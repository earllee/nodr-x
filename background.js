//function alertClick(HistoryItem result) {
// alert("ASD");
//}

//chrome.history.onVisited.addListener(alertClick());
function test()
{
 chrome.extension.getBackgroundPage().console.log("in test");
}
function test2(result)
{
 chrome.extension.getBackgroundPage().console.log("pagevisited");
}

chrome.browserAction.onClicked.addListener(test);

chrome.history.onVisited.addListener(test2);
