$(document).ready(function() {
	var id = $('#id').val();
	var clubName = $('#club_Name').val();

	$('#favorite').on('submit', function(e) {
		e.preventDefault();
		$.ajax({
			url:'/home',
			type: 'POST',
			data: {
				id: id,
				clubName: clubName
			},
			success: function(){
				console.log(clubName);
			}
		});
	});

	
});