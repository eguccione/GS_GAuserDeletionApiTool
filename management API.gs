function getPropertyName() {
  var request = Analytics.Management.Webproperties.get(AccountId,webPropertyId);
  return(request.name)
}


function setAccountsThatExist() {
  var request = Analytics.Management.Accounts.list()
  var names = request.items.map(function(a) {return a.name;});
  var ids = request.items.map(function(a) {return a.id;});
  var data = createManagementObject(names,ids)
  var names = [names]
  var numberOfRows = names[0].length
  var transNames = transposeSheetsDataRange(names)
  var ids = [ids]
  var transIds = transposeSheetsDataRange(ids)
  PROPERTIES.getRange(2,1,numberOfRows,1).setValues(transNames)
  PROPERTIES.getRange(2,2,numberOfRows,1).setValues(transIds)
  Logger.log(transNames[[0]])
  CONFIG.getRange(2,1).setValue(transNames[[0]])

 printAllProperties()
  
}


  
  
function printAllProperties(){
  var lastRow = PROPERTIES.getLastRow();
  PROPERTIES.getRange(2,3,lastRow-1,3).clear()
  var request = Analytics.Management.Accounts.list()
  var names = request.items.map(function(a) {return a.name;});
  var ids = request.items.map(function(a) {return a.id;});
  
  ids.forEach(function (data) { 
    var request = Analytics.Management.Webproperties.list(data).items
    request.forEach(function (data) { 
      var i = 1
      var range = PROPERTIES.getRange("C1:C").getValues();
      var lastInRange = range.filter(String).length;
      PROPERTIES.getRange(lastInRange+i,3,1,3).setValues([[data.accountId,data.name,data.id]])
      var i = i +1
    })
  })
getPropertiesForValidation()
 
}

function getAccountId(NAME){
  var request = Analytics.Management.Accounts.list()    
  Logger.log(NAME)
  var names = request.items.map(function(a) {return a.name;});
  Logger.log(names)
  var ids = request.items.map(function(a) {return a.id;});
  Logger.log(ids)
  var arrayPosition = names.indexOf(NAME);
  return(ids[arrayPosition]);
  
}


function onEdit(e){
  if(e.range.getA1Notation() == 'A2' && 
     e.range.getSheet().getName() == 'Input_sheet'
  ) 
    CONFIG.getRange(4,1).clear()
getPropertiesForValidation()
}


function getPropertiesForValidation(){
   var lastRow = PROPERTIES.getLastRow();
  var start =PROPERTIES.getRange(1,8).getValues()
  var length =PROPERTIES.getRange(2,8).getValues()
  Logger.log(start)
  Logger.log(length)

  var propertyNames =PROPERTIES.getRange(start,4,length,1).getValues()
  setListValidation(CONFIG.getRange(4, 1), propertyNames);}



function setListValidation(range, values) {
  range.setDataValidation(SpreadsheetApp.newDataValidation()
                          .setAllowInvalid(false)
                          .requireValueInList(values, true)
                          .build());
}











function createManagementObject(a,b) {
  var data = {};
  data.names = a[0];
  data.ids = b[0];
  return(data);
  
}


/**
* Transposes vertical array of Sheets cells and returns a horizontal array. 
* @param {Array} range - Vertical array of alert configurations
*/
function transposeSheetsDataRange(range){
  return Object.keys(range[0]).map( function (column) { 
    return range.map(function (row) { 
      return row[column];
    });
  });
}


