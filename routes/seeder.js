const express = require("express");
const router = express.Router();
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../public')));


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var dane = [
{ name: 'płyta główna ASUS', description: "fajna taka, świeci się", quantity: 6, cost: 1002, img: "https://allegro.stati.pl/AllegroIMG/PRODUCENCI/ASUS/PRIME-Z590-P/1-plyta-glowna-box.jpg"},
{ name: 'procesor intel i3', description: "tani ale działa", quantity: 35, cost: 100, img: "https://proline.pl/pic/bx8071512100f_0.jpg"},
{ name: 'procesor intel i9', description: "świetnie się sprawdza do ogrzewania domu", quantity: 3, cost: 400, img: "https://www.mediaexpert.pl/media/cache/resolve/gallery/images/33/3303133/Procesor-INTEL-Core-i9-12900K-front.jpg"},
{ name: 'RTX 4090', description: "powodzenia", quantity: 1, cost: 49242, img: "https://www.proshop.pl/Images/915x900/3106485_1feb0ab3891f.png"},
{ name: 'zasilacz 2000W', description: "bomb has been planted!", quantity: 47, cost: 10, img: "https://ae01.alicdn.com/kf/S31472bc60e06428aa5ae8f5371e7f8d6r/2400W-moc-g-rnicza-Ethereum-BTC-Asic-ATX-zasilacz-do-koparki-kryptowalut-ETH-Bitcoin-g-rnictwo.png"},
{ name: 'zasilacz 1GW', description: "potemga", quantity: 2, cost: 4000000000, img: "https://i.iplsc.com/gdzie-powstanie-pierwsza-w-polsce-elektrownia-atomowa/000G7ZYXWTEIFKLD-C122-F4.jpg"},
];


router.get('/', (req, res) => {
    MongoClient.connect(url, function (err, db){
        if (err) throw err;
        var dbo = db.db("Brzoskwinia");
        dbo.collection("Product").insertMany(dane,function (err, result){
            if (err) throw err;
            
            res.send("udało się")
            //res.render('shop/index', {products: product});
            db.close();

        });
    });
})


module.exports = router;