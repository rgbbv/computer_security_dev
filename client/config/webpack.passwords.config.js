const path = require('path');

module.exports = {

    mode: 'production',

    entry: [
        './src/components/PasswordList/index.js'
    ],

    output: {
        filename: 'PasswordList.js',
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
