
/**
* Global Variables.
* Availabile to all functions in all .gs script files. 
*/

SS = SpreadsheetApp.getActiveSpreadsheet();
CONFIG = SS.getSheetByName("Input_sheet");
userIdTypeValue = CONFIG.getRange("A6").getValue();
webPropertyId = CONFIG.getRange("B4").getValue();
AccountId = CONFIG.getRange("b2").getValue();
PROPERTIES = SS.getSheetByName("Properties_sheet");





switch(userIdTypeValue) {
  case "Client ID":
    var userIdType = "CLIENT_ID"
    break;
  case "User ID":
    var userIdType = "USER_ID"
    default:
    var userIdType = "CLIENT_ID"  
    }



function deleteManyUsers(){
  var propertyName = getPropertyName()
  // Display a dialog box with a title, message, input field, and "Yes" and "No" buttons. The
  // user can also close the dialog by clicking the close button in its title bar.
  var ui = SpreadsheetApp.getUi();
  var lastRow = CONFIG.getLastRow();
  var numberOfUserIDs = lastRow-7
  var response = ui.alert("You are about to delete "+ numberOfUserIDs+" users from the "+propertyName+" property.", ui.ButtonSet.OK_CANCEL);
  
  // Process the user's response.
  if (response == ui.Button.OK) {
    removeEmptyRows(CONFIG)
    var dataArray = getData();
    var i = 0
    dataArray.forEach(function (data) {
      try {
        data = createObject(data);
        var response = deleteGAUser(userIdType,data.userId,webPropertyId)
        CONFIG.getRange(i+8, 2).setValue("User ID "+response.id.userId+" webPropertyId = "+response.webPropertyId+" "+"deletionRequestTime = "+response.deletionRequestTime)
      } 
      catch(e) {
        var errorMsg = "User deletion Error: " + e.message;
        CONFIG.getRange(i+8, 2).setValue(errorMsg)
      }
      i = i + 1
    }
                     )
    
  } else {
    Logger.log('The user clicked "No" or the dialog\'s close button.');
  }
}

/**
* Deletes one specified user from a spefic Google analytics property.
*
* @param {string} userIdtype The type of userID that identifies specific users to be deleted CLIENT_ID or USER_ID
* @param {string} userId The userID of the user to be deletd
* @param {string} webPropertyId The webproperty ID from which the user will be deleted
*/
function deleteGAUser(userIdtype,userId,webPropertyId) {
var output = Analytics.UserDeletion.UserDeletionRequest.upsert({id:{type:userIdtype, userId:userId}, webPropertyId:webPropertyId, kind:"analytics#userDeletionRequest"})
return(output)
}


/**
* Reads data from ID sheet and transposes to horizontal array
* @return {Array} ID - IDs and rtpyes read from Sheet
*/
function getData(){
  if(CONFIG.getLastColumn() >= 1) {
    var data = CONFIG.getRange(8, 1, CONFIG.getLastRow()-7, 1).getValues();
    var dataArray = (data);
    Logger.log(dataArray)
    return(dataArray);
  } else {
    throw new Error( "No data found." );
  };
}



function createObject(a) {
  var data = {};
  data.userId = a[0];
  return(data);
  
}

function removeEmptyRows(){
  var maxRows = CONFIG.getMaxRows(); 
  var lastRow = CONFIG.getLastRow();
  if(maxRows-lastRow>0){CONFIG.deleteRows(lastRow+1, maxRows-lastRow)};
  
  
}

