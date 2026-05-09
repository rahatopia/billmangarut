"use client";

import { useRouter } from "next/navigation";

export default function Error({

  error,
  reset,

}: {

  error: Error;

  reset: () => void;

}) {

  console.error(error);

  const router = useRouter();

  return (

    <main className="min-h-screen flex items-center justify-center bg-[#F8F3F0] px-5">

      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm text-center">

        <h1 className="text-2xl font-bold text-[#014BAA] mb-3">

          Terjadi Kendala Aplikasi

        </h1>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">

          Aplikasi mengalami kendala pada perangkat ini.

          <br />
          <br />

          Silakan coba kembali atau laporkan kendala.

        </p>

        <div className="space-y-3">

          <button
            onClick={() => reset()}
            className="
              w-full
              bg-[#014BAA]
              text-white
              py-3
              rounded-2xl
              font-semibold
              active:scale-[0.98]
              transition
            "
          >

            Coba Lagi

          </button>

          <button
            onClick={() =>
              window.open(
                "https://forms.gle/igSBEeLGGq2soBgr6",
                "_blank"
              )
            }
            className="
              w-full
              border
              py-3
              rounded-2xl
              font-semibold
              active:scale-[0.98]
              transition
            "
          >

            Laporkan Kendala

          </button>

          <button
            onClick={() =>
              router.push(
                "/attendance"
              )
            }
            className="
              w-full
              text-sm
              text-gray-500
              py-2
            "
          >

            Kembali

          </button>

        </div>

      </div>

    </main>
  );
}