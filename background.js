var NOTRECORDING = 0;
var PAUSED = 1;
var RECORDING = 2;

var linkFollowed = false;
var parentURL = "";
var linkText = "";
var linkURL = "";
var currURL = "";
var currTitle = "";
var parentTitle = "";
var recs = {};
var recordingState = NOTRECORDING;

function logger(string) {
  chrome.extension.getBackgroundPage().console.log(string);
}

function setStatus(string) {
  $("#status").text(string);
}

function setupHtml() {
  if (chrome.extension.getBackgroundPage().recordingState >= PAUSED) {
    $("#recording").show();
    $("#record").hide();
    setStatus("Recording");
  }
  if (chrome.extension.getBackgroundPage().recordingState == PAUSED) {
    $("#pause").hide();
    $("#play").show();
    setStatus("Paused");
  }
}

function authenticateUser() {
  $.get("http://www.nodr.me/user").error(function() {
    chrome.tabs.create({'url': "http://www.nodr.me/auth/facebook/callback"});
  });
}

function loadRecommendations() {
  chrome.tabs.getSelected(null, function(tab) {
    if (tab) {
      chrome.extension.getBackgroundPage().console.log("window.location", tab.url, currURL);
      $.get("http://www.nodr.me/recommendations?url=" + encodeURIComponent(tab.url), function(data) {
        for(i = 0; i < data.length; i++) {
          $("#listing").append("<div data-url='" + data[i].url + "' class='rec-box'>" + data[i].title + "</div>");
        }
      });
    }
  });
}

function pauseSession() {
  if (chrome.extension.getBackgroundPage().recordingState == RECORDING) {
    chrome.extension.getBackgroundPage().recordingState = PAUSED;
    setStatus("Paused");
    $("#pause").hide();
    $("#play").show();
  }
}

function playSession() {
  if (chrome.extension.getBackgroundPage().recordingState <= PAUSED) {
    chrome.extension.getBackgroundPage().recordingState = RECORDING;
    setStatus("Recording");
    $("#play").hide();
    $("#pause").show();
  }
}

function recordSession() {
  if (chrome.extension.getBackgroundPage().recordingState == NOTRECORDING) {
    $.get("http://www.nodr.me/new_graph", function(data) {
      chrome.extension.getBackgroundPage().recordingState = RECORDING;
      setStatus("Recording");
      $("#record").hide();
      $("#recording").show();
    });
  }
}

function stopSession() {
  if (chrome.extension.getBackgroundPage().recordingState >= PAUSED) {
    $.get("http://www.nodr.me/end_graph", function(data) {
      chrome.extension.getBackgroundPage().recordingState = NOTRECORDING;
      setStatus("Not Recording");
      $("#recording").hide();
      $("#pause")
      $("#record").show();
      chrome.tabs.create({'url': "http://www.nodr.me/last_graph"});
    });
  }
}

function pushUpdate() {
  console.log("recording state is " + recordingState); 
  if (recordingState === false || currURL.indexOf("nodr.me") >= 0) {
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
	  $.get(url, function (data) {
      logger(data);
	  });
  } else {
    var url = "http://www.nodr.me/new_node?params=" + encodeURIComponent(JSON.stringify(sendInfo));
    $.get(url, function (data) {
      logger(data);
    });
  }
  
  var myText = encodeURIComponent(JSON.stringify(sendInfo));
  linkFollowed = false;
  linkText = '';
  linkURL = '';
};

chrome.browserAction.onClicked.addListener(function (request) {
  chrome.extension.getBackgroundPage().console.log("HELLO");
});

chrome.extension.onRequest.addListener(function (request, response) {
  alert("HELLO");
});

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
  } else if (request.directive === "popup-click") {
    alert("hellO");
  }
});

// Initialize
setupHtml();
authenticateUser();
loadRecommendations();

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

$("#nodrlogo").click(function() {
  chrome.tabs.create({'url': "http://www.nodr.me/"});
});

$("#listing .rec-box").click(function(event) {
  chrome.tabs.create({'url': "http://www.nodr.me"});
})
