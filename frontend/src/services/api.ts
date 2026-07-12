import { Platform } from "react-native";

const rawUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";
const BASE_URL =
  Platform.OS === "android" ? rawUrl.replace("localhost", "10.0.2.2") : rawUrl;

export const fetchMessages = async () => {
  const res = await fetch(`${BASE_URL}/api/messages`);
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
};
