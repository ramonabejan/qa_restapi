'use strict';

let mongoose = require ('mongoose'); 
 // Use native promises
mongoose.Promise = global.Promise;
//all db communication
const Schema = mongoose.Schema;

const sortAnswers = (a,b) => {
	//-negative if a before b...
	if(a.votes === b.votes) {
		return b.updatedAt - a .updatedAt;
	}
	//if positive(b.votes > a.votes) b will be placed before a
	return b.votes - a.votes;
}

 let AnswerSchema = new Schema ({
	text: String,
	createdAt: {type:Date, default: Date.now},
	updatedAt: {type:Date, default: Date.now},
	votes: {type:Number, default: 0}

});

 //instance method used to update an answer document
 AnswerSchema.method("update", function(updates, callback){
 	//merge 
 	Object.assign(this, updates, {updatedAt: new Date()});
 	this.parent().save(callback);
 });

  //instance method used to increment/decrement the votes for an answer document 
 AnswerSchema.method("vote", function(vote, callback){
 	if(vote === "up"){
 		this.votes += 1;
 	}
 	else {
 		this.votes -= 1;
 	}

	this.parent().save(callback);

 });

 let QuestionSchema = new Schema ({
	text: String, 
	createdAt: {type:Date, default: Date.now},
	answers: [AnswerSchema]
});

QuestionSchema.pre("save", function(next){
	if(this.answers !== undefined) {
		this.answers.sort(sortAnswers);

	}
	next();
})

const Question = mongoose.model("Question", QuestionSchema);
module.exports.Question = Question;

