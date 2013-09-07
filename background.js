var linkFollowed = false;
var parentURL = "";
var linkText = "";
var linkURL = "";

var currURL = "";
var currTitle = "";
var parentTitle ="";

var pushUpdate = function() { 
  var type = (linkFollowed) ? 'new_link' : 'new_node';

  var sendInfo = {
    url : currURL,
    title : currTitle
  };

  if (linkFollowed) {
    sendInfo = {
      parent : {url : parentURL, title : parentTitle},
      child : {url : currURL, title : currTitle}
    };
  }

  console.log(sendInfo);

  $.ajax({
    type: 'POST',
    url: 'http://www.nodr.me/' + type,
    dataType: 'jsonp',
    success: function (msg) {
      if (msg) {
        // Do nothing
      }
      else {
        // Force login
      }
    },
    data: sendInfo,
    complete: function(){
    }
  });

  linkFollowed = false;
  linkText = '';
  linkURL = '';
};

// Browser action listener
//chrome.browserAction.onClicked.addListener(test);

// Push new web page visit to server
// chrome.history.onVisited.addListener(pushUpdate);

// Receive data from content_scripts
chrome.runtime.onMessage.addListener(function (request, response, sendResponse) {
  if (request.type === "load") {
    currURL = request.pageURL;
    currTitle = request.pageTitle;
    if (currURL !== '') {
      pushUpdate();
    }
  } else if (request.linkFollowed === "yes") {
    linkFollowed = true;
    parentURL =  request.parentURL;
    parentTitle = request.parentTitle;
    linkText = request.linkText;
    linkURL = request.linkURL;
  }
});
