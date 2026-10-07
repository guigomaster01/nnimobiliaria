const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  '@opennextjs',
  'cloudflare',
  'dist',
  'cli',
  'build',
  'patches',
  'plugins',
  'load-manifest.js'
);

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  let modified = false;

  if (!content.includes('preview-props')) {
    // 1. Add preview-props to the glob search
    if (content.includes('**/{*-manifest,required-server-files,prefetch-hints}.json')) {
      content = content.replace(
        '**/{*-manifest,required-server-files,prefetch-hints}.json',
        '**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json'
      );
      modified = true;
    }

    // 2. Add preview-props to the fallback handler
    if (content.includes('p.endsWith("prefetch-hints"))')) {
      content = content.replace(
        'p.endsWith("prefetch-hints"))',
        'p.endsWith("prefetch-hints") ||\n        p.endsWith("preview-props"))'
      );
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(targetFile, content, 'utf8');
      console.log('✅ Successfully patched @opennextjs/cloudflare load-manifest for Next.js 16');
    } else {
      console.log('⚠️ Could not match target strings to patch in @opennextjs/cloudflare load-manifest.js');
    }
  } else {
    console.log('ℹ️ @opennextjs/cloudflare load-manifest already contains preview-props patch.');
  }
} else {
  console.log('ℹ️ @opennextjs/cloudflare not found, skipping patch.');
}
