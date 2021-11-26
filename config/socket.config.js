const socketIo = require('socket.io');
const { server } = require('../app');
const { ensurAuthenticatedSocket } = require('./security.config');
const { getNamespaces } = require('../queries/namespaces.queries');
const { getRoomByNsId } = require('../queries/room.queries');
const { getMessageByRoom } = require('../queries/messages.queries');
const { createMessage } = require('../queries/messages.queries');
const { User } = require('../database/models');
const { request } = require('express');
let namespaces;
let ios;


const initNamespaces = async ()=>{
    try {
     namespaces = await getNamespaces();
     for (const namespace of namespaces) {
        const ns = ios.of(`/${namespace._id}`);
         ns.on('connect', async (nsSocket)=>{
             try {
                 const rooms = await getRoomByNsId(namespace._id);
                 nsSocket.emit('rooms', rooms)
             } catch (error) {
                 throw error;
             }
             nsSocket.on('joinRoom', async (roomId)=>{
                try {
                    nsSocket.join(`/${roomId}`)
                    const messages = await getMessageByRoom(roomId);
                    nsSocket.emit('history', messages);
                } catch (error) {
                    throw error;
                }
             });
             nsSocket.on('message', async ({text, roomId}) =>{
                 try {
                     const user = nsSocket.request.user
                     const message = await createMessage({
                         data: text,
                         room: roomId,
                         authorName: user.username,
                         author: user._id
                     })
                     ns.to(`/${roomId}`).emit('message', message)
                 } catch (error) {
                     throw error;
                 }
             })
         });
     }
    } catch (error) {
        throw error;
    }
}
const initSocketServer = ()=>{
    ios = socketIo(server, {
        allowRequest: ensurAuthenticatedSocket
    })
    ios.on('connect', (socket)=>{
        console.log('connection socket');
        socket.emit('namespaces', namespaces);
    })
}
initNamespaces();
initSocketServer();
