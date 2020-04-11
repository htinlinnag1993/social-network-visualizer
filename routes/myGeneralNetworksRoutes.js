const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const GeneralNetwork = mongoose.model('general-networks');

module.exports = (app) => {
    app.get('/api/my-general-networks', requireLogin, async (req, res) => {
        const myGeneralNetworks = await GeneralNetwork.find({ _user: req.user.id })
        .select();

        res.send(myGeneralNetworks);
    });

    app.post('/api/new-general-network', requireLogin, requireCredits, async (req, res) => {
        const { name, description, nodes, links } = req.body;

        const generalNetwork = new GeneralNetwork({
            name,
            description,
            nodes,
            links,
            _user: req.user.id,
            createdOn: Date.now(),
            lastUpdated: Date.now()
        });

        try{
            await generalNetwork.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422).send(err); // unprocessable entity
        }
    });


};