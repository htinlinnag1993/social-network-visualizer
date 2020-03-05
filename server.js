const express = require('express');
const bodyParser = require('body-parser');
const url =  require('url');
const querystring = require('querystring');
const fs = require('fs');
const RPG = require('./RandomProfilesGenerator');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express(); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/generate/random-profiles-and-connections(/*)?', function(req, res) {

    var numberOfProfiles = Number(req.query.numofprofiles);

    const rpg = new RPG(numberOfProfiles, 101);
    // res.json(rpg.getNodesAndLinks());

    fs.writeFileSync('test-data.json', JSON.stringify(rpg.getNodesAndLinks()));
    let rawdata = fs.readFileSync('test-data.json');
    let nodesAndLinksData = JSON.parse(rawdata);
    res.send(nodesAndLinksData);
    // rpg.reset();
});

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets like our main.js file, main.css file
    app.use(express.static('client/build'));

    // Express will serve up the index.html file if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    }); 
}

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT, function() {});