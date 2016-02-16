var request = require('request')
var ical = require('ical.js')


var url = 'http://cafevankleef.com/events/?ical=1&tribe_display=month'
var shows = []
module.exports = function(done){
  request(url, function(err,response,body){
    var icalData = ical.parse(body);
    var vcalendar = new ICAL.Component(icalData);
    var events = vcalendar.getAllSubcomponents('vevent')
    for (var event of events) {
      var show = {
        venue: 'Cafe Van Kleef',
        venueURL: 'http://cafevankleef.com/'
      }
      show.title = event.getFirstPropertyValue('summary');

      //Date
      var date = event.getFirstPropertyValue('dtstart').toJSDate()
      var year = date.getFullYear()
      var month = (1 + date.getMonth()).toString()
      month = month.length > 1 ? month : '0' + month
      var day = date.getDate().toString()
      day = day.length > 1 ? day : '0' + day
      show.date =  year + '-' + month + '-' + day

      //time
      var hour = date.getHours()
      var mod = ' pm'
      if (hour < 12) {
        mod = ' am'
      }
      var min = date.getMinutes().toString()
      min = min.length > 1 ? min : '0' + min
      show.time = (hour%12).toString() + ':' + min +  mod

      //url
      show.url = event.getFirstPropertyValue('url')

      shows.push(show)
    }

    done(err, shows)
  })

}

module.exports(function(err,shows){
  console.log(shows)
})
