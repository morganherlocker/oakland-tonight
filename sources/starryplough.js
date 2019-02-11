var cheerio = require("cheerio");
var request = require("request");
var moment = require("moment");

var url = "http://www.thestarryplough.com/calendar/";
var shows = [];

module.exports = function(done) {
  request(
    {
      url: url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:41.0) Gecko/20100101 Firefox/41.0"
      }
    },
    function(err, response, body) {
      var $ = cheerio.load(body);
      $(".eventlist-event.eventlist-event--upcoming").each(function() {
        var show = {
          venue: "The Starry Plough",
          venueURL: "http://www.thestarryplough.com/",
          date: $(this)
            .find(".event-date")
            .attr("datetime"),
          time: $(this)
            .find(".event-time-12hr-start")
            .text()
            .trim(),
          url:
            "http://www.thestarryplough.com" +
            $(this)
              .find(".eventlist-title-link")
              .attr("href")
        };
        show.title = $(this)
          .find(".eventlist-title")
          .text()
          .split(":");
        show.title.shift();
        show.title = show.title.join(":").trim();
        shows.push(show);
      });

      done(null, shows);
    }
  );
};
