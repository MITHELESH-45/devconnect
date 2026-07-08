const socket = require("socket.io");
const crypto = require("crypto");


const getSecretRoomId = ({ userId, targetUserId }) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join('$')).digest('hex');
}

const intializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {

            const roomId = getSecretRoomId(userId, targetUserId);

            socket.join(roomId);
        });

        socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {

            const roomId = getSecretRoomId(userId, targetUserId);
            io.to(roomId).emit("messageReceived", { firstName, text });

        });

        socket.on("disconnect", () => { });
    });

}

module.exports = intializeSocket;
