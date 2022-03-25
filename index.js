// replace relative markdown image path with absolute path to hexo root
const path = require('path');
let imageReg = /!\[(?<alt>[^\]]*)\]\((?<url>.*?)(?=\"|\))(?<title>\".*\")?\)/g;
let cwd = process.cwd();

let hexo_img_locator = function (data) {

    let postPath = data.full_source;
    if (!postPath.endsWith('.md')) {
        console.log(`skip non-md file: ${postPath}`);
    }
    let substitution = new Map();
    let match = null;
    while ((match = imageReg.exec(data.content)) != null) {
        let imageUrl = match.groups.url;
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            console.log(`skip online image: ${imageUrl}`);
            continue;
        }
        if (imageUrl.startsWith('/')) {
            console.log(`skip absolute path: ${imageUrl}`);
            continue;
        }
        let imageSytax = match[0];
        let imagePath = path.resolve(path.dirname(postPath), imageUrl);
        substitution.set(imageSytax,
            imageSytax.replace(imageUrl, imagePath.replace(`${cwd}`, ''))
                .replace('/source', ''));
    }
    substitution.forEach((v, k, map) => {
        console.info(`substituting ${k} -> ${v}`);
        data.content = data.content.replace(k, v);
    })
    return data;
}

hexo.extend.filter.register('before_post_render', hexo_img_locator);

// TODO: handle <img src="../../xxx">
