// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var currentState = ;

var good;
var bad;
var verybad;

switch(current){
case state;
	current = 1;
case state;
case state



}
function updateIcon() {
  
  
  
  
  chrome.browserAction.setIcon({path:"icon" + current + ".png"});
  current++;

  if (current > max)
    current = min;
}

chrome.browserAction.onClicked.addListener(updateIcon);
updateIcon();
