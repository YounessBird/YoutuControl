export default class store {
  //popup Menu options
  /**
   * gets data from local storage
   * @param {*} optionId
   * @returns
   */
  static getOptionsMenuObject(optionId) {
    var returnedObject = JSON.parse(window.localStorage.getItem(optionId));
    return returnedObject;
  }

  static addOptionsMenuObject(optionId, menuOption) {
    window.localStorage.setItem(optionId, JSON.stringify(menuOption));
  }

  /**
   * gets data from chrome storage
   * @param {*} menuId
   * @returns
   */
  //context Menu store functions
  static async getContextMenuObject(menuId) {
    var returnedObject = new Promise((resolve, reject) => {
      chrome.storage.local.get([menuId], (item) => {
        if (Object.entries(item).length == 0) {
          resolve([]);
        } else {
          resolve([item]);
        }
      });
    });
    return await returnedObject;
  }
  /**
   * saves data to chrome storage
   * @param {*} menuId
   * @param {*} contextMenuObject
   * @returns
   */
  static addContextMenuObject(menuId, contextMenuObject) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [menuId]: contextMenuObject }, () => {
        if (chrome.runtime.lastError) console.log("Error setting");
        resolve();
      });
    });
  }

  static removeContextMenuObject(menuId) {
    chrome.storage.local.remove(menuId, () => {
      console.log("item with key " + menuId, "is removed");
    });
  }
}
