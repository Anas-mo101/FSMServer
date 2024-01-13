import { Server as SocketIO } from "socket.io";
import { Server } from "http";
import AppError from "../../errors/AppError";

let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: "http://localhost:3030"
    }
  });

  io.on("connection", socket => {
    console.log("Client Connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
  return io;
};

export const getIO = (): SocketIO => {
  if (!io) {
    throw new AppError("Socket IO not initialized");
  }
  return io;
};
