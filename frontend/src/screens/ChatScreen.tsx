import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchMessages } from "../services/api";
import { getSocket, disconnectSocket } from "../services/socket";
import MessageBubble from "../components/MessageBubble";
import { Message } from "../types";

interface Props {
  username: string;
}

export default function ChatScreen({ username }: Props) {
  const insets = useSafeAreaInsets();
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardShown(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardShown(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();

    fetchMessages()
      .then((data) => setMessages(data))
      .catch(console.error)
      .finally(() => setLoading(false));

    socket.emit("join", username);

    socket.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("userTyping", (user: string) => {
      setTypingUser(user);
    });

    socket.on("userStoppedTyping", () => {
      setTypingUser(null);
    });

    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("onlineUsers");
      disconnectSocket();
    };
  }, [username]);

  const handleTyping = (value: string) => {
    setText(value);
    const socket = getSocket();
    socket.emit("typing", username);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping");
    }, 1500);
  };

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const socket = getSocket();
    socket.emit("sendMessage", { username, text: trimmed });
    setText("");
    socket.emit("stopTyping");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Chat Room</Text>
        <Text style={styles.onlineCount}>{onlineUsers.length} online</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble message={item} currentUser={username} />
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {typingUser && typingUser !== username && (
        <Text style={styles.typing}>{typingUser} is typing...</Text>
      )}

      <View
        style={[
          styles.inputRow,
          { paddingBottom: keyboardShown ? 8 : Math.max(insets.bottom, 12) },
        ]}
      >
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleTyping}
          placeholder="Type a message..."
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
  },
  onlineCount: {
    fontSize: 13,
    color: "#4CAF50",
  },
  list: {
    paddingVertical: 12,
  },
  typing: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 15,
    marginRight: 8,
    color: "#111",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
