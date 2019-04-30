SS = SpreadsheetApp.getActiveSpreadsheet();
user = Session.getActiveUser().getEmail()



function getAllDataStudioFiles() {
    var results = [];
    var resultsLength = [];
    var type = ["application/vnd.google-analytics.rap.datasource", "application/vnd.google-analytics.rap.report"]
    var i = 1
    var sheet = SS.getSheetByName("dsFiles")
    var lastRow = sheet.getMaxRows()
    
    //clear anything that's currently in the sheet
    sheet.getRange(2, 1, lastRow - 1, 8).clear().clearDataValidations()

    //loop through all files in gDrive looking only at DS
    for (var t in type) {
        var files = DriveApp.getFilesByType(type[t]);

        while (files.hasNext()) {
          //get data for each file that is a DS file
            var file = files.next();
            var owner = file.getOwner().getEmail()
            //add something about aliases with error trycatch for accounts without gmail

            if (owner == user) {//check whether the data studio file is owned by the person running the sheet
              //add the details of the file to an array 
              results.push([file.getName(), getFileType(file.getMimeType()), file.getId(), "https://datastudio.google.com/open/" + file.getId().toString(), i]);
                i++
            }
        }
    }

//create spreadsheet view of results data
    var rows = results.length
    sheet.getRange(1, 1, 1, 9).setValues([
        ["DS file name", "File Type", "File Id", "Link to file", "Change owner", "New Owner Email Address", "Notify New owner?", "Note", "Row Number"]
    ])
    //lazy column 5 gets overwritten
    //lazy pasting row number so I can pick it up rather than work it out
    sheet.getRange(2, 1, rows, 5).setValues(results)
    //lazy copy to end column
    sheet.getRange(2, 9, rows, 1).setValues(sheet.getRange(2, 5, rows, 1).getValues())
    //set validation on transfer ownership? and send email? columns
    setListValidation(sheet.getRange(2, 5, rows, 1), ["Yes", "No"])
    var noArray = fillArray(["No"], rows)
    sheet.getRange(2, 5, rows, 1).setValues(noArray)
    setListValidation(sheet.getRange(2, 7, rows, 1), ["Yes", "No"])
    sheet.getRange(2, 7, rows, 1).setValues(noArray)
    sheet.autoResizeColumns(1, 7);
    trimSheet("dsFiles")
}

function transferDataStudioFiles() {
    var sheet = SS.getSheetByName("dsFiles")
    var lastRow = sheet.getMaxRows()
    var sheet = SS.getSheetByName("dsFiles")
    var DSfiles = sheet.getRange(2, 1, lastRow - 1, 9).getValues() //get all data from sheet
    var filesToTransfer = [];

    for each(var row in DSfiles) {
        if (row[4] != "No" & row[5] != "") {//check if file is to be transfered
            filesToTransfer.push(row)
        };
    }
    for each(var id in filesToTransfer) {
        var dsFile = DriveApp.getFileById(id[2]) //get info about file from google drive via the file ID
        var position = id[8] + 1 // get position of the file within the spreadsheet
        try {
            dsFile.setOwner(id[5]); //attempt to change ownsership
          
            var output = "Owner change to " + id[5] + " completed" //paste that ownser change has been made
            
    
            if (id[6] == "Yes") {//check if email should be sent
                MailApp.sendEmail(id[5], "Data Studio data source transfered", "The following DS file has been transferred to your ownership " + id[0] + " .       " + "Go here " + id[3] + " to complete transfer");
                var output = "Owner change to " + id[5] + " completed & email sent" //overwrite the output if email has been sent
                sheet.autoResizeColumns(1, 8);
                Logger.log("success with email")
            }
        } catch (e) {
          //If there's an error in setting ownsership then write the error message output
            var output = "Error: " + e

            // Logs an ERROR message.
            Logger.log(output)
        }
//      add output to the sheet
        sheet.getRange(position, 8).setValue(output);



    }



}
