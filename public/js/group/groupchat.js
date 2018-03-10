$(document).ready(function(){
    var socket = io();
    
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    
    socket.on('connect', function(){
        console.log("Yea! user connected");
        var params = {
            room: room,
            name: sender
        }
        //emit the join event to connect to rooms together
        socket.emit('join', params, function(){
            console.log("User has joined this channel");
        });
    });
    
    ////display users list
    socket.on('usersList', function(users) {
        var ol = $('<ol></ol>');

		for(var i = 0; i < users.length; i++ ){
		  //  if(sender !== users[i]){
		        ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
		   // }
		    
			
		}
		
		$(document).on('click', '#val', function() {
			$('#name').text('@'+ $(this).text());
			$('#receiverName').val($(this).text());
			$('#nameLink').attr("href", "/profile/"+$(this).text());
		});
		
		
		$('#numValue').text('('+ users.length +')');
		$('#users').html(ol);
		
    });
    
    //get message and display on client side
    socket.on('newMessage', function(data){
        var template = $("#message-template").html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from
        });//render mustache template
        
        //append to the view
        $("#messages").append(message);
        
        
    });
    
    //send message to server
    $('#message-form').on('submit', function(e){
       e.preventDefault();
       var msg = $('#msg').val();
       socket.emit('createMessage', {
          text: msg,
          room: room, //emit the room
          sender: sender
       }, function(msg){
           //what to do after message has been sent
           $('#msg').val(''); //clear input field
           
       });
    });
});