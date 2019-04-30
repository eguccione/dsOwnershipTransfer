SS = SpreadsheetApp.getActiveSpreadsheet();

  


function getAllDataStudioFiles() {
  var sheet = SS.getSheetByName("dsFiles")
var lastRow = sheet.getMaxRows()

sheet.getRange(2, 1, lastRow-1, 8).clear().clearDataValidations()

 var results = [];
  var resultsLength =[];
 var type = [ "application/vnd.google-analytics.rap.datasource","application/vnd.google-analytics.rap.report"]
 for (var t in type) {
   var files = DriveApp.getFilesByType(type[t]);
   while (files.hasNext()) {

     var file = files.next();
     var owner = file.getOwner().getEmail()
     var user = Session.getActiveUser().getEmail()
//add something about aliases with error trycatch for accounts without gmail
    if(owner == user){     
     results.push( [file.getName() ,getFileType(file.getMimeType()),file.getId(),"https://datastudio.google.com/open/"+file.getId().toString() ] );
   }
   }
 }
  
  
var rows = results.length


sheet.getRange(1, 1, 1, 8).setValues([["DS file name","File Type","File Id","Link to file","Change owner","New Owner Email Address","Notify New owner?","Note"]])

sheet.getRange(2, 1, rows, 4).setValues(results)

setListValidation(sheet.getRange(2, 5, rows, 1),["Yes","No"])

var noArray= fillArray(["No"],rows-1)
Logger.log(noArray)
           Logger.log(results)
sheet.getRange(2, 5, rows-1, 1).setValues(noArray)
setListValidation(sheet.getRange(2, 7, rows, 1),["Yes","No"])
sheet.getRange(2, 7, rows-1, 1).setValues(noArray)

sheet.autoResizeColumns(1, 7);
trimSheet("dsFiles")
}

function transferDataStudioFiles(){
  var sheet = SS.getSheetByName("dsFiles")

  var lastRow = sheet.getMaxRows()
var sheet = SS.getSheetByName("dsFiles")
var DSfiles =  sheet.getRange(2, 1, lastRow-1, 7).getValues()
var i =1
 var filesToTransfer = [];

for each (var row in DSfiles)
  { if(row[4]!="No"&row[5]!=""){
    Logger.log(row)
filesToTransfer.push(row)
  };
  }
  
  for each (var id in filesToTransfer){

       var dsFile = DriveApp.getFileById(id[2])
       Logger.log(id[5])
                          sheet.getRange(i+1, 8).setValue("Owner change to "+id[5]+" completed")
sheet.autoResizeColumns(1, 8);

       //need to add error checking for if this fails
       try { dsFile.setOwner(id[5]);

  } catch(e) {
         var sheet = SS.getSheetByName("dsFiles")

    // Logs an ERROR message.
Logger.log(e)
  }
       Logger.log(id[6])
    if(id[6]=="Yes"){
Logger.log( "Data Studio data source transfered"+"The following DS file has been transferred to your ownership"+id[0]+".       "+ "Go here" + id[3] +"to complete transfer")
            MailApp.sendEmail(id[5], "Data Studio data source transfered","The following DS file has been transferred to your ownership "+id[0]+" .       "+ "Go here " + id[3] +" to complete transfer");
                   sheet.getRange(i+1, 8).setValue("Owner change to "+id[5]+" completed & email sent")
sheet.autoResizeColumns(1, 8);

    }
  i++
  }



//Logger.log(DSfiles)
}

/**
* Inserts a new sheet into the active spreadsheet.
* If a sheet with the same name exists already, it is deleted first.
* @param {string} sheetname - Name of new sheet
*/
function insertSheet(sheetname) {

 

  SS.insertSheet(sheetname);
  sheet = SS.getSheetByName(sheetname);
  sheet.deleteColumns(16, 11);  
  sheet.activate();
  SS.moveActiveSheet(SS.getSheets().length);
}

//stolen from https://ctrlq.org/code/19912-mime-types-google-drive
function getFileType(mimeType) {
  
  var filetype = "";
  
  switch (mimeType) {
    case 'application/vnd.google-analytics.rap.datasource': filetype = 'Data Studio datasource'; break;
    case 'application/vnd.google-analytics.rap.report': filetype = 'Data Studio report'; break;
    case MimeType.GOOGLE_APPS_SCRIPT: filetype = 'Google Apps Script'; break;
    case MimeType.GOOGLE_DRAWINGS: filetype = 'Google Drawings'; break;
    case MimeType.GOOGLE_DOCS: filetype = 'Google Docs'; break;
    case MimeType.GOOGLE_FORMS: filetype = 'Google Forms'; break;
    case MimeType.GOOGLE_SHEETS: filetype = 'Google Sheets'; break;
    case MimeType.GOOGLE_SLIDES: filetype = 'Google Slides'; break;
    case MimeType.FOLDER: filetype = 'Google Drive folder'; break;
    case MimeType.BMP: filetype = 'BMP'; break;
    case MimeType.GIF: filetype = 'GIF'; break;
    case MimeType.JPEG: filetype = 'JPEG'; break;
    case MimeType.PNG: filetype = 'PNG'; break;
    case MimeType.SVG: filetype = 'SVG'; break;
    case MimeType.PDF: filetype = 'PDF'; break;
    case MimeType.CSS: filetype = 'CSS'; break;
    case MimeType.CSV: filetype = 'CSV'; break;
    case MimeType.HTML: filetype = 'HTML'; break;
    case MimeType.JAVASCRIPT: filetype = 'JavaScript'; break;
    case MimeType.PLAIN_TEXT: filetype = 'Plain Text'; break;
    case MimeType.RTF: filetype = 'Rich Text'; break;
    case MimeType.OPENDOCUMENT_GRAPHICS: filetype = 'OpenDocument Graphics'; break;
    case MimeType.OPENDOCUMENT_PRESENTATION: filetype = 'OpenDocument Presentation'; break;
    case MimeType.OPENDOCUMENT_SPREADSHEET: filetype = 'OpenDocument Spreadsheet'; break;
    case MimeType.OPENDOCUMENT_TEXT: filetype = 'OpenDocument Word'; break;
    case MimeType.MICROSOFT_EXCEL: filetype = 'Microsoft Excel'; break;
    case MimeType.MICROSOFT_EXCEL_LEGACY: filetype = 'Microsoft Excel'; break;
    case MimeType.MICROSOFT_POWERPOINT: filetype = 'Microsoft PowerPoint'; break;
    case MimeType.MICROSOFT_POWERPOINT_LEGACY: filetype = 'Microsoft PowerPoint'; break;
    case MimeType.MICROSOFT_WORD: filetype = 'Microsoft Word'; break;
    case MimeType.MICROSOFT_WORD_LEGACY: filetype = 'Microsoft Word'; break;
    case MimeType.ZIP: filetype = 'ZIP'; break;
    default: filetype = "Unknown";
  }
  
  return filetype;
  
}


/**
* Deletes surplus rows and columns from a given sheet within the active spreadsheet.
* @param {string} sheetname - Name of worksheet
*/
function trimSheet(sheetname) {
  var trim = SS.getSheetByName(sheetname);
  var lastCol = trim.getLastColumn();
  var lastRow = trim.getLastRow();
  var maxCols = trim.getMaxColumns();
  var maxRows = trim.getMaxRows();

  if (maxCols > lastCol && lastCol > 0) {
    trim.deleteColumns(lastCol + 1, maxCols - lastCol);
  }
  
  if (maxRows > lastRow && lastRow > 0) {
    trim.deleteRows(lastRow + 1, maxRows - lastRow);
  }
  trim.activate();
}


function setListValidation(range, values) {
  range.setDataValidation(
    SpreadsheetApp.newDataValidation()
                          .setAllowInvalid(false)
                          .requireValueInList(values, true)
                          .build());
}

function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}