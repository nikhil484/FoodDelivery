import User from "./models/user.model.js";

export const socketHandler = async (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId, {socketId: socket.id ,isOnline:true},
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });
  });
};

