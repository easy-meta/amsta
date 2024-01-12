const n_fs = require('_vendor/fs-extra');
const orig_data = require('./emoji.json');

console.log(orig_data);

const idxs = {
  no: 0,
  code: 1,
  browser: 2,
  appl: 3,
  goog: 4,
  fb: 5,
  wind: 6,
  twtr: 7,
  joy: 8,
  sams: 9,
  gmail: 10,
  sb: 11,
  dcm: 12,
  kddi: 13,
  name: 14,
}

const cnt_imp = `
.emoji::before{
  content: "\\00001" !important;
  font-size: unset !important;
}
`;

for (const idx_name of ['code', 'browser', 'twtr']) {

  const idx_val = idxs[idx_name];

  const all_emoji_array = ['code', 'browser'].includes(idx_name) ? [] : [cnt_imp];
  let bit_small_array = ['code', 'browser'].includes(idx_name) ? [] : [cnt_imp];

  for (const cat_1 in orig_data) {
    // cate_1 = [Smileys & Emotion, Flags]

    const file_1 = clean_str(cat_1);
    for (const cat_2 in orig_data[cat_1]) {
      // cat_2 = [face-smiling, face-affection]

      const file_2 = clean_str(cat_2);

      for (const item of orig_data[cat_1][cat_2]) {

        const file_3 = clean_str(item[idxs.name]);
        let val = item[idx_val];

        let code = ''
        switch (idx_name) {
          case 'code':
            val = String(val).replace(/\s/g, '').replace(/\U\+/g, '\\');
            code = `.emoji.emoji-${file_1}-${file_2}-${file_3}::before {
  content: "${val}";
}`;
            break;

          case 'browser':
            code = `.emoji.emoji-${file_1}-${file_2}-${file_3}::before {
  content: "${val}";
}`;
            break;

          default:
            code = `.emoji.emoji-${file_1}-${file_2}-${file_3}::before {
  background-image: url(${val});
}`;
            break;
        }

        all_emoji_array.push(code);
        bit_small_array.push(code)
      }

      const bit_emoji_css = bit_small_array.join('\n');
      n_fs.writeFileSync(`../${idx_name}-${file_1}-${file_2}.css`, bit_emoji_css);
      bit_small_array = [];

    }
  }

  const all_emoji_css = all_emoji_array.join('\n');
  n_fs.writeFileSync(`../${idx_name}.css`, all_emoji_css);
}



function clean_str(str) {
  str = String(str)
    .replace('flag: ', '')
    .replace('&', 'and')
    .replace(/\W/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+/g, '_')
    .replace(/\_+/g, '_')

    //.replace('-flag', '')
    //.replace('-symbol', '')

    .toLowerCase()
    .trim()

  return str;
}
