
const express = require('express');
const fs = require('fs');
const RPG = require('./RandomProfilesGenerator');

const app = express(); 

app.get('/api/generate/random-profiles-and-connections', function(req, res) {
    const rpg = new RPG();
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
}

const PORT = process.env.PORT || 5000;
var server = app.listen(PORT, function() {});