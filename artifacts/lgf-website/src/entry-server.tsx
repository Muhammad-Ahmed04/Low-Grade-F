import { renderToString } from "react-dom/server";
import App from "@/App";
import { getRouteSeo, getStructuredData } from "@/lib/site";
import "@/index.css";

export function render(url: string) {
  const normalized = new URL(url, "https://lowgradefilms.com");
  const seo = getRouteSeo(normalized.pathname);
  const structuredData = getStructuredData(normalized.pathname);
  const appHtml = renderToString(
    <App ssrPath={normalized.pathname} ssrSearch={normalized.search} />,
  );

  return {
    appHtml,
    seo,
    structuredData,
  };
}
