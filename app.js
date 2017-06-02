'use strict';

const express = require ('express');
const app = express();
const jsonParser = require("body-parser").json;
const routes = require('./routes');
const logger = require("morgan");

app.use(logger("dev"));
//mw that parse request to json and make it accesible from the request.body property
app.use(jsonParser());

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/qa");

const db = mongoose.connection;

db.on("error", err => console.error("conn error",err));

db.once("open",() => {
	console.log("db connection successful");
})

//Setting-up the api to be used by a browser
//mw for granting cors 
app.use((req,res,next)=>{
	//allow acces to the api from any domain
	res.header("Acces-Control-Allow-Origin","*");
	//which headers are permited in the requests
	res.header("Acces-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
	//grant pe-flight request permission (preflight requests come with the method OPTIONS)
	if(req.method === "OPTIONS") {
		res.header("Acces-Control-Allow-Methods","PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
})


//Handle the routes
app.use('/questions', routes);

//catch 404 not found
app.use((req, res, next)=>{
	var err = new Error("Not found");
	err.status = 404;
	//cal the error handler with the err param
	next(err);
});

//Error Handler
app.use( (err, req, res, next) => {
	res.status (err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

const port = process.env.PORT || 3000;

app.listen(port,()=> {
	console.log("Express server is listening on port ", port);
});