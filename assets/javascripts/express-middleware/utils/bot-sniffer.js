// bot sniffing taken from https://github.com/biggora/express-useragent
const BOTS = [
  '\\+https:\\/\\/developers.google.com\\/\\+\\/web\\/snippet\\/',
  'googlebot',
  'baiduspider',
  'gurujibot',
  'yandexbot',
  'slurp',
  'msnbot',
  'bingbot',
  'facebookexternalhit',
  'facebot',
  'linkedinbot',
  'twitterbot',
  'slackbot',
  'telegrambot',
  'applebot',
  'pingdom',
  'tumblr '
];

const IS_BOT_REGEXP = new RegExp('^.*(' + BOTS.join('|') + ').*$');

function isBot(user_agent) {
  const isBot = IS_BOT_REGEXP.exec(user_agent.toLowerCase());
  return isBot !== null;
};

module.exports = isBot;
