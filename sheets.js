// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '1042405230806-4b0th7ne9m1e3p3elo7j2jv2au1v17va.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadSheetsApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
  var discoveryUrl =
      'https://sheets.googleapis.com/$discovery/rest?version=v4';
  gapi.client.load(discoveryUrl).then(handleAuthorized);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '17XCCYV29ey9nQpVjSjFptjGNf6XPtCcNFBffwNB3Ncc',
    range: 'Biljetter!A2:B',
  }).then(function(response) {
    var range = response.result;
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        appendPre(row[0] + ', ' + row[1]);
      }
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}


function handleAuthorized() {

}

function getTickets() {
  return new Promise(function(resolve, reject) {
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: '17XCCYV29ey9nQpVjSjFptjGNf6XPtCcNFBffwNB3Ncc',
      range: 'Biljetter!A2:F',
    }).then(function(response) {
      var range = response.result;
      if (range.values.length > 0) {
        resolve(range);
      } else {
        reject(Error('No data found.'));
      }
    }, function(response) {
      reject(Error(response.result.error.message));
    });
  });
}

function markTicket(row) {
  return new Promise(function(resolve, reject) {
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: '17XCCYV29ey9nQpVjSjFptjGNf6XPtCcNFBffwNB3Ncc',
      valueInputOption: 'USER_ENTERED',
      range: 'Biljetter!C'+row,
      values: [ [new Date().toLocaleString("sv")] ]
    }).then(function(response) {
      resolve(response);
    }, function(response) {
      reject(Error(response.result.error.message));
    });
  });
}
