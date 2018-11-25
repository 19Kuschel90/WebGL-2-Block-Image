class CMyTime {

    constructor(Name = "SERVER") {
        this.Name = Name;
    }

    ////////////////////////////////////////////
    // return time as string
    getTimeNow() {
        var dt = new Date();
        var utcDate = dt.toUTCString();
        return utcDate;
    }

    /////////////////////////////////////////////////
    // return void and post cosole log
    CL(Srting) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        console.log(this.getTimeNow() + " " + this.Name + ": " + Srting);
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

    }
}
var time = new CMyTime();

var express = require('express');
const path = require('path');

var app = express();

const root = './public'; // export folder
const port = process.env.PORT || 4000;

console.log(port);
app.use(express.static(root));
app.set('port', port); // z.B: PORT=9000 npm start
var server = app.listen(port);
time.CL('is running ' + app.get('port'));


app.use(express.static(root));

app.get('/', function(request, response) {


    response.sendFile(path.resolve(__dirname, root, 'index.html'));
});