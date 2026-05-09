"use client";

export default function Error({

  error,
  reset,

}: {

  error: Error;

  reset: () => void;

}) {

  console.error(error);

  return (

    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F8F3F0] px-6 text-center">

      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full">

        <h1 className="text-2xl font-bold text-[#014BAA] mb-3">

          Terjadi Kendala Aplikasi

        </h1>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">

          Aplikasi mengalami kendala pada perangkat ini.
          Silakan coba kembali atau refresh aplikasi.

        </p>

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

      </div>

    </main>
  );
}