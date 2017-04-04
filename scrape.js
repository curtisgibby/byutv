var fs = require('fs');
var moment = require('moment-timezone');
var request = require('request');
var $ = require('cheerio')
var chalk = require('chalk');

require('./getShowGuidFromTitle.js').getShowGuidFromTitle(scrape);

function scrape(showGuid) {
  var url = 'http://www.byutv.org/show/' + showGuid + '?airdates=true';

  request(url, function(err, resp, html){
    if (err) return console.error(err)
    var $html = $.load(html)

    $html('section.airdates-widget section.view section').map(function(i, episode) {
      // console.log("episode : ", episode); //debug!
      var title = $(episode).find('h1').first().text().replace(/\s\s+/g, ' ').trim();
      var description = $(episode).find('p').attr('title');
      // var description = $(episode).find('p').attr('title').replace(/\s\s+/g, ' ').trim();
      if (typeof description == 'undefined') {
        return false;
      }
      description = description.replace(/«/g, "'").trim();
      var airdate = $(episode).find('time').first().attr('datetime');
      airdate = moment(airdate).tz("America/Denver").format('YYYY-MM-DD HH:mm:ss');
      console.log(chalk.blue.bold("\n----------------------------------------- EPISODE -----------------------------------------"));
      console.log(chalk.green("\ntitle\n-----"));
      console.log(title);
      console.log(chalk.green("\ndescription\n-----------"));
      console.log(description);
      console.log(chalk.green("\nairdate\n-------"));
      console.log(airdate);
    })
  });
}