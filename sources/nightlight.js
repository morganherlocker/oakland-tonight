var cheerio = require('cheerio')
var request = require('request')
var moment = require('moment')

var months = [
  'January', 
  'February', 
  'March', 
  'April', 
  'May', 
  'June', 
  'July', 
  'August', 
  'September', 
  'October', 
  'November', 
  'December']
var url = 'http://www.thenightlightoakland.com/'
var shows = []

module.exports = function(done) {
  request(url, function(err, response, body) {
    var year = (new Date()).getFullYear()
    var $ = cheerio.load(body)
    $('.home-event-item').each(function(){
      var month = (months.indexOf($(this).find('.date-month').text().trim()) + 1)
      if(month.length === 1) month = '0' + month
      var day = $(this).find('.date-date').text().trim()
      if(day.length === 1) day = '0' + day
      var date = year+'-'+month+'-'+day
      $(this).find('.venue-headliner').each(function(){
        var show = {
          venue: 'The Night Light',
          venueURL: 'http://www.thenightlightoakland.com/',
          title: $(this).text().trim(),
          date: date,
          url: $(this).children().first().attr('href'),
          time: $(this).parent().find('p').last().text().split('|')[0].trim()
        }
        if(show.title) shows.push(show)
      })
    })

    done(null, shows)
  })
}