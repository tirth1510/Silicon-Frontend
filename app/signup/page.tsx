import Link from "next/link";
import Image from "next/image";
import { SignupForm } from "@/pages/leading/Auth/Signup";

export default function SignUpPage() {
  return (
    <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 " >

      {/* Top Right Logo */}
      <Link
        href="/"
        className="absolute top-10 left-20 flex items-center gap-2"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={180}
          height={40}
          className="object-contain cursor-pointer hover:opacity-80 transition"
        />
      </Link>

      {/* Login Form */}
      <div className="w-full max-w-sm md:max-w-4xl mt-10">
        <SignupForm />
      </div>
    </div>
  );
}
