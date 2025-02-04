const { Server } = require("socket.io");

function startSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("send_message", (data) => {
            io.emit("receive_message", data);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.id);
        });
    });
}

module.exports = startSocket;
