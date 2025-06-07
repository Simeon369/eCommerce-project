// constants.jsx or a hook
import { client } from './sanityClient';
import { auth } from "../firebase";


/**
 * Fetches storeName and phoneNumber from Sanity for a given Firebase UID.
 * @param {string} uid - Firebase UID of the user
 * @returns {Promise<{ storeName: string, phoneNumber: string }>} user store info
 */
export const getUserStoreInfo = async (uid) => {
  try {
    const data = await client.fetch(
      `*[_type == "user" && uid == $uid][0]{
        storeName,
        phoneNumber
      }`,
      { uid }
    );

    return {
      storeName: data?.storeName || "",
      phoneNumber: data?.phoneNumber || "",
    };
  } catch (error) {
    console.error("Failed to fetch store info:", error.message);
    return {
      storeName: "",
      phoneNumber: "",
    };
  }
};


