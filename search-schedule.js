var chalk = require('chalk');
// var fs = require('fs');
// var Jimp = require("jimp");
var moment = require('moment-timezone');
var request = require('request');
// var sanitize = require('sanitize-filename');

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
    // console.log("itemsSeenPreviously : ", itemsSeenPreviously); //debug!

    // var mostRecentSeason = false;
    // lists = jsonContent.lists;
    // Object.keys(lists).forEach(function(key) {
    //   list = lists[key];
    //   if (list.type == 'ShowSeason' && mostRecentSeason == false) {
    //     mostRecentSeason = true;
    //     getApiDataForSeason(list.id);
    //   }
    // });
  }
});



// function getApiDataForSeason(seasonid) {
//   var url = 'https://api.byutv.org/api3/list/getlistitems?start=0&limit=20&channel=byutv&listid=' + seasonid;

//   var options = {
//     url: url,
//     headers: {
//       'x-byutv-context': 'web$US',
//       'x-byutv-platformkey': 'xsaaw9c7y5',
//       'content-type': 'application/json',
//     }
//   };

//   request(options, function(err, resp, body){
//     if (!err && resp.statusCode == 200) {
//       var jsonContent = JSON.parse(body);

//       var i = 1;
//       if (process.argv.length >= 4) {
//         i = parseInt(process.argv[3]);
//       }

//       var episode = jsonContent.items[i - 1];
//       var airdate = moment(episode.premiereDate).tz("America/Denver").format('YYYY-MM-DD HH:mm:ss');

//       console.log(chalk.blue.bold("\n----------------------------------------- EPISODE -----------------------------------------"));
//       console.log(chalk.green("\nname\n----"));
//       console.log(episode.subtitle);
//       console.log(chalk.green("\ndescription\n-----------"));
//       console.log(episode.description);
//       console.log(chalk.green("\nairdate\n-------"));
//       console.log(airdate);

//       var images = episode.images[0].images;
//       Object.keys(images).forEach(function(key) {
//         image = images[key]; // ends up with the largest one
//       });

//       var originalFilename = sanitize(episode.subtitle) + '.' + image.size + '.jpg';
//       downloadFile(image.url, originalFilename, function(){
//         var outputFilename = sanitize(episode.subtitle) + '.400x225.jpg';
//         Jimp.read(originalFilename, function (err, image) {
//             if (err) throw err;
//             image.resize(400, 225) // resize
//                  .write(outputFilename); // save
//         });
//         console.log(chalk.green("\nimage\n-----"));
//         console.log("saved file to", outputFilename);
//       });
//     }
//   });
// }

// var downloadFile = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   });
// };
