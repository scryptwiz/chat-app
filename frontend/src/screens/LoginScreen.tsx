import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { setUsername } from "../storage";

interface Props {
  onLogin: (username: string) => void;
}

export default function LoginScreen({ onLogin }: Props) {
  const [value, setValue] = useState("");

  const handleJoin = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      Alert.alert("Enter a username to continue");
      return;
    }
    setUsername(trimmed);
    onLogin(trimmed);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat App</Text>
      <Text style={styles.label}>Choose a username</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. john_doe"
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleJoin}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoin}>
        <Text style={styles.buttonText}>Join Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
    color: "#111",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: "#111",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
