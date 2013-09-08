if (chrome.extension.getBackgroundPage().recordingState == true) {
  document.getElementByID("status").textContent = "Recording";
} else {  
  document.getElementByID("status").textContent = "Not Recording";
}