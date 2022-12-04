const express = require('express');
const path = require('path');
const mysql = require('mysql');
const connection = require('./database');                   					   // Connect to the database
const session = require('express-session');

const app=express();


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));



app.get('/', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/main.html'));                       
});

app.get('/user', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/user.html'));                     
});

app.get('/admin', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/admin.html'));                     
});

app.post('/userSignUp', function(request, response){                                            // Register and enter the data into 'user' table
	
	var username = request.body.usernameSignUp;
	var password = request.body.password;
	
	var sql = `INSERT INTO user(Username, Password) VALUES ("${username}", "${password}")`;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log("record inserted");
		
		response.redirect('/userPage');
	})
})

app.post('/userLogin', function(request, response) {										// Authorize username and password for login
	
	let username = request.body.usernameLogin;
	let password = request.body.password;
	
	if (username && password) {

		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			
			if (error) throw error;
			
			if (results.length > 0) {
				
				request.session.loggedin = true;
				request.session.username = username;
				
				response.redirect('/userPage');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/userPage', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/userPage.html'));                     
});

app.post('/userPage1', function(request, response) {
	
    let Bplace = request.body.place;
    
        var sql = `SELECT * from booking_place WHERE place LIKE"%${Bplace}%"`;
        connection.query(sql, function(err,result){
            response.send(result);
        })        
});

app.get('/viewAllPlaces.html', function(request, response) 
{
    var sql = `SELECT * from booking_place`;
	connection.query(sql, function(err,result){
		response.send(result);
	})
})

app.post('/adminLogin', function(request, response) {										// Authorize username and password for login
	
	let username = request.body.adminLogin;
	let password = request.body.password;
	
	if (username && password) {

		connection.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			
			if (error) throw error;
			
			if (results.length > 0) {
				
				request.session.loggedin = true;
				request.session.username = username;
				
				response.redirect('/adminPage');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/adminPage', function(request, response) {
	
	response.sendFile(path.join(__dirname + '/adminPage.html'));                     
});

app.post('/addPlace', function(request, response){                                            // Register and enter the data into 'user' table
	
	var place = request.body.place;
	
	var sql = `INSERT INTO booking_place(place, avail) VALUES ("${place}", ${5})`;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log("record inserted");
		
		response.redirect('/adminPage');
	})
})

app.get('/viewBookings.html', function(request, response) 
{
    var sql = `SELECT * from bookings`;
	connection.query(sql, function(err,result){
		response.send(JSON.stringify(result));
		
	})
})

app.get('/viewBookings1.html', function(request, response) 
{
	response.sendFile(path.join(__dirname + '/viewBookings.html'));                     

})

app.post('/acceptBooking', function(request, response){                                            
	
	var accept = request.body.accept;
	
	var sql = `UPDATE bookings SET status = 'Acccepted'`;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log("record inserted");
		
		response.redirect('/adminPage');
	})
})

app.post('/rejectBooking', function(request, response){                                            
	
	var accept = request.body.accept;
	
	var sql = `UPDATE bookings SET status = 'Rejected'`;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log("record inserted");
		
		response.redirect('/adminPage');
	})
})

app.post('/book', function(request, response){                                            
	
	var place = request.body.placeOfAppointment;
	var user=request.body.username;
	var sql = `INSERT INTO bookings(user, place, status) VALUES('${user}', '${place}', 'pending') `;

	connection.query(sql, function(err, result){
		if(err) throw err;
		console.log("record inserted");
		
		response.redirect('/userPage');
	})
})

app.post('/viewBookingStatus', function(request, response) 
{
	var user = request.body.username;
    var sql = `SELECT status from bookings WHERE user='${user}'`;
	connection.query(sql, function(err,result){
		response.send(result);
		
	})
})

app.listen(3000);