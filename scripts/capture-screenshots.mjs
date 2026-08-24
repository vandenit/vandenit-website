#!/usr/bin/env node
/**
 * Capture screenshots at multiple viewport widths using Chrome headless.
 * Usage: node scripts/capture-screenshots.mjs <url> <width> <output-path> [height]
 */
import { spawn } from 'child_process';
import { argv } from 'process';

const [,, url, widthStr, outputPath, heightStr] = argv;
const width = parseInt(widthStr, 10);
const height = heightStr ? parseInt(heightStr, 10) : Math.round(width * 2); // tall viewport for full page

const chrome = spawn('google-chrome', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  `--window-size=${width},${height}`,
  `--screenshot=${outputPath}`,
  '--hide-scrollbars',
  '--virtual-time-budget=5000',
  url,
], { stdio: 'pipe' });

chrome.stdout.on('data', (d) => process.stdout.write(d));
chrome.stderr.on('data', (d) => process.stderr.write(d));

chrome.on('close', (code) => {
  console.log(`Chrome exited with code ${code}, screenshot saved to ${outputPath}`);
  process.exit(code === 0 ? 0 : 1);
});