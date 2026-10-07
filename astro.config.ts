import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://caen.tech",
  output: "static",
  redirects: {
    // Le programme est versionné par édition ; /programme pointe sur la plus récente.
    "/programme": "/programme/2026",
  },
});
