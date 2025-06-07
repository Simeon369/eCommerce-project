import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust the path if needed

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    // Optionally redirect or clear local state
    window.location.href = "/"; // e.g., redirect to login page
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};
