var request = require('request')
var moment = require('moment')

var url = 'http://thegoldenbullbar.com/?rhc_action=get_calendar_events&post_type[]=events'
var shows = []

module.exports = function(done) {
  var params = {
    start: Math.round(+moment().format('x')/1000).toString(),
    end: Math.round(+moment().add(1, 'M').format('x')/1000).toString(),
    view: 'month',
    rhc_shrink: '1',
    _: '629d2aa861fe15daf376f69823073a3b'
  }

  request.post(url, {form: params}, function(err, response, body) {
    var events = JSON.parse(body).EVENTS

    events.forEach(function(event){
      var show = {
        venue: 'The Golden Bull',
        venueURL: 'http://thegoldenbullbar.com/',
        title: '',
        url: event['8'] || event['7'],
        date: event['3'].split(' ')[0],
        time: '',
        price: ''
      }

      if(show.url) show.url = show.url[0]
      else show.url = 'http://thegoldenbullbar.com/upcoming/'

      event['2'].split(' ').forEach(function(word){
        if (word.indexOf('pm') !== -1 || word.indexOf('PM') !== -1) show.time = word
        else if (word.indexOf('$') !== -1) show.price = word
        else if (word.toLowerCase().indexOf('free') !== -1) show.price = 'FREE'
        else show.title += word + ' '
      });

      show.title = show.title.trim()

      shows.push(show)
    })

    done(null, shows)
  })
}
