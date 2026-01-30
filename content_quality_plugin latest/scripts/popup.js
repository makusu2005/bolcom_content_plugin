'use strict';

/**
 * Main function, runs once each time the popup window is opened.
 */
(async () => {
  console.log('[popup]: requesting login details from background.js...');

  const loginDetails = await getLoginDetails();

  console.log('[popup]: received login details from background.js!', loginDetails);

  updateUI(loginDetails);
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
 * Updates the UI according to the login status
 * @param {{
 *   isLoggedIn: boolean,
 *   username: string|undefined,
 * }} loginDetails
 * @return void
 */
function updateUI(loginDetails) {
  const {
    isLoggedIn,
    username,
  } = loginDetails;

  const $loggedInContainer = $('.logged-in');
  const $notLoggedInContainer = $('.not-logged-in');

  $loggedInContainer.toggle(isLoggedIn);
  $notLoggedInContainer.toggle(!isLoggedIn);

  if (isLoggedIn) {
    $loggedInContainer.html(`
      You're logged in as <b>${username}</b>!
      `);
  }
}
var switchStatus
chrome.storage.sync.get(["on"]).then((result) => {
  switchStatus = result.on
  if (switchStatus == false ){
    $("#flexSwitchCheckChecked").attr("checked", false);
  }
  else {
    $('#flexSwitchCheckChecked').attr("checked", true);
  }
});

/* check if switch is on or off */
$("#flexSwitchCheckChecked").on('change', function() {
  if ($(this).is(':checked')) {
    switchStatus = $(this).is(':checked');
    chrome.storage.sync.set({ "on": switchStatus }).then(() => {
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });



  }
  else {
   switchStatus = $(this).is(':checked');
   $(this).prop('checked', false);
   chrome.storage.sync.set({ "on": switchStatus }).then(() => {
   });       
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
 }
});

