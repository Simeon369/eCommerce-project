import { client } from "../sanityClient";

/**
 * Fetches the products for a specific user based on their Firebase UID
 * @param {string} uid - Firebase UID of the user
 * @returns {Promise<Array>} list of products
 */
export async function fetchProducts(uid) {
  if (!uid) {
    console.error("UID is required to fetch products.");
    return [];
  }

  const query = `*[_type == "user" && uid == $uid][0]{
    products[] {
      productId,
      title,
      price,
      stock,
      "imageUrl": image.asset->url
    }
  }`;

  const data = await client.fetch(query, { uid });

  return data?.products || [];
}
