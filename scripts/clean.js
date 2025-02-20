// Copyright 2023-2025 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { glob } from 'glob';
import path from 'path';
import { rimrafSync } from 'rimraf';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');

// Function to delete files and directories using glob and rimraf
function cleanUp(pattern) {
  const matches = glob.sync(pattern, {
    cwd: projectRoot,
    ignore: ['node_modules/**/*']
  });

  matches.forEach((match) => {
    const fullPath = path.join(projectRoot, match);

    rimrafSync(fullPath);
    console.log('Deleted:', fullPath);
  });
}

// Delete all 'build' directories
cleanUp('**/build');
cleanUp('**/dist');

// Delete all '*.tsbuildinfo' files
cleanUp('**/*.tsbuildinfo');

console.log('Clean up completed.');
