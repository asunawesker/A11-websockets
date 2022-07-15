const socketController = (socket) => {

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });

    socket.on('enviar-mensaje', (payload, callback) => {
        console.log('computadora -> ', payload);
        const id = 1234;
        callback(id);

        //payload.client = socket.handshake.headers['sec-ch-ua'];

        payload.client = socket.id;
        
        socket.broadcast.emit('res-ser', payload);
    });

    socket.on('enviar-notificacion', (payload, callback) => {
        console.log('computadora -> ', payload);
        const id = 1234;
        callback(id);
        
        socket.broadcast.emit('res-noti', payload);
    });
    
};

module.exports = {
    socketController
}