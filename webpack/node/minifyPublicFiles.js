const minify = require('minify');

const options = {
    html: {
        removeAttributeQuotes: false,
        removeOptionalTags: false,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
    },
    // css: {
    //     compatibility: '*',
    // },
    js: {
        ecma: 5,
    },
};

const filesToMinify = [
    'index.html',
];

for (let fileIndex = 0; fileIndex < filesToMinify.length; fileIndex++) {
    const fileToMinify = filesToMinify[fileIndex];
    minify(`public/${fileToMinify}`, options)
        .then(console.log)
        .catch(console.error);
}


