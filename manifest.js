/* Ignore parserOptions.project warning. 
  This file is only run pre-build */
const fs = require('fs');
const path = require('path');

const url = process.env.DEVFILE_VIEWER_ROOT ? process.env.DEVFILE_VIEWER_ROOT : '/';

const manifest = {
  theme_color: '#358ef6',
  background_color: '#f69435',
  display: 'standalone',
  scope: url,
  start_url: url,
  name: 'Registry Viewer',
  short_name: 'Registry Viewer',
  icons: [
    {
      src: 'images/icons/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: 'images/icons/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};

function main() {
  const manifestJSON = JSON.stringify(manifest, null, 2);
  const filePath = path.join(process.cwd(), 'public', 'manifest.json');
  fs.writeFileSync(filePath, manifestJSON, { encoding: 'utf8' });
}

main();
