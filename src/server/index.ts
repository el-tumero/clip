import { Server } from "socket.io";

const port:number | undefined = Number(process.env.PORT)

const io = new Server(port, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    //const pin:string | string[] | undefined = socket.handshake.query.pin;
    socket.on('hello', data => {
        //console.log(data)
        io.emit(data[1], { sender: data[0], msg: data[2]})
    })
})


console.log('Server (socket.io) listening at port ' + port)
