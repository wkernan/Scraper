$('#0').removeClass('hide').addClass('active');

var startId = $('#0').attr('data-id');

function getComments(id) {
	$('.comments').empty();
	$.ajax({
	  method: "GET",
	  url: "/articles/" + id,
	})
	  // with that done, add the note information to the page
	.done(function( data ) {
	  console.log(data);
	  var data = data[0];
	  if(data.comments) {
	  	data.comments.forEach(function(item) {
	    	$('.comments').append('<p class="delComment" data-id="' + item._id + '">' + item.body + '</p>');
	  	})
	  }
	});
}

getComments(startId);

$('#left').click(function() {
	var index = $('.active').attr('id');
	if(index != 0) {
		$('.active').removeClass('active').addClass('hide');
		index--;
		$('#' + index).removeClass('hide').addClass('active');
	}
	var id = $('#' + index).attr('data-id');
	getComments(id);
})

$('#right').click(function() {
	$('.comments').empty();
	var index = $('.active').attr('id');
	var max = $('#builds').children('span').length - 1;
	if(index != max) {
		$('.active').removeClass('active').addClass('hide');
		index++;
		$('#' + index).removeClass('hide').addClass('active');
	}
	var id = $('#' + index).attr('data-id');
	getComments(id);
})

$('#postComment').click(function() {
	var id = $('.active').attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + id,
    data: { 
      body: $('#body').val()
    }
  })
    // with that done
    .done(function( data ) {
      getComments(id);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $('#body').val("");

})

$('body').on('click','p.delComment',function() {
	var commentId = $(this).attr('data-id');
	console.log(commentId);
	var articleId = $('.active').attr('data-id');
  $.ajax({
    method: "DELETE",
    url: "/articles/" + commentId,
    success: function(result) {
    	// console.log(result);
    }
  })
    // with that done
    .done(function(data) {
      // log the response
      getComments(articleId);
    });
})

$('body').on('mouseenter', 'p.delComment',function() {
	console.log('test');
	$(this).append('<p class="delPhrase">click to delete</p>');
})

$('body').on('mouseleave', 'p.delComment', function() {
	$(this).children('p').remove();
})

