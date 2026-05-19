const API_URL =
  process.env.NEXT_PUBLIC_API_URL!;

async function safeRequest(payload: any) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    console.log("API URL:", API_URL);
    console.log("RAW RESPONSE:", text);

    if (!text || text.trim() === "") {
      throw new Error("Empty server response");
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response");
    }

  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export async function login(
  username: string,
  password: string
) {
  return safeRequest({
    action: "login",
    username,
    password,
  });
}

export async function submitAttendance(data: any) {
  return safeRequest({
    action: "attendance",
    ...data,
  });
}

export async function getTodayAttendance(
  username: string
) {
  return safeRequest({
    action: "getTodayAttendance",
    username,
  });
}