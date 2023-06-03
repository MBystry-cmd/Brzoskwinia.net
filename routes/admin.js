const express = require("express");
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


router.get('/panel', (req, res, next) => {
    if(req.session.admin_permission){
        res.render('admin/panel');
    }
    else{
        res.redirect("/")
    }
});

router.post('/panel', function(req, res) {

    let product_Name = req.body.name;
    let product_Quantity = req.body.quantity;
    let product_Img = req.body.img;
    let product_Description = req.body.description;
    let product_Cost = req.body.cost;
    
    if (product_Name && product_Quantity && product_Img && product_Description && product_Cost) {
        let dane = {name: product_Name, description: product_Description, quantity: product_Quantity, cost: product_Cost, img: product_Img};
        
        MongoClient.connect(url, function (err, db){
            if (err) throw err;
            var dbo = db.db("Brzoskwinia");
            dbo.collection("Product").insertOne(dane,function (err, result){
                if (err) throw err;
                res.redirect("/");
                db.close();    
            });
        });
        
    }
    else {
        res.render('admin/panel',{errors: "Nie wypełniono formularza", hasError: true});
    }
})

module.exports = router;