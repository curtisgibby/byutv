var fs = require('fs');
var request = require('request');
var sharp = require('sharp');

var showGuid = require('./getShowGuidFromTitle.js').getShowGuidFromTitle();

var url = 'http://www.byutv.org/api/Television/GetShowEpisodesByDate?context=Android%24US%24Release&showGuid=' + showGuid;

request(url, function(err, resp, body){
  if (!err && resp.statusCode == 200) {
    var jsonContent = JSON.parse(body);
    for ( var i = 0; i < 1; i++) {
      var episode = jsonContent[i];
      var originalFilename = episode.name + '.original.jpg';
      downloadFile(episode.largeImage, originalFilename, function(){
        var outputFilename = episode.name + '.400x225.jpg';
        sharp(originalFilename)
          .resize(400, 225)
          .toFile(outputFilename, function(err) {
            fs.unlink(originalFilename);
            // console.log("err : ", err); //debug!
          });
        console.log("saved file to", outputFilename); //debug!
      });
    }
  }
});

var downloadFile = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
