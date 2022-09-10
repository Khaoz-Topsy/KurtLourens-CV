const fs = require('fs');
const util = require('util');
const axios = require('axios');

const readFile = util.promisify(fs.readFile);

async function generateFullJson() {
    let fullJson = {};

    const siteDataContentsPromise = readFile('./webpack/data/site.json', 'utf8');
    const cvContentsPromise = readFile('./webpack/data/cv.json', 'utf8');
    const cspPromise = readFile('./webpack/data/csp.json', 'utf8');

    const cvContents = await cvContentsPromise;
    const siteDataContents = await siteDataContentsPromise;
    const cspContents = await cspPromise;
    const rssData = await axios.get('https://blog.kurtlourens.com/assets/json/project.json');;

    const cv = JSON.parse(cvContents);
    const siteData = JSON.parse(siteDataContents);
    const cspContent = JSON.parse(cspContents);
    const headerList = cspContent.options.map(opt =>
        opt.name +
        ((opt.values != null && opt.values.length > 0) ? ' ' : '') +
        opt.values.join(' ')
    );
    const header = headerList.join('; ') + ';';

    fullJson = {
        ...siteData, ...cv,
        headers: [
            ...cspContent.headers.map(csp => ({ "name": csp, "value": header })),
            ...siteData.headers,
        ],
        ...{ recentBlogPosts: rssData.data.posts.slice(0, 4) }
    };

    fs.writeFile('./webpack/data/project.json', JSON.stringify(fullJson), ['utf8'], () => { });
}

generateFullJson();
