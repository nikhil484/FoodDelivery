import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("identity", async ({ userId }) => {
      try {
        await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id },
          { new: true }
        );
      } catch (err) {
        console.log("Socket Identity Error:", err);
      }
    });
  });
};
