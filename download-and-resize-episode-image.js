var chalk = require('chalk');
var fs = require('fs');
var Jimp = require("jimp");
var moment = require('moment-timezone');
const path = require('path');
var request = require('request');
var sanitize = require('sanitize-filename');

require('./getShowGuidFromTitle.js').getShowGuidFromTitle(getApiDataForShow);

function getApiDataForShow(showGuid) {
    var url = 'https://api.byutv.org/api3/page/getpage?pageid=' + showGuid;

    var options = {
        url: url,
        headers: {
            'x-byutv-context': 'web$US',
            'x-byutv-platformkey': 'xsaaw9c7y5',
            'content-type': 'application/json',
        }
    };
    request(options, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var jsonContent = JSON.parse(body);
            var mostRecentSeason = false;
            lists = jsonContent.lists;
            Object.keys(lists).forEach(function(key) {
                list = lists[key];
                if (list.type == 'ShowSeason' && mostRecentSeason == false) {
                    mostRecentSeason = true;
                    getApiDataForSeason(list.id);
                }
            });
        }
    });
}

function getApiDataForSeason(seasonid) {
    var url = 'https://api.byutv.org/api3/list/getlistitems?start=0&limit=20&channel=byutv&listid=' + seasonid;

    var options = {
        url: url,
        headers: {
            'x-byutv-context': 'web$US',
            'x-byutv-platformkey': 'xsaaw9c7y5',
            'content-type': 'application/json',
        }
    };

    request(options, function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
            var jsonContent = JSON.parse(body);

            var i = 1;
            if (process.argv.length >= 4) {
                i = parseInt(process.argv[3]);
            }

            var episode = jsonContent.items[i - 1];
            var airdate = moment(episode.premiereDate).tz("America/Denver").format('YYYY-MM-DD HH:mm:ss');

            console.log(chalk.blue.bold("\n----------------------------------------- EPISODE -----------------------------------------"));
            console.log(chalk.green("\nname\n----"));
            console.log(episode.subtitle);
            console.log(chalk.green("\ndescription\n-----------"));
            console.log(episode.description.replace("\r", ' '));
            console.log(chalk.green("\nairdate\n-------"));
            console.log(airdate);

            var images = false;
            if (episode.images) {
                images = episode.images[0].images;
            } else if (episode.listImage.images) {
                images = episode.listImage.images;
            }
            if (!images) {
                throw new Error("unable to find images");
            }
            
            Object.keys(images).forEach(function(key) {
                image = images[key]; // ends up with the largest one
            });
            const dir = path.normalize(__dirname + '/' + episode.title + '/');
            !fs.existsSync(dir) && fs.mkdirSync(dir);

            var originalFilename = dir + sanitize(episode.subtitle) + '.' + image.size + '.jpg';
            downloadFile(image.url, originalFilename, function() {
                var outputFilename = dir + sanitize(episode.subtitle) + '.640x360.jpg';
                Jimp.read(originalFilename, function(err, image) {
                    if (err) throw err;
                    image.resize(640, 360) // resize
                        .write(outputFilename); // save
                });
                console.log(chalk.green("\nimage\n-----"));
                console.log("saved file to", outputFilename);
            });
        }
    });
}

var downloadFile = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
