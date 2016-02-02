var fs = require('fs')
var queue = require('queue-async')
var childProcess = require('child_process')
var moment = require('moment')

var page = fs.readFileSync(__dirname+'/template.html', 'utf8')

fs.readdir(__dirname+'/sources', function(err, dirs){
  var q = queue(10)
  dirs.forEach(function(dir){
    var fn = require(__dirname + '/sources/' + dir)
    q.defer(fn)
  })
  q.awaitAll(function(errs, results){
    var shows = []
    results.forEach(function(venue){
      shows = shows.concat(venue)
    })

    shows.sort(function(a, b){
      if(a.date > b.date) return 1
      else return -1
    })

    var today = new Date()
    var year = today.getFullYear().toString()
    var month = (today.getMonth() + 1).toString()
    if(month.length === 1) month = '0' + month
    var day = today.getDate().toString()
    if(day.length === 1) day = '0' + day
    var oneWeek = moment(year+'-'+month+'-'+day).add(8, 'days').format('YYYY-MM-DD')

    var venueHash = {};
    shows.forEach(function(show){
      if(!venueHash[show.venue]) venueHash[show.venue] = {venue: show.venue, venueURL: show.venueURL, tonight: [], soon: []}
      if(show.date === year+'-'+month+'-'+day)
        venueHash[show.venue].tonight.push(show)
      else if(show.date > year+'-'+month+'-'+day && show.date <= oneWeek)
        venueHash[show.venue].soon.push(show)
    })
    venues = Object.keys(venueHash).map(function(key){
      return venueHash[key]
    })

    var html = ''
    html += '<h1>TONIGHT'
    html += '<span id="date">' + moment().format('M/D') +'</span></h1>'
    html += '<div id="tonight">'

    venues.forEach(function(venue){
      if(venue.tonight.length > 0) html += '<h3><a class="venue-link" href="'+venue.venueURL+'">'+venue.venue+'</a></h3>'
      venue.tonight.forEach(function(show, i){
        if(i > 0) html += '<hr>'
        html += '<div class="show">'
        html += '<h4><a class="show-link" href="'+show.url+'">'+show.title+'</a></h4>'
        html += '<div>'+show.time+'</div>'
        if(show.price) html += '<div>'+show.price+'</div>'
        html += '</div>'
      })
    })

    html += '</div>'

    html += '<h1>NEXT WEEK'
    html += '<span id="date">' + moment().add(1, 'day').format('M/D') + '-' + moment().add(8, 'days').format('M/D') + '</span></h1>'
    html += '<div id="soon">'

    venues.forEach(function(venue){
      if(venue.soon.length > 0) html += '<h3><a class="venue-link" href="'+venue.venueURL+'">'+venue.venue+'</a></h3>'
      venue.soon.forEach(function(show, i){
        if(i > 0) html += '<hr>'
        html += '<div class="show">'
        html += '<h4><a class="show-link" href="'+show.url+'">'+show.title+'</a></h4>'
        html += '<div>'+show.date.split('-')[1]+'/'+show.date.split('-')[2]+'/'+show.date.split('-')[0]+'</div>'
        html += '<div>'+show.time+'</div>'
        if(show.price) html += '<div>'+show.price+'</div>'
        html += '</div>'
      })
    })

    html += '</div>'

    page = page.split('{{content}}').join(html)

    fs.writeFileSync(__dirname+'/index.html', page)
  })
})