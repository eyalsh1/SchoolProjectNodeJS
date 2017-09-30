const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const urlParse = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));

// create connection
const con = mysql.createConnection(
    {   // connection details
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'login_test'
    }
);

// connect
con.connect( 
    err => {
        if (err) {
            console.log('Error connecting to DB:' + err);
            return;
        }
        console.log('Connected');
    }
);

app.post('/login', urlParse, function (req, res) {
    if (!req.body) 
		return res.sendStatus(400);
		
    var username= req.body.username;
	var password = req.body.password;
	
    console.log("Login attempt received:" + username + "," + password); // Why do I get undifined?

    // select
    con.query(
        `select * from users where name=?`, [username], 
        //`select * from users where name="eyal"`,
        function (error, results, fields) {
            if (error) {
                console.log("error ocurred",error);
                res.send({
                    "code":400,
                    "failed":"error ocurred"
                })
            } else {
                console.log('The solution is: ', results);
                if (results.length > 0) {
                    if (results[0].password == password) {
                        res.send({
                            "code":200,
                            "success":"login sucessfull"
                        });
                    } else{
                        res.send({
                            "code":204,
                            "success":"Email and password does not match"
                        });
                    }
                } else{
                    res.send({
                        "code":204,
                        "success":"Email does not exits"
                    });
                }
            }
        });

    /*const passwordHash = require('password-hash');
    var hashedPassword = passwordHash.generate(req.body.password);
    res.send('Welcome: ' + req.body.username + ',' + req.body.password + "," + hashedPassword);
    console.log(passwordHash.verify('1234', hashedPassword));*/
});

var port = 4000;
app.listen(port, function () {
	console.log('Server listening on port ' + port);
});