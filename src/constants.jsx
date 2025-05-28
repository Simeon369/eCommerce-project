// constants.jsx or a hook
import { client } from './sanityClient';

// Example query
const query = `*[_type == "storeConfig"][0]`;
export const config = await client.fetch(query);

