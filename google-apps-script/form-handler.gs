/**
 * Fay Consult Group: website form handler (Google Apps Script)
 * =============================================================
 * Receives the "free response-time test" form from contact.html and:
 *   1. Adds a row to the "Leads" tab of this Google Sheet
 *   2. Emails Evan an instant alert (reply goes straight to the lead)
 *   3. Sends the lead an instant "got it" email
 *
 * Setup steps are in README.md ("Form backend: Google Sheet + Apps Script").
 * After editing this file: Deploy > Manage deployments > (pencil) > Version: New version > Deploy.
 */

// ---------- Settings ----------
var OWNER_EMAIL   = 'evan@fayconsultgroup.com';
var SHEET_NAME    = 'Leads';
var SEND_AUTOREPLY = true;
var CALENDAR_LINK = 'https://calendar.app.google/FocAjrRYRFWKcmJGA';

// Column order in the sheet. Add new form field names here to capture them.
var FIELDS = [
  'name', 'business_name', 'email', 'phone', 'website', 'industry',
  'monthly_leads', 'lead_sources', 'notes', 'contact_consent', 'sms_consent',
  'submitted_from'
];

function doPost(e) {
  var p = (e && e.parameter) || {};
  var multi = (e && e.parameters) || {};

  // Spam trap: real people never fill this hidden field
  if (p._gotcha) return json({ ok: true });

  // Basic server-side checks (the page checks these too)
  if (!p.name || !p.email || !p.phone || p.contact_consent !== 'Yes') {
    return json({ ok: false, error: 'missing_required' });
  }

  // Checkboxes can arrive as repeated fields; join them
  if (multi.lead_sources && multi.lead_sources.length > 1) {
    p.lead_sources = multi.lead_sources.join(', ');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var row = [new Date()].concat(FIELDS.map(function (f) { return clean_(p[f]); }));
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  try { notifyOwner_(p); } catch (err) { console.error('Owner email failed', err); }
  if (SEND_AUTOREPLY && isEmail_(p.email)) {
    try { autoReply_(p); } catch (err) { console.error('Auto-reply failed', err); }
  }

  return json({ ok: true });
}

// Lets you open the web app URL in a browser to confirm it's live
function doGet() {
  return json({ ok: true, message: 'Fay Consult Group form handler is running.' });
}

// ---------- Helpers ----------
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['received_at'].concat(FIELDS));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, FIELDS.length + 1).setFontWeight('bold');
  }
  return sheet;
}

function notifyOwner_(p) {
  var subject = 'New response-time test request: ' + (p.business_name || p.name);
  var lines = FIELDS.map(function (f) {
    return f.replace(/_/g, ' ') + ': ' + (p[f] || '-');
  });
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    replyTo: isEmail_(p.email) ? p.email : OWNER_EMAIL,
    subject: subject,
    body: 'New lead from the website. Reply to this email to answer them directly.\n\n' +
          lines.join('\n') + '\n\nAll leads: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });
}

function autoReply_(p) {
  var first = String(p.name || '').trim().split(/\s+/)[0] || 'there';
  var body =
    'Hi ' + first + ',\n\n' +
    'Thanks for requesting a free response-time test' + (p.business_name ? ' for ' + p.business_name : '') + '. ' +
    'I got your request and will be in touch within a few hours.\n\n' +
    'Here is what happens next:\n' +
    '1. I send your business an ordinary inquiry, the way any customer would.\n' +
    '2. I time how long it takes to hear back and note what the experience was like.\n' +
    '3. I send you a short report with a few practical fixes.\n\n' +
    'Want to talk sooner? Grab a time here: ' + CALENDAR_LINK + '\n\n' +
    'Evan Fay\n' +
    'Fay Consult Group\n' +
    '140 Church St, Phoenixville, PA 19460\n' +
    'fayconsultgroup.com';
  MailApp.sendEmail({
    to: p.email,
    replyTo: OWNER_EMAIL,
    name: 'Evan Fay, Fay Consult Group',
    subject: 'Got it: your free response-time test',
    body: body
  });
}

function clean_(v) {
  if (v === undefined || v === null) return '';
  var s = String(v).slice(0, 2000);
  // Stop spreadsheet formula injection
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function isEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor (select testSetup, click Run) to authorize and
// create the Leads tab. It sends one test alert to OWNER_EMAIL only.
function testSetup() {
  doPost({ parameter: {
    name: 'Test Lead', business_name: 'Test Business', email: OWNER_EMAIL,
    phone: '555-0100', contact_consent: 'Yes', notes: 'Setup test, delete this row.',
    submitted_from: 'Apps Script editor'
  }, parameters: {} });
}
