'use strict';

const nameList = [
    { id: 23, firstName: 'F1', lastName: 'L1', email: 'f1.l1@gmail.com' },
    { id: 24, firstName: 'F2', lastName: 'L2', email: 'f2.l2@gmail.com' },
    { id: 25, firstName: 'F3', lastName: 'L3', email: 'f3.l3@gmail.com' },
    { id: 26, firstName: 'F4', lastName: 'L4', email: 'f4.l4@gmail.com' }
];

let nextId = 27;

function createItem(req, res, _) {
    const item = {
        id: nextId++,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };
    nameList.push(item);
    sendJsonResponse(res, 201, addHypermediaLinks(req, item));   
}

function readAllItems(req, res, _) {
    sendJsonResponse(res, 200, nameList.map(item => addHypermediaLinks(req, item)));   
}

function readItem(req, res, _) {
    const id = Number(req.params.id);
    const item = findItem(id);
    if (item) {
        sendJsonResponse(res, 200, item);
    }
    else {
        sendStatusResponse(res, 404)   
    }
}

function updateItem(req, res, _) {
    const id = Number(req.params.id);
    const item = findItem(id);
    if (item) {
        item.firstName = req.body.firstName;
        item.lastName = req.body.lastName;
        item.email = req.body.email;
        sendJsonResponse(res, 200, addHypermediaLinks(req, item));
    }
    else {
        sendStatusResponse(res, 404);
    }
}

function deleteItem(req, res, _) {
    const id = Number(req.params.id);
    const index = findItemIndex(id);
    if (index >= 0) {
        nameList.splice(index, 1);
        sendEmptyResponse(res, 200);   
    }
    else {
        sendStatusResponse(res, 404);
    }
}

function elementWithId(id) {
    return e => e.id === id;
}

function addHypermediaLinks(req, item) {
    const clonedItem = Object.assign({}, item);
    const baseUri = getBaseUri(req);
    const uri = `${baseUri}/${item.id}`;
    clonedItem.readUri = uri;
    clonedItem.updateUri = uri;
    clonedItem.deleteUri = uri;
    return clonedItem;
}

function getBaseUri(req) {
    const xForwardedProtoHeader = req.header('x-forwarded-proto');
    const protocol = xForwardedProtoHeader ? xForwardedProtoHeader : req.protocol;
    const baseUri = protocol + '://' + req.get('host') + req.baseUrl;
    return baseUri;
}

function findItem(id) {
    return nameList.find(elementWithId(id));
}

function findItemIndex(id) {
    return nameList.findIndex(elementWithId(id));
}

function sendJsonResponse(res, status, content) {
    res.status(status).json(content);
}

function sendEmptyResponse(res, status) {
    res.status(status).send();
}

function sendStatusResponse(res, status) {
    res.sendStatus(status);
}

module.exports = {
    createItem,
    readAllItems,
    readItem,
    updateItem,
    deleteItem
};
