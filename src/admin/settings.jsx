import React, { useState, useEffect } from 'react';
import { client } from "../sanityClient";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Settings = ({ setIsSetting }) => {
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const data = await client.fetch(
          `*[_type == "user" && uid == $uid][0]`,
          { uid: user.uid }
        );
        if (data) {
          setStoreName(data.storeName || "");
          setPhoneNumber(data.phoneNumber || "");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfileChange = async (e) => {
    e.preventDefault();
    if (!uid) return alert("User not found!");

    try {
      // Make sure user document exists
      await client.createIfNotExists({
        _id: uid, // Important: use UID as the document ID
        _type: "user",
        uid,
        storeName,
        phoneNumber,
      });

      // Patch user document
      await client
        .patch(uid)
        .set({ storeName, phoneNumber })
        .commit();

      setIsSetting(false);
      alert("Store settings updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating settings.");
    }
  };

  return (
    <div className="bg-white mb-8 p-4 rounded shadow">
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
  );
};

export default Settings;
