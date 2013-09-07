var linkFollowed = false;
var parentURL = '';
var parentTitle = '';
var currURL = '';
var currTitle = '';
var linkText = '';
var linkURL = '';

var pushUpdate = function(type, sendInfo) { 
  $.ajax({
       type: 'POST',
        url: 'http://node.me/' + type,
        dataType: 'json',
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

/*chrome.tabs.getSelected(null, function(tab) {
  if (!linkFollowed) {
     chrome.extension.getBackgroundPage().console.log('new page');
  } else {
     chrome.extension.getBackgroundPage().console.log('link from:');
     chrome.extension.getBackgroundPage().console.log(parentURL);
     chrome.extension.getBackgroundPage().console.log(linkText);
     chrome.extension.getBackgroundPage().console.log(linkURL);
  }
  linkFollowed = false;
  var tabTitle = tab.title;
  var tabURL = tab.url;
  chrome.extension.getBackgroundPage().console.log(tabTitle);
  chrome.extension.getBackgroundPage().console.log(tabURL);
});
*/
// Browser action listener
//chrome.browserAction.onClicked.addListener(test);

// Push new web page visit to server
chrome.history.onVisited.addListener(pushUpdate);

// Receive data from content_scripts
chrome.runtime.onMessage.addListener(function (request, response, sendResponse) {
  if (request.type === 'load') {
    chrome.extension.getBackgroundPage().console.log('Navigate: ' + request.pageURL + ' ' + request.pageTitle);
    if (linkFollowed) {
      chrome.extension.getBackgroundPage().console.log('link from: ' + parentURL + ' ' + linkText);
    }
  } else if (request.linkFollowed) {
    linkFollowed = true;
    parentURL =  request.parentURL;
    linkText = request.linkText;
    linkURL = request.linkURL;
  }
});
