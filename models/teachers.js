var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teacherSchema = new Schema({
  slug : { type: String, lowercase: true, unique: true },
  teachername:  String,
  subject: String,
  introduction:   String,
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