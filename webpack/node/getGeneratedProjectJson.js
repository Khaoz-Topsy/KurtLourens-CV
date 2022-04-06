const fs = require('fs');
const util = require('util');
const Parser = require('rss-parser');

const readFile = util.promisify(fs.readFile);

async function generateFullJson() {
    let fullJson = {};

    const parser = new Parser({
        customFields: {
            item: ['media:content'],
        }
    });

    const siteDataContentsPromise = readFile('./webpack/data/site.json', 'utf8');
    const cvContentsPromise = readFile('./webpack/data/cv.json', 'utf8');
    const cspPromise = readFile('./webpack/data/csp.json', 'utf8');
    const rssPromise = parser.parseURL('https://blog.kurtlourens.com/rss/');;

    const cvContents = await cvContentsPromise;
    const siteDataContents = await siteDataContentsPromise;
    const cspContents = await cspPromise;
    const rssData = await rssPromise;

    const cv = JSON.parse(cvContents);
    const siteData = JSON.parse(siteDataContents);
    const simpleRssData = mapRssToSimpleObj(rssData);
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
        ...{ recentBlogPosts: simpleRssData } 
    };

    fs.writeFile('./webpack/data/project.json', JSON.stringify(fullJson), ['utf8'], () => { });
}

function mapRssToSimpleObj(rss) {
    const result = [];
    for (let rssIndex = 0; rssIndex < rss.items.length; rssIndex++) {
        if (result.length >= 4) continue;
        const rssItem = rss.items[rssIndex];
        result.push({
            guid: rssItem.guid,
            link: rssItem.link,
            title: rssItem.title,
            description: rssItem.contentSnippet,
            imageUrl: rssItem['media:content']['$'].url,
            tags: rssItem.categories,
        })
    }
    return result;
}

generateFullJson();
