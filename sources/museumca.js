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
var url = 'http://museumca.org/events/all'
var shows = []

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body)
    $('.views-row-inner').each(function(){
      var show = {
        venue: 'Oakland Museum of CA',
        venueURL: 'http://museumca.org/',
        date: moment($(this).find('.date-display-single').attr('content')).format('YYYY-MM-DD'),
        time: $(this).find('.date-display-single').last().text().trim(),
        title: $(this).find('.list-omca-title').text().trim(),
        url: 'http://museumca.org'+$(this).find('.list-omca-title').children().first().attr('href')
      }
      if(show.title) shows.push(show)
    })

    done(null, shows)
  })
}