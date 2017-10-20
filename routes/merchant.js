require('dotenv').config();
var express = require('express');
var router = express.Router();
const request = require('request');
var querystring = require('querystring');

router.post('/', function(req, res, next) {
    let primaryUrl = req.body.domainName;
    console.log(req.body.domainName);
    let fraudCount = getOrganizationName(primaryUrl)
      .then(function(orgName) { console.log('Org name:' + orgName); getMerchantIdFromMerchantAPI(orgName)})
      .then(function(merchantId) { console.log('Merchant id:' + merchantId); getFraudCountFromMerchantId(merchantId)});
    .catch(function(err) {
        console.log(err);
    });

    // let merchantId = getMerchantIdFromMerchantAPI(organizationName);
    // let fraudCount = merchantId === null ? 0 : getFraudCountFromMerchantId(merchantId) ;
    res.writeHead(200, {"Content-Type": "application/json"});
    let json = JSON.stringify({
        fraud_count: fraudCount
    });
    res.end(json);
});

function getOrganizationName(domain){
    var url = process.env.WHOIS_API_ENDPOINT;
    var username = process.env.WHOIS_USER;
    var password = process.env.WHOIS_PASS;

    var parameters = {
        domainName: domain,
        username: username,
        password: password,
        outputFormat: 'json'
    };

    url = url + querystring.stringify(parameters);
    return new Promise(function(resolve, reject){
        request( url , function (error, response, body) {
            // in addition to parsing the value, deal with possible errors
            if (error) return reject(error);
            try {
                // JSON.parse() can throw an exception if not valid JSON
                resolve(JSON.parse(body).WhoisRecord.registrant.organization);
            } catch(e) {
                reject(e);
            }
        });
    });
}

function getMerchantIdFromMerchantAPI(organizationName){
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
    encodeURIComponent('searchCriteria.filterField') + '=' + encodeURIComponent('name')+ '&' +
    encodeURIComponent('searchCriteria.filterValue') + '=' + encodeURIComponent('Target');//repl with organizationName
    return new Promise(function(resolve, reject){
      request({
          url: url + queryParams,
          method: 'GET'
        }, function (error, response) {
        console.log('Getting merchant info!!!!! *******');
        // console.log('Status', response);
      });
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
          console.log(url);
          var queryParams = '?' + encodeURIComponent('fromDate') + '=' + encodeURIComponent('2015-01-01')+ '&' + encodeURIComponent('toDate') + '=' + encodeURIComponent('2016-10-15');
          return new Promise(function(resolve, reject){
            request({
                url: url + queryParams,
                headers: { 'x-dfs-c-app-cert': process.env.APP_CERT, 'x-dfs-api-plan': process.env.API_PLAN, 'Authorization':'Bearer ' + token },
                method: 'GET',
              }, function (error, response) {
              var body = JSON.parse(response.body);
              console.log(Object.keys(body.alertDetails).length);
            });
          });
       })
    return randomIntFromInterval(0, 1000);
}

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = router;
