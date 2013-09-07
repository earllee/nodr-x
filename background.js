var linkFollowed = false;
var parentURL = '';
var parentTitle = '';
var currURL = '';
var currTitle = '';
var linkText = '';
var linkURL = '';

var pushUpdate = function() { 
  var type = (linkFollowed) ? 'new_link' : 'new_node';

  var sendInfo = {
    currURL : currURL,
    currTitle : currTitle,
    linkURL : '',
    linkText : '',
    parentURL : '',
    parentText : '',
    direct : true
  };

  if (linkFollowed) {
    sendInfo.linkURL = linkURL;
    sendInfo.linkText = linkText;
    sendInfo.parentURL = parentURL;
    sendInfo.parentTitle = parentTitle;
    sendInfo.direct = false;
  }

  console.log(sendInfo);

  $.ajax({
       type: 'POST',
        url: 'http://nodr.me/' + type,
        dataType: 'json',
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
chrome.history.onVisited.addListener(function(){});

// Receive data from content_scripts
chrome.runtime.onMessage.addListener(function (request, response, sendResponse) {
  if (request.type === 'load') {
    currURL = request.pageURL;
    currTitle = request.pageTitle;
    pushUpdate();
  } else if (request.type === 'link') {
    console.log('link clicked');
    linkFollowed = true;
    parentTitle = request.parentTitle;
    parentURL =  request.parentURL;
    linkText = request.linkText;
    linkURL = request.linkURL;
  }
});
