import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";

class SocketManager {
  private wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws) => {
      console.log("Cliente conectado ao WebSocket");

      ws.on("close", () => {
        console.log("Cliente desconectado do WebSocket");
      });
    });
  }

  broadcast(event: string, data: unknown) {
    const message = JSON.stringify({ event, data });

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

let socketManager: SocketManager;

export function initializeSocket(server: Server) {
  socketManager = new SocketManager(server);
}

export function getSocketManager() {
  return socketManager;
}
