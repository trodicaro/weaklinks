document.addEventListener("DOMContentLoaded", function(event) {
        console.log(event);

        function updateIcon(){

            chrome.tabs.getSelected(null, function(tab) {
                var currentURL = tab.url;
                alert(currentURL);
            });


            var numberReports = 67;
            if (numberReports >= 60){
                chrome.browserAction.setIcon({path:"icon1.png"});
            }else if (numberReports >= 30){
                chrome.browserAction.setIcon({path:"icon2.png"});
            }else {
                chrome.browserAction.setIcon({path:"icon3.png"});
            }
        }

        //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
        chrome.tabs.executeScript({
            code:  updateIcon()
        })
    }
);
