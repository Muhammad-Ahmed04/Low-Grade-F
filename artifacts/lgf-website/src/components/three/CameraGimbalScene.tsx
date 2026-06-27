import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────────
 * Camera + Gimbal scroll assembly
 *
 * Two real GLB models (CC-BY, see CREDITS below) start apart and, as the user
 * scrolls through the About section, converge until the camera is mounted on the
 * gimbal — becoming one unit that turns on a slow turntable.
 *
 * CREDITS (CC-BY 3.0 — keep attribution somewhere visible on the site):
 *   • "DJI RS3 Mini gimbal" by MisterGoodDeal — https://poly.pizza/m/Xdm7hAkghi
 *   • "Camera" by Poly by Google              — https://poly.pizza/m/0nfSsetwy0Z
 *
 * All the geometry numbers you'd want to tweak live in TUNING below.
 * ──────────────────────────────────────────────────────────────────────────── */

const CAMERA_URL = `${import.meta.env.BASE_URL}models/camera.glb`;
const GIMBAL_URL = `${import.meta.env.BASE_URL}models/gimbal.glb`;

type ProgressRef = { current: number };

const TUNING = {
  // Normalised on-screen size (largest dimension, in world units) of each model.
  cameraSize: 1.15,
  gimbalSize: 2.6,

  // Chrome tint for each model.
  cameraColor: "#D6D6D6",
  gimbalColor: "#B0B0B0",

  // Camera: where it floats at scroll start → where it locks onto the mount.
  // End sits the camera base on the gimbal's mounting rail (arm.004, which is
  // centred near the top over the base), level, lens pointing forward (+Z).
  cameraStart: new THREE.Vector3(2.7, 1.8, 0.8),
  cameraEnd: new THREE.Vector3(0.17, 1.05, -0.12),
  cameraStartRot: new THREE.Euler(0.45, -0.8, 0.35),
  cameraEndRot: new THREE.Euler(0, 0, 0),

  // Gimbal: where it sits at scroll start → its settled, centred position.
  gimbalStart: new THREE.Vector3(-2.4, -1.5, -0.6),
  gimbalEnd: new THREE.Vector3(0, -0.55, 0),
  gimbalStartRot: new THREE.Euler(-0.3, 0.7, -0.2),
  gimbalEndRot: new THREE.Euler(0, -0.35, 0),
};

// Alignment debug: append ?rig=cam | ?rig=gim | ?rig=both to the URL to freeze
// the scene (no spin) and inspect a single model or the assembled mount.
// Optional ?yaw=<rad>&pitch=<rad> sets the frozen viewing angle.
const RIG_PARAMS =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
const RIG_DEBUG = RIG_PARAMS.get("rig");
const RIG_YAW = RIG_PARAMS.has("yaw") ? parseFloat(RIG_PARAMS.get("yaw")!) : -0.55;
const RIG_PITCH = RIG_PARAMS.has("pitch")
  ? parseFloat(RIG_PARAMS.get("pitch")!)
  : 0;

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

/** Clone a GLTF scene, recolour it as chrome, and normalise it to a target size,
 *  centred on the origin. Returns a ready-to-place group. */
function useChromeModel(url: string, targetSize: number, color: string) {
  const { scene } = useGLTF(url);

  return useMemo(() => {
    const root = scene.clone(true);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 1,
      roughness: 0.26,
      envMapIntensity: 1.35,
    });

    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    // Centre the geometry on the origin, then scale so its largest side === targetSize.
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    root.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const wrapper = new THREE.Group();
    wrapper.add(root);
    wrapper.scale.setScalar(targetSize / maxDim);
    return wrapper;
  }, [scene, targetSize, color]);
}

function Assembly({ progress }: { progress: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = useRef(0);

  const camera = useChromeModel(
    CAMERA_URL,
    TUNING.cameraSize,
    TUNING.cameraColor,
  );
  const gimbal = useChromeModel(
    GIMBAL_URL,
    TUNING.gimbalSize,
    TUNING.gimbalColor,
  );

  // Debug: log the normalised extent of each model so the mount can be placed precisely.
  useEffect(() => {
    if (!RIG_DEBUG) return;
    const measure = (o: THREE.Object3D) => {
      const p = o.position.clone();
      const r = o.rotation.clone();
      o.position.set(0, 0, 0);
      o.rotation.set(0, 0, 0);
      o.updateMatrixWorld(true);
      const b = new THREE.Box3().setFromObject(o);
      o.position.copy(p);
      o.rotation.copy(r);
      return { min: b.min.toArray(), max: b.max.toArray() };
    };
    // eslint-disable-next-line no-console
    console.log(
      "RIGBOX " +
        JSON.stringify({ camera: measure(camera), gimbal: measure(gimbal) }),
    );
  }, [camera, gimbal]);

  // Start the parts where they belong at progress 0, so there's no first-frame flash.
  useMemo(() => {
    camera.position.copy(TUNING.cameraStart);
    camera.rotation.copy(TUNING.cameraStartRot);
    gimbal.position.copy(TUNING.gimbalStart);
    gimbal.rotation.copy(TUNING.gimbalStartRot);
  }, [camera, gimbal]);

  useFrame((state, delta) => {
    // Debug: freeze for alignment tuning (?rig=cam | gim | both).
    if (RIG_DEBUG) {
      if (RIG_DEBUG === "cam") {
        camera.position.set(0, 0, 0);
        camera.rotation.set(0, 0, 0);
      } else if (RIG_DEBUG === "gim") {
        gimbal.position.set(0, 0, 0);
        gimbal.rotation.set(0, 0, 0);
      } else {
        camera.position.copy(TUNING.cameraEnd);
        camera.rotation.copy(TUNING.cameraEndRot);
        gimbal.position.copy(TUNING.gimbalEnd);
        gimbal.rotation.copy(TUNING.gimbalEndRot);
      }
      if (groupRef.current) groupRef.current.rotation.set(RIG_PITCH, RIG_YAW, 0);
      return;
    }

    // Frame-rate-independent smoothing toward the live scroll progress.
    smooth.current = THREE.MathUtils.damp(
      smooth.current,
      THREE.MathUtils.clamp(progress.current, 0, 1),
      4,
      delta,
    );
    const e = easeInOutCubic(smooth.current);

    camera.position.lerpVectors(TUNING.cameraStart, TUNING.cameraEnd, e);
    camera.rotation.set(
      THREE.MathUtils.lerp(TUNING.cameraStartRot.x, TUNING.cameraEndRot.x, e),
      THREE.MathUtils.lerp(TUNING.cameraStartRot.y, TUNING.cameraEndRot.y, e),
      THREE.MathUtils.lerp(TUNING.cameraStartRot.z, TUNING.cameraEndRot.z, e),
    );

    gimbal.position.lerpVectors(TUNING.gimbalStart, TUNING.gimbalEnd, e);
    gimbal.rotation.set(
      THREE.MathUtils.lerp(TUNING.gimbalStartRot.x, TUNING.gimbalEndRot.x, e),
      THREE.MathUtils.lerp(TUNING.gimbalStartRot.y, TUNING.gimbalEndRot.y, e),
      THREE.MathUtils.lerp(TUNING.gimbalStartRot.z, TUNING.gimbalEndRot.z, e),
    );

    // Once assembled, the whole unit turns on a slow turntable + gentle mouse tilt.
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (0.12 + e * 0.28);
      const targetTilt = -state.pointer.y * 0.12;
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetTilt,
        3,
        delta,
      );
    }
  });

  return (
    <group ref={groupRef}>
      {RIG_DEBUG !== "cam" && <primitive object={gimbal} />}
      {RIG_DEBUG !== "gim" && <primitive object={camera} />}
    </group>
  );
}

/** Self-contained studio environment (rendered locally — no HDR download). */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Lightformers ring the model so the chrome stays luminous through the
          full turntable rotation rather than going dark when it turns away. */}
      <Environment resolution={256}>
        <Lightformer
          intensity={2.4}
          position={[0, 5, 2]}
          scale={[10, 5, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.6}
          position={[5, 1, 3]}
          scale={[3, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.6}
          position={[-5, 1, 3]}
          scale={[3, 8, 1]}
          color="#dfe6ff"
        />
        <Lightformer
          intensity={1.4}
          position={[4, 1, -4]}
          scale={[3, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.4}
          position={[-4, 1, -4]}
          scale={[3, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.2}
          position={[0, -3, -5]}
          scale={[12, 7, 1]}
          color="#9a9a9a"
        />
      </Environment>
      <ContactShadows
        position={[0, -1.7, 0]}
        opacity={0.55}
        scale={11}
        blur={2.6}
        far={4.5}
        color="#000000"
      />
    </>
  );
}

export default function CameraGimbalScene({
  progress,
}: {
  progress: ProgressRef;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.4, 6.6], fov: 35 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Assembly progress={progress} />
        <Studio />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(CAMERA_URL);
useGLTF.preload(GIMBAL_URL);
