import { io } from "socket.io-client";
import { BASE_URL } from "../../Api/Url";

const SOCKET_URL = "https://dharma-cab.onrender.com";
// const SOCKET_URL = "https://a36d-2401-4900-36ad-dc2b-9b6-567a-d954-f52f.ngrok-free.app";
// const SOCKET_URL = "https://cabdriverserver-a3cdd048fc7c.herokuapp.com";

class WSService { 
  constructor() {
    this.socket = null;
  }

  initializeSocket = async (userToken) => {
    try {
      // If socket already exists and is connected, return it
      if (this.socket?.connected) {
        return this.socket;
      }

      // Initialize new socket connection
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        secure: true,
        auth: {
          token: userToken,
          type: "rider"
        },
        query: {
          token: userToken,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        // extraHeaders: {
        //   "User-Agent": "okhttp/4.12.0",
        //   "Accept-Encoding": "gzip",
        // }
      });

      console.log('👋 Initializing socket');

      // Setup event handlers
      this.socket.on("connect", () => {
        console.log("✅✅✅ Socket connected successfully! ✅✅✅", this.socket);
      });

      this.socket.on("disconnect", () => {
        console.log("=== socket disconnected ===");
      });

      this.socket.on("connect_error", (error) => {
        console.log("=== socket connection error ===", JSON.stringify(error));
      });

      return this.socket;

    } catch (error) {
      console.log("=== socket initialization error ===", error);
      throw error;
    }
  }

  on(event, callback) {
    if (!this.socket) {
      console.warn("Socket not initialized. Call initializeSocket first.");
      return;
    }
    this.socket.on(event, callback);
  }

  emit(event, data, callback) {
    if (!this.socket) {
      console.warn("Socket not initialized. Call initializeSocket first.");
      return;
    }
    this.socket.emit(event, data, callback);
  }

  removeListener(event, listener) {
    if (!this.socket) {
      console.warn("Socket not initialized. Call initializeSocket first.");
      return;
    }
    this.socket?.off(event, listener);
  }

  disconnectSocket = () => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("=== Socket manually disconnected ===");
    }
  }

  isConnected = () => {
    return this.socket?.connected;
  }
}

const socketServices = new WSService();
export default socketServices;