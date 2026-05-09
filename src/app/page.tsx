"use client";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import { useRouter }
from "next/navigation";

import { login }
from "@/services/api";

import {
  Loader2,
  LogIn,
} from "lucide-react";

export default function HomePage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {

      router.push(
        "/attendance"
      );
    }

  }, [router]);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (
      !username ||
      !password
    ) {

      alert(
        "Username dan password wajib diisi"
      );

      return;
    }

    if (!navigator.onLine) {

      alert(
        "Tidak ada koneksi internet"
      );

      return;
    }

    try {

      setLoading(true);

      const result =
        await login(
          username,
          password
        );

      console.log(result);

      if (
        result &&
        result.success
      ) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            result.user
          )
        );

        router.push(
          "/attendance"
        );

      } else {

        alert(
          result?.message ||
          "Username atau password salah"
        );
      }

    } catch (error) {

      console.error(error);

      alert(
        "Tidak dapat terhubung ke server.\n\nSilakan coba kembali."
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <main className="min-h-screen bg-[#F8F3F0] flex items-center justify-center px-4">

      <div className="w-full max-w-sm">

        <div className="bg-white rounded-3xl shadow-xl p-6">

          <div className="flex flex-col items-center mb-8">

            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={90}
              priority
              className="drop-shadow-md"
            />

            <h1 className="text-2xl font-bold mt-4 text-[#014BAA] text-center">

              BILLMAN UP3 GARUT

            </h1>

            <p className="text-sm text-gray-500 mt-2 text-center">

              Sistem Absensi Pegawai

            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>

              <label className="block mb-2 text-sm font-medium text-gray-700">

                Username

              </label>

              <input
                type="text"
                value={username}
                autoComplete="username"
                inputMode="text"
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-[#014BAA]
                "
                placeholder="Masukkan username"
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-medium text-gray-700">

                Password

              </label>

              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-[#014BAA]
                "
                placeholder="Masukkan password"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-[#014BAA]
                text-white
                py-3
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                active:scale-[0.98]
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >

              {loading ? (

                <>

                  <Loader2
                    className="animate-spin"
                    size={18}
                  />

                  Masuk...

                </>

              ) : (

                <>

                  <LogIn size={18} />

                  Masuk

                </>

              )}

            </button>

          </form>

        </div>

        <p className="text-center text-xs text-gray-500 mt-5">

          v2.0 Internal System

        </p>

      </div>

    </main>
  );
}