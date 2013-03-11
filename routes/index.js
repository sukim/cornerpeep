
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var moment = require("moment"); // date manipulation library
var studentModel = require("../models/student.js"); //db model
var teacherModel = require("../models/teachers.js"); //db model


/*
	GET /
*/


exports.index = function(req, res) {
	
	console.log("main page requested");

	// query for all students
	// .find will accept 3 arguments
	// 1) an object for filtering {} (empty here)
	// 2) a string of properties to be return, 'name slug source' will return only the name, slug and source returned students
	// 3) callback function with (err, results)
	//    err will include any error that occurred
	//	  allStudents is our resulting array of students
	studentModel.find({}, 'name slug source', function(err, allStudents){

		if (err) {
			res.send("Unable to query database for students").status(500);
		};

		console.log("retrieved " + allStudents.length + " students from database");

		var templateData = {
			students : allStudents,
			pageTitle : "Our Current Students (" + allStudents.length + ")"
		}

//	studentModel.findOne(filter, fields, callback);
		res.render('index.html', templateData);
	});


	teacherModel.find({}, 'name slug source', function(err, allTeachers){

		if (err) {
			res.send("Unable to query database for teachers").status(500);
		};

		console.log("retrieved " + allTeachers.length + " teachers from database");

		var templateData = {
			astros : allTeachers,
			teacherListing : "Our Current Teachers (" + allTeachers.length + ")"
		}

		res.render('index.html', templateData);
	});

}

/*
	GET /teacher/:astro_id
*/
exports.detail = function(req, res) {

	console.log("detail page requested for " + req.params.teacher_id);

	//get the requested students by the param on the url :astro_id
	var teacher_id = req.params.teacher_id;

	// query the database for teachers
	teacherModel.findOne({slug:teacher_id}, function(err, currentTeacher){

		console.log(currentTeacher);
		
		if (err) {
			return res.status(500).send("There was an error on the teacher query");
		}

		if (currentTeacher == null) {
			return res.status(404).render('404.html');
		}

	//teacherModel.update({slug:teacher_id}, {$inc: {"meta.votes":1}})
	//teacherModel.update({slug:teacher_id}, {$set: updatedData}, function(err, allTeachers));
		teacherModel.find({}, 'name slug', function(err, allTeachers){

			console.log("retrieved all teachers : " + allTeachers.length);

			//prepare template data for view
			var templateData = {
				tchr : currentTeacher,
				alltchr : allTeachers,
				pageTitle : currentTeacher.name
			}

			// render and return the template
			res.render('detail.html', templateData);


		}) // end of .find (all) query
		
	}); // end of .findOne query

}



//get student
exports.studetail = function(req, res) {

	console.log("detail page requested for " + req.params.student_id);

	//get the requested students by the param on the url :astro_id
	var student_id = req.params.student_id;

	// query the database for students
	studentModel.findOne({slug:student_id}, function(err, currentStudent){

		console.log(currentStudent);
		
		if (err) {
			return res.status(500).send("There was an error on the student query");
		}

		if (currentStudent == null) {
			return res.status(404).render('404.html');
		}


		studentModel.find({}, 'name slug', function(err, allStudents){

			console.log("retrieved all teachers : " + allStudents.length);

			//prepare template data for view
			var templateData = {
				stu : currentStudent,
				allstu : allStudents,
				pageTitle : currentStudent.name
			}

			// render and return the template
			res.render('studetail.html', templateData);


		}) // end of .find (all) query
	
	}); // end of .findOne query

}



/*
	GET /create
*/
exports.studentForm = function(req, res){

	var templateData = {
		page_title : 'Enlist a new student'
	};

	res.render('create_form.html', templateData);
}

/*
	POST /create
*/
exports.createStudent = function(req, res) {
	
	console.log("received form submission");
	console.log(req.body);

	// accept form post data
	var newStudent = new studentModel({
		name : req.body.name,
		slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')

	});
	
	// save the newStudent to the database
	newStudent.save(function(err){
		if (err) {
			console.error("Error on saving new student");
			console.error("err");
			return res.send("There was an error when creating a new student");

		} else {
			console.log("Created a new student!");
			console.log(newStudent);
	
			// redirect to the students's page
			res.redirect('/students/'+ newStudent.slug)
		}

	});
}

/*
	GET /create
*/
exports.teacherForm = function(req, res){

	var templateData = {
		page_title : 'Are you an awesome teacher? Sign up to join our team!'
	};

	res.render('create_tr_form.html', templateData);
}


//POST teacher form
exports.createTeacher = function(req, res) {
	
	console.log("received form submission");
	console.log(req.body);

	// accept form post data
	var newTeacher = new teacherModel({
		teachername : req.body.teachername,
		subject : req.body.subject,
		trphoto : req.body.trphoto,
		source : {
			name : req.body.source_teachername,
			url : req.body.source_url
		},
		slug : req.body.teachername.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_')

	});
	newTeacher.save(function(err){
		if (err) {
			console.error("Error on saving new teacher");
			console.error("err");
			return res.send("There was an error when creating a new teacher");

		} else {
			console.log("Created a new teacher!");
			// redirect to the students's page
			res.redirect('/teachers/'+ newTeacher.slug)
		}

	});

}


exports.loadData = function(req, res) {

	// load initial students into the database
	for(a in students) {

		//get loop's current astronuat
		currStudent = students[a];

		// prepare students for database
		tmpStudent = new studentModel();
		tmpStudent.slug = currStudent.slug;
		tmpStudent.thenamebox = currStudent.thenamebox;
		tmpStudent.homework = currStudent.homework;
		

		// save tmpStudent to database
		tmpStudent.save(function(err){
			// if an error occurred on save.
			if (err) {
				console.error("error on save");
				console.error(err);
			} else {
				console.log("Student loaded/saved in database");
			}
		});

	} //end of for-in loop

	// respond to browser
	return res.send("loaded students");

} // end of loadData function


var getStudentById = function(slug) {
	for(a in students) {
		var currentStudent = students[a];

		// does current students's id match requested id?
		if (currentStudent.slug == slug) {
			return currentStudent;
		}
	}

	return false;
}

console.log ("it's working");

