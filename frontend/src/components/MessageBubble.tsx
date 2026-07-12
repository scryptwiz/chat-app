import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "../types";

interface Props {
  message: Message;
  currentUser: string;
}

export default function MessageBubble({ message, currentUser }: Props) {
  const isMe = message.username === currentUser;
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
      {!isMe && <Text style={styles.username}>{message.username}</Text>}
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={isMe ? styles.textMe : styles.textThem}>{message.text}</Text>
        <Text style={[styles.time, { color: isMe ? "rgba(255,255,255,0.7)" : "#999" }]}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    maxWidth: "75%",
  },
  rowLeft: {
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  rowRight: {
    alignSelf: "flex-end",
    marginRight: 12,
  },
  username: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  bubbleMe: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: "#F0F0F0",
    borderBottomLeftRadius: 4,
  },
  textMe: {
    color: "#fff",
    fontSize: 15,
  },
  textThem: {
    color: "#111",
    fontSize: 15,
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
});
