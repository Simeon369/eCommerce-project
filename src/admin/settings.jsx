import React, {useState, useEffect} from 'react'
import { client } from "../sanityClient";

const settings = ({setIsSetting}) => {

    const [storeName, setStoreName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        const fetchStoreConfig = async () => {
          const config = await client.fetch(`*[_type == "storeConfig"][0]`);
          if (config) {
            setStoreName(config.storeName);
            setPhoneNumber(config.phoneNumber);
          }
        };
        fetchStoreConfig();
      }, [])
      const handleProfileChange = async (e) => {
      e.preventDefault();
      try {
        // Step 1: Ensure the document exists (create if not)
        await client.createIfNotExists({
          _id: "storeConfig",
          _type: "storeConfig",
          storeName,
          phoneNumber,
        });
    
        // Step 2: Update it
        await client
          .patch("storeConfig")
          .set({
            storeName,
            phoneNumber,
          })
          .commit();
          setIsSetting(false)
    
        alert("Store settings updated!");
      } catch (err) {
        console.error("Update error:", err);
        alert("Error updating settings.");
      }
    };
  return (
    <div className=" bg-white mb-8">
      <h2 className="text-2xl font-bold mb-4">Store Settings</h2>
      <form onSubmit={handleProfileChange} className="space-y-4">
        <div>
          <label className="block font-semibold">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default settings
