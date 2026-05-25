import { Server } from "socket.io";

export function initSocket(httpServer) {
    const io = new Server(httpServer);
    
    const clients = {}; // Ожидающие клиенты
    const chatHistory = {}; // История сообщений. Ключ: clientId (он же roomId), Значение: массив сообщений

    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        socket.on("register", ({ name, role }) => {
            console.log(`Registered ${role}:`, name);
            
            if (role === "client") {
                clients[socket.id] = { id: socket.id, name };
                chatHistory[socket.id] = []; // Инициализируем пустую историю для нового клиента
                socket.join(socket.id); 
                
                io.to("supports").emit("clientsList", clients);
            } 
            else if (role === "support") {
                socket.join("supports"); 
                socket.emit("clientsList", clients);
            }
        });

        // Оператор подключается к чату
        socket.on("joinChat", (clientId) => {
            socket.join(clientId);
            
            // Отправляем оператору историю этого чата (если она есть)
            const history = chatHistory[clientId] || [];
            socket.emit("loadHistory", history);

            socket.emit("systemMsg", `Вы подключились к чату.`);
        });

        // Получение и рассылка сообщения
        socket.on("sendMessage", ({ roomId, message, senderName }) => {
            const msgObj = { senderName, message };

            // Сохраняем сообщение в историю конкретной комнаты (клиента)
            if (chatHistory[roomId]) {
                chatHistory[roomId].push(msgObj);
            }

            // Отправляем всем в комнате
            io.to(roomId).emit("newMessage", msgObj);
        });

        socket.on("disconnect", () => {
            if (clients[socket.id]) {
                delete clients[socket.id];
                // Очищаем историю при отключении клиента, чтобы не засорять память
                delete chatHistory[socket.id];
                io.to("supports").emit("clientsList", clients);
            }
        });
    });
}