module.exports = function(Users,async) {
	 return{
	 	SetGroupRouting: function(router) {
	 		router.get('/group/:name', this.groupPage);
	 		
	 		router.post('/group/:name', this.groupPostPage);


	 	//	router.post('/group/:name', this.groupPostPage);
	 	},
	 	
	 	groupPage: function(req, res){
	 	   const name = req.params.name;
	 		async.parallel([
	 			function(callback){
	 				Users.findOne({'username': req.user.username})
	 				   .populate('request.userId')
	 				   .exec((err, result) => {
	 				   		callback(err, result);
	 				   })
	 			}

	 		], (err, results) => {
	 			const result1 = results[0];
                  // console.log(result1.request[0].userId);
		 			res.render('groupchat/group', 
		 			{
		 				title: 'FootBallkik | Group',
		 				groupName: name,
		 				user: req.user,
		 				data: result1
		 			}
		 		  );
	 		});
	 	    
	 	    
	 	},
	 	
	 	groupPostPage: function(req, res) {
	 		 // send friend request
	 		async.parallel([
	 			function(callback){
                   if(req.body.receiver){
                       Users.update({
                           'username': req.body.receiver,
                           'request.userId': {$ne: req.user._id},
                           'friendsList.friendId': {$ne: req.user._id}
                       },
                       {
                            $push: {request: {
                                userId: req.user._id,
                                username: req.user.username
                            }},
                            $inc: {totalRequest: 1}
                       }, (err, count) => {
                           callback(err, count);
					});
                   }
                },
	 			function(callback){
                    if(req.body.receiver){
                        Users.update({
                            'username': req.user.username,
                            'sentRequest.username': {$ne: req.body.receiver}
                        },
                        {
                            $push: {sentRequest: {
                                username: req.body.receiver
                            }}    
                        }, (err, count) => {
                            callback(err, count);
                      });
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+req.params.name);
            });
            
            //accept friend request
            async.parallel([
                
                function(callback) {
                     if(req.body.senderId) {
                         //update users document inside users collection when it is accepted 
                         
                         Users.update({
                             '_id': req.user._id,
                             'friendsList.friendId': { $ne: req.body.senderId }
                         },{
                             $push: {friendsList: {
                                 friendId: req.body.senderId,
                                 friendName: req.body.senderName
                             }},
                             $pull: {request: {
                                 userId: req.body.senderId,
                                 username: req.body.senderName
                             }},
                             $inc: {totalRequest: -1}
                         }, (err, count) => {
                             callback(err, count);
                         });
                     }
                },
                
                function(callback) {
                     if(req.body.senderId) {
                         //update users document inside  the sender collection when it is accepted by the reciever
                         
                         Users.update({
                             '_id': req.body.senderId,
                             'friendsList.friendId': { $ne: req.user._id }
                         },{
                             $push: {friendsList: {
                                 friendId: req.user._id,
                                 friendName: req.user.username
                             }},
                             $pull: {sentRequest: {
                                 username: req.user.username
                             }}
                         }, (err, count) => {
                             callback(err, count);
                         });
                     }
                }
            ], (err, count ) => {
                res.redirect('/group/'+req.params.name);
            });
	 	  }
	 	
	 	
	 	
	 	
	 	
	 	
   } 

}
	 	