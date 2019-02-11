var cheerio = require("cheerio");
var request = require("request");
var moment = require("moment");

var url =
  "https://sudoroom.org/wordpress/wp-admin/admin-ajax.php?action=WP_FullCalendar&type=event&start=" +
  moment()
    .subtract(1, "days")
    .format("YYYY-MM-DD") +
  "&end=" +
  moment()
    .add(10, "days")
    .format("YYYY-MM-DD");
var shows = [];

module.exports = function(done) {
  request(url, function(err, response, body) {
    var data = JSON.parse(body);
    data.forEach(function(item) {
      var show = {
        venue: "Sudo Room",
        venueURL: "https://sudoroom.org/",
        title: item.title,
        url: item.url,
        date: moment(item.start).format("YYYY-MM-DD"),
        time: moment(item.start).format("h:mm a")
      };
      shows.push(show);
    });
    done(null, shows);
  });
};
