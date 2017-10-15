require('dotenv').config();
var express = require('express');
var router = express.Router();
var https = require('https');
var querystring = require('querystring');

router.get('/', function(req, res, next) {
    var domains = ["http://greensburg.k12.in.us", "https://www.facebook.com/oglethorpefeed", "https://www.yelp.com/biz/oglethorpe-feed-seed-and-farm-supply-crawford"];
    primaryUrl = domains[0];

    getOrganizationName(primaryUrl);

    var merchantId = getMerchantIdFromLinks(domains);
    var fraudCount = merchantId === null ? 0 : getFraudCountFromMerchantId(merchantId) ;
    res.writeHead(200, {"Content-Type": "application/json"});
    var json = JSON.stringify({
        fraud_count: fraudCount
    });
    res.end(json);
});

function getOrganizationName(domain) {
  var url = process.env.WHOIS_API_ENDPOINT;
  var username = process.env.WHOIS_USER;
  var password = process.env.WHOIS_PASS;

  var parameters = {
      domainName: primaryUrl,
      username: username,
      password: password,
      outputFormat: 'json'
  };

  url = url + querystring.stringify(parameters);

  https.get(url, function (res) {
      const statusCode = res.statusCode;

      if (statusCode !== 200) {
          console.log('Request failed: '
              + statusCode
          );
      }

      var rawData = '';

      res.on('data', function(chunk) {
          rawData += chunk;
      });
      res.on('end', function () {
          try {
              var parsedData = JSON.parse(rawData);
              if (parsedData.WhoisRecord) {
                console.log(parsedData.WhoisRecord.registrant.organization);
              } else {
                  console.log(parsedData);
              }
          } catch (e) {
              return e.message;
          }
      })
  }).on('error', function(e) {
      return e.message;
  });
}

function getMerchantIdFromLinks(domains){
    //  api call to see if link return merchant
    var request = require('request');
    var url = process.env.MERCHANT_VERIFICATION_POINT_API

    var queryParams = '?' + encodeURIComponent('requestHeader.version') + '=' + encodeURIComponent('3.2')+
    '&' + encodeURIComponent('requestHeader.format') + '=' + encodeURIComponent('json')+ '&' +
    encodeURIComponent('requestHeader.applicationKey') + '=' +
    encodeURIComponent(process.env.API_KEY)+ '&' +
    encodeURIComponent('listControl.startIndex') + '=' + encodeURIComponent('0')+ '&' +
    encodeURIComponent('listControl.segmentSize') + '=' + encodeURIComponent('10')+ '&' +
    encodeURIComponent('listControl.segmentWindow') + '=' + encodeURIComponent('3')+ '&' +
    encodeURIComponent('apikey') + '=' + encodeURIComponent(process.env.API_KEY);

    request({
        url: url + queryParams,
        method: 'GET'
      }, function (error, response) {
      // console.log('Getting merchant info!!!!! *******');
      //console.log('Status', response);
    });

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
