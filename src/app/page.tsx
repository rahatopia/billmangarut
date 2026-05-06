"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/api";

export default function HomePage() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const result = await login(
        username,
        password
      );

      console.log(result);

      if (result.success) {

        localStorage.setItem(
          "user",
          JSON.stringify(result.user)
        );

        router.push("/attendance");

      } else {

        alert(result.message);

      }

    } catch (error) {

      console.error(error);

      alert("Login failed");

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">

        <h1 className="text-2xl font-bold text-center mb-6">
          Laporan Absensi
        </h1>

        <h1 className="text-2xl font-bold text-center mb-6">
          BILLMAN UP3 GARUT
        </h1>
        
        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <div>

            <label className="block mb-1 text-sm font-medium">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter username"
            />

          </div>

          <div>

            <label className="block mb-1 text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter password"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg"
          >

            {loading
              ? "Loading..."
              : "Login"}

          </button>

        </form>

      </div>

    </main>
  );
}