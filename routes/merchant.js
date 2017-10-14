var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log("Request handler random was called.");
    res.writeHead(200, {"Content-Type": "application/json"});
    var otherArray = randomIntFromInterval(0,100);
    var json = JSON.stringify({
        fraud_count: otherArray
    });
    res.end(json);
});

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = router;
