const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const GeneralNetwork = mongoose.model('general-networks');

module.exports = (app) => {
    app.get('/api/networks/general-networks', requireLogin, async (req, res) => {
        // const myGeneralNetworks = await GeneralNetwork.find((error, data) => { 
        //     if (error)
        //         return next(error);
        //     else
        //         res.json(date);
        // })
        const myGeneralNetworks = await GeneralNetwork.find({ _user: req.user.id }).sort({ lastUpdated: -1 });
                                                        // .select({});
        var summarizedNetworks = myGeneralNetworks.map(network => {
            const current = {
                _id: network._id,
                name: network.name,
                description: network.description,
                startingNodeID: network.startingNodeID,
                numOfNodes: network.nodes.length,
                numOfLinks: network.links.length,
                lastUpdated: network.lastUpdated,
                createdOn: network.createdOn
            };
            return current;
        })                                       
        res.status(200).send(summarizedNetworks);
        // res.status(200).send(myGeneralNetworks);
    });

    app.get('/api/networks/general-networks/:id', requireLogin, async (req, res) => {
        try {
            const generalNetworkID = req.params.id;
            // var result = await GeneralNetwork.deleteOne({ _id: generalNetworkID }).exec();
            // res.send(result);
            var generalNetwork = await GeneralNetwork.findById(generalNetworkID).exec();
            res.status(200).send(generalNetwork);
        } catch (error) {
            res.status(500).send(error);
        }
    });





    app.post('/api/networks/general-networks', requireLogin, requireCredits, async (req, res) => {
        const { name, description, startingNodeID, nodes, links, graphInAdjList } = req.body;

        const generalNetwork = new GeneralNetwork({
            name,
            description,
            startingNodeID,
            nodes: nodes.map(node => 
                ({ 
                    nodeID: node.id,
                    name: node.name,
                    description: node.description 
                })
            ),
            links: links.map(link => 
                ({
                    connectionID: link.id,
                    source: link.source,
                    target: link.target,
                    weight: link.weight
                    // Instead of having the following two fields, 
                    // we will make use of network.startingNodeID to dynamically assign them
                    // sourceId: link.sourceId,
                    // targetId: link.targetId
                })
            ),
            _user: req.user.id,
            createdOn: Date.now(),
            lastUpdated: Date.now()
        });

        try{
            await generalNetwork.save();
            req.user.credits -= 1;
            const user = await req.user.save();

            res.send(user);
            // res.redirect('/dashboard');
        } catch (err) {
            res.status(422).send(err); // unprocessable entity
        }
    });

    app.delete('/api/networks/general-networks/:id', async (req, res) => {
        try {
            const generalNetworkID = req.params.id;
            // var result = await GeneralNetwork.deleteOne({ _id: generalNetworkID }).exec();
            // res.send(result);
            GeneralNetwork.findByIdAndDelete(generalNetworkID, (err, generalNetwork) => {
                let response = {
                    message: "General Network with id: " + generalNetworkID + " successfully deleted",
                };
                res.status(200).send(response);
            })
        } catch (error) {
            res.status(500).send(error);
        }
    });
};