var cheerio = require('cheerio')
var request = require('request')
var moment = require('moment')

var url = 'http://thenewparish.com/shows.cfm'
var shows = []

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body)
    $('li.useShortDescLink').each(function(){
      var show = {
        venue: 'The New Parish',
        venueURL: 'http://thenewparish.com/'
      }
      var year = (new Date()).getFullYear()
      var month = $(this).find('.dateFld').text()
        .split('\n').join('')
        .trim().split(' ')[1]
        .split('/')[0]
      if(month.length === 1) month = '0'+month
      var day = $(this).find('.dateFld').text()
        .split('\n').join('')
        .trim().split(' ')[1]
        .split('/')[0]
      if(day.length === 1) day = '0'+day
      show.date = year+'-'+month+'-'+day

      show.title = $(this).find('strong.title').text().trim()
      show.time = $(this).find('.doorTime').text()
        .split('(').join('')
        .split(')').join('')
        .split('Doors open at').join('').trim()
      show.url = $(this).find('.buy').attr('href')
      shows.push(show)
    })

    done(null, shows)
  })
}