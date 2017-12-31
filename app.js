var express = require("express");
var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("landing");
});

app.get('/campgrounds', function(req, res) {
    var camps = [
        {name: "Wye Valley Camping", img: "http://www.photosforclass.com/download/7121861565"},
        {name: "Granite Hill", img: "http://www.photosforclass.com/download/1342367857"},    
        {name: "Jenny Lake Camp", img: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}  
    ];
    res.render("campgrounds", {camps: camps});
});

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});