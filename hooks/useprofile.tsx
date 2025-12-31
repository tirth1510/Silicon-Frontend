import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

export interface Profile {
  id: string;
  username: string;
  email: string;
  role: string;
  imageUrl: string;

}

export interface UseProfileReturn {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            withCredentials: true, // ⬅️ Send cookies
          }
        );

        if (data.success) {
          setProfile({
            id: data.id,
            username: data.username,
            email: data.email,
            role: data.role,
            imageUrl: data.imageUrl || "/default-avatar.png",
          });
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || err.message);
        } else {
          setError("An unknown error occurred");
        }
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
