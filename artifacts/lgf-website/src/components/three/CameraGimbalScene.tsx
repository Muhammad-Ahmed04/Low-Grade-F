import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Lightformer,
  ContactShadows,
  SpotLight,
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
  cameraColor: "#1a1a1a",
  gimbalColor: "#2c2c2e",

  // Camera: where it floats at scroll start → where it locks onto the mount.
  // End sits the camera base on the gimbal's mounting rail (arm.004, which is
  // centred near the top over the base), level, lens pointing forward (+Z).
  cameraStart: new THREE.Vector3(2.7, 1.8, 0.8), 
  cameraEnd: new THREE.Vector3(0.4, 0.52, -0.01), 
  cameraStartRot: new THREE.Euler(0.45, -0.8, 0.35), 
  cameraEndRot: new THREE.Euler(0, 1.1, 0), 
  // Gimbal: where it sits at scroll start → its settled, centred position. 
  gimbalStart: new THREE.Vector3(-2.4, -1.5, -0.6), 
  gimbalEnd: new THREE.Vector3(0, -0.65, 0), 
  gimbalStartRot: new THREE.Euler(-0.3, 0.7, -0.2), 
  gimbalEndRot: new THREE.Euler(0, -0.35, 0),
};

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

function buildCameraMaterials(): THREE.MeshStandardMaterial[] {
  const body = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1c1c1e"),
    metalness: 0.1,
    roughness: 0.78,
    envMapIntensity: 0.9,
  });
  const lens = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#282828"),
    metalness: 0.7,
    roughness: 0.42,
    envMapIntensity: 1.1,
  });
  const trim = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#707070"),
    metalness: 0.88,
    roughness: 0.32,
    envMapIntensity: 1.2,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0d0d0f"),
    metalness: 0.0,
    roughness: 0.06,
    envMapIntensity: 0.6,
  });
  return [body, lens, trim, glass];
}

function buildGimbalMaterials(): THREE.MeshStandardMaterial[] {
  const frame = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#202022"),
    metalness: 0.82,
    roughness: 0.5,
    envMapIntensity: 1.0,
  });
  const motor = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#3c3c3e"),
    metalness: 0.85,
    roughness: 0.38,
    envMapIntensity: 1.15,
  });
  const grip = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#131314"),
    metalness: 0.0,
    roughness: 0.94,
    envMapIntensity: 0.2,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#888888"),
    metalness: 0.95,
    roughness: 0.22,
    envMapIntensity: 1.3,
  });
  return [frame, motor, grip, accent];
}

function useMaterialModel(
  url: string,
  targetSize: number,
  materials: THREE.MeshStandardMaterial[],
) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const root = scene.clone(true);
    let meshIndex = 0;
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.material = materials[meshIndex % materials.length];
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshIndex++;
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
  }, [scene, targetSize, materials]);
}

function Assembly({ progress }: { progress: ProgressRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const smooth = useRef(0);

  const cameraMaterials = useMemo(() => buildCameraMaterials(), []);
  const gimbalMaterials = useMemo(() => buildGimbalMaterials(), []);

  const camera = useMaterialModel(CAMERA_URL, TUNING.cameraSize, cameraMaterials);
  const gimbal = useMaterialModel(GIMBAL_URL, TUNING.gimbalSize, gimbalMaterials);

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
      {/* Tiny ambient lift — keeps pure shadow areas from going #000000 */}
      <ambientLight intensity={0.1} color="#1a1f2e" />

      {/* KEY: top-left warm white — main form definition */}
      <directionalLight
        position={[-3, 7, 4]}
        intensity={1.6}
        color="#e8eeff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* RIM: cool blue-white from behind-right — edge separation */}
      <directionalLight
        position={[5, 3, -5]}
        intensity={2.0}
        color="#4a90d9"
      />

      {/*
       * WHITE SPOTLIGHT — the signature addition.
       * Positioned above-front, aimed straight at the rig centre.
       * Drei's <SpotLight> casts a visible volumetric cone on the model
       * and pools a clean white disc on the ground shadow.
       * penumbra softens the edge so it reads as a studio spot, not a
       * harsh clip. attenuation + anglePower control the falloff curve.
       */}
      <SpotLight
        position={[0, 6, 3.5]}
        angle={0.28}
        penumbra={0.6}
        intensity={55}
        color="#ffffff"
        castShadow
        distance={14}
        attenuation={5}
        anglePower={4}
        target-position={[0, 0, 0]}
      />

      {/* SECONDARY SPOT: narrower, slightly warm — picks out the camera top */}
      <SpotLight
        position={[-2.5, 7, 1]}
        angle={0.18}
        penumbra={0.7}
        intensity={30}
        color="#fff5e8"
        distance={12}
        attenuation={4}
        anglePower={5}
        target-position={[0, 0.5, 0]}
      />

      <Environment resolution={256}>
        {/* Narrow top softbox — what metal edges reflect */}
        <Lightformer
          intensity={3.5}
          position={[0, 8, 0]}
          scale={[12, 1.5, 1]}
          color="#f0f4ff"
        />
        {/* Left blue rim */}
        <Lightformer
          intensity={2.8}
          position={[-6, 2, -2]}
          scale={[1.5, 10, 1]}
          color="#3a7bd5"
        />
        {/* Right soft fill */}
        <Lightformer
          intensity={1.4}
          position={[6, 2, 1]}
          scale={[1.5, 8, 1]}
          color="#c8d8ff"
        />
        {/* Back kicker strip */}
        <Lightformer
          intensity={2.0}
          position={[0, 1, -8]}
          scale={[10, 3, 1]}
          color="#5588cc"
        />
        {/* Floor: near-black, no bounce */}
        <Lightformer
          intensity={0.15}
          position={[0, -5, 0]}
          scale={[14, 1, 1]}
          color="#0a0a14"
        />
      </Environment>

      <ContactShadows
        position={[0, -1.7, 0]}
        opacity={0.65}
        scale={12}
        blur={4.5}
        far={5}
        color="#000510"
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
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
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
