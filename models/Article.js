//require mongoose
var mongoose = require("mongoose");
//create Schema class
var Schema = mongoose.Schema;

//create Article schema
var ArticleSchema = new Schema({
	//title is a required string
	title: {
		type: String,
		required: true,
		unique: true
	},
	//link is a required string
	link: {
		type: String,
		required: true
	},
	teaser: {
		type: String,
		required: false
	},
	imgLink: {
		type: String,
		required: false
	},
	note: [{
		type: Schema.Types.ObjectId,
		ref: "Note"
	}]
});

//Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

//export the model
module.exports = Article;