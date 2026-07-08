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

            const roomId = getSecretRoomId({ userId, targetUserId });

            socket.join(roomId);
        });

        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {


            try {

                const roomId = getSecretRoomId(userId, targetUserId);

                let chat = await Chat.findOne({
                    participants: {
                        $all: [userId, targetUserId]
                    }
                });

                if (!chat) {

                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text,
                });

                await chat.save();

                io.to(roomId).emit("messageReceived", { firstName, text });

            } catch (err) {
                console.log(err.message);
            }

        });

        socket.on("disconnect", () => { });
    });

}

module.exports = intializeSocket;
