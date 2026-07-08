const Chat = require('../models/chat');
const ConnectionRequest = require('../models/connectionRequest');

const getChat = async (req, res) => {
    try {
        const targetUserId = req.params.targetUserId;
        const userId = req.user._id;

        const isConnectionExist = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                { fromUserId: targetUserId, toUserId: userId, status: "accepted" }
            ]
        });

        if (!isConnectionExist) {
            return res.status(404).json({ message: "No accepted connection found with this user" });
        }


        let chat = await Chat.findOne({
            participants: {
                $all: [userId, targetUserId],

            },
        }).populate({
            path: "messages.senderId",
            select: "firstName"
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            });

        }

        await chat.save();

        res.json(chat);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = {
    getChat
};
