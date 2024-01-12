const n_fs = require('_vendor/fs-extra');
const n_cheerio = require('_vendor/cheerio');


const html = n_fs.readFileSync('./full-emoji-list.html');

const $ = n_cheerio.load(html);


const tree = {};
let cat_1 = null;
let cat_2 = null
$('table')
  .find('tr')
  .each((idx_tr, ele_tr) => {

    const $_cat_1 = $(ele_tr).find('th.bighead');
    if ($_cat_1.length) {
      cat_1 = $_cat_1.text();
      return;
    }
    const $_cat_2 = $(ele_tr).find('th.mediumhead');
    if ($_cat_2.length) {
      cat_2 = $_cat_2.text()
      return;
    }
    const $_cat_3 = $(ele_tr).find('th.cchars');
    if ($_cat_3.length) {
      return;
    }

    if (!tree[cat_1]) {
      tree[cat_1] = {};
    }

    if (!tree[cat_1][cat_2]) {
      tree[cat_1][cat_2] = [];
    }

    const item = [];

    $(ele_tr)
      .find('td')
      .each((idx_td, ele_td) => {
        let val = null;
        const $_img = $(ele_td).find('img');
        if ($_img.length) {
          val = $_img.attr('src');
        } else {
          val = $(ele_td).text()
        }

        item.push(val)

      })

    tree[cat_1][cat_2].push(item);

  });

console.log(tree);

n_fs.writeFileSync('./emoji.json', JSON.stringify(tree));