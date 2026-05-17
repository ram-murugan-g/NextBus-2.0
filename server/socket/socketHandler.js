export const initSocketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('join:driver', (driverId) => {
      socket.join(`driver:${driverId}`);
      console.log(`🚗 Driver ${driverId} joined`);
    });

    socket.on('driver:update', (data) => {
      io.emit('bus:driverUpdate', data);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
