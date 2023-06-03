const express = require("express");
const {ObjectID, ObjectId} = require("mongodb");
const router = express.Router();
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get('/', (req, res) => {
    MongoClient.connect(url, function (err, db){
        if (err) throw err;
        var dbo = db.db("Brzoskwinia");
        dbo.collection("Product").find({}).toArray(function (err, result){
            if (err) throw err;
            var product = result;

            res.render('shop/index', {products: product});
            db.close();
            
        });
    });
    if (req.session.loggedin) {
        
        let username = req.session.username;
        
        MongoClient.connect(url, function (err, db){
            if (err) throw err;
            var dbo = db.db("Brzoskwinia");
            
            dbo.collection("User").findOne({email: username}, function (err, result){
                    if (err) throw err;
                    let user = result;
                    
                    dbo.collection("Cart").aggregate([
                        {$match: { user_id: new ObjectId(user._id)}},
                        {$group: { _id: '54', cart_sum: {$sum: "$quantity"}}}
                    ]).toArray(function(err, result) {
                        req.session.cart_quantity = result[0].cart_sum;
                    });
            });
        }); 
    }
})

router.get('/id/:id', (req, res) =>{
    MongoClient.connect(url, function (err, db){
        if (err) throw err;
        var dbo = db.db("Brzoskwinia");
        var id = req.params.id;
        var o_id = new ObjectId(id);
        console.log(id)
        dbo.collection("Product").find({_id: o_id}).toArray(function (err, result){
            if (err) throw err;
            var product = result;
            
            res.render('shop/produkt', {products: product})
            db.close();
        });
    });
});

// Początki koszyka //
/*
    ____             __            
   / __ )__  _______/ /________  __
  / __  / / / / ___/ __/ ___/ / / /
 / /_/ / /_/ (__  ) /_/ /  / /_/ / 
/_____/\__, /____/\__/_/   \__, /  
      /____/              /____/   

*/


router.post('/', function(req, res) {

    let username = req.session.username;
    let id_product = req.body.product_id;

    if (username && req.session.loggedin) {
        MongoClient.connect(url, function (err, db){
            if (err) throw err;
            var dbo = db.db("Brzoskwinia");
            
            dbo.collection("User").findOne({email: username}, function (err, result){
                if (err) throw err;
                let user = result;
                
                MongoClient.connect(url, function (err, db){
                    if (err) throw err;
                    
                    var dbo = db.db("Brzoskwinia");
                    dbo.collection("Cart").find({user_id: new ObjectId(user._id), product_id: new ObjectId(id_product)}).toArray(function (err, result){
                        if (err) throw err;

                        let Cart = {user_id: new ObjectId(user._id), product_id: new ObjectId(id_product), quantity: 1};
                        if(result.length == 0){
                            MongoClient.connect(url, function (err, db){
                                if (err) throw err;
                                var dbo = db.db("Brzoskwinia");
                                dbo.collection("Cart").insertOne(Cart,function (err, result){
                                    if (err) throw err;
            
            
                                    res.redirect('/');
                                    db.close();
                                });
                            });
                        }else{
                            MongoClient.connect(url, function (err, db){
                                if (err) throw err;
                                var dbo = db.db("Brzoskwinia");
                                let cart_info_query = {user_id: new ObjectId(user._id), product_id: new ObjectId(id_product)};
                                let quantity_update = {$inc: {quantity: 1}};
                                dbo.collection("Cart").updateOne(cart_info_query, quantity_update, function (err, result){
                                    if (err) throw err;
                                    res.redirect('/');        
                                    db.close();
                                });
                            });
                        }
                    });
                });
            });
        });
    }
    else{
        res.render('user/signin',{errors: "Aby coś dodać do koszyka potrzebujesz być zalogowany", hasError: true});
    }
})


//-------------------------------------------------------------------------------------------//

router.get('/cart', function(req, res) {
    res.redirect('/')
    //res.render('shop/cart');
})

module.exports = router;