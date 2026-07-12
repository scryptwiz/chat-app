import { io, Socket } from "socket.io-client";
import { Platform } from "react-native";

const rawUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";
const BASE_URL =
  Platform.OS === "android" ? rawUrl.replace("localhost", "10.0.2.2") : rawUrl;

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(BASE_URL, { transports: ["websocket"] });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
