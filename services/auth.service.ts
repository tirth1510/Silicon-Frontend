/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export interface RegisterServicePayload {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  imageUrl?: string;
}

export interface RegisterServiceResponse {
  success: boolean;
  message: string;
  emailMessage: string;
  id: string;
  username: string;
  email: string;
  role: string;
  imageUrl?: string;
  accessToken: string;
  tokenExpiresAt: string;
}

export const registerService = async (
  payload: RegisterServicePayload
): Promise<RegisterServiceResponse> => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
      payload,
      {
        withCredentials: true, // REQUIRED for httpOnly cookie
      }
    );

    return response.data;
  } catch (error: any) {
    // Normalize backend errors
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Registration failed";

    throw new Error(message);
  }
};








export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include", // 🚀 Important for httpOnly cookie
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  return data;
};


export const logoutService = async (): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }
};


export const googleLoginService = async (idToken: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google-login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔥 REQUIRED for cookies
      body: JSON.stringify({ idToken }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Google login failed");
  }

  return data;
};
