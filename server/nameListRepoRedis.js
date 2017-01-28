'use strict';

const redis = require('redis');
const client = redis.createClient();

client.on('error', err => console.error(`Redis error: ${err}`));

const createItem = (details, cb) => {
    client.incr('item:', (err, obj) => {
        const id = obj;
        const key = `item:${id}`;
        client.zadd('items:', id, key, (err, obj) => {
            const item = Object.assign({}, details, { id });
            client.hmset(`item:${id}`, item, (err, obj) => {
                cb(obj);
            });
        });
    });
};

const readAllItems = cb => {
    client.zrange('items:', 0, -1, (err, obj) => {
        const keys = obj;
        const items = [];
        keys.forEach((key, index) => {
            client.hgetall(key, (err, obj) => {
                items.push(obj);
                if (index === keys.length - 1) {
                    cb(items);
                }
            });
        });
    });
};

const readItem = (id, cb) =>
    client.hgetall(`item:${id}`, (err, obj) =>
        cb(obj));

const updateItem = (id, details, cb) => {
    const key = `item:${id}`;
    client.hgetall(key, (err, obj) => {
        const item = obj;
        if (item) {
            item.firstName = details.firstName;
            item.lastName = details.lastName;
            item.email = details.email;
            client.hmset(key, item, (err, obj) => {
                cb(item);
            });
        }
        else {
            cb(null);
        }
    });
};

const deleteItem = (id, cb) => {
    const key = `item:${id}`;
    client.hdel(key, ['firstName', 'lastName', 'email', 'id'], (err, obj) => {
        if (obj === 4) {
            client.zrem('items:', key, (err, obj) =>
                cb(obj === 1));
        }
        else {
            cb(false);
        }
    });
};

module.exports = {
    createItem,
    readAllItems,
    readItem,
    updateItem,
    deleteItem
};
