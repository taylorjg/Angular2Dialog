'use strict';

// const repo = require('./nameListRepoInMemory');
const repo = require('./nameListRepoRedis');

const createItem = (req, res) => {
    const details = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    repo.createItem(details).then(item => {
        sendJsonResponse(res, 201, addHypermediaLinks(req, item));   
    });
};

const readAllItems = (req, res) => {
    repo.readAllItems().then(items => {
        sendJsonResponse(res, 200, items.map(item => addHypermediaLinks(req, item)));
    });
};

const readItem = (req, res) => {
    const id = Number(req.params.id);
    repo.readItem(id).then(item => {
        if (item) {
            sendJsonResponse(res, 200, addHypermediaLinks(req, item));
        }
        else {
            sendStatusResponse(res, 404)   
        }
    });
};

const updateItem = (req, res) => {
    const id = Number(req.params.id);
    const details = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    repo.updateItem(id, details).then(item => {
        if (item) {
            sendJsonResponse(res, 200, addHypermediaLinks(req, item));
        }
        else {
            sendStatusResponse(res, 404);
        }
    });
};

const deleteItem = (req, res) => {
    const id = Number(req.params.id);
    repo.deleteItem(id).then(result => {
        if (result) {
            sendEmptyResponse(res, 200);
        }
        else {
            sendStatusResponse(res, 404);
        }
    });
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

const sendJsonResponse = (res, status, content) => res.status(status).json(content);
const sendEmptyResponse = (res, status) => res.status(status).send();
const sendStatusResponse = (res, status) => res.sendStatus(status);

module.exports = {
    createItem,
    readAllItems,
    readItem,
    updateItem,
    deleteItem
};
