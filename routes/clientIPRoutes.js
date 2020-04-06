module.exports = (app) => {
    app.get('/client/iplocation', function (req, res) {
        const ipInfo = req.ipInfo;
        var message = `Hey, you are browsing from ${ipInfo.ip}, ${ipInfo.city}, ${ipInfo.country}`;
        console.log(message);
        // res.send(message);
        res.send(ipInfo);
    });
}

