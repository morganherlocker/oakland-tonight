var cheerio = require("cheerio");
var request = require("request");

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
var url = "http://www.thefoxoakland.com/calendar.php";
var shows = [];

module.exports = function(done) {
  request(url, function(err, response, body) {
    var $ = cheerio.load(body);
    $(".concert_calendar")
      .find("tr")
      .each(function() {
        var show = {
          venue: "The Fox Theater Oakland",
          venueURL: "http://www.thefoxoakland.com/"
        };
        $(this)
          .find("td")
          .each(function(i, td) {
            var text = $(td).text();
            if (i === 0 && text) {
              var year = new Date().getFullYear();
              var month = (
                months.indexOf(text.split(",")[1].split(" ")[0]) + 1
              ).toString();
              if (month.length === 1) month = "0" + month;
              var day = text.split(",")[1].split(" ")[1];
              if (day.length === 1) day = "0" + day;
              show.date = year + "-" + month + "-" + day;
            } else if (i === 1 && text) {
              if (
                $(td)
                  .find("a")
                  .attr("href")
              )
                show.url =
                  "http://www.thefoxoakland.com/" +
                  $(td)
                    .find("a")
                    .attr("href");
              var headliner = $(td)
                .find(".headliner")
                .text()
                .trim();
              headliner = headliner
                .split(
                  $(td)
                    .find(".headliner")
                    .find(".prepend")
                    .text()
                )
                .join("");
              var warmup = "";
              $(td)
                .find(".warmup")
                .contents()
                .each(function() {
                  if ($(this).text())
                    warmup +=
                      $(this)
                        .text()
                        .trim() + " ";
                });
              warmup = warmup.trim();
              if (warmup.substring(0, 4) === "with")
                warmup = warmup.substring(5, warmup.length);
              show.title = headliner;
              if (warmup) show.title += " w/ " + warmup;
            } else if (i === 2) {
              show.time = text
                .split("show")
                .join("")
                .trim();
            }
          });
        if (show.date && show.title) shows.push(show);
      });

    done(null, shows);
  });
};
