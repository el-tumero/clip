import { Server } from "socket.io";

const port:number = 3333

const io = new Server(port, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    //const pin:string | string[] | undefined = socket.handshake.query.pin;
    socket.on('hello', data => {
        console.log(data)
        io.emit(data[1], { sender: data[0], msg: data[2]})
    })
})

//io.listen(3333)

console.log('Server listening at port ' + port)

// console.log(123)