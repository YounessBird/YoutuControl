import store from "./store";

// clear local storage
chrome.storage.local.clear();

/**
 *  Parent Menu click event
 */
const parentMenuFunction = chrome.contextMenus.onClicked.addListener(() => {});

const contextMenuEvent = chrome.contextMenus.onClicked.addListener((data) => {
  /**
   *  Start Loop Menu option click event
   */
  if (data.menuItemId == "start loop") {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach((tab) => {
        if (tab.audible) {
          chrome.tabs.sendMessage(tab.id, { message: "loop" }, (res) => {
            //if (res.send == "video looping") {
            subMenuMenuUpdate("loop", false);
            //  }
          });
        }
      });
    });
  }
  /**
   *  Stop Loop Menu option click event
   */
  if (data.menuItemId == "stop loop") {
    chrome.tabs.query({}, function (tab) {
      tab.forEach((tabs) => {
        if (tabs.audible) {
          chrome.tabs.sendMessage(tabs.id, { message: "stopLoop" }, (res) => {
            subMenuMenuUpdate("loop", true);
            //console.log(res);
          });
        }
      });
    });
  }
  /**
   * Pause Menu option click event
   */
  if (data.menuItemId.includes("Play")) {
    var tabId = data.menuItemId.match(/(?<=tabId\:)(\d+)/)[0];
    stop(tabId);
  }
  /**
   * Play Menu option click event
   */
  if (data.menuItemId.includes("Pause")) {
    var tabId = data.menuItemId.match(/(?<=tabId\:)(\d+)/)[0];
    resume(tabId);
  }
  /**
   * Search Menu option click event
   */
  if (data.menuItemId == "Search") {
<<<<<<< HEAD
    var dataToBeSearched = data.selectionText;
    var newURL = `https://www.youtube.com/results?search_query=${dataToBeSearched}`;
=======
    dataToBeSearched = data.selectionText;
    newURL = `https://www.youtube.com/results?search_query=${dataToBeSearched}`;
>>>>>>> master
    chrome.tabs.create({ url: newURL });
  }
  /**
   * Next Menu option click event
   */
  if (data.menuItemId == "Next") {
    chrome.tabs.query({}, function (tab) {
      tab.forEach((tabs) => {
        if (tabs.audible) {
          chrome.tabs.sendMessage(tabs.id, { action: "next" });
        }
      });
    });
  }
  /**
   * Back Menu option click event
   */
  if (data.menuItemId == "Back") {
    chrome.tabs.query({}, function (tab) {
      tab.forEach((tabs) => {
        if (tabs.audible) {
          chrome.tabs.sendMessage(tabs.id, { action: "back" });
        }
      });
    });
  }
  /**
   * Save To PlayList Menu Option
   */

  if (data.menuItemId.includes("saveToList")) {
    console.log("triggered");
    var playlistName = data.menuItemId.slice(
      data.menuItemId.indexOf(`saveToList`) + `saveToList`.length
    );
    console.log(playlistName);
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (
          // this has to be changed to check only if the link is youtube
          new RegExp("https://www.youtube.com/*", "g").test(tab.url) &&
          tab.audible
        ) {
          chrome.tabs.sendMessage(tab.id, {
            action: "saveToList",
            playlistName: playlistName,
          });
        }
      });
    });
  }
});

const parentMenu = {
  id: "YoutubeMenu",
  title: "Youtube Remote control",
  id: "parent",
  contexts: ["all"],
  onclick: parentMenuFunction,
};
chrome.contextMenus.create(parentMenu);

const searchYoutube = {
  id: "Search",
  parentId: "parent",
  title: "Search Youtube for '%s' ",
  contexts: ["selection"],
  onclick: contextMenuEvent,
};
chrome.contextMenus.create(searchYoutube);

chrome.contextMenus.create({
  id: "Play",
  title: "Play",
  parentId: "parent",
  contexts: ["all"],
  onclick: () => {},
});
chrome.contextMenus.create({
  id: "Pause",
  title: "Pause",
  parentId: "parent",
  contexts: ["all"],
  onclick: () => {},
});
chrome.contextMenus.create({
  id: "Next",
  title: "Next",
  parentId: "parent",
  contexts: ["all"],
  onclick: contextMenuEvent,
});
chrome.contextMenus.create({
  id: "Back",
  title: "Back",
  parentId: "parent",
  contexts: ["all"],
  onclick: contextMenuEvent,
});
const loopContextMenu = {
  id: "start loop",
  parentId: "parent",
  title: "Start Loop",
  contexts: ["all"],
  onclick: contextMenuEvent,
};
chrome.contextMenus.create(loopContextMenu);
chrome.contextMenus.create({
  id: "playLists",
  title: "Save To PlayList",
  parentId: "parent",
  contexts: ["all"],
  onclick: () => {},
});
store.addContextMenuObject("Play", {});
store.addContextMenuObject("Pause", {});
store.addContextMenuObject("Next", {});
store.addContextMenuObject("Loop", "start loop");
//store.addContextMenuObject("P",{});

//tracks url change ,play, pause next,back and updates context menu accordingly
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  const menuObj = await store.getContextMenuObject(tabId.toString());
  console.log(tabId, changeInfo, tab);
<<<<<<< HEAD
  if (
    new RegExp("https://www.youtube.com/*").test(tab.url) &&
    tab.status == "complete"
  ) {
    //injectScript(tabId);
    if (!menuObj.length) {
      console.log("create 1");
=======
  if (new RegExp("https://www.youtube.com/*", "g").test(tab.url)) {
    //injectScript(tabId);
    if (!menuObj.length) {
>>>>>>> master
      const populatePlayTitles = {
        id: `tabId:${tabId} Play`,
        parentId: "Pause",
        title: tab.title,
        contexts: ["all"],
        onclick: contextMenuEvent,
      };
<<<<<<< HEAD
      await clearTitlesMenu(tabId);
      chrome.contextMenus.create(populatePlayTitles);
      await store.addContextMenuObject(tabId.toString(), `tabId:${tabId} Play`);
    } else {
      if (tab.audible && tab.status == "complete") {
        console.log("create 2");
=======
      chrome.contextMenus.create(populatePlayTitles);
      await store.addContextMenuObject(tabId.toString(), {
        id: `tabId:${tabId} Pause`,
        title: tab.title,
        parentId: "Pause",
        status: "Pause",
      });
    } else {
      if (tab.audible) {
>>>>>>> master
        await clearTitlesMenu(tabId);
        const populatePauseTitles = {
          id: `tabId:${tabId} Play`,
          parentId: "Pause",
          title: tab.title,
          contexts: ["all"],
          onclick: contextMenuEvent,
        };
        chrome.contextMenus.create(populatePauseTitles);
      } else {
        await clearTitlesMenu(tabId);
        const populatePlayTitles = {
          id: `tabId:${tabId} Pause`,
          parentId: "Play",
          title: tab.title,
          contexts: ["all"],
          onclick: contextMenuEvent,
        };
        chrome.contextMenus.create(populatePlayTitles);
      }
    }
  }
});
// remove the contextmenu object when the tab is closed
chrome.tabs.onRemoved.addListener(async (tabId, info) => {
  clearTitlesMenu(tabId);
  store.removeContextMenuObject(tabId.toString());
});

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.msg.text === "changeMenu") {
    var getOption;
    let [option, value] = Object.entries(request.msg)[1];

    // change form loop to start/stop loop
    option == "Loop"
      ? ((getOption = await store.getContextMenuObject(option)),
        (option = getOption[0].Loop))
      : option;

    // make option in context menu invisible
    !value
      ? chrome.contextMenus.update(option, { visible: false })
      : chrome.contextMenus.update(option, { visible: true });
  }
  if (request.msg === "playlistsStored") {
    //get playlists from storage
    var playLists = await store.getContextMenuObject("playlists");
    playLists[0].playlists.forEach((pl, i) => {
<<<<<<< HEAD
      clearTitlesMenu(`saveToList${pl}`);
=======
>>>>>>> master
      chrome.contextMenus.create({
        id: `saveToList${pl}`,
        title: pl,
        parentId: "playLists",
        contexts: ["all"],
        onclick: contextMenuEvent,
      });
    });
  }
  if (request.msg === "removePlayList") {
<<<<<<< HEAD
    console.log(request.removePlayList);
    chrome.contextMenus.remove(`saveToList${request.removePlayList}`);
=======
    chrome.contextMenus.remove(`saveToPlayList${request.removePlayList}`);
>>>>>>> master
  }
  // message from content scrpit to notify
  if (request.msg === "Notify") {
    var result = request.value;
    chrome.notifications.create("", {
      type: "basic",
      iconUrl: "./images/icon-32.png",
      title: "Save To PlayList",
      message: result
        ? `Video Saved To ${request.playlistName}`
        : `Video Removed From ${request.playlistName}`,
    });
  }
});

/**
 *  Removes ContextMenu Based On The Menu Id
 * @param {string|number} tabId
 * @returns {Promise}
 */

function clearTitlesMenu(tabId) {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.remove(`tabId:${tabId} Play`, () => {
      if (chrome.runtime.lastError) console.log("Error setting");
      resolve();
    });
    chrome.contextMenus.remove(`tabId:${tabId} Pause`, () => {
      if (chrome.runtime.lastError) console.log("Error setting");
      resolve();
    });
  });
}

/**
 *  Removes contextMenu based On menu type and a boolean value
 * @param {string} menuType
 * @param {boolean} isActive
 */
function subMenuMenuUpdate(menuType, isActive) {
  if (menuType == "loop") {
    isActive
      ? chrome.contextMenus.remove("stop loop", () => {
          if (chrome.runtime.lastError) console.log("Error setting");
        })
      : chrome.contextMenus.remove("start loop", () => {
          if (chrome.runtime.lastError) console.log("Error setting");
        });

    const loopContextMenu = {
      id: isActive ? "start loop" : "stop loop",
      parentId: "parent",
      title: isActive ? "Start Loop" : "Stop Loop",
      contexts: ["all"],
      onclick: contextMenuEvent,
    };
    chrome.contextMenus.create(loopContextMenu);
    // register the current loop id to keep track of it as it's going to be useful when removing options
    isActive
      ? store.addContextMenuObject("Loop", "start loop")
      : store.addContextMenuObject("Loop", "stop loop");
  }
}
function stop(tabId) {
  chrome.tabs.sendMessage(Number(tabId), { action: "stop" });
}

function resume(tabId) {
  chrome.tabs.sendMessage(Number(tabId), { action: "resume" });
}
