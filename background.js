var link_followed = false;
var parentURL = "";
var linkText = "";
var linkURL = "";

var pushUpdate = function(type, sendInfo) { 
  $.ajax({
       type: "POST",
        url: "http://node.me/" + type,
        dataType: "json",
        success: function (msg) {
           if (msg) {
             // Do nothing
           }
           else {
             // Force login
           }
        },
        data: sendInfo 
  });
};

chrome.tabs.getSelected(null, function(tab) {
  if (!link_followed) {
     chrome.extension.getBackgroundPage().console.log("new page");
  } else {
     chrome.extension.getBackgroundPage().console.log("link from:");
     chrome.extension.getBackgroundPage().console.log(parentURL);
     chrome.extension.getBackgroundPage().console.log(linkText);
     chrome.extension.getBackgroundPage().console.log(linkURL);
  }
  link_followed = false;
  var tabTitle = tab.title;
  var tabURL = tab.url;
  chrome.extension.getBackgroundPage().console.log(tabTitle);
  chrome.extension.getBackgroundPage().console.log(tabURL);
});

// Browser action listener
chrome.browserAction.onClicked.addListener(test);

// Push new web page visit to server
chrome.history.onVisited.addListener(pushUpdate);

// Receive data from content_scripts
chrome.runtime.onMessage.addListener(function (request, response, sendResponse) {
 if (request.linkfollowed === "yes") {
	link_followed = true;
	parentURL =  request.parent_URL;
	linkText = request.link_Text;
	linkURL = request.link_URL;
 }
});
