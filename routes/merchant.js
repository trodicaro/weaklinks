var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    links = ['helllo'];
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

    var ClientOAuth2 = require('client-oauth2')

    var Auth = new ClientOAuth2({
        clientId: 'l7xx27729b45a68c4a849160b2cbb9cf2a35',
        clientSecret: '582dcdd36d324e0b91e61f9b15013db7',
        accessTokenUri: 'https://apis.discover.com/auth/oauth/v2/token',
        scopes: ['FRAUDALERTS']
    });

    Auth.credentials.getToken()
        .then(function (user) {
            console.log(user.data.access_token) //=> { accessToken: '...', tokenType: 'bearer', ... }
        })

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
