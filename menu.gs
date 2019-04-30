//create menus in sheet

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('DS ownership transfer')
  .addItem('Get all Datastudio Files in Drive', 'menuItem1')
  .addItem('Transfer ownership', 'menuItem2')
  .addToUi();
}

/**
* Menu items and functions to be executed
*/

function menuItem1() {
getAllDataStudioFiles()
}

function menuItem2() {
transferDataStudioFiles()
}