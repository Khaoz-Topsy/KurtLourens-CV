const fs = require('fs');
const minify = require('minify');

const options = {
    html: {
        removeAttributeQuotes: false,
        removeOptionalTags: false,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        processScripts: ['application/ld+json']
    },
    css: {
        compatibility: '*',
        properties: {
            urlQuotes: true
        }
    },
    js: {
        ecma: 5,
    },
};

const filesToMinify = [
    'index.html',
    'assets/css/main.css',
    'assets/css/icon-pack.css',
];

for (let fileIndex = 0; fileIndex < filesToMinify.length; fileIndex++) {
    const fileToMinify = filesToMinify[fileIndex];
    minify(`public/${fileToMinify}`, options)
        .then((newContents) => {
            fs.writeFile(`public/${fileToMinify}`, newContents, ['utf8'], () => { });
        })
        .catch(console.error);
}


