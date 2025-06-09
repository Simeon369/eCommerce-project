import React, { useEffect, useState } from 'react';
import { FaUser, FaPlus } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { client } from '../sanityClient';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase"; 

const Nav = ({ toggleSettings, toggleProductUpdate, logout }) => {
  const [storeSlug, setStoreSlug] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await client.fetch(
          `*[_type == "user" && uid == $uid][0]{storeSlug}`,
          { uid: user.uid }
        );
        if (userDoc?.storeSlug) {
          setStoreSlug(userDoc.storeSlug.current);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 z-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 transition"
          onClick={() => navigate(`/${storeSlug}`)}
          title="View Shop"
        >
          <FaUser className="text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Admin</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white transition"
          onClick={toggleProductUpdate}
          title="Add Product"
        >
          <FaPlus />
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white transition"
          onClick={toggleSettings}
          title="Settings"
        >
          <FaGear />
        </button>

        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition"
          onClick={logout}
          title="Log out"
        >
          <IoLogOut />
        </button>
      </div>
    </header>
  );
};

export default Nav;
