var fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function generateFullJson() {
    let fullJson = {};

    const siteDataContents = await readFile('./webpack/data/site.json', 'utf8');
    const siteData = JSON.parse(siteDataContents);
    fullJson = { ...fullJson, ...siteData };

    const cvContents = await readFile('./webpack/data/cv.json', 'utf8');
    const cv = JSON.parse(cvContents);
    fullJson = { ...fullJson, ...cv };

    fs.writeFile('./webpack/data/project.json', JSON.stringify(fullJson), ['utf8'], () => { });
}

generateFullJson();
