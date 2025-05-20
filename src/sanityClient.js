// sanityClient.js
import createClient from '@sanity/client';

export const client = createClient({
  projectId: '7jy808ks', // 👈 replace with yours
  dataset: 'production',
  apiVersion: '2025-05-20', // Use today's date
  useCdn: true, // `true` for fast caching; false if you need fresh data
});
