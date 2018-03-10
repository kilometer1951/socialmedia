'use strict';

module.exports = function(formidable, Club, aws) {
	 return {
	 	SetAdminRouting: function(router) {
	 		router.get('/dashboard', this.adminIndexPage);


	 	    router.post('/uploadFile', aws.Upload.any(), this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
	 	},
	 	adminIndexPage: function(req, res) {
	 		return res.render('admin/dashboard');
	 	},
	 	adminPostPage: function(req, res){
            const newClub = new Club();
            newClub.name = req.body.club;
            newClub.country = req.body.country;
            newClub.image = req.body.upload;
            newClub.save((err) => {
                res.redirect('/dashboard');
            })
        },
	 	uploadFile: function(req, res) {
            const form = new formidable.IncomingForm();
            
            form.on('file', (field, file) => {

            });
            
            form.on('error', (err) => {
            });
            
            form.on('end', () => {
                
            });
            
            form.parse(req);
        }
	 }
}