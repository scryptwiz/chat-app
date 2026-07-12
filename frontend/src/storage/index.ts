import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export const getUsername = (): string | undefined =>
  storage.getString("username");

export const setUsername = (username: string) =>
  storage.set("username", username);

export const clearUsername = () => storage.remove("username");
