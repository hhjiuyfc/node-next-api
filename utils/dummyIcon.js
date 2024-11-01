const Identicon = require('identicon.js');

const dummyIcon = (input, size = 100) => {
  const hash = require('crypto').createHash('md5').update(input).digest('hex');

  const data = new Identicon(hash, size).toString();

  return `data:image/png;base64,${data}`;
};
module.exports = dummyIcon;
