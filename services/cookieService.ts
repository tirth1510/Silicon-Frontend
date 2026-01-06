/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const fetchProfile = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/auth/profile", // backend URL
      {
        withCredentials: true, // send cookies automatically
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("Profile API error:", err.response?.data || err.message);
    return null;
  }
};
