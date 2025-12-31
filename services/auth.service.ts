export const loginService = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`http://localhost:5000/api/auth/login`, {
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
