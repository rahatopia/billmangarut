const API_URL = "https://script.google.com/macros/s/AKfycbzJ5FJAweO547jRg6Fd66GtiZh8X9L1xuBJ5QxTmuu9V_p5Jtbl74DvAuSB9Hq8UMIm/exec";

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