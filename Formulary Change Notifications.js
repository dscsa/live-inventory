function formularyChangeNotification() {
   
    var ssheet  = SpreadsheetApp.getActiveSpreadsheet()
    var live    = ssheet.getSheetByName('Live Inventory')
    var cache   = ssheet.getSheetByName('Historic')
    var lastCol = cache.getLastColumn()
    var lastRow = cache.getLastRow()

    var data = live.getRange('B1:C').getValues()
    
    var merge = []
    for (var i in data) {
      if ( ! data[i][0]) continue
      merge.push([data[i][0]+'~'+(data[i][1] || 'Published')])
    }
                            
    merge[0] = [new Date().toJSON().slice(0, 10)]  
    
    //Logger.log(JSON.stringify(merge, null, " "))
    
    var cached = cache.getRange(1, lastCol, lastRow, 1).getValues() 
    cache.getRange(1, lastCol+1, merge.length, 1).setValues(merge)
    
    //Since cached is a 2d array we can't just do an indexOf() so since we have to convert might as well be an object for fatest lookup.
    cached = cached.slice(1).reduce(function(map, row) { 
      row = row[0].split('~') 
      map[row[0]] = row[1]
      return map
    }, {})
  
    //Logger.log(JSON.stringify(cached, null, " "))
    
    var added   = []
    var removed = []
    var changes = []
    for (var i = 1; i < merge.length; i++) {
      var drug = merge[i][0].split('~')
      if (cached[drug[0]] == drug[1]) continue
      
      changes.unshift({
        drug:drug[0],
        newStock:drug[1],
        oldStock:cached[drug[0]]
      })
      
      if (changes[0].newStock == 'Published') added.unshift(drug[0])
      if (changes[0].oldStock == 'Published') removed.unshift(drug[0])
    }
  
    added   = added.length ? '<br>'+added.join('<br>') : ' None'
    removed = removed.length ? '<br>'+removed.join('<br>') : ' None'
    changes = changes.length ? '<br><pre>'+JSON.stringify(changes, null, " ")+'</pre>' : ' None'
  
    Logger.log('Added'+added)
    Logger.log('Removed'+removed)
    Logger.log('Changes'+changes)
    
    try {
      MailApp.sendEmail({
        name:'Good Pill Pharmacy',
        to:'stockchanges@goodpill.org',
        bcc:'adam@sirum.org',
        subject:'Stock changed for the following medications',
        htmlBody:'<b>Added:</b>'+added+'<br><br><b>Removed:</b>'+removed+'<br><br><b>All Changes:</b>'+changes
      })
    } catch (e) {
      //TODO confirm this by checking if error matches "Email quota likely reached Exception: Service invoked too many times for one day: email."  "
      Log('Email Not Sent: Quota likely reached', e)
    }

    //
}
