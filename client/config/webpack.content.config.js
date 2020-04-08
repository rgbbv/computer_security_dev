const path = require('path');

module.exports = {

    entry: [
        './public/contentScript.js'
    ],

    output: {
        filename: 'contentScript.js',
        path: path.join(__dirname, '../', 'build')
    },

    resolve: {
        extensions: ['.js', '.json'],
        modules: ['node_modules']
    },

    // module: {
    //     loaders: [
    //         {
    //             test: /\.(js)?$/,
    //             loader: 'babel-loader',
    //             exclude: /(node_modules)/,
    //             include: path.join(__dirname, 'src'),
    //             query: {
    //                 presets: ['es2015', 'react']
    //             }
    //         }
    //     ]
    // }
};
