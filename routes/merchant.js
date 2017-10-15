var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var merchantId = getMerchantIdFromLinks(links);
    var fraudCount = merchantId === null ? 0 : getFraudCountFromMerchantId(merchantId) ;
    res.writeHead(200, {"Content-Type": "application/json"});
    var json = JSON.stringify({
        fraud_count: fraudCount
    });
    res.end(json);
});

function getMerchantIdFromLinks(links){
    //  api call to see if link return merchant
    MerchantId = 123123123;
    return MerchantId
}

function getFraudCountFromMerchantId(MerchantId){

    var count = randomIntFromInterval(0,100);
    //api with the merchant id return alert count
    //count the events

    return count;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = router;
