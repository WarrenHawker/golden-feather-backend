import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// API base path
const apiBasePath = '/api/v1';

// Get the path to the route-files subdirectory
const routesDirectory = path.join(__dirname, 'route-files');

// Read all files in the route-files directory
fs.readdirSync(routesDirectory).forEach((file) => {
  // Only process files that end with `.route.ts`
  if (file.endsWith('.route.ts')) {
    // Dynamically require the route file
    const route = require(path.join(routesDirectory, file));

    // Remove the `.route.ts` from the file name to use it as the base path
    const routeName = file.replace('.route.ts', '');

    // Register the route with the apiBasePath, e.g., "/api/v1/auth"
    router.use(`${apiBasePath}/${routeName}`, route.router);
  }
});

// Export the router so it can be used in app.ts
export default router;
