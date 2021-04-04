var chalk = require('chalk');
var fs = require('fs');
var moment = require('moment-timezone');
const path = require('path');
var request = require('request');
var sanitize = require('sanitize-filename');
var { getEpisode, getListItems, getPage } = require('./byutv-api.js');

require('./getShowGuidFromTitle.js').getShowGuidFromTitle(getApiDataForShow);

function getApiDataForShow(showGuid) {
    getPage(showGuid, getShowSeasons);
}

function getShowSeasons(showData) {
    var mostRecentSeason = false;
    lists = showData.lists;
    Object.keys(lists).forEach(function(key) {
        list = lists[key];
        if (list.type == 'ShowSeason' && mostRecentSeason == false) {
            mostRecentSeason = true;
            getListItems(list, getApiDataForSeason);
        }
    });
}

function getApiDataForSeason(season) {
    var i = 1;
    if (process.argv.length >= 4) {
        i = parseInt(process.argv[3]);
    }

    var rawEpisode = season.items[i - 1];
    getEpisode(rawEpisode, getEpisodeImage);
}

var getEpisodeImage = function(episode) {
    var airdate = moment(episode.startDate).tz("America/Denver").format('YYYY-MM-DD HH:mm:ss');

    console.log(chalk.blue.bold("\n----------------------------------------- EPISODE -----------------------------------------"));
    console.log(chalk.green("name"));
    console.log(episode.title);
    console.log(chalk.green("\ndescription"));
    console.log(episode.description.replace(/\r?\n|\r/gm, ' '));
    console.log(chalk.green("\nairdate"));
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
    const dir = path.normalize(__dirname + '/' + episode.showTitle + '/' + episode.seasonTitle + '/');
    !fs.existsSync(dir) && fs.mkdirSync(dir);

    var originalFilename = dir + sanitize(episode.title) + '.' + image.size + '.jpg';
    downloadFile(image.url, originalFilename, function() {
        Jimp.read(originalFilename, function(err, image) {
            if (err) throw err;
            image.write(originalFilename); // save
        });
        console.log(chalk.green("\nimage"));
        console.log("original URL:", image.url);
        console.log("saved file to", originalFilename);
    });
}

var downloadFile = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};
