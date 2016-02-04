var cheerio = require('cheerio')
var moment = require('moment')
var childProcess = require('child_process')

var url = 'http://www.yoshis.com/calendar/'
var shows = []

module.exports = function(done) {
 /* childProcess.exec('curl --socks5 189.219.180.61:10000 '+url, function(err, stdout, stderr) {
    var $ = cheerio.load(stdout)
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
*/
    done(null, shows)
 // })
}
