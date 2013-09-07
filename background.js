//function alertClick(HistoryItem result) {
// alert("ASD");
//}

//chrome.history.onVisited.addListener(alertClick());
link_followed = false;
the_parentURL = "";
the_linkText = "";
the_linkURL = "";

function test()
{
 chrome.extension.getBackgroundPage().console.log("in test");
}
function test2(result)
{
 chrome.extension.getBackgroundPage().console.log("pagevisited: ");
// chrome.extension.getBackgroundPage().console.log(result.title);
 
chrome.tabs.getSelected(null, function(tab) {
  if (!link_followed)
  {
     chrome.extension.getBackgroundPage().console.log("new page");
  }
  else
  {
     chrome.extension.getBackgroundPage().console.log("link from:");
     chrome.extension.getBackgroundPage().console.log(the_parentURL);
     chrome.extension.getBackgroundPage().console.log(the_linkText);
     chrome.extension.getBackgroundPage().console.log(the_linkURL);

  }
link_followed = false;
   var myTitle = tab.title;
   var myURL = tab.url;
   chrome.extension.getBackgroundPage().console.log(myTitle);
   chrome.extension.getBackgroundPage().console.log(myURL);
});

 //chrome.extension.getBackgroundPage().console.log(thetitle);
/* switch (result.transition):
 {
  case 
 }*/
}

chrome.browserAction.onClicked.addListener(test);

chrome.history.onVisited.addListener(test2);

chrome.runtime.onMessage.addListener(function (request, response, sendResponse)
{
 if (request.linkfollowed === "yes")
 {
	link_followed = true;
	the_parentURL =  request.parent_URL;
	the_linkText = request.link_Text;
	the_linkURL = request.link_URL;
 }
}
);
