// @ts-check
import { defineConfig } from 'astro/config';

// Statischer Build nach dist/. Apache liefert dist/ über die .htaccess im Repo-Root aus (siehe README).
export default defineConfig({
  site: 'https://danielsell.com',
  outDir: './dist',
  trailingSlash: 'always',
  build: { format: 'directory', assets: '_astro' },
  compressHTML: true,
  devToolbar: { enabled: false },
  image: { responsiveStyles: false },
});
