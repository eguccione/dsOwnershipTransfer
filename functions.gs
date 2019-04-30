//functions that are used in the script



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
        case 'application/vnd.google-analytics.rap.datasource':
            filetype = 'Data Studio datasource';
            break;
        case 'application/vnd.google-analytics.rap.report':
            filetype = 'Data Studio report';
            break;
        case MimeType.GOOGLE_APPS_SCRIPT:
            filetype = 'Google Apps Script';
            break;
        case MimeType.GOOGLE_DRAWINGS:
            filetype = 'Google Drawings';
            break;
        case MimeType.GOOGLE_DOCS:
            filetype = 'Google Docs';
            break;
        case MimeType.GOOGLE_FORMS:
            filetype = 'Google Forms';
            break;
        case MimeType.GOOGLE_SHEETS:
            filetype = 'Google Sheets';
            break;
        case MimeType.GOOGLE_SLIDES:
            filetype = 'Google Slides';
            break;
        case MimeType.FOLDER:
            filetype = 'Google Drive folder';
            break;
        case MimeType.BMP:
            filetype = 'BMP';
            break;
        case MimeType.GIF:
            filetype = 'GIF';
            break;
        case MimeType.JPEG:
            filetype = 'JPEG';
            break;
        case MimeType.PNG:
            filetype = 'PNG';
            break;
        case MimeType.SVG:
            filetype = 'SVG';
            break;
        case MimeType.PDF:
            filetype = 'PDF';
            break;
        case MimeType.CSS:
            filetype = 'CSS';
            break;
        case MimeType.CSV:
            filetype = 'CSV';
            break;
        case MimeType.HTML:
            filetype = 'HTML';
            break;
        case MimeType.JAVASCRIPT:
            filetype = 'JavaScript';
            break;
        case MimeType.PLAIN_TEXT:
            filetype = 'Plain Text';
            break;
        case MimeType.RTF:
            filetype = 'Rich Text';
            break;
        case MimeType.OPENDOCUMENT_GRAPHICS:
            filetype = 'OpenDocument Graphics';
            break;
        case MimeType.OPENDOCUMENT_PRESENTATION:
            filetype = 'OpenDocument Presentation';
            break;
        case MimeType.OPENDOCUMENT_SPREADSHEET:
            filetype = 'OpenDocument Spreadsheet';
            break;
        case MimeType.OPENDOCUMENT_TEXT:
            filetype = 'OpenDocument Word';
            break;
        case MimeType.MICROSOFT_EXCEL:
            filetype = 'Microsoft Excel';
            break;
        case MimeType.MICROSOFT_EXCEL_LEGACY:
            filetype = 'Microsoft Excel';
            break;
        case MimeType.MICROSOFT_POWERPOINT:
            filetype = 'Microsoft PowerPoint';
            break;
        case MimeType.MICROSOFT_POWERPOINT_LEGACY:
            filetype = 'Microsoft PowerPoint';
            break;
        case MimeType.MICROSOFT_WORD:
            filetype = 'Microsoft Word';
            break;
        case MimeType.MICROSOFT_WORD_LEGACY:
            filetype = 'Microsoft Word';
            break;
        case MimeType.ZIP:
            filetype = 'ZIP';
            break;
        default:
            filetype = "Unknown";
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


//stolen from here: https://stackoverflow.com/questions/12503146/create-an-array-with-same-element-repeated-multiple-times
function fillArray(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}