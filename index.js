const nunjucks = require('nunjucks');
const emoji = require('node-emoji');
const marked = require('marked');

const args = process.argv.slice(2);
const input = args[0];

nunjucks.configure({
  autoescape: true,
  trimBlocks: true,
  lstripBlocks: true
});

const helpers = require('./helpers');

htmlify = data => {
  if (Array.isArray(data)) {
    return data.map(htmlify);
  }
  else if (typeof data === 'string') {
    return data;
  }
  else if (data.type === 'mrkdwn' && data.text) {
    data.text = data.text.replace(/<([a-z]+:.*?)\|(.*?)>/g, '[$2]($1)');
    data.text = emoji.emojify(data.text);
    data.text = marked(data.text);
    data.text = data.text.replace(/\\n/g, '<br>');
    data.type = 'html';
    return data;
  }

  for (const key in data) {
    data[key] = htmlify(data[key]);
  }

  return data;
};

(() => {
  let data;

  try {
    data = require(input);
  }
  catch (ex) {
    return console.error(`Can not read file ${input}`, ex);
  }

  if (!data.blocks) {
    return console.error(`${input} doesn't seem to be a valid blocks JSON`);
  }

  data = htmlify(data);

  console.log(nunjucks.render('index.html', {...helpers, ...data }));
})();
