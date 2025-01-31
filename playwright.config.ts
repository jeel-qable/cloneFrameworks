import { defineConfig } from '@playwright/test';
import { getBaseUrl } from './env';
const mobileDevices = require('./mobileDevices');

// Extract the product, language, browser, and environment from the PROJECT environment variable
const project = process.env.PROJECT || '';

// Split the project string into parts
const parts = project.split('-');

// Extract values from the parts
const product = parts[0]?.toUpperCase();    // Extract product (e.g., copb2b)
const language = parts[1];      // Extract language (e.g., en)
const browser = parts[2];       // Extract browser (e.g., chrome)
const environment = parts[3];  // Extract environment (e.g., production)
const tag = parts[4]; 
console.log(`Test case is running for product: ${product} in language: ${language} on browser: ${browser} in the ${environment} environment.`);

// Validate the browser
const validBrowsers = ['chromium', 'firefox', 'webkit', 'chrome', 'edge', 'safari'];
let mappedBrowser: 'chromium' | 'firefox' | 'webkit' | 'edge' | 'safari' = 'chromium';  // Default to 'chromium'
if (validBrowsers.includes(browser)) {
  if (browser === 'chrome') mappedBrowser = 'chromium';  // Chrome is mapped to Chromium
  else if (browser === 'firefox') mappedBrowser = 'firefox';
  else if (browser === 'edge') mappedBrowser = 'chromium';
  else if (browser === 'webkit' || browser === 'safari') mappedBrowser = 'webkit';
}
// Get the base URL using the getBaseUrl function
const baseURL = getBaseUrl(project);
process.env.LANGUAGE = language;
process.env.TAG = tag;
const path = `./Products/${product}/tests`
const isMobile = project.includes('mobile'); // Check if it's a mobile test
const deviceName = isMobile ? project.split('.').pop() : ''; // Extract device name from the last part after the dot
const selectedDevice = isMobile && deviceName ? mobileDevices.find(device => device.name.toLowerCase() === deviceName.toLowerCase()) : undefined;
const projects = [] as any[]; 

if (isMobile && selectedDevice) {
  projects.push({
    name: `${product}-${selectedDevice.name}-${browser}`, 
    use: {
      browserName: 'chromium',
      actionTimeout: 30000, 
      baseURL: baseURL,
      screenshot: 'only-on-failure',
      video: 'off',
      headless: true,
      viewport: selectedDevice.viewport || '', // Use device-specific resolution
      launchOptions: {
        args: ['--start-maximized'],
      },
    },
  });
} else {
  // Web browser configuration for non-mobile devices
  projects.push({
    name: `${product}-${mappedBrowser}`,
    use: {
      actionTimeout: 30000, // Set action timeout globally 
      browserName: mappedBrowser, // Use the mapped browser
      channel: mappedBrowser === 'chromium' ? (browser === 'chrome' ? 'chrome' : browser === 'edge' ? 'msedge' : undefined) : undefined,

      headless: true,
      viewport: null,
      launchOptions: {
        args: ["--start-maximized"],
      },
      baseURL: baseURL,  // Use the base URL for the project
      screenshot: 'only-on-failure',
      video: 'off',
      // trace: 'retain-on-failure',
    },
  });
}

module.exports = defineConfig({
  testDir: `./Products/${product}/tests`, // Define the test directory based on the product
  timeout: 540000,
  retries: 1,
  projects: projects, // Directly assign the projects array to the config
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 3000,
      stylePath: './screenshot.css',
    },
  },
  snapshotPathTemplate: `reports/test-results-${product}/tests/{testFileName}-{browserName}.png`,
  reporter: [
    ['list'],
    ['json', { outputFile: `reports/test-results-${product}-${browser}.json` }],
    ['html', { outputFolder: './playwright-report/html', open: 'never' }],
  ],
  workers: 5,
  grep: tag ? new RegExp(`@${tag}`) : /.*/, 
});

