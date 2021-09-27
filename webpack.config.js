const path = require('path');

module.exports = {
    entry: {
        //options page
        onlyUnlogged: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'onlyUnlogged.js'),
        fixedHeader: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'fixedHeader.js'),
        blackListContainerDiv: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'blackListContainerDiv.js'),
        tabNumbersContainerDiv: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'tabNumbersContainerDiv.js'),
        stimuliContainerDiv: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'stimuliContainerDiv.js'),
        toDoContainerDiv: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'toDoContainerDiv.js'),
        appIntegrationsContainerDiv: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'appIntegrationsContainerDiv'),
        advancedOptionsContainerDiv: path.resolve(__dirname, 'src', 'grafts', 'optionsGrafts', 'advancedOptionsContainerDiv.js'),
        //popup page
        advancedOptionsContainerDiv2: path.resolve(__dirname, 'src', 'grafts', 'popupGrafts', 'advancedOptionsContainerDiv.js'),
        fixedFooter2: path.resolve(__dirname, 'src', 'grafts', 'popupGrafts', 'footerSection'),
        appIntegrationsContainerDiv2: path.resolve(__dirname, 'src', 'grafts', 'popupGrafts', 'appIntegrationsContainerDiv.js'),
        stimuliContainerDiv2: path.resolve(__dirname, 'src', 'grafts', 'popupGrafts', 'stimuliContainerDiv.js'),
        tabNumbersContainerDiv2: path.resolve(__dirname, 'src', 'grafts', 'popupGrafts', 'tabNumbersContainerDiv.js'),
        blackListContainerDiv2: path.resolve(__dirname, 'src', 'grafts', 'popupGrafts', 'blackListContainerDiv.js'),
        toDoContainerDiv2: path.resolve(__dirname, 'src', 'grafts', 'popupGrafts', 'toDoContainerDiv.js'),
    },
    output: {
        path: path.resolve(__dirname, 'public/bundle'),
        filename: '[name]/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node.modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /.css$/,
                exclude: /node.modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ]
            },
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                exclude: /node.modules/,
                use: {
                    loader: 'file-loader',
                }
            }
        ]
    },
    optimization: {
        minimize: false
    },
    watch: true,
};
