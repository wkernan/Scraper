var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var Article = require('../models/Article.js');
var Comment = require('../models/Comment.js');


router.get('/', function(req, res) {
	request('http://www.pcgamer.com/build-of-the-week/', function(error, response, html) {
    var $ = cheerio.load(html);

    $('.listingResult').each(function(i,elem) {
    	var result = {};
    	if ($(this).children('a').attr('href')) {
    		result.title = $(this).find('h3.article-name').text();
    		result.link = $(this).children('a').attr('href');
    		result.image = $(this).find('figure').data('original');
    	}
			var entry = new Article (result);

			Article.findOne({title: result.title}, function(err, item) {
				if(item) {
					return;
				} else {
					entry.save(function(err, doc) {
					});
				}
			})
    })
  });
  Article.find({},function(err,data) {
	  res.render('index', {article: data});
  })
});

router.get('/articles/:id', function(req,res) {
		Article.find({'_id': req.params.id})
	.populate('comments')
	.exec(function(err,doc) {
		res.send(doc);
	})
})

router.post('/articles/:id', function(req, res){
	
	var newComment = new Comment(req.body);

	newComment.save(function(err,doc) {
		Article.findOneAndUpdate({'_id': req.params.id}, {$push: {'comments': doc._id}}, {new: true})
		.exec(function(err, doc) {
			res.send(doc);
		})
	})
});

router.delete('/articles/:id', function(req,res) {
	Comment.find({'_id': req.params.id}).remove()
	.exec(function(err, doc) {
		res.send(doc);
	})
})

module.exports = router;