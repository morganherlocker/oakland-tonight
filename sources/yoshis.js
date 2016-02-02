var cheerio = require('cheerio')
var request = require('request')
var moment = require('moment')

var url = 'http://www.yoshis.com/calendar/'
var shows = []

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body)
    $('.data.vevent').each(function(){
      var date = $(this).find('.value-title').attr('title').split('T')[0]
      $(this).find('.one-event').each(function(){
        var show = {
          venue: 'Yoshi\'s',
          venueURL: 'http://www.yoshis.com/'
        }
        show.time = $(this).find('.start-time').text().trim()
        show.title = $(this).find('.headliners.summary').text()
        show.url = 'http://www.yoshis.com'+$(this).find('.headliners.summary').children().first().attr('href')
        show.date = date

        shows.push(show)
      })
    })

    done(null, shows)
  })
}