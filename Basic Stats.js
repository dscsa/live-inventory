function recordBasicStats() {
  
    var ssheet = SpreadsheetApp.getActiveSpreadsheet()
    var stats  = ssheet.getSheetByName('Basic Stats')
   
    var data = stats.getRange('A2:I2').getValues()
    data[0][0] = new Date().toJSON().slice(0, 10)
    
    stats.getRange(stats.getLastRow()+1, 1, 1, 9).setValues(data)
}
