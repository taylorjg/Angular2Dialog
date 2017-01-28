'use strict';

const Promise = require('bluebird');

let nextId = 23;

const nameList = [
    { id: nextId++, firstName: 'F1', lastName: 'L1', email: 'f1.l1@gmail.com' },
    { id: nextId++, firstName: 'F2', lastName: 'L2', email: 'f2.l2@gmail.com' },
    { id: nextId++, firstName: 'F3', lastName: 'L3', email: 'f3.l3@gmail.com' },
    { id: nextId++, firstName: 'F4', lastName: 'L4', email: 'f4.l4@gmail.com' }
];

const createItem = details => {
    const item = Object.assign({}, details, { id: nextId++ });
    nameList.push(item);
    return Promise.resolve(item);
};

const readAllItems = () =>
    Promise.resolve(nameList);

const readItem = id =>
    Promise.resolve(findItem(id));

const updateItem = (id, details) => {
    const item = findItem(id);
    if (item) {
        item.firstName = details.firstName;
        item.lastName = details.lastName;
        item.email = details.email;
        return Promise.resolve(item);
    }
    else {
        return Promise.resolve(null);
    }
};

const deleteItem = id => {
    const index = findItemIndex(id);
    if (index >= 0) {
        nameList.splice(index, 1);
        return Promise.resolve(true);
    }
    else {
        return Promise.resolve(false);
    }
};

const findItem = id => nameList.find(elementWithId(id));

const findItemIndex = id => nameList.findIndex(elementWithId(id));

const elementWithId = id => e => e.id === id;

module.exports = {
    createItem,
    readAllItems,
    readItem,
    updateItem,
    deleteItem
};
