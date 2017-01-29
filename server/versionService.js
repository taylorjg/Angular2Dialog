'use strict';

const packageJson = require('../package.json');

function getVersion(req, res) {
    sendJsonResponse(res, 200, { version: packageJson.version });
}

function sendJsonResponse(res, status, content) {
    res.status(status).json(content);
}

module.exports = {
    getVersion
};
