//Narazie nie używany plik 
const express = require("express");
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


router.get("/", (req, res, next)=>{

    MongoClient.connect(url, function (err, db){
        if (err) throw err;
        var dbo = db.db("Brzoskwinia");
        dbo.collection("Product").find({}).toArray(function (err, result){
            if (err) throw err;
            var products = result;
            console.log(result);
            db.close();
        });
    });
    next()
});

module.exports = router;