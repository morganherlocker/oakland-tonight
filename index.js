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

    var html = '<h1>TONIGHT</h1>'
    shows.forEach(function(show){
      if(show.date === year+'-'+month+'-'+day) {
        html += '<div class="show tonight"><hr>'
        html += '<h3><a class="show-link" href="'+show.url+'">'+show.title+'</a></h3>'
        html += '<h4><a class="venue-link" href="'+show.venueURL+'">'+show.venue+'</a></h4>'
        html += '<div>'+show.time+'</div>'
        html += '</div>'
      }
    })
    html += '<h1>NEXT WEEK</h1>'
    var oneWeek = moment(year+'-'+month+'-'+day).add(7, 'days').format('YYYY-MM-DD')
    shows.forEach(function(show){
      if(show.date > year+'-'+month+'-'+day && show.date <= oneWeek){
        html += '<div class="show soon"><hr>'
        html += '<h3><a class="show-link" href="'+show.url+'">'+show.title+'</a></h3>'
        html += '<h4><a class="venue-link" href="'+show.venueURL+'">'+show.venue+'</a></h4>'
        html += '<div>'+show.date.split('-')[1]+'/'+show.date.split('-')[2]+'/'+show.date.split('-')[0]+'</div>'
        html += '<div>'+show.time+'</div>'
        html += '</div>'
      }
    })

    page = page.split('{{content}}').join(html)

    fs.writeFileSync(__dirname+'/index.html', page)
  })
})