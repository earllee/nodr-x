//function alertClick(HistoryItem result) {
// alert("ASD");
//}

//chrome.history.onVisited.addListener(alertClick());
link_followed = false;

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
     chrome.extension.getBackgroundPage().console.log("link...");
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
