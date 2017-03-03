const express = require('express');
const { renderToString } = require('react-dom/server');

const SSR = require('./static');

const renderMarkup = html => (
    `   <!DOCTYPE html>
        <html lang="en">
            <head>
            <meta charset="UTF-8">
            <title>Webpack SSR Demo</title>
            </head>
            <body>
                <div id="app">${html}</div>
                <script src="./index.js"></script>
                <script src="${process.env.BROWSER_REFRESH_URL}"></script>
            </body>
        </html>`
)

const server = port => {
    const app = express();

    app.use(express.static('static'));
    app.get('/', (req, res) => (
        res.status(200).send(renderMarkup(renderToString(SSR)))
    ));

    app.listen(port, () => process.send && process.send('online'));
}

server(process.env.port || 8080);