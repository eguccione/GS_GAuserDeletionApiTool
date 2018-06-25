// http://stackoverflow.com/questions/11273288/script-import-local-csv-in-google-spreadsheet

function test(){
  copyValues()}

function doGet(e) {
  var app = UiApp.createApplication().setTitle("Upload CSV to Sheet");
  var formContent = app.createVerticalPanel();
  formContent.add(app.createFileUpload().setName('thefile'));
  formContent.add(app.createSubmitButton('Start Upload'));
  var form = app.createFormPanel();
  form.add(formContent);
  app.add(form);
  SpreadsheetApp.getActiveSpreadsheet().show(app);
}

function doPost(e) {
    var app = UiApp.getActiveApplication();

  // data returned is a blob for FileUpload widget
  var fileBlob = e.parameter.thefile;
  
  // parse the data to fill values, a two dimensional array of rows
  // Assuming newlines separate rows and commas separate columns, then:
  var values = []
  var rows = fileBlob.contents.split('\n');
  for(var r=0, max_r=rows.length; r<max_r; ++r)
    values.push( rows[r].split(',') );  // rows must have the same number of columns
  insertSheet("data")
  var sheet = SS.getSheetByName("data");
  for (var i = 0; i < values.length; i++) {
    sheet.getRange(i+1, 1, 1, values[i].length).setValues(new Array(values[i]));
  }
  copyValues()
  SS.getSheetByName("Input_sheet").activate();
  
  app.close();
  return app;
}


/**
* Inserts a new sheet into the active spreadsheet.
* If a sheet with the same name exists already, it is deleted first.
* set cell format to plaintext
* @param {string} sheetname - Name of new sheet
*/
function insertSheet(sheetname) {
  var sheet = SS.getSheetByName(sheetname);
  if (sheet != null) {
    sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clear();
  } else {
    SS.insertSheet(sheetname);}
  sheet = SS.getSheetByName(sheetname);
  
  var range = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
  range.setNumberFormat("@");
}

function copyValues(){
  var datasheet = SS.getSheetByName("data");
  var input_sheet = SS.getSheetByName("input_sheet");
  input_sheet.getRange(8, 1, input_sheet.getMaxRows(), 2).clear();
  var datarange = datasheet.getRange(8, 1, datasheet.getMaxRows()-7, 1);
  var dataValues = datarange.getValues()
  var inputsheetRange = input_sheet.getRange(8, 1, datasheet.getMaxRows()-7, 1)
  inputsheetRange.setNumberFormat("@");
  inputsheetRange.setValues(dataValues)
  input_sheet.getRange(6,1).setValue(datasheet.getRange(7,1).getValue())
}