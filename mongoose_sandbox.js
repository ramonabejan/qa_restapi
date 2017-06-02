'use strict';

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/sandbox");

const db = mongoose.connection;

db.on("error", err => console.error("conn error",err));

db.once("open",() => {
	console.log("db connection successful");
	//all db communication
	let Schema = mongoose.Schema;
	let AnimalSchema = new Schema({
		type: String,
		size: String,
		color: String
	})

	db.close();
})