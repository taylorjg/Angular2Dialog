'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nameListService = require('./nameListService');

const nameListServiceRouter = express.Router();
nameListServiceRouter.post('/', nameListService.createItem);
nameListServiceRouter.get('/', nameListService.readAllItems);
nameListServiceRouter.get('/:id', nameListService.readItem);
nameListServiceRouter.post('/:id', nameListService.updateItem);
nameListServiceRouter.delete('/:id', nameListService.deleteItem);

const preferCompressedStaticContent = rootFolder => (req, res, next) => {
    if (req.method === 'GET' && req.get('Accept-Encoding').indexOf('gzip') >= 0) {
        const normalFilePath = path.join(rootFolder, req.url);
        const compressedFilePath = normalFilePath + '.gz';
        fs.stat(normalFilePath, err1 =>
            fs.stat(compressedFilePath, err2 => {
                if (!err1 && !err2) {
                    req.url = req.url + '.gz';
                    res.set('Content-Encoding', 'gzip');
                }
                next();
            }));
    }
    else {
        next();
    }
};

const publicFolder = path.join(__dirname, 'public');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use('/', preferCompressedStaticContent(publicFolder));
app.use('/', express.static(publicFolder));
app.use('/api/nameList', nameListServiceRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
