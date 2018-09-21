//importing middlewares
var util = require('util');
var bodyParser = require("body-parser");
var session = require("express-session");
var express = require("express");
var axios = require('axios');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var bcrypt = require('bcrypt');

// Establish database connection
mongoose.connect('mongodb://localhost/basic_mongoose');

// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set up session
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

// set up path to server static content, templates, and use EJS to render
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/public/dist/public' ));


// Set up constructor for our data
var ProductSchema = new mongoose.Schema({
	productId: {type: String},
	name: {type: String, required:[true, "Product must have a name!"], minlength: [3, "Product name must be longer than 3 characters!"]},
	quantity: {type: Number, required:[true, "Product must have quantity"], min: [0, "Product quantity cannot be lower than 0!"]},
	price: {type: Number, required: [true, "Product must have a price"], min: [0, "Product price cannot be lower than 0!"]}
	},
	{timestamps: true})


// Select and declare our model
mongoose.model("Product", ProductSchema);
var Product = mongoose.model("Product");

// Routes
app.get('/products', function(req, res){
	Product.find({})
	.then(data => console.log("Got all products, ", data)|| res.json(data))
	.catch(errs => console.log("Create user failed, error: ", errs)|| res.json(errs))
})

app.get('/products/:id', function(req, res){
	Product.findOne({productId: req.params.id})
	.then(data => console.log("Single product found", data) || res.json(data))
	.catch(errs => console.log("Cannot find product: ", errs)|| json(errs))
})

app.post('/products', function(req, res){
	newProduct = new Product({
		productId : Math.floor(Math.random() * Math.floor(100000)),
		name : req.body.name,
		quantity : req.body.quantity,
		price : req.body.price
	})
	newProduct.save()
	.then(data => console.log("Product created, ", data)|| res.json(data))
	.catch(errs => console.log("Cannot create product, error: ", errs)|| res.json(errs))
})

app.delete('/products/:id', function(req, res){
	Product.findOneAndRemove({productId: req.params.id})
	.then(data => console.log("Single product removed", data) || res.json(data))
	.catch(errs => console.log("Cannot find product for removal: ", errs) || res.json(errs))
})

app.put('/products/:id', function(req, res){
	Product.findOneAndUpdate({productId: req.params.id}, req.body, {new: true, runValidators : true})
	.then(data => console.log("Product updated", data) || res.json(data))
	.catch(errs => console.log("FAILED TO UPDATE: ", errs) || res.json(errs))
})


app.listen(8000, function() {
  console.log("listening on port 8000");
});