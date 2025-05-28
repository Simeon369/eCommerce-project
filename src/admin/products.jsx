// productsService.js
import { client } from "../sanityClient";

export async function fetchProducts() {
  const query = `*[_type == "product"]{
    _id, productId, title, price, stock,
    "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
}
