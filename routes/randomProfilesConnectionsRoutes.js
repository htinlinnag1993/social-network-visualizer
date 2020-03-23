module.exports = (app, RPG, fs) => {
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
}