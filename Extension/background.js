chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.executeScript(details.tabId, {
        code: ' if (document.body.innerText.indexOf("Cat") !=-1) {' +
        '     alert("Cat not found!");' +
        ' }'
    });
}, {
    url: [{
        // Runs on example.com, example.net, but also example.foo.com
        hostContains: '.example.'
    }],
});

   
var numberReports = 67;

function updateIcon(){
	if (numberReports >= 60){
		chrome.browserAction.setIcon({path:"icon1.png"});
	}else if (numberReports >= 30){
		chrome.browserAction.setIcon({path:"icon2.png"});
	}else {
		chrome.browserAction.setIcon({path:"icon3.png"});
	}		
}



chrome.browserAction.onClicked.addListener(updateIcon);
updateIcon();
