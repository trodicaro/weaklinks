require('dotenv').config()
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var links = ["http://greensburg.k12.in.us", "https://www.facebook.com/oglethorpefeed", "https://www.yelp.com/biz/oglethorpe-feed-seed-and-farm-supply-crawford"];
    console.log(links);
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
    var MerchantId = process.env.MERCHANT_ID;
    return MerchantId;
}

function getFraudCountFromMerchantId(MerchantId){
    // var count = randomIntFromInterval(0,100);
    //api with the merchant id return alert count
    //count the events

    var ClientOAuth2 = require('client-oauth2');

    var Auth = new ClientOAuth2({
       clientId: process.env.CLIENT_ID,
       clientSecret: process.env.CLIENT_SECRET,
       accessTokenUri: process.env.ACCESS_TOKEN_URI,
       scopes: [process.env.SCOPE]
    });

   Auth.credentials.getToken()
       .then(function (user) {
          var token = user.data.access_token
          var request = require('request');
          var url = process.env.FRAUD_ALERTS_API_ENDPOINT.replace(/{orgid}/g, encodeURIComponent(MerchantId));
          var queryParams = '?' + encodeURIComponent('fromDate') + '=' + encodeURIComponent('2015-01-01')+ '&' + encodeURIComponent('toDate') + '=' + encodeURIComponent('2016-10-15');
          console.log(request);
          request({
              url: url + queryParams,
              headers: { 'x-dfs-c-app-cert': process.env.APP_CERT, 'x-dfs-api-plan': process.env.API_PLAN, 'Authorization':'Bearer ' + token },
              method: 'GET',
            }, function (error, response) {
            var body = JSON.parse(response.body);
            console.log(Object.keys(body.alertDetails).length);
          });
       })
    return randomIntFromInterval(0, 1000);
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = router;
