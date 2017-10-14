const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const passwordHash = require('password-hash');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: './public/img/tmp'});

const app = express();
const urlParse = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));

// create connection
const con = mysql.createConnection(
    {   // connection details
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'school_db',
        multipleStatements: true
    }
);

// connect
con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});

/*con.connect( 
    err => {
        if (err) {
            console.log('Error connecting to DB:' + err);
            return;
        }
        console.log('Connected');
    }
);*/

app.post('/login', urlParse, function (req, res) {
    if (!req.body) 
		return res.sendStatus(400);
        
    //console.log(req.body);    
    var username = req.body.username;
    var password = req.body.password;
    //var {username, password} = req.body;
	
    //console.log("Login attempt received:" + username + "," + password);

    // select
    con.query(
        //`SELECT * FROM admins WHERE email=?`, [username], 
        `SELECT admins.name as name, admins.email as email, admins.password as password, admins.image as image, roles.name as role FROM admins INNER JOIN roles on roles.id = admins.role_id WHERE email=?`, [username], 
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code":400,
                    "failed":"error ocurred!"
                })
            } else {
                //console.log('The solution is: ', results);
                if (results.length > 0) {
                    //if (results[0].password == password) {
					if (passwordHash.verify(password, results[0].password)) {
                        res.send({
                            "code":200,
                            "success":"login sucessfull",
                            "data": results
                        });
                    } else{
                        res.send({
                            "code":204,
                            "success":"Email and password does not match!"
                        });
                    }
                } else{
                    res.send({
                        "code":204,
                        "success":"Email does not exits!"
                    });
                }
            }
        });
});

app.get('/courses', urlParse, function (req, res) {
	//console.log("courses received");
	//res.set({"Content-Type": "text/html; charset=utf-8"});
	con.query(
        `SELECT * FROM courses`, 
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code":400,
                    "failed":"error ocurred!"
                })
            } else {
				//console.log(results);
                res.send(results);
            }
        });
});

app.get('/students', urlParse, function (req, res) {
	//console.log("courses received");
	//res.set({"Content-Type": "text/html; charset=utf-8"});
	con.query(
        `SELECT * FROM students`, 
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code":400,
                    "failed":"error ocurred!"
                })
            } else {
				//console.log(results);
                res.send(results);
            }
        });
});

app.get('/admins', urlParse, function (req, res) {
	//console.log("admins received");
	//res.set({"Content-Type": "text/html; charset=utf-8"});
	con.query(
        `SELECT admins.id as id, admins.name as name, admins.phone as phone, 
        admins.email as email, admins.image as image, admins.role_id as role_id, 
        roles.name as role FROM admins INNER JOIN roles on roles.id = admins.role_id`, 
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code":400,
                    "failed":"error ocurred!"
                })
            } else {
				//console.log(results);
                res.send(results);
            }
        });
});

app.get('/course/:id', function (req, res) {
    con.query(
        `SELECT name, description, image FROM courses WHERE id=?; SELECT name FROM students WHERE course_id=?`, [req.params['id'], req.params['id']], 
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code":400,
                    "failed":"error ocurred!"
                })
            } else {
                //console.log(results[0]);
                //console.log(results[1]);
                res.send(results);
            }
        });

});

app.get('/student/:id', function (req, res) {
	con.query(
        `SELECT students.name as name, students.phone as phone, students.email as email, students.image as image, courses.name as course 
        FROM students INNER JOIN courses on students.course_id = courses.id WHERE students.id=?`, [req.params['id']],
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code":400,
                    "failed":"error ocurred!"
                })
            } else {
				//console.log(results);
                res.send(results);
            }
        });
});

app.get('/admin/:id', function (req, res) {
	con.query(
        `SELECT admins.name as name, admins.phone as phone, admins.email as email, admins.image as image,
        admins.password as password, admins.role_id as role_id, roles.name as role FROM admins INNER JOIN roles on roles.id = admins.role_id WHERE admins.id=?;
        SELECT * FROM roles`, [req.params['id']],
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred", error);
                res.send({
                    "code":400,
                    "failed":"error ocurred!"
                })
            } else {
				//console.log(results);
                res.send(results);
            }
        });
});

app.post('/upload', upload.single('img'), function (req, res) {
	//console.log(req.file);
	if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
		fs.rename(req.file.path, 'public/img/Admins/' + req.file.originalname, function (err) {
			if (err) {throw new Error(err);}
			res.send('<h1>uploaded successfully</h1>');
		})
	} else {
		fs.unlink(req.file.path, function (err) {
			if (err) {throw new Error(err);}
			res.send('<h1>it\'s not correct mimetype</h1>');
		});
	}
});

var port = 4000;
app.listen(port, function () {
	console.log('Server listening on port ' + port);
});

/*app.get('/home', function (req, res) {
	res.set({"Content-Type": "text/html; charset=utf-8"});
	res.send('<h1>home page</h1>');
})

app.get('/books', function (req, res) {
	res.set({"Content-Type": "text/html; charset=utf-8"});
	fs.readFile('books.json', 'utf-8', function (err, data) {
		if (err) {throw new Error(err)}

		res.set({'Content-Type': 'application/json'})
		res.send(data);
		//res.json(data);
	});
})

app.get('/', function (req, res) {
	res.set({"Content-Type": "text/html; charset=utf-8"});
	//res.send('<h1>home page</h1>');
	fs.readFile('users.json', 'utf-8', function (err, data) {
		if (err) {throw new Error(err);}

		var output = '<ul>';
		users = JSON.parse(data);
		for(var i = 0; i < users.length; i++) {
		    //console.log(users[i].id + "," + users[i].name);
		    output += ('<li>' + users[i].name + '</li>');
		}
		output += '</ul>';

		res.set({"Content-Type": "text/html; charset=utf-8"});
		res.send(output);
	});
})

app.get('/users', function (req, res) {
	fs.readFile('users.json', 'utf-8', function (err, data) {
		if (err) {throw new Error(err);}

		res.set({"Content-Type": "application/json"});
		res.send(data);
	});
})

app.get('/users/:id', function (req, res) {
	var userId = parseInt(req.params['id']);

	fs.readFile('users.json', 'utf-8', function (err, data) {
		if (err) {throw new Error(err);}

		var users = JSON.parse(data);
		var user = users.find(function (user) {
			return user.id === userId
		})

		res.set({"Content-Type": "application/json"});
		res.send(JSON.stringify(user));
	});
})

app.post('/users', function (req, res) {
	var data = '';
	req.on('data', function (chunk) {
		data += chunk;
	})
	req.on('end', function () {
		var newUser = JSON.parse(data);
		fs.readFile('users.json', 'utf-8', function (err, data) {
			if (err) {throw new Error(err);}

			var users = JSON.parse(data);
			users.push(newUser);
			
			fs.writeFile('users.json', JSON.stringify(users, '', 4), 'utf-8', function (err) {
				if (err) {throw new Error(err);}
				res.sendStatus(201);
			});
		});
	})
})

app.delete('/:id', function (req, res) {
	var userId = parseInt(req.params['id']);
	fs.readFile('users.json', 'utf-8', function (err, data) {
		if (err) {throw new Error(err);}

		var users = JSON.parse(data);
		var index = users.findIndex(function (user) {
			return user.id === userId
		})
		
		if (index < 0)
		{
			console.log("User not found!");
			res.sendStatus(404);
		}
		else {
			users.splice(index, 1);
			fs.writeFile('users.json', JSON.stringify(users, '', 4), 'utf-8', function (err) {
				if (err) {throw new Error(err);}
				res.sendStatus(204);
			});
		}
	});
})
*/
