var webpack = require('webpack');

module.exports = {
    entry: [
        'script!jquery/dist/jquery.min.js',
        'script!foundation-sites/dist/foundation.min.js',
        './app/app.jsx'
    ],
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'
        })
    ],
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            Main: 'app/components/Main.jsx',
            Header: 'app/components/Header.jsx',
            Footer: 'app/components/Footer.jsx',
            ButtonObject: 'app/components/ButtonObject.jsx',
            ContentBlock: 'app/components/ContentBlock.jsx',
            HomePage: 'app/components/HomePage.jsx',
            VideoPage: 'app/components/VideoPage.jsx',
            SurveyPage: 'app/components/SurveyPage.jsx',
            FinalPage: 'app/components/FinalPage.jsx'
        },
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0']
                },
                test: /\.jsx?$/,
                exclude: /(node_modules | bower_components)/
            }
        ]
    },
    node: {
        fs: 'empty'
    },
    devtool: 'cheap-module.eval-source.map'
};
