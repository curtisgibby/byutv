var chalk = require('chalk');
var moment = require('moment-timezone');
var request = require('request');

require('./getShowGuidFromTitle.js').getShowGuidFromTitle(scrape);

function scrape(showGuid) {
  var url = 'http://www.byutv.org/api/Television/GetShowEpisodesByDate?context=Android%24US%24Release&showGuid=' + showGuid;

  request(url, function(err, resp, body){
    if (!err && resp.statusCode == 200) {
      var jsonContent = JSON.parse(body);

      length = 10;
      if (jsonContent.length < length) {
        length = jsonContent.length;
      }
      for ( var i = 0; i < length; i++) {
        var episode = jsonContent[i];

        var airdate = moment(episode.premiereDate).tz("America/Denver").format('YYYY-MM-DD HH:mm:ss');
        console.log(chalk.blue.bold("\n----------------------------------------- EPISODE -----------------------------------------"));
        console.log(chalk.green("\nname\n----"));
        console.log(episode.name);
        console.log(chalk.green("\ndescription\n-----------"));
        console.log(episode.description);
        console.log(chalk.green("\nairdate\n-------"));
        console.log(airdate);
      }
    }
  });
}