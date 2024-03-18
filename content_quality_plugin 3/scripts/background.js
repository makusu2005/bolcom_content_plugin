'use strict';


const Config = {
  loginSite: {
    domain: 'attalosagency.com',
    cookiePrefix: 'wordpress_logged_in_',
  },
};

/**
 * Main function
 */
(async () => {
  chrome.runtime.onInstalled.addListener((request) => {
        chrome.storage.sync.set({ "on": true }).then(() => {
    });
    const url = 'https://attalosagency.com/create-account/';

    console.log('chrome.runtime.onInstalled', request);

    if (request.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({ url });
    }
  });

  console.log('[background]: setting up a message listener!');
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.operation === 'getLoginDetails') {
      return handleGetLoginDetails(request, sender, sendResponse);
    } else if (request.operation === 'injectContentJs') {
      return handleInjectContentJs(request, sender, sendResponse);
    } else if (request.operation === 'injectContentLoginJs') {
      return handleInjectContentLoginJs(request, sender, sendResponse);
    } else {
      return handleUnknownOperation(request);
    }
  });
})();

function handleGetLoginDetails(request, sender, sendResponse) {

  /**
   * An async block to allow the use of await/async syntax
   */
  (async () => {
    const wpLoginCookie = await getWPLoginCookie({
      domain: Config.loginSite.domain,
      cookiePrefix: Config.loginSite.cookiePrefix,
    });

    if (typeof wpLoginCookie === 'undefined') {
      sendResponse({
        isLoggedIn: false,
      })
      return; // skip executing the rest of the code
    }

    const wpCookieValue = decodeURIComponent(wpLoginCookie.value);
    const wpCookieParts = wpCookieValue.split('|');
    const username = wpCookieParts[0];
    sendResponse({
      isLoggedIn: true,
      username,
    });
  })();

  return true; // indicates that a response will be sent asynchronously, otherwise an error will be thrown in console
}

function handleInjectContentJs(request, sender, sendResponse) {
  chrome.scripting.executeScript({
    target: { tabId: sender.tab.id },
    files: ['scripts/content.js'],
  }, () => {
    sendResponse({
      success: true,
    });
  });

  return true; // indicates that a response will be sent asynchronously, otherwise an error will be thrown in console
}

function handleInjectContentLoginJs(request, sender, sendResponse) {
  chrome.scripting.executeScript({
    target: { tabId: sender.tab.id },
    files: ['scripts/content-login.js'],
  }, () => {
    sendResponse({
      success: true,
    });
  });

  return true; // indicates that a response will be sent asynchronously, otherwise an error will be thrown in console
}

function handleUnknownOperation(request) {
  throw new Error(`unknown/undefined request operation "${request.operation}"`);
}

/**
 *
 * @param {string} domain
 * @param {string} cookiePrefix
 * @return {Promise<{
 *  domain: string,
 *  expirationDate: number,
 *  hostOnly: boolean,
 *  httpOnly: boolean,
 *  name: string,
 *  path: string,
 *  sameSite: 'lax' | 'strict' | 'none' | 'unspecified',
 *  secure: boolean,
 *  session: boolean,
 *  storeId: string,
 *  value: string,
 * } | undefined>}
 */
async function getWPLoginCookie({ domain, cookiePrefix }) {
  const cookies = await chrome.cookies.getAll({
    domain,
  });
  return cookies.find((cookie) => (
    cookie.name.indexOf(cookiePrefix) === 0
  ));
}
