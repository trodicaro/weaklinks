document.addEventListener("DOMContentLoaded", function(event) {
        console.log(event);

        function updateIcon(){

            chrome.tabs.getSelected(null, function(tab) {
                let numberReports = getFraudCount(tab.url).then(function(val) {
                    console.log(val);
                }).catch(function(err) {
                    console.log(err);
                });

                alert(numberReports);

                if (numberReports >= 60){
                    chrome.browserAction.setIcon({path:"icon1.png"});
                }else if (numberReports >= 30){
                    chrome.browserAction.setIcon({path:"icon2.png"});
                }else {
                    chrome.browserAction.setIcon({path:"icon3.png"});
                }

            });
        }

        function getFraudCount(url){

            var details = {
                domainName: tab.url
            };

            var formBody = [];
            for (var property in details) {
                var encodedKey = encodeURIComponent(property);
                var encodedValue = encodeURIComponent(details[property]);
                formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            var count = fetch('http://localhost:3000/merchant', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formBody
            });


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

        //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
        chrome.tabs.executeScript({
            code:  updateIcon()
        })
    }
);
