//require mongoose
var mongoose = require("mongoose");
//create a schema class
var Schema = mongoose.Schema;

//create NoteSchema
var NoteSchema = new Schema({
	//title can be just a string
	title: {
		type: String
	},
	//body can be just a string
	body: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});
//Mongoose automatically saves the ObjectIds of the notes
//These ids are referred to in the Article model

//create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

//export the Note model
module.exports = Note;

