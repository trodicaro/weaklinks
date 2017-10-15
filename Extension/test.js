document.addEventListener("DOMContentLoaded", function(event) {
        console.log(event);

        function updateIcon(){

            chrome.tabs.getSelected(null, function(tab) {
				var currentURL = tab.url;
				var numberReports = 22; 
                if (numberReports >= 60){
                    chrome.browserAction.setIcon({path:"icon1.png"});
                }else if (numberReports >= 30){
                    chrome.browserAction.setIcon({path:"icon2.png"});
                }else {
                    chrome.browserAction.setIcon({path:"icon3.png"});
                }

            });
        }

        chrome.tabs.executeScript({
            code: updateIcon()
                });
        
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "https://www.weaklinks.co/merchant", true);
		xhr.setRequestHeader('DomainName', 'currentURL');
		xhr.onload = function () {
			// do something to response
			console.log(this.responseText);
			};
		xhr.send();

		console.log(xhr.status);
		console.log(xhr.statusText);
		
});