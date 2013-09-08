var linkFollowed = false;
var parentURL = "";
var linkText = "";
var linkURL = "";

var currURL = "";
var currTitle = "";
var parentTitle ="";
recording_state = "on";

var pushUpdate = function() {
console.log("recording state is " + recording_state); 
  if (recording_state === "off" || recording_state === "pause")
  {
    linkFollowed = false;
    linkText = '';
    linkURL = '';
    console.log("recording state is " + recording_state + " not pushing");
    return;
  }
console.log("pushing... " + currURL);
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
//		console.log(data);
	});
  }
else {
$.getJSON("http://www.nodr.me/new_node?params=" + encodeURIComponent(JSON.stringify(sendInfo)), function (data) {
//	console.log(data);
});
}
//  $.getJSON("http://www.nodr.me/new_link?currentURL=" + encodeURIComponent(currURL) + "&currentTitle=" + encodeURIComponent(currTitle) + "&parentURL=" + encodeURIComponent(parentURL) + "&parentTitle=" + encodeURIComponent(parentTitle), function(data) { 
//  console.log(sendInfo);

  var myText = JSON.stringify(sendInfo);

myText = encodeURIComponent(myText);

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

$("#pause").click(function() {
	recording_state = "pause";
	alert("pause");
});

