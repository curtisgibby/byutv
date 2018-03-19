var chalk = require('chalk');
var moment = require('moment-timezone');
var request = require('request');

var rawTitle = 'Studio C';
if (process.argv.length >= 3) {
  var rawTitle = process.argv[2];
}

var url = 'https://api.byutv.org/api3/schedule/searchschedule?start=0&limit=25&channel=byutv&query=' + rawTitle;

var options = {
  url: url,
  headers: {
    'x-byutv-context': 'web$US',
    'x-byutv-platformkey': 'xsaaw9c7y5',
    'content-type': 'application/json',
  }
};
request(options, function(err, resp, body){
  if (!err && resp.statusCode == 200) {
    var jsonContent = JSON.parse(body);
    items = jsonContent.items;
    itemsSeenPreviously = [];
    Object.keys(items).forEach(function(key) {
      item = items[key];
      if (itemsSeenPreviously.indexOf(item.episodeTitle) === -1) {
        itemsSeenPreviously.push(item.episodeTitle);
  
        var airdate = moment(item.begin).tz("America/Denver").format('YYYY-MM-DD HH:mm:ss');
        console.log(chalk.blue.bold("----------------------------------------- Episode -----------------------------------------"));
        console.log(chalk.green("name:"));
        console.log(item.episodeTitle);
        console.log(chalk.green("description:"));
        console.log(item.episodeDescription);
        console.log(chalk.green("airdate:"));
        console.log(airdate);
      }
    });
  }
});
