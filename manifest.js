/* Ignore parserOptions.project warning. 
  This file is only run pre-build */
const fs = require('fs');
const path = require('path');

const basePath = process.env.DEVFILE_VIEWER_ROOT ? process.env.DEVFILE_VIEWER_ROOT : '';

const manifest = {
  theme_color: '#151515',
  background_color: '#F0F0F0',
  display: 'standalone',
  scope: basePath,
  start_url: basePath,
  name: 'Registry Viewer',
  short_name: 'Registry Viewer',
  icons: [
    {
      src: 'images/icons/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: 'images/icons/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
};

function main() {
  const manifestJSON = JSON.stringify(manifest, null, 2);
  const filePath = path.join(process.cwd(), 'public', 'manifest.json');
  fs.writeFileSync(filePath, manifestJSON, { encoding: 'utf8' });
}

main();
