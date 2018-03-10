module.exports = function(io, Users) {
    
    const users = new Users();
    
    io.on('connection', (socket) => {
       console.log('User Connected');
       
       //listen for the join event
       socket.on('join', (params, callback) => {
           socket.join(params.room);//connect to the room automatically and when a message is emited only users in that room will be able to see the message
           
           //add the users connected
           users.AddUserData(socket.id, params.name, params.room);
           
           //get list of users connected
           io.to(params.room).emit('usersList', users.GetUsersList(params.room));
           
           //console.log(users);
          callback(); 
       });
       
       socket.on('createMessage', (message, callback) => {
          console.log(message); 
          
          //send message back to client side and listen on the message
          //to emit a message to evry one connected to that room you add to(message.room)
          io.to(message.room).emit('newMessage', {
             text: message.text,
             room: message.room,
             from: message.sender
          });
          
          callback();
       });
       
       socket.on('disconnect', () => {
			var user = users.RemoveUser(socket.id);

			if (user) {
				 io.to(user.room).emit('usersList', users.GetUsersList(user.room));
			}
		});

       
    });
}