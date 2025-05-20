// sanityClient.js
import {createClient} from '@sanity/client';

export const client =createClient({
  projectId: '7jy808ks', // 👈 replace with yours
  dataset: 'production',
  apiVersion: '2025-05-20', // Use today's date
  useCdn: false,// `true` for fast caching; false if you need fresh data
  token: import.meta.env.VITE_SANITY_TOKEN,
});
