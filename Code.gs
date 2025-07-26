// Google Apps Script for Timer Platform API
// Replace SHEET_ID with your actual Google Sheet ID

const SHEET_ID = '1u4ZUmiV7BfSUxqxRjQdtFVfEh-AbE7ue7ZMOKC0uZQA';

function doGet(e) {
  const action = e.parameter.action;
  const roomId = e.parameter.roomId;
  
  try {
    switch(action) {
      case 'getRooms':
        return createResponse(getRooms());
      case 'getTimers':
        return createResponse(getTimers(roomId));
      case 'getMessages':
        return createResponse(getMessages(roomId));
      case 'getTimerData':
        return createResponse(getTimerData(roomId));
      default:
        return createResponse({error: 'Invalid action'}, 400);
    }
  } catch (error) {
    return createResponse({error: error.toString()}, 500);
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  try {
    switch(action) {
      case 'createRoom':
        return createResponse(createRoom(data));
      case 'updateTimer':
        return createResponse(updateTimer(data));
      case 'createTimer':
        return createResponse(createTimer(data));
      case 'updateMessage':
        return createResponse(updateMessage(data));
      case 'createMessage':
        return createResponse(createMessage(data));
      default:
        return createResponse({error: 'Invalid action'}, 400);
    }
  } catch (error) {
    return createResponse({error: error.toString()}, 500);
  }
}

function createResponse(data, status = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({'Access-Control-Allow-Origin': '*'});
}

function getRooms() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('rooms');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function getTimers(roomId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('timers');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1)
    .filter(row => row[1] === roomId)
    .map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    })
    .sort((a, b) => a.order - b.order);
}

function getMessages(roomId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('messages');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1)
    .filter(row => row[1] === roomId)
    .map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
}

function getTimerData(roomId) {
  return {
    timers: getTimers(roomId),
    messages: getMessages(roomId)
  };
}

function createRoom(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('rooms');
  const roomId = Utilities.getUuid();
  
  sheet.appendRow([
    roomId,
    data.title,
    data.owner_email,
    new Date().toISOString()
  ]);
  
  return {room_id: roomId};
}

function createTimer(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('timers');
  const timerId = Utilities.getUuid();
  
  sheet.appendRow([
    timerId,
    data.room_id,
    data.order || 0,
    data.title,
    data.speaker || '',
    data.duration_sec,
    data.start_time || '',
    data.mode || 'countdown',
    data.wrap_yellow_pct || 20,
    data.wrap_red_pct || 10,
    data.linked_to || '',
    data.status || 'stopped',
    new Date().toISOString()
  ]);
  
  return {timer_id: timerId};
}

function updateTimer(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('timers');
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.timer_id) {
      if (data.status !== undefined) sheet.getRange(i + 1, 12).setValue(data.status);
      if (data.start_time !== undefined) sheet.getRange(i + 1, 7).setValue(data.start_time);
      sheet.getRange(i + 1, 13).setValue(new Date().toISOString());
      break;
    }
  }
  
  return {success: true};
}

function createMessage(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('messages');
  const msgId = Utilities.getUuid();
  
  sheet.appendRow([
    msgId,
    data.room_id,
    data.text,
    data.color || '#000000',
    data.is_flashing || false,
    data.is_shown || false,
    new Date().toISOString()
  ]);
  
  return {msg_id: msgId};
}

function updateMessage(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('messages');
  const dataRange = sheet.getDataRange().getValues();
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0] === data.msg_id) {
      if (data.text !== undefined) sheet.getRange(i + 1, 3).setValue(data.text);
      if (data.color !== undefined) sheet.getRange(i + 1, 4).setValue(data.color);
      if (data.is_flashing !== undefined) sheet.getRange(i + 1, 5).setValue(data.is_flashing);
      if (data.is_shown !== undefined) sheet.getRange(i + 1, 6).setValue(data.is_shown);
      break;
    }
  }
  
  return {success: true};
}