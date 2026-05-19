const API_URL =
  process.env.NEXT_PUBLIC_API_URL!;

export async function login(
  username: string,
  password: string
) {

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },

    body: JSON.stringify({
      action: "login",
      username,
      password,
    }),
  });

  return response.json();
}

export async function submitAttendance(data: any) {

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },

    body: JSON.stringify({
      action: "attendance",
      ...data,
    }),
  });

  return response.json();
}

export async function getTodayAttendance(
  username: string
) {

  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type":
        "text/plain;charset=utf-8",
    },

    body: JSON.stringify({
      action: "getTodayAttendance",
      username,
    }),
  });

  return response.json();
}