function getShowGuidFromTitle(callback) {
  var rawTitle = 'Studio C';
  if (process.argv.length >= 3) {
    var rawTitle = process.argv[2];
  }

  var parsedTitle = rawTitle.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');

  switch (parsedTitle) {
    case 'extinct':
      return callback('e5f3bb84-3e34-4b51-8d71-e4d538fd93b2');
      break;

    case 'random':
    case 'random-acts':
    case 'randomacts':
      return callback('2f11a156-dfaa-454c-a104-60165b2a5625');
      break;

    case 'tricked':
      return callback('5215330f-fd7d-4f56-a0d8-11cefcb6f204');
      break;

    case 'studio-c':
    case 'studioc':
      return callback('c68c4e4f-6322-4a23-8b8e-a5be75b70635');
      break;

    default:
      var request = require('then-request');
      var url = 'http://www.byutv.org/api/Television/GetShowsByName?context=Android%24US%24Release&name=' + encodeURIComponent(rawTitle);
      request('GET', url).then(function (res) {
        var jsonData = JSON.parse(res.getBody('utf-8'));
        if (0 in jsonData) {
          callback(jsonData[0].guid);
        } else {
          console.error("Unknown show!");
        }
      });
  }
}

module.exports.getShowGuidFromTitle = getShowGuidFromTitle;