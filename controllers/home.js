module.exports = function(async, Club, _, Users) {
	 return {
	 	SetHomeRouting: function(router) {
	 		  router.get('/home', this.homePage);

	 		  router.post('/home', this.postHomePage);

	 	},


	 	homePage: function(req, res){
	 		const errors = req.flash('error');
	 		if (req.user) {
	 			async.parallel([

	 				function(callback){
	 					Club.find({}, (err, result) => {
	 						callback(err, result);
	 					})
	 				},

	 				function(callback) {
	 					Club.aggregate([
	 						{$group: {
	 							_id: "$country"
	 						}}
	 					], (err, newResult) => {
	 						callback(err, newResult);
	 					});
	 				},

	 			  function(callback){
	 				Users.findOne({'username': req.user.username})
	 				   .populate('request.userId')
	 				   .exec((err, result) => {
	 				   		callback(err, result);
	 				   })
	 			}

	 			], (err, results) => {
	 				const res1 = results[0];
	 				const res2 = results[1];
	 				const res3 = results[2];
	 				
	 				const dataChunk = [];
	 				const chunkSize = 3;
	 				for(let i = 0; i < res1.length; i += chunkSize ){
	 					dataChunk.push(res1.slice(i, i+chunkSize));
	 				}

	 				//sort 
	 				const countrySort = _.sortBy(res2, '_id');
	 				//console.log(res2);

	 				return res.render('home', 
	 					{
	 						title: 'FootballKik | Home',
	 						chunks: dataChunk,
	 						country: countrySort,
	 						data: res3
	 					}

	 				);
	 			});
	 			
	 		}else{
	 		 res.redirect('/signup');
	     	}
	 	},

	 	postHomePage: function(req, res){
	 		async.parallel([
	 			function(callback){
	 				Club.update({
	 					'_id': req.body.id,
	 					'fans.username': {$ne: req.user.username}
	 				},{
	 					$push: {fans: {
	 						username: req.user.username,
	 						email: req.user.email
	 					}}
	 				}, (err, count) => {
	 					console.log(count);
	 					callback(err, count);
	 				});
	 			}

	 	  ], (err, results) => {
	 	  	res.redirect('/home');
	 	  });
	 	}
	 }
}