import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getUsername } from "./src/storage";
import LoginScreen from "./src/screens/LoginScreen";
import ChatScreen from "./src/screens/ChatScreen";

export default function App() {
  const [username, setUsername] = useState<string | null>(
    () => getUsername() ?? null,
  );

  if (!username) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLogin={setUsername} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ChatScreen username={username} />
    </SafeAreaProvider>
  );
}
