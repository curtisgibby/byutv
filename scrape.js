var fs = require('fs');
var request = require('request');
var $ = require('cheerio')
var chalk = require('chalk');

// var showGuid = '2f11a156-dfaa-454c-a104-60165b2a5625'; // Random Acts
var showGuid = 'c68c4e4f-6322-4a23-8b8e-a5be75b70635'; // Studio C
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
    console.log(chalk.blue.bold("\n----------------------------------------- EPISODE -----------------------------------------")); //debug!
    console.log(chalk.green("\ntitle\n-----")); //debug!
    console.log(title); //debug!
    console.log(chalk.green("\ndescription\n-----------")); //debug!
    console.log(description); //debug!
    console.log(chalk.green("\nairdate\n-------")); //debug!
    console.log(airdate); //debug!

  })
});
