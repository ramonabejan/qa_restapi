'use strict';

const express = require('express');

const router = express.Router();

const questionModel = require('./models.js').Question;
const answerModel = require('./models.js').Answer;

//param handler: preload questionModel documents: req.queston
//callback executed when quid is present
router.param("qID", (req,res,next,id) => {
	questionModel.findById(req.params.qID, (err,doc) => {
		if(err) return next(err);
		if(!doc) {
			err =  new Error ("Not Found");
			err.status = 404;
			return next(err);
		}
		//set the question prop to be used in others mw or routes handlers
		req.question = doc;
		next();
	})
});


//param handler: preload answer documents: req.answer
//callback executed when aid is present
router.param("aID", (req,res,next,id) => {
	req.answer = req.question.answers.id(id);

	if(!req.answer) {
			err = new Error ("Not Found");
			err.status = 404;
			return next(err);
	}
	next();

});

//GET /questions
router.get('/', (req,res, next) => {
	questionModel.find({})
		.sort ({createdAt: -1})
		.exec((err,questions) =>{				
			if(err) return next(err);
			//return all the questions
			res.json({response: questions});
		})	
	});

//POST /questions
router.post('/', (req, res, next) => {
	let question = new questionModel(req.body);

	question.save( (err, que) => {
		if(err){			
			return next(err);
		} 
		//questionModel saved successfully
		//return all the questionModels
		res.status(201);
		res.json(que);

	});	
});

//GET /questions/:id
router.get('/:qID', (req,res,next) => {
	res.json(req.question);
});

//create answer
//POST /questions/:id/answers
router.post('/:qID/answers', (req,res) => {
	//the questionModel is put on the req by the param handler
	req.question.answers.push(req.body);
	req.question.save((err,questionModel) => {
		if(err) return next(err);
		res.status(201);
		res.json(questionModel);
	})
});


//edit answer
//PUT /question/:id/answers/:id
router.put('/:qID/answers/:aID', (req,res) => {
	//modify answer with the req.body
	req.answer.update(req.body, (err,result) => {
		if(err) return next(err);
		res.json(result);
	});
});

//delete answer
//DELETE /questionModels/:id/answers/:id
router.delete('/:qID/answers/:aID', (req,res) => {
	req.answer.remove (err => {
		req.questionModel.save((err,questionModel) => {
			if(err) return next(err);
			res.json(questionModel);
		})
	})
});


//vote answer
//POST /questionModels/:qid/answers/:aid/vote-up
//POST /questionModels/:qid/answers/:aid/vote-down
router.post('/:qID/answers/:aID/vote-:dir',
	(req,res,next) => {
		if(req.params.dir.search(/^(up|down)$/) ===-1) {
			var err = new Error ("Not Found");
			err.status = 404;
			next(err);
		}
		else{
			req.vote = req.params.dir;
			next();
		}
	},
	(req,res,next) => {
		req.answer.vote(req.vote, (err,que) => {
			if(err) return next(err);
			res.json(que);
		})
	});



module.exports = router;