var express = require('express'),
    fs = require('fs');

// App entry point
var app = express();
const PORT = process.env.PORT || 3000;

app.use(function (req, res, next){
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
});

app.use(express.static('public'));

app.listen(PORT, function() {
    console.log('Express server is up on port ' + PORT + '.');
});

var myWrite = function myWrite(data) {
    fs.appendFile('./public/data/results.txt', data, function (err) {
      if (err) { console.log('There was an error writing the file.') }
    });
};

myWrite('Adding a new line\n');
myWrite('Adding another line\n');
myWrite('Adding this here final line\n');
