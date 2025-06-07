// pages/StoreSetup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { client } from "../sanityClient";

const StoreSetup = () => {
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/signin"); // Not logged in
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await client
        .patch(userId)
        .set({
          storeName,
          phoneNumber,
        })
        .commit();

      navigate("/admin"); // Go to home after setup
    } catch (err) {
      console.error("Sanity update failed:", err);
      alert("Failed to save store details.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Set Up Your Store</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Store Name"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Save & Continue
        </button>
      </form>
    </div>
  );
};

export default StoreSetup;
