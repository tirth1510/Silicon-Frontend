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
    // Don't log errors for unauthenticated users (401/403)
    // This is expected behavior when user is not logged in
    const status = err.response?.status;
    if (status !== 401 && status !== 403) {
      console.error("Profile API error:", {
        status,
        data: err.response?.data,
        message: err.message,
      });
    }
    return null;
  }
};
