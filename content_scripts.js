// Handle links
var linkText;
var links = document.getElementsByTagName('a');
var length = links.length;
var saveLinkText = function(e) {
  // Save link text
  console.log(e);
  var currURL = document.URL;
  var linkText = e.target.innerHTML;
  var linkURL = e.target.href;
  chrome.runtime.sendMessage({linkfollowed: "yes", parent_URL: currURL, link_Text: linkText, link_URL: linkURL}, function(response){ });
};

// Set up link handlers
for (var i = 0; i < length; i++) {
  links[i].addEventListener('click', saveLinkText , false); 
}


