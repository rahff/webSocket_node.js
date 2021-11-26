let namespaces;
let namespaceSocket = [];
let rooms = [];
let init = false;
let activedNsSocket;
let firstRoom;
let activedRoom;
let messages = [];


const ioClient = io({reconnection: false});
ioClient.on('connect', ()=>{
    console.log('connection ok');
})
ioClient.on('namespaces', (data)=>{
    namespaces = data;
    for (const ns of namespaces) {
        const nsSocket = io(`/${ns._id}`)
        nsSocket.on('rooms', (data)=>{
            rooms.push(...data);
            if(!init){
                activateNamespace(nsSocket);
                displaynamespaces(namespaces, nsSocket.nsp);
                init = true;
            }
        })
        nsSocket.on('history', (data)=>{
            messages = data;
            displayMesssages(messages);
        })
        nsSocket.on('message', (data)=>{
            messages.push(data);
            displayMesssages(messages)
        })
        namespaceSocket.push(nsSocket)
    }
})
setTimeout(() => {
    console.log(rooms);
    console.log(namespaces);
    console.log(namespaceSocket);
}, 3000);
function activateNamespace(nsSocket){
    activedNsSocket = nsSocket;
    firstRoom = rooms.filter((room)=> `/${room.namespace}` === activedNsSocket.nsp && room.index === 0)[0];
    displayrooms(rooms.filter((room)=> `/${room.namespace}` === activedNsSocket.nsp), firstRoom._id);
    activateRoom(firstRoom)
}
function activateRoom(room){
    activedNsSocket.emit('joinRoom', room._id);
    activedRoom = room
}