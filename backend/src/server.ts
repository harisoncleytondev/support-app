import http from "http";
import app from "./app.js";
import { initializeSocket } from "./websocket/socket.js";

const server = http.createServer(app);

initializeSocket(server);

const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
