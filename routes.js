'use strict';

const express = require('express');

const router = express.Router();

//GET /questions
router.get('/', (req,res) => {
	//return all the questions
	res.json({response:"You sent a GET request"});
});

//POST /questions
router.post('/', (req,res) => {
	//return all the questions
	res.json({
		response:"You sent a POST request",
		body: req.body
	});
});

//GET /questions/:id
router.get('/:qID', (req,res) => {
	//return all the questions
	res.json({
		response:`You sent a GET request for the id ${req.params.qID}`,

	});
});

//create answer
//POST /questions/:id/answers
router.post('/:qID/answers', (req,res) => {
	//return all the questions
	res.json({
		response:"You sent a POST request to answers",
		questionId: req.params.qID,
		body: req.body
	});
});


//edit answer
//PUT /questions/:id/answers/:id
router.put('/:qID/answers/:aID', (req,res) => {
	//return all the questions
	res.json({
		response:"You sent a PUT request to answers",
		questionId: req.params.qID,
		answerId: req.params.aID,
		body: req.body
	});
});

//delete answer
//DELETE /questions/:id/answers/:id
router.delete('/:qID/answers/:aID', (req,res) => {
	//return all the questions
	res.json({
		response:"You sent a DELETE request ",
		questionId: req.params.qID,
		answerId: req.params.aID
		
	});
});


//vote answer
//POST /questions/:qid/answers/:aid/vote-up
//POST /questions/:qid/answers/:aid/vote-down
router.post('/:qID/answers/:aid/vote-:dir',
(req,res,next) => {
	if(req.params.dir.search(/^(up|down)$/) ===-1) {
		var err = new Error ("Not Found");
		err.status = 404;
		next(err);
	}
	else{
		next();
	}
},
(req,res) => {
	//return all the questions
	res.json({
		response:"You sent a POST request to /vote-"+req.params.dir,
		questionId: req.params.qID,
		body: req.body,
		vote: req.params.dir
	});
});



module.exports = router;