'use strict';

const path = require('path');
const fs = require('fs');

const preferCompressedStaticContent = rootFolder => (req, res, next) => {
    if (req.method === 'GET' && req.get('Accept-Encoding') && req.get('Accept-Encoding').indexOf('gzip') >= 0) {
        const normalFilePath = path.join(rootFolder, req.url);
        const compressedFilePath = normalFilePath + '.gz';
        fs.stat(normalFilePath, err1 =>
            fs.stat(compressedFilePath, err2 => {
                if (!err1 && !err2) {
                    req.url += '.gz';
                    res.set('Content-Encoding', 'gzip');
                }
                next();
            }));
    }
    else {
        next();
    }
};

module.exports = preferCompressedStaticContent;
