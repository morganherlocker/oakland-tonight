var request = require('request')
var moment = require('moment')

var url = 'https://tockify.com/api/readEventView?calname=comedyinoakland&max=12&start-inclusive=true&startms='+moment().format('x')
var shows = []

module.exports = function(done) {
  request(url, function(err, response, body) {
    var events = JSON.parse(body).events

    events.forEach(function(event){
      var show = {
        venue: 'Comedy Oakland',
        venueURL: 'http://www.comedyoakland.com/',
        title: event.content.summary.text + ' @ ' + event.content.place,
        url: event.content.customButtonLink,
        date: moment(event.when.start.millis).format('YYYY-MM-DD'),
        time: moment(event.when.start.millis).format('h:mm a')
      }

      shows.push(show)
    })

    done(null, shows)
  })
}
