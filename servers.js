const express = require('express');
const path = require('path');
const request = require('request');
const open = require("open");
const app = express();

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.use('/lib', express.static(__dirname + '/lib'));
app.use('/assets', express.static(__dirname + '/assets'));

const urlpath=`http://localhost:8888`;
const urls = urlpath+`/lib/lipstick.json`;
app.get('/apis', function(req, res) {
    //const url = req.query.url;
    //console.log(req.headers.host)
    const options = {
        url: urls,
        json: true
    };
    request.get(options, (error, getResponse, body) => {
        if (body.error) {
            res.status(422).send(`Error with Data! Try again!`);
        } else { 
            res.send(body);
        }
    });
});

// Server Start
const port = (process.env.PORT || 8888);
app.listen(port, function() { 
    console.log(`Please open in the browser ${urlpath}`);
    open(urlpath);
});