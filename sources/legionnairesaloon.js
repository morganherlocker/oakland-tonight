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
var url = 'http://legionnairesaloon.com/'
var shows = []

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body)
    $('div.event-description').each(function(){
      var show = {
        venue: 'The Legionnaire Saloon',
        venueURL: 'http://legionnairesaloon.com/',
        title: $(this).find('.event-info.title').text().trim(),
        url: $(this).find('.zoogle-share').attr('data-url').trim(),
        time: $(this).find('.time').first().text().trim()
      }
      var year = (new Date()).getFullYear()
      var month = (months.indexOf($(this).find('.date').first().text().trim().split(' ')[1]) + 1).toString()
      if(month.length === 1) month = '0' + month
      var day = $(this).find('.date').first().text().trim().split(' ')[2]
      if(day.length === 1) day = '0' + day
      show.date = year+'-'+month+'-'+day
      shows.push(show)
    })

    done(null, shows)
  })
}