'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const nameListService = require('./nameListService');
const preferCompressedStaticContent = require('./preferCompressedStaticContent');

const port = process.env.PORT || 3000;
const publicFolder = path.join(__dirname, 'public');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use('/', preferCompressedStaticContent(publicFolder));
app.use('/', express.static(publicFolder));
app.use('/api/nameList', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use('/api/nameList', nameListService.router);

app.listen(port, () => console.log(`Listening on port ${port}`));
