const request = require("request");
const moment = require("moment");

var url =
  "http://thegoldenbullbar.com/api/get-shows/{{MM}}/{{YYYY}}?callback=JSON_CALLBACK";
var shows = [];

module.exports = function(done) {
  url = url.split("{{MM}}").join(moment().format("MM"));
  url = url.split("{{YYYY}}").join(moment().format("YYYY"));

  request(url, (err, response, body) => {
    const data = JSON.parse(body).data;

    shows = data.map(item => {
      console.log(item);
      var show = {
        venue: "The Golden Bull",
        venueURL: "http://thegoldenbullbar.com/",
        title: item.title,
        url: "http://thegoldenbullbar.com/shows/" + item._id,
        date: moment(new Date(item.date)).format("YYYY-MM-DD"),
        time: item.time
      };

      item.description.split(" ").forEach(word => {
        if (word.indexOf("$") !== -1) show.price = word;
        else if (word.toLowerCase().indexOf("free") !== -1) show.price = "FREE";
      });

      return show;
    });
    console.log(shows);
    done(null, shows);
  });
};
