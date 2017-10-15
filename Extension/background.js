// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

   
var numberReports = 30;

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

chrome.tabs.sendMessage(tab.id, {content: "message"}, function(response) {
    if(response) {
        //We do something
    }
});

// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    console.log('Turning ' + tab.url + ' red!');
    chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="red"'
    });
});