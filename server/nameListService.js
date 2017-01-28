'use strict';

const repo = require('./nameListRepoInMemory');

const createItem = (req, res) => {
    const details = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    const item = repo.createItem(details);
    sendJsonResponse(res, 201, addHypermediaLinks(req, item));   
};

const readAllItems = (req, res) => {
    const items = repo.readAllItems();
    sendJsonResponse(res, 200, items.map(item => addHypermediaLinks(req, item)));
};

const readItem = (req, res) => {
    const id = Number(req.params.id);
    const item = repo.readItem(id);
    if (item) {
        sendJsonResponse(res, 200, addHypermediaLinks(req, item));
    }
    else {
        sendStatusResponse(res, 404)   
    }
};

const updateItem = (req, res) => {
    const id = Number(req.params.id);
    const details = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    const item = repo.updateItem(id, details);
    if (item) {
        sendJsonResponse(res, 200, addHypermediaLinks(req, item));
    }
    else {
        sendStatusResponse(res, 404);
    }
};

const deleteItem = (req, res) => {
    const id = Number(req.params.id);
    if (repo.deleteItem(id)) {
        sendEmptyResponse(res, 200);   
    }
    else {
        sendStatusResponse(res, 404);
    }
};

const addHypermediaLinks = (req, item) => {
    const clonedItem = Object.assign({}, item);
    const baseUri = getBaseUri(req);
    const uri = `${baseUri}/${item.id}`;
    clonedItem.readUri = uri;
    clonedItem.updateUri = uri;
    clonedItem.deleteUri = uri;
    return clonedItem;
};

const getBaseUri = req => {
    const xForwardedProtoHeader = req.header('x-forwarded-proto');
    const protocol = xForwardedProtoHeader || req.protocol;
    const baseUri = protocol + '://' + req.get('host') + req.baseUrl;
    return baseUri;
};

const sendJsonResponse = (res, status, json) => res.status(status).json(json);
const sendEmptyResponse = (res, status) => res.status(status).send();
const sendStatusResponse = (res, status) => res.sendStatus(status);

module.exports = {
    createItem,
    readAllItems,
    readItem,
    updateItem,
    deleteItem
};
