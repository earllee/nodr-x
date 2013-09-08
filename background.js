var linkFollowed = false;
var parentURL = "";
var linkText = "";
var linkURL = "";
var currURL = "";
var currTitle = "";
var parentTitle ="";
var recordingState = false;

function pauseSession() {
  chrome.extension.getBackgroundPage().console.log("pause");
}

function playSession() {
  chrome.extension.getBackgroundPage().console.log("play");
}

function recordSession() {
  
}

function stopSession() {
  
}

function pushUpdate() {
  console.log("recording state is " + recordingState); 
  if (recordingState === false) {
    linkFollowed = false;
    linkText = '';
    linkURL = '';
    console.log("recording state is " + recordingState + " not pushing");
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
	
	  var url = "http://www.nodr.me/new_link?params=" + encodeURIComponent(JSON.stringify(sendInfo));
	  $.getJSON(url, function (data) {

	  });
  } else {
    var url = "http://www.nodr.me/new_node?params=" + encodeURIComponent(JSON.stringify(sendInfo));
    $.getJSON(url, function (data) {
      
    });
  }

  var myText = encodeURIComponent(JSON.stringify(sendInfo));
  linkFollowed = false;
  linkText = '';
  linkURL = '';
};

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

// Events
$("#pause").click(function() {
	pauseSession();
});
