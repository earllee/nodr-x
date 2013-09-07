// Handle links
var linkText;
var links = document.getElementsByTagName('a');
var length = links.length;
var saveLinkText = function(e) {
  // Save link text
  var currText = document.title;
  var currURL = document.URL;
  var linkText = e.target.innerHTML;
  var linkURL = e.target.href;
  chrome.runtime.sendMessage({
    type: 'link',
    linkFollowed: true,
    parentTitle : currTitle,
    parentURL: currURL, 
    linkText: linkText, 
    linkURL: linkURL
    }, function(response){ });
};

// Set up link handlers
for (var i = 0; i < length; i++) {
  links[i].addEventListener('click', saveLinkText , false); 
}

chrome.runtime.sendMessage({
  type: 'load', 
  pageURL: document.URL, 
  pageTitle: document.getElementsByTagName('title')[0].innerHTML
  }, function(response){});
