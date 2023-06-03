const express = require("express");
const router = express.Router();
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
app.use(express.static(path.join(__dirname, '../public')));
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

router.get('/signup', (req, res, next) => {
    if(req.session.loggedin){
        console.log("zalogowany")
    }
    res.render('user/signup');
    //console.log("signup")
});

router.post('/signup', function(req, res) {

    var email_form = req.body.email;
    var password_form = req.body.password;
    var password2_form = req.body.password2;
    var regulations_form = req.body.regulations

    if (email_form && password_form && (password2_form==password_form) && regulations_form) {

        MongoClient.connect(url, function (err, db){
            if (err) throw err;
            var dbo = db.db("Brzoskwinia");

            dbo.collection("User").find({email: email_form}).toArray(function (err, result){
                if (err) throw err;
                var same_email_in_db = result.length;
                db.close();

                if (same_email_in_db==0) {
                    
                    let hash = bcrypt.hashSync(password_form, 10)

                    var User = {email: email_form, password: hash, admin_permission: false}
                    
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'email@gmail.com',
                          pass: 'password'
                        }
                        });
                    const mailOptions = {
                        from: 'email@gmail.com',
                        to: email_form,
                        subject: 'Rejestracja konta na Brzoskwinie.net',
                        text: 'Witaj nowy użytkowniku'
                        };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                        });

                    MongoClient.connect(url, function (err, db){
                        if (err) throw err;
                        var dbo = db.db("Brzoskwinia");
                        dbo.collection("User").insertOne(User,function (err, result){
                            if (err) throw err;
                            req.session.loggedin = true;
                            req.session.admin_permission = false;
                            req.session.username = email_form;
                            req.session.cart_quantity = 0;
                            res.redirect('/');
                            db.close();
                
                        });
                    });
                }
                else{
                    res.render('user/signup',{errors: "Konto o takim emailu już istnieje", hasError: true});
                    //res.send("już użyty email")
                }
            });
        });
    }
    else{
        res.render('user/signup',{errors: "Błędne dane w formularzu", hasError: true});
        // res.send("coś jest nie tak")
    }
})

////////////////////////////////////////////////////////////

router.get('/signin', (req, res, next) => {
    res.render('user/signin');
});

router.post('/signin', function(req, res) {

    var email_form = req.body.email;
    var password_form = req.body.password;

    if (email_form && password_form) {

        MongoClient.connect(url, function (err, db){
            if (err) throw err;
            var dbo = db.db("Brzoskwinia");

            dbo.collection("User").find({email: email_form}).toArray(function (err, result){
                if (err) throw err;
                var account = result;
                db.close();

                if (account.length==1) {
                    //console.log(account[0].email)

                    if (bcrypt.compareSync(password_form ,account[0].password)) {
                        req.session.admin_permission = account[0].admin_permission;
                        req.session.loggedin = true;
                        req.session.username = email_form;
                        req.session.cart_quantity = 0;
                        res.redirect('/')
                    }
                    else{
                        res.render('user/signin',{errors: "Błędne hasło", hasError: true});
                    }
                }
                else{
                    res.render('user/signin',{errors: "Konto o takim emailu nie istnieje", hasError: true});
                }
                
            });
        });
    }
    else{
        res.send("coś jest nie tak")
    }
})

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;