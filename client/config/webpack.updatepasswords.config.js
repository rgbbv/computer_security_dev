const path = require('path');

module.exports = {

    mode: 'production',

    entry: [
        './src/components/UpdatePassword/index.js'
    ],

    output: {
        filename: 'UpdatePassword.js',
        path: path.join(__dirname, '../', 'build')
    },

    resolve: {
        extensions: ['.js', '.json'],
        modules: ['node_modules']
    },

    module: {
        rules: [
            {
                test: /\.(jsx|js)?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
            }]
    }
};
