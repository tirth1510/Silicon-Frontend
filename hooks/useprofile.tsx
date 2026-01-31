import { useEffect, useState } from "react";
import { fetchProfile } from "@/services/cookieService";

const GUEST_PROFILE = {
  id: "",
  googleId:"",
  username: "",
  email: "",
  role: "",
  imageUrl: "/default-avatar.png",
  isVerified: ""
};

export const useProfile = () => {
  const [profile, setProfile] = useState(GUEST_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const data = await fetchProfile();
      if (data) setProfile(data);
      setLoading(false);
    };
    getProfile();
  }, []);

  return { profile, loading };
};
