var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// validation function
var trnameValidation = function(val) {
  console.log("inside name validation");
  console.log(val);

  if (val.length >= 3) {
    return true;
  } else {
    return false;
  }
}


var teacherSchema = new Schema({
  slug : { type: String, lowercase: true, unique: true },
  teachername:  { type: String, validate: [trnameValidation, 'Name must be at least 5 characters.']},
  subject: String,
  voicechat:   Boolean,
  videochat:   Boolean,
  fullservice:   Boolean,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }

});

// export 'Teachers' model
module.exports = mongoose.model('Teachers',teacherSchema);