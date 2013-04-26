
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var request = require('request'); // library to make requests to remote urls

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


		// OK, found students, now find teachers

		teacherModel.find({}, 'name slug source', function(err, allTeachers){

			if (err) {
				res.send("Unable to query database for teachers").status(500);
			};

			console.log("retrieved " + allTeachers.length + " teachers from database");

			var templateData = {
				students: allStudents,
				astros : allTeachers,
				teacherListing : "Our Current Teachers (" + allTeachers.length + ") Current Students (" + allStudents.length + ")"
			}

			res.render('index.html', templateData);
		});

	});
}

exports.data_all = function(req, res) {

	studentQuery = studentModel.find({}); // query for all astronauts
	studentQuery.sort('name');
	//YOU CAN CHOOSE WHAT KIND OF DATA YOU WANT TO SHOW
	studentQuery.select('name');
	studentQuery.exec(function(err, allStudents){
		// prepare data for JSON
		var jsonData = {
			status : 'OK',
			students : allStudents

		}

		res.json(jsonData);
	});

}

exports.data_detail = function(req, res) {

	console.log("detail page requested for " + req.params.astro_id);

	//get the requested astronaut by the param on the url :astro_id
	var student_id = req.params.student_id; 

	// query the database for astronaut
	var studentQuery = studentModel.findOne({slug:student_id});
	studentQuery.exec(function(err, currentStudent){

		if (err) {
			return res.status(500).send("There was an error on the student query");
		}

		if (currentStudent == null) {
			return res.status(404).render('404.html');
		}

		//prepare JSON data for response
		var jsonData = {
			student : currentStudent,
			status : 'OK'
		}

		// return JSON to requestor
		res.json(jsonData);

	}); // end of .findOne query

}

/*
	GET /teacher/:teacher_id
*/
exports.detail = function(req, res) {

	console.log("detail page requested for " + req.params.teacher_id);

	//get the requested students by the param on the url :teacher_id
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

	//get the requested students by the param on the url :student_id
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
			console.log(templateData);

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
	console.log(req.name);

	// accept form post data
	var newStudent = new studentModel({
		name : req.body.name,
		slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_'),
		age : req.body.age,
		email : req.body.email,
		trname : req.body.trname,
		tremail : req.body.tremail,
		homework : req.body.homework,

	});
	
	// save the newStudent to the database
	newStudent.save(function(err){
		if (err) {
				
			console.error("Error on saving new student");
			console.error(err);

			var isDuplicateError = (err.code == 11000); // duplicate mongo error 11000. will be true or false

			var templateData = {
				page_title : 'Enlist a new student',
				errors : err.errors,
				duplicateError : isDuplicateError,
				student : req.body
			};

			res.render('create_form.html', templateData);

		} else {
			console.log("Created a new student!");
			console.log(newStudent);
	
			// redirect to the students's page allstudents
			res.redirect('/students/'+ newStudent.slug)
		}

	});
};

exports.editStudentForm = function(req, res) {

	// Get student from URL params
	var student_id = req.params.student_id;
	var studentQuery = studentModel.findOne({slug:student_id});
	studentQuery.exec(function(err, student){

		if (err) {
			console.error("ERROR");
			console.error(err);
			res.send("There was an error querying for "+ student_id).status(500);
		}

		if (student != null) {


			// prepare template data
			var templateData = {
				stu : student
			};

			// render template
			res.render('edit_form.html',templateData);
		} else {
			console.log("unable to find student: " + student_id);
			return res.status(404).render('404.html');
		}

	})
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

			// rebuild the templateData page
			var templateData = {
				page_title : 'Enlist a new teacher',
				errors : err.errors, // include the error msg objects keys = fieldnames
				teachername : req.body,  // include the user submitted fields
		};
 
		// redisplay the create form template
		res.render('create_form.html', templateData);
 


		} else {
			console.log("Created a new teacher!");
			// redirect to the students's page
			res.redirect('/teachers/'+ newTeacher.slug)
		}

	});

}

exports.updateStudent = function(req, res) {

	// Get astronaut from URL params
	var student_id = req.params.student_id;

	// prepare form data
	var updatedData = {
		name : req.body.name,
		slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_'),
		age : req.body.age,
		email : req.body.email,
		trname : req.body.trname,
		tremail : req.body.tremail,
		homework : req.body.homework,
	}
	// query for astronaut
	studentModel.update({slug:student_id}, { $set: updatedData}, function(err, student){

		if (err) {
			console.error("ERROR: While updating");
			console.error(err);			
		}

		if (astronaut != null) {
			res.redirect('/students/' + student_id);

		} else {

			// unable to find astronaut, return 404
			console.error("unable to find student: " + student_id);
			return res.status(404).render('404.html');
		}
	})

}

var getStudentById = function(slug) {
	for(a in students) {
		var currentStudent = students[a];

		// does current students's id match requested id?
		if (currentStudent.slug == slug) {
			return currentStudent;
			res.render('studetail.html', templateData);
		}

	}

	return false;
}

console.log ("it's working");


exports.remote_api = function(req, res) {

	var remote_api_url = 'http://itpdwdexpresstemplates.herokuapp.com/data/astronauts';
	// var remote_api_url = 'http://localhost:5000/data/astronauts';

	// make a request to remote_api_url
	request.get(remote_api_url, function(error, response, data){

		if (error){
			res.send("There was an error requesting remote api url.");
			return;
		}

		// convert data JSON string to native JS object
		var apiData = JSON.parse(data);

		// if apiData has property 'status == OK' then successful api request
		if (apiData.status == 'OK') {

			// prepare template data for remote_api_demo.html template
			var templateData = {
				//it is important to find a JavaScript object in someone's JSPON.
				astronauts : apiData.astros,
				rawJSON : data, 
				remote_url : remote_api_url
			}

			return res.render('remote_api_demo.html', templateData);

		}

	})

};

