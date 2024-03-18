'use strict';

/**
 * Main function, runs once each time the popup window is opened.
 */
(async () => {
  console.log('[init-content]: requesting login details from background.js...');

  const loginDetails = await getLoginDetails();

  console.log('[init-content]: received login details from background.js!', loginDetails);

  console.log('[init-content]: requesting to inject content.js...');

  if (loginDetails.isLoggedIn) {
    await injectContentJs();
  } else {
    await injectContentLoginJs();
  }
})();

/**
 * Requests login details from background.js
 * @return {Promise<{
 *   isLoggedIn: boolean,
 *   username: string|undefined,
 * }>}
 */
async function getLoginDetails() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      operation: 'getLoginDetails',
    }, resolve);
  });
}

/**
 * Requests background.js to inject content.js file
 * @return {Promise<void>}
 */
async function injectContentJs() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      operation: 'injectContentJs',
    }, resolve);
  });
}

/**
 * Requests background.js to inject content-login.js file
 * @return {Promise<void>}
 */
async function injectContentLoginJs() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      operation: 'injectContentLoginJs',
    }, resolve);
  });
}
