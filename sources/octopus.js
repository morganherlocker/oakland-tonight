var cheerio = require("cheerio");
var request = require("request");
var moment = require("moment");

var url = "https://oaklandoctopus.org/calendar";
var shows = [];

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body);
    $("td.single-day").each(function() {
      var date = $(this).attr("data-date");

      $(this)
        .find("span.field-content")
        .each(function() {
          var show = {
            venue: "The Octopus",
            venueURL: "https://oaklandoctopus.org",
            title: "",
            url:
              "https://oaklandoctopus.org" +
              $(this)
                .find("a")
                .attr("href"),
            date: date
          };

          var text = $(this)
            .text()
            .trim();
          text.split(" ").forEach(function(word) {
            if (word.indexOf("pm") !== -1 || word.indexOf("PM") !== -1)
              show.time = word;
            else if (word.indexOf("$") !== -1) show.price = word;
            else show.title += word + " ";
          });

          show.title = show.title.trim();

          if (show.title.length > 1) shows.push(show);
        });
    });

    done(null, shows);
  });
};

module.exports;
