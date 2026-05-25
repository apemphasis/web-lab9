import { app } from "./rest.js"
import { initSocket } from './socket.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Running in port:${PORT}`)
})

initSocket(server)