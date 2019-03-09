function triggerRefresh() {
  var date  = new Date()
  var sheet = SpreadsheetApp.openById('1gF7EUirJe4eTTJ59EQcAs1pWdmTm2dNHUAcrLjWQIpY').getSheetByName('Live Inventory')
   
  //Every ten minutes unless it didn't load properly
  try {
    if ( ! (date.getMinutes() % 10)) {
      refreshInventory(sheet, date)
    } else if (sheet.getRange("B2").isBlank()) {
      
      refreshInventory(sheet, date)
      
      MailApp.sendEmail({
        name:'Live Inventory',
        to:'adam@sirum.org',
        subject:'fixing refreshInventory failure',
        htmlBody:'fixing refreshInventory failure'
      })
    }
  } catch (e) {
    logger.log('Email quota may have been reached '+e.stack)
    MailApp.sendEmail({
      name:'Live Inventory',
      to:'adam@sirum.org',
      subject:'Script Error on Good Pill Live Inventory v2.1 CoreSheet',
      htmlBody:e.message+' '+e.stack+' '+'https://docs.google.com/spreadsheets/d/1gF7EUirJe4eTTJ59EQcAs1pWdmTm2dNHUAcrLjWQIpY/edit#gid=505223313'
    })
  }
}

function refreshInventory(sheet, date) {
   sheet.getRange("B1").setValue(date)
}
