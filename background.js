var linkFollowed = false;
var parentURL = "";
var linkText = "";
var linkURL = "";

var currURL = "";
var currTitle = "";
var parentTitle ="";
var recording_state = "on";

var pushUpdate = function() { 
  if (recording_state === "off")
  {
    linkFollowed = false;
    linkText = '';
    linkURL = '';
    return;
  }
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
	
	$.getJSON("http://www.nodr.me/new_link?params=" + encodeURIComponent(JSON.stringify(sendInfo)), function (data) {
		console.log(data);
	});
  }
else {
$.getJSON("http://www.nodr.me/new_node?params=" + encodeURIComponent(JSON.stringify(sendInfo)), function (data) {
	console.log(data);
});
}
//  $.getJSON("http://www.nodr.me/new_link?currentURL=" + encodeURIComponent(currURL) + "&currentTitle=" + encodeURIComponent(currTitle) + "&parentURL=" + encodeURIComponent(parentURL) + "&parentTitle=" + encodeURIComponent(parentTitle), function(data) { 
  console.log(sendInfo);

  var myText = JSON.stringify(sendInfo);

myText = encodeURIComponent(myText);
console.log(myText);
console.log(encodeURIComponent(myText));
//  myText = encodeURI(myText);
console.log(myText);

/*
  $.getJSON("http://www.nodr.me/new_link?" + myText, function(data) { 
	console.log(data);
});*/
 
// $.get("http://www.nodr.me/new_graph" /*+ myText*/, function(data) { 
//	console.log(data);
//});

/*  $.ajax({
    type: 'POST',
    url: 'https://www.nodr.me/' + type,
    dataType: 'json',
    success: function (msg) {
      if (msg) {
        // Do nothing
        console.log(msg);
      }
      else {
        console.log(msg);
        // Force login
      }
    },
    data: sendInfo,
    complete: function(response, status){
 console.log(status);
    }
  });*/

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
