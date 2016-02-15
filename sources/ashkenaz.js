var cheerio = require('cheerio')
var request = require('request')

var shows = []

var options = {
  url: 'http://www.ashkenaz.com/',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.47 Safari/537.36'
  }
}

module.exports = function(done) {
  request(options, function(err, response, body){
    var $ = cheerio.load(body)
    //console.log(body)
    $('*[class^="event-week"]').each(function(i, item){
      var show = {
        venue: 'Ashkenaz',
        venueURL: 'http://www.ashkenaz.com/'
      }

      //Get Title
      $(this).find('.event-subdescription').each(function(i, div){
        console.log($(div).text())
        show.title = $(div).text()
      })

      $(this).find('.event-name').each(function(i, div){
        if (show.title) {
          show.title = show.title + ' - '
        } else {
          show.title = ''
        }
        show.title = show.title + $(div).text()
      })

      $(this).find('.artist.opening').each(function(i, div){
        show.title = show.title + ' ' + $(div).text()
      })

      $(this).find('.artist.headliner').each(function(i, div){
        show.title = show.title + ' ' + $(div).text()
      })

      //Get Date
      $(this).find('.day11').each(function(i, div){
        var dateText = $(div).text()

        var year = (new Date()).getFullYear().toString()
        dateText = dateText.split(',')[1] + ' ' + year
        var date = new Date(Date.parse(dateText))
        var month = (date.getMonth()+1).toString()
        if(month.length === 1) month = '0' + month
        var day = date.getDate().toString()
        if(day.length === 1) day = '0' + day
        show.date = date.getFullYear().toString() + '-' + month + '-' + day
      })

      //Get time and price
      $(this).find('.time-price').each(function(i, div){
        var price = ''
        $(div).find('br').each(function(i, br){

          var timeprice = $(br).get( 0 ).nextSibling.nodeValue.trim()
          if (timeprice.indexOf('Show at') > -1) {
            show.time = timeprice.split('Show at ')[1]
          }
          else if (timeprice.indexOf('$') > -1) {
            if (price.length > 0) {
              price = price + ' - '
            }
            price = price + timeprice
          }

        })
        if (price.length > 0) {
          show.price = price.trim()
        }
      })
      shows.push(show)
    })
    done(err, shows)
  })
}
