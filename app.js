var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.render("landing");
});

var camps = [
    {name: "Wye Valley Camping", img: "http://www.photosforclass.com/download/7121861565"},
    {name: "Granite Hill", img: "http://www.photosforclass.com/download/1342367857"},    
    {name: "Jenny Lake Camp", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},  
    {name: "Wye Valley Camping", img: "http://www.photosforclass.com/download/7121861565"},
    {name: "Granite Hill", img: "http://www.photosforclass.com/download/1342367857"},    
    {name: "Jenny Lake Camp", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
    {name: "Wye Valley Camping", img: "http://www.photosforclass.com/download/7121861565"},
    {name: "Granite Hill", img: "http://www.photosforclass.com/download/1342367857"},    
    {name: "Jenny Lake Camp", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
];

app.get('/campgrounds', function(req, res) {
    res.render("campgrounds", {camps: camps});
});

app.post('/campgrounds', function(req, res) {
    var name = req.body.name;
    var img = req.body.img;
    camps.push({ name: name, img: img });
    res.redirect("/campgrounds");
});

app.get('/campgrounds/new', function(req, res) {
    res.render("new.ejs");
});

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});