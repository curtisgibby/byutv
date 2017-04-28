var fs = require('fs');
var request = require('request');
var sharp = require('sharp');

require('./getShowGuidFromTitle.js').getShowGuidFromTitle(getApiDataForShow);

function getApiDataForShow(showGuid) {
  var url = 'http://www.byutv.org/api/Television/GetShowEpisodesByDate?context=Android%24US%24Release&showGuid=' + showGuid;

  request(url, function(err, resp, body){
    if (!err && resp.statusCode == 200) {
      var jsonContent = JSON.parse(body);
      var i = 0;
      if (process.argv.length >= 4) {
        i = parseInt(process.argv[3]);
      }

      var episode = jsonContent[i];
      var originalFilename = episode.name + '.original.jpg';
      downloadFile(episode.largeImage, originalFilename, function(){
        var outputFilename = episode.name + '.400x225.jpg';
        sharp(originalFilename)
          .resize(400, 225)
          .toFile(outputFilename, function(err) {
            fs.unlink(originalFilename);
          });
        console.log("saved file to", outputFilename);
      });
    }
  });
}

var downloadFile = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
