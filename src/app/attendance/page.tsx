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

import {
  submitAttendance,
  getTodayAttendance,
} from "@/services/api";

import { compressImage } from "@/utils/compressImage";

import { fileToBase64 } from "@/utils/fileToBase64";

export default function AttendancePage() {

  const router = useRouter();

  const [user, setUser] =
    useState<any>(null);

  const [attendanceType, setAttendanceType] =
    useState("HADIR");

  const [location, setLocation] =
    useState<{
      latitude: number;
      longitude: number;
      accuracy: number;
    } | null>(null);

  const [photo, setPhoto] =
    useState<File | null>(null);

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [notes, setNotes] =
    useState("");

  const [loadingLocation, setLoadingLocation] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [gpsConfirmed, setGpsConfirmed] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  useEffect(() => {

    if (!navigator.onLine) {

  alert(
    "Koneksi internet tidak tersedia"
  );
}

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      router.push("/");

      return;
    }

    let parsedUser;

    try {

      parsedUser =
        JSON.parse(storedUser);

    } catch (error) {

      console.error(error);

      localStorage.removeItem("user");

      router.push("/");

      return;
    }

    setUser(parsedUser);

    checkTodayAttendance(
      parsedUser.username
    );

    navigator.geolocation.getCurrentPosition(

      (position) => {

        if (
          position &&
          position.coords
        ) {

          setLocation({
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,
          });
        }

        setLoadingLocation(false);
      },

      (error) => {

        console.error(error);

        setLoadingLocation(false);

        alert(
          "Gagal Mendapatkan GPS, Pastikan GPS Aktif dan Beri Izin Akses Lokasi"
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

    );

    const timer = setInterval(() => {

      setCurrentTime(new Date());

    }, 1000);

    return () => {

      clearInterval(timer);

      if (photoPreview) {

        URL.revokeObjectURL(
          photoPreview
        );
      }
    };

  }, [router]);

  function refreshLocation() {

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(

      (position) => {

        if (
          position &&
          position.coords
        ) {

          setLocation({
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,

            accuracy:
              position.coords.accuracy,
          });
        }

        setLoadingLocation(false);
      },

      (error) => {

        console.error(error);

        setLoadingLocation(false);

        alert(
          "Gagal Memperbaharui GPS, Coba Lagi"
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

    );
  }

  async function checkTodayAttendance(
    username: string
  ) {

    try {

      const result =
        await getTodayAttendance(
          username
        );

      if (
        result &&
        result.success
      ) {

        router.push(
          "/attendance/result"
        );
      }

    } catch (error) {

      console.error(error);

    }
  }

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    try {

      if (
        e.target.files &&
        e.target.files[0]
      ) {

        const file =
          e.target.files[0];

        setPhoto(file);

        const imageUrl =
          URL.createObjectURL(file);

        setPhotoPreview(
          imageUrl
        );
      }

    } catch (error) {

      console.error(error);

      alert(
        "Gagal memproses foto"
      );
    }
  }

  async function handleSubmit() {

    if (submitting) return;

    if (!navigator.onLine) {

    alert(
    "Tidak ada koneksi internet.\n\nPeriksa koneksi lalu coba kembali."
    );

    return;
    }

    if (
      attendanceType === "HADIR" &&
      !photo
    ) {

      alert(
        "Selfie dulu ya untuk absen hadir"
      );

      return;
    }

    if (
      attendanceType === "HADIR" &&
      !location
    ) {

      alert(
        "Lokasi GPS dibutuhkan untuk absen hadir"
      );

      return;
    }

    if (
      attendanceType === "HADIR" &&
      location &&
      location.accuracy > 100 &&
      !gpsConfirmed
    ) {

      const continueSubmit =
        window.confirm(
          `Akurasi GPS saat ini ${Math.round(
            location.accuracy
          )}m.\n\nGPS kurang akurat.\n\nPilih OK untuk lanjut absensi atau Cancel untuk refresh GPS.`
        );

      if (!continueSubmit) {

        refreshLocation();

        return;
      }

      setGpsConfirmed(true);
    }

    try {

      setSubmitting(true);

      let base64Photo = "";

      if (
        photo &&
        attendanceType === "HADIR"
      ) {

        const compressedPhoto =
          await compressImage(photo);

        base64Photo =
          await fileToBase64(
            compressedPhoto
          );
      }

      const result =
        await submitAttendance({

          username:
            user?.username || "",

          name:
            user?.name || "",

          unit:
            user?.unit || "",

          type:
            attendanceType,

          latitude:
            location?.latitude || "",

          longitude:
            location?.longitude || "",

          accuracy:
            location?.accuracy || "",

          notes,

          photo: base64Photo,
        });

      if (
        result &&
        result.success
      ) {

        setGpsConfirmed(false);

        router.push(
          "/attendance/result"
        );

      } else {

        alert(
          result?.message ||
          "Gagal mengirim absensi.\n\nPeriksa koneksi internet lalu coba kembali."
        );
      }

    } catch (error) {

      console.error(error);

      alert(
        "Absensi gagal dikirim.\n\nSilakan coba kembali."
      );

    } finally {

      setSubmitting(false);

    }
  }

  function handleLogout() {

    localStorage.removeItem("user");

    router.push("/");
  }

  return (

    <main className="min-h-screen bg-[#F8F3F0] pb-10">

      <section className="bg-[#014BAA] text-white rounded-b-3xl px-5 pt-6 pb-8 shadow-lg">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-300">
              Selamat Datang
            </p>

            <h1 className="text-2xl font-bold mt-1">
              {user?.name || "Employee"}
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              {user?.unit || "-"}
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

      <section className="px-4 -mt-4 max-w-md mx-auto mb-4">

        <div className="bg-white rounded-3xl shadow-lg p-5">

          <p className="text-sm text-gray-500 mb-1">
            Waktu Absensi
          </p>

          <h2 className="text-3xl font-bold tracking-tight">
            {currentTime.toLocaleTimeString("id-ID")}
          </h2>

          <p className="text-sm text-gray-600 mt-2">

            {currentTime.toLocaleDateString(
              "id-ID",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}

          </p>

        </div>

      </section>

      <section className="px-4 max-w-md mx-auto">

        <div className="bg-white rounded-3xl shadow-xl p-5 space-y-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Absensi Harian
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
              className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#014BAA]"
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

                  Belum ada foto diambil

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

                <div className="bg-[#014BAA] text-white text-center py-3 rounded-2xl font-medium active:scale-[0.98] transition">

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

                  Mendeteksi lokasimu...

                </div>

              ) : location ? (

                <div className="space-y-2 text-sm">

                  <div className="flex items-center gap-2 text-green-600 font-medium">

                    <CheckCircle2 size={16} />

                    Lokasi Terdeteksi

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

                    <p
                      className={
                        location.accuracy <= 20
                          ? "text-green-600 font-medium"
                          : location.accuracy <= 50
                          ? "text-yellow-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >

                      Accuracy:
                      {" "}

                      {Math.round(
                        location.accuracy
                      )} m

                    </p>

                  </div>

                </div>

              ) : (

                <p className="text-sm text-red-500">

                  Gagal Mendapatkan Lokasi

                </p>

              )}

              <button
                onClick={refreshLocation}
                className="mt-4 w-full border py-3 rounded-2xl font-medium active:scale-[0.98] transition"
              >

                Refresh GPS

              </button>

            </div>

          )}

          <div className="bg-gray-50 border rounded-2xl p-4">

            <div className="flex items-center gap-2 mb-3">

              <FileText size={18} />

              <h3 className="font-semibold">
                Catatan
              </h3>

            </div>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Tambahkan catatan jika diperlukan..."
              rows={4}
              className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#014BAA] resize-none"
            />

          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="
            w-full
            bg-[#014BAA]
            text-white
            py-4
            rounded-2xl
            font-semibold
            text-lg
            shadow-lg
            active:scale-[0.98]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
"
          >

            {submitting
              ? "Mengirim Absensi..."
              : "Kirim Absensi"}

          </button>

        </div>

      </section>

    </main>
  );
}