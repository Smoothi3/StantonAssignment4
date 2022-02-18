var debug = require('debug')('demo')
var Review = require('../models/review.model')

function sendJSONresponse(res, status, content){
    res.status(status)
    res.json(content)
}

module.exports.readReviewsAll = function(req, res){
    debug('Getting all reviews')
    console.log('Getting all reviews')
    Review.find().exec().then(function(results){
        sendJSONresponse(res, 200, results)
    }).catch(function(err){
        sendJSONresponse(res, 404, err)
    })
}

module.exports.reviewsReadOne = function(req, res){
    debug('Reading one review')
    console.log('Reading one review')

    if(req.params && req.params.reviewid){

        Review.findById(req.params.reviewid).exec().then(
            function(result){
                sendJSONresponse(res,200,result)
            }
        ).catch(function(err){
            sendJSONresponse(res,404,err)
        })
    }else{
        sendJSONresponse(res, 404, {"message":"Review not found."})
    }
}

module.exports.reviewCreate = function(req, res){
    debug('Create one review', req.body)
    console.log('Create one review', req.body)

    Review.create({
        author:req.body.author,
        rating:req.body.rating,
        reviewText:req.body.reviewText
    }).then(function(dataSaved){
        sendJSONresponse(res, 201, dataSaved)
    }).catch(function(err){
        debug(err)
        sendJSONresponse(res, 404, err)
    })

}

module.exports.reviewUpdateOne = function(req, res){
    debug('Update one review')
    console.log('Update one review')
    if(!req.params.reviewid){
        sendJSONresponse(res, 404, {"message":"Not found...request id required"})
        return
    }

    Review.findById(req.params.reviewid).exec().then(
        function(reviewData){
            reviewData.author = req.body.author;
            reviewData.rating = req.body.rating;
            reviewData.reviewText = req.body.reviewText;
            return reviewData.save()
        }
    ).then(function(data){
        sendJSONresponse(res,200, data)
    }).catch(function(err){
        sendJSONresponse(res, 400, err)
    })

}

module.exports.reviewDeleteOne = function(req, res){
    debug('Delete one review')
    console.log('Delete one review')

    if(!req.params.reviewid){
        sendJSONresponse(res, 404, {"message":"Not found...request id required"})
        return
    }

    Review.findByIdAndRemove(req.params.reviewid).exec().then(
        function(reviewData){
            console.log("Review ID " + req.params.reviewid + " deleted")
            debug(reviewData)
        }
    ).catch(function(err){
        sendJSONresponse(res, 400, err)
    })
}

module.exports.searchByColumn = function(req, res){
    var sColumn = req.body.searchColumn
    console.log("Searching for specifics")
    var search = {"rating" : req.body.rating}
    console.log(req.body.reviewText)
    //For some reason, this seems to be the only way I can get it to work
    //I swear I've tried everything, yet this works
    //Coding is weird
    switch (sColumn){
        case "_id":
            search = {"_id": req.params.reviewid}
            break;
        case "rating":
            search = {"rating" : req.body.rating}
            break;
        case "author":
            search = {"author" : req.body.author}
            break;
        case "review":
            search = {"reviewText" : req.body.reviewText}
            break;
        case "createdOn":
            search = {"createdOn": req.body.createdOn}
            break;
    }

    Review.find(search).exec().then(function(results){
        sendJSONresponse(res, 200, results)
    }).catch(function(err){
        sendJSONresponse(res, 404, err)
    })
}

module.exports.sortByColumn = function(req, res){
    var search = req.body.searchColumn
    console.log("Sorting for specifics")
    var sort = {"_id": req.body.searchOrder}

    //For some reason, this seems to be the only way I can get it to work
    //I swear I've tried everything, yet this works
    //Coding is weird
    switch (search){
        case "_id":
            sort = {"_id": req.body.searchOrder}
            break;
        case "rating":
            sort = {"rating": req.body.searchOrder}
            break;
        case "author":
            sort = {"author": req.body.searchOrder}
            break;
        case "review":
            sort = {"reviewText": req.body.searchOrder}
            break;
        case "createdOn":
            sort = {"createdOn": req.body.searchOrder}
            break;
    }
    
    console.log(sort)
    Review.find().sort(sort).then(function(results){
        sendJSONresponse(res, 200, results)
    }).catch(function(err){
        sendJSONresponse(res, 404, err)
    })
}