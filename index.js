import { Server } from "socket.io";

const io = new Server(9000, {
    cors: {
        origin: 'https://6534c695598cac05e278943d--stalwart-profiterole-05f973.netlify.app'
    }
})
//to show active users below
let users = []
const addUser = (userData, socketId) =>{
     !users.some(user=>user.sub == userData.sub) && users.push({...userData, socketId})
}

const getUser = (userId) => {
    return users.find(user => user.sub === userId)
}

io.on('connection', (socket)=>{
    console.log('user connected')
    socket.on('addUsers', userData => {
        addUser(userData, socket.id)
        io.emit('getUsers', users)
    })
    socket.on('sendMessage', data => {
        const user = getUser(data.receiverId)
        io.to(user.socketId).emit('getMessage', data)
    })
})
