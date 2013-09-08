var linkFollowed = false;
var parentURL = "";
var linkText = "";
var linkURL = "";
var currURL = "";
var currTitle = "";
var parentTitle ="";
var recordingState = false;

function logger(string) {
  chrome.extension.getBackgroundPage().console.log(string);
}

function setStatus(string) {
  $("#status").text(string);
}

function pauseSession() {
  if (chrome.extension.getBackgroundPage().recordingState == true) {
    chrome.extension.getBackgroundPage().recordingState = false;
    setStatus("Paused");
    $("#pause").hide();
    $("#play").show();
  }
}

function playSession() {
  if (chrome.extension.getBackgroundPage().recordingState == false) {
    chrome.extension.getBackgroundPage().recordingState = true;
    setStatus("Recording");
    $("#play").hide();
    $("#pause").show();
  }
}

function recordSession() {
  if (chrome.extension.getBackgroundPage().recordingState == false) {
    $.get("http://www.nodr.me/new_graph", function(data) {
      chrome.extension.getBackgroundPage().recordingState = true;
      setStatus("Recording");
      $("#record").hide();
      $("#recording").show();
    });
  }
}

function stopSession() {
  if (chrome.extension.getBackgroundPage().recordingState === true) {
    $.get("http://www.nodr.me/end_graph", function(data) {
      chrome.extension.getBackgroundPage().recordingState = false;
      setStatus("Not Recording");
      $("#recording").hide();
      $("#record").show();
    });
  }
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

$("#play").click(function() {
	playSession();
});

$("#stop").click(function() {
  stopSession();
});

$("#record").click(function() {
  recordSession();
});
