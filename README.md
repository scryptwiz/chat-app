# Chat App

A real-time chat application built with React Native (Expo), Node.js, Express, Socket.io, and MongoDB.

## Project Structure

```
chat-app/
├── backend/          # Node.js + Express + Socket.io + MongoDB
└── frontend/         # React Native (Expo)
```

---

## Backend Setup

### Requirements

- Node.js >= 18
- A MongoDB Atlas connection string

### Steps

```bash
cd backend

# Copy env file and fill in your values
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables (`backend/.env`)


| Variable      | Description                                        |
| ------------- | -------------------------------------------------- |
| `PORT`        | Port the server listens on (default: `3001`)       |
| `MONGODB_URI` | MongoDB Atlas connection string                    |
| `CLIENT_URL`  | Allowed CORS origin (e.g. `http://localhost:8081`) |


---



## Frontend Setup



### Requirements

- Node.js >= 18
- iOS Simulator / Android Emulator, or a physical device with Expo Go

> **Note:** `react-native-mmkv` requires a **development build** (not Expo Go). Run `npx expo run:ios` or `npx expo run:android` to build locally, or use EAS Build.



### Steps

```bash
cd frontend

# Copy env file and fill in your backend URL
cp .env.example .env

# Install dependencies
npm install

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```



### Environment Variables (`frontend/.env`)


| Variable              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | Backend server URL (e.g. `http://localhost:3001`) |


---



## REST API


| Method | Endpoint        | Description                                   |
| ------ | --------------- | --------------------------------------------- |
| `GET`  | `/api/messages` | Fetch last 100 messages                       |
| `POST` | `/api/messages` | Create a message (body: `{ username, text }`) |




## Socket.io Events


| Event (Client → Server) | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `join`                  | Register username, get added to online users list    |
| `sendMessage`           | Send `{ username, text }`, saved to DB and broadcast |
| `typing`                | Notify others the user is typing                     |
| `stopTyping`            | Notify others the user stopped typing                |



| Event (Server → Client) | Description                                    |
| ----------------------- | ---------------------------------------------- |
| `newMessage`            | Broadcast newly created message to all clients |
| `userTyping`            | Broadcasts which user is typing                |
| `userStoppedTyping`     | Clears typing indicator                        |
| `onlineUsers`           | Updated list of connected usernames            |


---



## Design Decisions

- **MMKV** is used over AsyncStorage for local persistence because it is synchronous and significantly faster for simple key-value reads.
- **Socket.io singleton** (`getSocket`) ensures one shared connection is reused across the app rather than creating new connections per component.
- **Message persistence**: Messages are saved to MongoDB via the `sendMessage` socket event (not the REST POST route), keeping the real-time and persistence logic in one place. The REST GET route is used on app load to hydrate history.
- **Online users** are tracked in-memory on the server using a `Map` of `socketId → username`. This resets on server restart intentional for simplicity.



## Assumptions

- This is a single shared public chat room (no private rooms/DMs).
- Usernames are not globally unique users pick any name on login.
- No password or token-based authentication (dummy login by username only).
- Chat history is limited to the last 100 messages.

