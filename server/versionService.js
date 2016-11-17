const package = require('../package.json');

function getVersion(req, res, _) {
    sendJsonResponse(res, 200, { version: package.version });
}

function sendJsonResponse(res, status, content) {
    res.status(status).json(content);
}

module.exports = {
    getVersion
};
