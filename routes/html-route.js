// Dependencies
// =============================================================
const express = require('express');

const router = express.Router();
const article = require('../models/Articles');
const comment = require('../models/Comments');
const scraper = require('../db/articleScraper');


//landing page
router.get('/', (req, res, next) => {

    article.find({
            category: {
                $regex: '^((?!deals).)*$',
                $options: 'i'
            }
        })
        .populate('comments')
        .sort({
            pubDate: -1
        })
        .exec((err, articles) => {
            let hbsObject = {
                results: articles,
                title: 'results'
            }
            res.render('newsCrape', hbsObject);
        })
})


router.get('/scrape', (req, res, next) => {
    console.log("inside scrape route");
    scraper.articleScraper().then((articles) => {
        article.create(articles, (err, results) => {
            if (err) {
                console.log(err)
            }
            console.log(results);
            console.log("articles added to db");
        })
        res.redirect('/')
    });
})

router.post('/postComment', (req, res, next) => {
    let articleId = req.body.articleId;
    let userName = req.body.username;
    let body = req.body.body;
    let post = {
        user: userName,
        body: body
    };

    console.log(post);

    let newComment = new comment(post);

    newComment.save(function (error, doc) {
        if (error) {
            console.log(error)
        } else {
            article.findOneAndUpdate({
                    '_id': articleId
                }, {
                    $push: {
                        comments: doc._id
                    }
                }, {
                    new: true
                },
                function (err, newDoc) {
                    if (err) {
                        console.log(err)
                    } else {
                        res.redirect('/');
                    }
                }
            )
        }
    })
})

router.post('/delete', (req, res, next) => {

    let commentId = req.body.commentId;
    let articleId = req.body.articleId;

    comment.remove({
        '_id': commentId
    }, err => {
        if (err) {
            console.log(err)
        }
        article.update({
            '_id': articleId
        }, {
            $pull: {
                comments: commentId
            }
        }, function (err, doc) {
            res.redirect('/')
        })
    })
})
module.exports = router;