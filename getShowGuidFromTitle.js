function getShowGuidFromTitle(rawArgs) {
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
    case 'random':
    case 'random-acts':
    case 'randomacts':
      return '2f11a156-dfaa-454c-a104-60165b2a5625';
      break;
    case 'tricked':
      return '5215330f-fd7d-4f56-a0d8-11cefcb6f204';
      break;
    case 'studio-c':
    case 'studioc':
      return 'c68c4e4f-6322-4a23-8b8e-a5be75b70635';
      break;
    default:
      console.error('Unknown Show Title');
      process.exit(1);
  }
}

module.exports.getShowGuidFromTitle = getShowGuidFromTitle;