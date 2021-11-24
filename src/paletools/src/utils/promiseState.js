export default function(promise, callback) {
    // Symbols and RegExps are never content-equal
    var uniqueValue = window['Symbol'] ? Symbol('unique') : /unique/
  
    function notifyPendingOrResolved(value) {
      if (value === uniqueValue) {
        return callback('pending')
      } else {
        return callback('fulfilled')
      }
    }
  
    function notifyRejected(reason) {
      return callback('rejected')
    }
    
    var race = [promise, Promise.resolve(uniqueValue)]
    Promise.race(race).then(notifyPendingOrResolved, notifyRejected)
  }