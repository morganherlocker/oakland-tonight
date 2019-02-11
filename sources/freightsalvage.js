var cheerio = require("cheerio");
var request = require("request");
var moment = require("moment");

var url =
  "http://www.freightandsalvage.org/event/" +
  moment().format("YYYY/MM/DD") +
  "/month/all/all/";
var shows = [];

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body);
    $(".event.monthview.vevent").each(function() {
      var show = {
        venue: "Freight & Salvage",
        venueURL: "http://www.freightandsalvage.org/",
        title: $(this)
          .find(".title.summary")
          .text()
          .trim(),
        date: moment(
          $(this)
            .find(".start.dtstart")
            .attr("title")
        ).format("YYYY-MM-DD"),
        time: $(this)
          .find(".start.dtstart")
          .text()
          .trim(),
        url:
          "http://www.freightandsalvage.org" +
          $(this)
            .find(".title.summary")
            .children()
            .first()
            .attr("href")
            .trim(),
        price: $(this)
          .find(".pricelink")
          .text()
          .trim()
      };
      shows.push(show);
    });

    done(null, shows);
  });
};
