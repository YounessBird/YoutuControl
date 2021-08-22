let youtubeControlButtons = "ytp-left-controls";
let videoFrame = document.querySelector("html5-main-video");
let videoPage = document.querySelector("watch-title");

if (!videoPage) {
  videoPage = document.querySelector("ytd-video-primary-info-renderer");
}

let initDone = false;
let btnCreated = false;

/**
 *  A function that Runs the "getVideoInfo" function every 100ms
 * to detect if the video is loaded and the elements of the page are present
 * @returns { function() }
 */
let detectVideoInfo = () => {
  /**
   *
   * @returns { () => void }
   */
  return setInterval(() => {
    //Runs the "getVideoInfo" function every 100ms
    getVideoInfo();
  }, 100);
};

/**
 * checks if the elements videoFrame && videoPage were loaded
 * and then it creats the loop button
 * @function getVideoInfo
 */
let getVideoInfo = () => {
  if (videoFrame && videoPage) {
    if (!btnCreated) {
      createBtn();
      btnCreated = true;
    }
    if (videoFrame.readyState === 4) {
      clearInterval(runDetectVideoInfo);
      initDone = true;
    }
  } else {
    videoPage = document.getElementsByClassName("watch-title")[0];
    if (!videoPage) {
      videoPage = document.getElementsByClassName(
        "ytd-video-primary-info-renderer"
      )[0];
    }
    videoFrame = document.getElementsByClassName("html5-main-video")[0];
  }
};

let setLargeBtn = () => {
  let btn = document.getElementsByClassName("btn-div");
  if (btn) {
    btn = btn[0];
    let icon = btn.getElementsByClassName("material-icons")[0];
    icon.setAttribute("class", "material-icons icon material-font-large");
  }
};

let setSmallBtn = () => {
  let btn = document.getElementsByClassName("btn-div");
  if (btn) {
    btn = btn[0];
    let icon = btn.getElementsByClassName("material-icons")[0];
    icon.setAttribute("class", "material-icons icon material-font-small");
  }
};

let createBtn = () => {
  let btn = document.createElement("div");
  btn.setAttribute("class", "btn-div ytp-button");

  let icon = document.createElement("i");
  icon.setAttribute("class", "material-icons icon material-font-small");
  icon.textContent = "repeat";

  btn.appendChild(icon);
  btn.onclick = repeat;
  let btnPanel = document.getElementsByClassName(youtubeControlButtons)[0];
  btnPanel.insertBefore(btn, btnPanel.firstChild);
};

let repeatItval = null;

chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
  var videoElements = document.querySelectorAll("video");

  if (request.message === "loop") {
    startLoop();
  }
  if (request.message === "stopLoop") {
    stopLoop();
  }
  if (request.action === "next") {
    console.log("next");
    var playlist = document.querySelector(".ytd-toggle-button-renderer");
    console.log(playlist);
    playlist
      ? document.querySelector("a.ytp-next-button").click()
      : window.history.go(1).click();
  }
  if (request.action === "back") {
    console.log("back");
    window.history.back().click();
  }
  for (i = 0; i < videoElements.length; i++) {
    if (request.action === "stop" && !videoElements[i].paused) {
      videoElements[i].pause();
    } else if (request.action === "resume" && videoElements[i].paused) {
      videoElements[i].play();
    }
  }
  //Store playlists msg from popup (to be improved)
  if (request.msg === "storePlayLists") {
    document.querySelectorAll('[aria-label="Save to playlist"]')[1].click();
    document.querySelectorAll('[aria-label="Save to playlist"]')[1].click();
    var timer = setInterval(() => {
      var playListsCollection = document.querySelectorAll(
        "ytd-playlist-add-to-option-renderer"
      );
      let playListTitles = Array.from(playListsCollection, (playlist) =>
        playlist.innerText.trim()
      );
      console.log(playListTitles);

      if (playListTitles.length > 0) {
        chrome.storage.local.set({ playlists: playListTitles }, () => {
          sendMessage({ res: "saved" });
        });
        clearInterval(timer);
      }
    }, 100);
  }
  // Save to playlist msg from background
  if (request.action === "saveToList") {
    document.querySelectorAll('[aria-label="Save to playlist"]')[1].click();
    document.querySelectorAll('[aria-label="Save to playlist"]')[1].click();

    // give time to element to mount to the DOM
    var timer = setTimeout(() => {
      const listTitles = document.querySelector(
        `[title="${request.playlistName}"]`
      );
      listTitles.click();
      // check if checkbox is checked or not and then notify background

      let IsSaved =
        listTitles.parentNode.parentNode.parentNode.parentNode.children[0].firstChild.classList.contains(
          "checked"
        );
      chrome.runtime.sendMessage({
        msg: "Notify",
        value: IsSaved,
        playlistName: request.playlistName,
      });
    }, 400);
  }
});
/**
 * A toggle for the loop button
 * @function repeat
 */
let repeat = () => {
  let repeating = videoFrame.getAttribute("loop");
  if (!repeating) {
    startLoop();
  } else {
    stopLoop();
  }
};

let runDetectVideoInfo = detectVideoInfo();

let usingSmallBtn = true;
setInterval(() => {
  // if on full screen use large button

  if (document.webkitFullscreenElement && usingSmallBtn) {
    setLargeBtn();
    usingSmallBtn = false;
  }
  // if on full screen use small button

  if (!document.webkitFullscreenElement && !usingSmallBtn) {
    setSmallBtn();
    usingSmallBtn = true;
  }
}, 100);

/**
 * function to start the loop
 * @function startLoop
 */
function startLoop() {
  videoFrame.setAttribute("loop", true);
  document
    .getElementsByClassName("btn-div")[0]
    .setAttribute("style", "color: red !important;");
}
/**
 * function to stop the loop
 * @function stopLoop
 */
function stopLoop() {
  videoFrame.removeAttribute("loop");
  document
    .getElementsByClassName("btn-div")[0]
    .setAttribute("style", "color: white !important;");
}
