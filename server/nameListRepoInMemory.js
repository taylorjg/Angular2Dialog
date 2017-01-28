'use strict';

const nameList = [
    { id: 23, firstName: 'F1', lastName: 'L1', email: 'f1.l1@gmail.com' },
    { id: 24, firstName: 'F2', lastName: 'L2', email: 'f2.l2@gmail.com' },
    { id: 25, firstName: 'F3', lastName: 'L3', email: 'f3.l3@gmail.com' },
    { id: 26, firstName: 'F4', lastName: 'L4', email: 'f4.l4@gmail.com' }
];

let nextId = nameList.reduce((acc, item) => Math.max(acc, item.id), 0) + 1;

const createItem = (details, cb) => {
    const item = Object.assign({}, details);
    item.id = nextId++;
    nameList.push(item);
    cb(item);
};

const readAllItems = cb => cb(nameList);

const readItem = (id, cb) => cb(findItem(id));

const updateItem = (id, details, cb) => {
    const item = findItem(id);
    if (item) {
        item.firstName = details.firstName;
        item.lastName = details.lastName;
        item.email = details.email;
        cb(item);
    }
    else {
        cb(null);
    }
};

const deleteItem = (id, cb) => {
    const index = findItemIndex(id);
    if (index >= 0) {
        nameList.splice(index, 1);
        cb(true);
    }
    else {
        cb(false);
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
