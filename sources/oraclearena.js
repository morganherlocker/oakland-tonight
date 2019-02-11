var cheerio = require("cheerio");
var request = require("request");
var moment = require("moment");

var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var url = "http://www.coliseum.com/venues/detail/oracle-arena";
var shows = [];

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body);
    $("div.entry").each(function() {
      var year = new Date().getFullYear();
      var month = (
        months.indexOf(
          $(this)
            .find(".date_wrapper")
            .text()
            .split(" ")[0]
            .trim()
        ) + 1
      ).toString();
      if (month.length === 1) month = "0" + month;
      var day = $(this)
        .find(".date_wrapper")
        .text()
        .split(" ")[1];
      if (day.length === 1) day = "0" + day;
      var time = $(this)
        .find(".date_wrapper")
        .text()
        .split(" ")[3]
        .trim();
      if (time.indexOf("PM") === -1 || time.indexOf("PM") === -1) time = "";
      var show = {
        venue: "Oracle Arena",
        venueURL: "http://www.coliseum.com/",
        date: year + "-" + month + "-" + day,
        title: $(this)
          .find("h3")
          .text()
          .trim(),
        url: $(this)
          .find("h3")
          .children()
          .first()
          .attr("href"),
        time: time
      };
      shows.push(show);
    });

    done(null, shows);
  });
};
