"use client";

export default function GlobalError({

  error,
  reset,

}: {

  error: Error & {
    digest?: string;
  };

  reset: () => void;

}) {

  console.error(error);

  return (

    <html lang="en">

      <body className="bg-[#F8F3F0]">

        <main className="min-h-screen flex items-center justify-center px-5">

          <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-sm text-center">

            <h1 className="text-2xl font-bold text-[#014BAA] mb-3">

              Aplikasi Tidak Dapat Dibuka

            </h1>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">

              Terjadi kendala saat membuka aplikasi.

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

            </div>

          </div>

        </main>

      </body>

    </html>
  );
}
