import { exec } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(__dirname, "..");
const distPublicDir = path.join(appDir, "dist");
const distServerDir = path.join(appDir, ".ssr");
const templatePath = path.join(distPublicDir, "index.html");
const routes = ["/", "/about", "/work", "/contact"];

const run = async (args) => {
  await execAsync(`pnpm ${args.join(" ")}`, {
    cwd: appDir,
    shell: true,
    env: {
      ...process.env,
      BASE_PATH: process.env.BASE_PATH ?? "/",
      PORT: process.env.PORT ?? "3000",
    },
  });
};

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const applyRouteSeo = (template, seo, structuredData) => {
  let html = template
    .replace(/<title>.*?<\/title>/s, `<title>${seo.title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${escapeAttribute(seo.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${escapeAttribute(seo.title)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${escapeAttribute(seo.description)}" />`,
    )
    .replace(
      /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:type" content="${escapeAttribute(seo.ogType ?? "website")}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${escapeAttribute(seo.canonicalUrl)}" />`,
    )
    .replace(
      /<meta\s+property="og:site_name"\s+content=".*?"\s*\/?>/i,
      '<meta property="og:site_name" content="LOWGRADEFILMS" />',
    )
    .replace(
      /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:image" content="${escapeAttribute(seo.ogImage)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeAttribute(seo.title)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeAttribute(seo.description)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:image" content="${escapeAttribute(seo.ogImage)}" />`,
    )
    .replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${escapeAttribute(seo.canonicalUrl)}" />`,
    );

  const jsonLd = structuredData
    .map(
      (entry) =>
        `<script type="application/ld+json">${JSON.stringify(entry)}</script>`,
    )
    .join("");

  if (html.includes("<!--app-head-->")) {
    html = html.replace("<!--app-head-->", jsonLd);
  } else {
    html = html.replace("</head>", `${jsonLd}</head>`);
  }

  return html;
};

const injectAppHtml = (template, appHtml) =>
  template.replace(
    /<div id="root">.*?<\/div>/s,
    `<div id="root">${appHtml}</div>`,
  );

const writeRouteHtml = async (routePath, html) => {
  const targetDir =
    routePath === "/" ? distPublicDir : path.join(distPublicDir, routePath.slice(1));
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, "index.html"), html, "utf8");
};

const writeSitemap = async () => {
  const urls = routes
    .map((route) => {
      const loc = route === "/" ? "https://lowgradefilms.com/" : `https://lowgradefilms.com${route}`;
      return `<url><loc>${loc}</loc></url>`;
    })
    .join("");

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls +
    "</urlset>";

  await fs.writeFile(path.join(distPublicDir, "sitemap.xml"), xml, "utf8");
};

const writeRobots = async () => {
  const robots = "User-agent: *\nAllow: /\nSitemap: https://lowgradefilms.com/sitemap.xml\n";
  await fs.writeFile(path.join(distPublicDir, "robots.txt"), robots, "utf8");
};

await run(["run", "build:client"]);
await run(["run", "build:ssr"]);

const template = await fs.readFile(templatePath, "utf8");
const serverEntryUrl = pathToFileURL(path.join(distServerDir, "entry-server.js")).href;
const { render } = await import(serverEntryUrl);

for (const routePath of routes) {
  const { appHtml, seo, structuredData } = render(routePath);
  const withHtml = injectAppHtml(template, appHtml);
  const withSeo = applyRouteSeo(withHtml, seo, structuredData);
  await writeRouteHtml(routePath, withSeo);
}

await writeSitemap();
await writeRobots();
