function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Delete Users from GA')
  .addItem('Update properties & Accounts', 'setAccountsThatExist')
  .addItem('Upload CSV', 'doGet')
  .addItem('Delete Users', 'deleteManyUsers')
  .addToUi();
  setAccountsThatExist();
}
