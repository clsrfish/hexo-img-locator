// replace relative markdown image path with absolute path to hexo root
const path = require('path');
const fs = require('fs');

let imageReg = /!\[(?<alt>[^\]]*)\]\((?<url>.*?)(?=\"|\))(?<title>\".*\")?\)/g;
let cwd = process.cwd();

function printInfo(msg) {
    hexo.log.info(msg)
}

function printError(msg) {
    hexo.log.e(msg)
}

let hexo_img_locator = function (data) {
    let postPath = data.full_source;
    if (!postPath.endsWith('.md')) {
        printInfo(`skip ${postPath}`);
        return data;
    }
    let mapping = new Map();
    let cannotAccess = new Array();

    let match = null;
    while ((match = imageReg.exec(data.content)) != null) {
        // skip online image and local file with absolute path
        let imageUrl = match.groups.url;
        if (imageUrl.startsWith('http://')
            || imageUrl.startsWith('https://')
            || imageUrl.startsWith('/')) {
            continue;
        }
        let imageAbsPath = path.resolve(path.dirname(postPath), imageUrl);

        if (!fs.existsSync(imageAbsPath)) {
            cannotAccess.push(imageUrl);
            continue;
        } else if (cannotAccess.length > 0) {
            // no need process any more
            continue;
        }

        let imageAbsPathFromSource = path.sep + path.relative(`${cwd}${path.sep}source`, imageAbsPath);
        let imageDirective = match[0];
        mapping.set(imageDirective,
            imageDirective.replace(imageUrl, imageAbsPathFromSource));
        printInfo(`[hexo-img-locator] ${imageUrl} -> ${imageAbsPathFromSource}`);
    }

    if (cannotAccess.length != 0) {
        printError(`[hexo-img-locator] cannot access ${cannotAccess[0]} and other ${cannotAccess.length - 1} from ${path.relative(cwd, data.full_source)}, file not found.`)
        process.exit(1)
    }
    mapping.forEach((v, k, map) => {
        data.content = data.content.replace(k, v);
    })
    return data;
}

hexo.extend.filter.register('before_post_render', hexo_img_locator);

// TODO: handle <img src="../../xxx">
