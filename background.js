function alertClick(HistoryItem result) {
 alert("ASD");
}

//chrome.history.onVisited.addListener(alertClick());
function test()
{
 console.log("in test");
}

chrome.browserAction.onClicked.addListener(test);
