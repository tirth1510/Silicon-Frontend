"use client";

import { useProfile } from "@/hooks/useprofile";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, loading } = useProfile();

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={profile.imageUrl}
          alt={profile.username}
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
        <h2 className="text-xl font-semibold">{profile.username}</h2>
                <h2 className="text-xl font-semibold">{profile.role}</h2>

        <p className="text-gray-600">{profile.email || "No email provided"}</p>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Role: {profile.role}
        </span>
      </div>
    </div>
  );
}
