var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define a new schema
var StudentSchema = new Schema({
    slug : { type: String, lowercase: true, unique: true },
	name : String,
	homework : Boolean,	
    lastupdated : { type: Date, default: Date.now }
    meta: {
    votes: Number,
    favs:  Number
  }
});


// export 'Student' model
module.exports = mongoose.model('Student',StudentSchema);
