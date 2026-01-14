/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const fetchProfile = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile`, // backend URL
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
