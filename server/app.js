'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const versionService = require('./versionService');
const nameListService = require('./nameListService');

const versionServiceRouter = express.Router();
versionServiceRouter.get('/', versionService.getVersion);

const nameListServiceRouter = express.Router();
nameListServiceRouter.post('/', nameListService.createItem);
nameListServiceRouter.get('/', nameListService.readAllItems);
nameListServiceRouter.get('/:id', nameListService.readItem);
nameListServiceRouter.post('/:id', nameListService.updateItem);
nameListServiceRouter.delete('/:id', nameListService.deleteItem);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api/version', versionServiceRouter);
app.use('/api/nameList', nameListServiceRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
