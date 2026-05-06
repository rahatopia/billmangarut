"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  MapPin,
  Camera,
  FileText,
  CheckCircle2,
  Loader2,
  LogOut,
  ClipboardList,
} from "lucide-react";

import { submitAttendance } from "@/services/api";

export default function AttendancePage() {

  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [attendanceType, setAttendanceType] =
    useState("HADIR");

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  const [photo, setPhoto] =
    useState<File | null>(null);

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [notes, setNotes] = useState("");

  const [loadingLocation, setLoadingLocation] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      router.push("/");
      return;
    }

    setUser(JSON.parse(storedUser));

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLoadingLocation(false);
      },

      (error) => {

        console.error(error);

        setLoadingLocation(false);

        alert("Failed to get GPS location");
      }

    );

  }, [router]);

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    if (
      e.target.files &&
      e.target.files[0]
    ) {

      const file = e.target.files[0];

      setPhoto(file);

      const imageUrl =
        URL.createObjectURL(file);

      setPhotoPreview(imageUrl);
    }
  }

  async function handleSubmit() {

    if (
      attendanceType === "HADIR" &&
      !photo
    ) {
      alert("Please take a photo first");
      return;
    }

    if (
      attendanceType === "HADIR" &&
      !location
    ) {
      alert("GPS location not detected");
      return;
    }

    try {

      setSubmitting(true);

      const result =
        await submitAttendance({

          username: user.username,
          name: user.name,

          type: attendanceType,

          latitude:
            location?.latitude || "",

          longitude:
            location?.longitude || "",

          accuracy:
            location?.accuracy || "",

          notes,
        });

      if (result.success) {

        alert(
          "Attendance submitted successfully"
        );

        setPhoto(null);
        setPhotoPreview(null);
        setNotes("");

      } else {

        alert(result.message);

      }

    } catch (error) {

      console.error(error);

      alert("Submission failed");

    } finally {

      setSubmitting(false);

    }
  }

  function handleLogout() {

    localStorage.removeItem("user");

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pb-10">

      <section className="bg-black text-white rounded-b-3xl px-5 pt-6 pb-8 shadow-lg">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-300">
              Selamat Datang
            </p>

            <h1 className="text-2xl font-bold mt-1">
              {user?.name || "Employee"}
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              {user?.unit}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-white/10 p-3 rounded-xl active:scale-95 transition"
          >
            <LogOut size={18} />
          </button>

        </div>

      </section>

      <section className="px-4 -mt-5 max-w-md mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-5 space-y-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Absensi harian
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Silahkan lengkapi pengiriman absensi Anda
            </p>

          </div>

          <div className="bg-gray-50 border rounded-2xl p-4">

            <div className="flex items-center gap-2 mb-3">

              <ClipboardList size={18} />

              <h3 className="font-semibold">
                Jenis Absensi
              </h3>

            </div>

            <select
              value={attendanceType}
              onChange={(e) =>
                setAttendanceType(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-black"
            >

              <option value="HADIR">
                Hadir
              </option>

              <option value="SAKIT">
                Sakit
              </option>

              <option value="IZIN">
                Izin
              </option>

              <option value="CUTI">
                Cuti
              </option>

            </select>

          </div>

          {attendanceType === "HADIR" && (

            <div className="bg-gray-50 border rounded-2xl p-4">

              <div className="flex items-center gap-2 mb-3">

                <Camera size={18} />

                <h3 className="font-semibold">
                  Foto Absensi
                </h3>

              </div>

              {photoPreview ? (

                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-2xl mb-4"
                />

              ) : (

                <div className="w-full h-64 rounded-2xl border-2 border-dashed flex items-center justify-center text-gray-400 mb-4">

                  No photo selected

                </div>

              )}

              <label className="block">

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <div className="bg-black text-white text-center py-3 rounded-2xl font-medium active:scale-[0.98] transition">

                  {photo
                    ? "Retake Photo"
                    : "Take Photo"}

                </div>

              </label>

            </div>

          )}

          {attendanceType === "HADIR" && (

            <div className="bg-gray-50 border rounded-2xl p-4">

              <div className="flex items-center gap-2 mb-3">

                <MapPin size={18} />

                <h3 className="font-semibold">
                  Lokasi GPS
                </h3>

              </div>

              {loadingLocation ? (

                <div className="flex items-center gap-2 text-sm text-gray-500">

                  <Loader2
                    className="animate-spin"
                    size={16}
                  />

                  Detecting your location...

                </div>

              ) : location ? (

                <div className="space-y-2 text-sm">

                  <div className="flex items-center gap-2 text-green-600 font-medium">

                    <CheckCircle2 size={16} />

                    Location detected

                  </div>

                  <div className="text-gray-600 space-y-1">

                    <p>
                      Latitude:
                      {" "}
                      {location.latitude}
                    </p>

                    <p>
                      Longitude:
                      {" "}
                      {location.longitude}
                    </p>

                    <p>
                      Accuracy:
                      {" "}
                      {Math.round(
                        location.accuracy
                      )}
                      m
                    </p>

                  </div>

                </div>

              ) : (

                <p className="text-sm text-red-500">

                  Failed to get location

                </p>

              )}

            </div>

          )}

          <div className="bg-gray-50 border rounded-2xl p-4">

            <div className="flex items-center gap-2 mb-3">

              <FileText size={18} />

              <h3 className="font-semibold">
                Notes
              </h3>

            </div>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Optional notes..."
              rows={4}
              className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-black resize-none"
            />

          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg shadow-lg active:scale-[0.98] transition disabled:opacity-50"
          >

            {submitting
              ? "Submitting..."
              : "Submit Attendance"}

          </button>

        </div>

      </section>

    </main>
  );
}