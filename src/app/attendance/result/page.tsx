"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  CheckCircle2,
  MapPin,
  Clock3,
  FileText,
  ArrowLeft,
  LogOut,
} from "lucide-react";

import {
  getTodayAttendance,
} from "@/services/api";

export default function AttendanceResultPage() {

  const router = useRouter();

  const [attendance, setAttendance] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      router.push("/");

      return;
    }

    const user =
      JSON.parse(storedUser);

    loadAttendance(
      user.username
    );

  }, [router]);

  async function loadAttendance(
    username: string
  ) {

    try {

      const result =
        await getTodayAttendance(
          username
        );

      if (result.success) {

        setAttendance(
          result.attendance
        );

      } else {

        router.push(
          "/attendance"
        );
      }

    } catch (error) {

      console.error(error);

      alert(
        "Failed to load attendance"
      );

    } finally {

      setLoading(false);

    }
  }

  function handleLogout() {

    localStorage.removeItem("user");

    router.push("/");
  }

  if (loading) {

    return (

      <main className="min-h-screen flex items-center justify-center bg-[#F8F3F0]">

        <p className="text-gray-500">
          Loading attendance...
        </p>

      </main>

    );
  }

  return (

    <main className="min-h-screen bg-[#F8F3F0] pb-6">

      <section className="bg-[#014BAA] text-white rounded-b-3xl px-5 pt-5 pb-6 shadow-lg">

        <div className="flex items-start justify-between mb-5">

          <button
            onClick={() =>
              router.push(
                "/attendance"
              )
            }
            className="bg-white/10 p-3 rounded-xl"
          >

            <ArrowLeft size={18} />

          </button>

          <button
            onClick={handleLogout}
            className="bg-white/10 p-3 rounded-xl"
          >

            <LogOut size={18} />

          </button>

        </div>

        <div>

          <p className="text-sm text-blue-100">

            Absensi Hari Ini

          </p>

          <h1 className="text-3xl font-bold mt-2">

            {attendance?.attendance}

          </h1>

        </div>

      </section>

      <section className="px-4 -mt-4 max-w-md mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-4 space-y-4">

          <div className="flex items-center gap-3">

            <div className="bg-green-100 p-3 rounded-2xl">

              <CheckCircle2
                className="text-green-600"
                size={22}
              />

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Nama
              </p>

              <h2 className="font-bold text-lg">
                {attendance?.name}
              </h2>

            </div>

          </div>

          <div className="border-t pt-4 space-y-4">

            <div className="flex items-start gap-3">

              <Clock3
                className="text-[#014BAA]"
                size={20}
              />

              <div>

                <p className="text-sm text-gray-500">
                  Waktu Absensi
                </p>

                <p className="font-medium">

                  {new Date(
                    attendance?.timestamp
                  ).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}

                  {" • "}

                  {new Date(
                    attendance?.timestamp
                  ).toLocaleTimeString(
                    "id-ID"
                  )}

                </p>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <MapPin
                className="text-[#014BAA]"
                size={20}
              />

              <div>

                <p className="text-sm text-gray-500">
                  GPS Accuracy
                </p>

                <p className="font-medium">

                  {Math.round(
                    attendance?.accuracy
                  )} m

                </p>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <FileText
                className="text-[#014BAA]"
                size={20}
              />

              <div>

                <p className="text-sm text-gray-500">
                  Catatan
                </p>

                <p className="font-medium break-words">

                  {attendance?.notes ||
                    "-"}

                </p>

              </div>

            </div>

          </div>

          {attendance?.photoUrl && (

            <div className="pt-1">

              <p className="text-sm text-gray-500 mb-3">

                Foto Absensi

              </p>

              <img
                src={attendance.photoUrl}
                alt="Attendance"
                className="
                  w-full
                  max-h-[45vh]
                  object-cover
                  rounded-2xl
                  border
                "
              />

            </div>

          )}

        </div>

      </section>

    </main>
  );
}