var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// validation function
var nameValidation = function(val) {
	console.log("inside name validation");
	console.log(val);

	if (val.length >= 3) {
		return true;
	} else {
		return false;
	}
}


// define a new schema
var StudentSchema = new Schema({
    slug : { type: String, lowercase: true, required: true, unique: true },
	name : { type: String, required: true, validate: [nameValidation, 'Name must be at least 5 characters.']},
	age : String, 
	email : {type: String, required: true},
	trname : {type: String, required: true},
	tremail :{type: String, required: true},
	homework : Boolean,	
    lastupdated : { type: Date, default: Date.now }

});


// export 'Student' model
module.exports = mongoose.model('Student',StudentSchema);
