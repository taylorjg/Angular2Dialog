'use strict';

const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
const client = redis.createClient();

client.on('error', err => console.error(`Redis error: ${err}`));

const createItem = details =>
    client.incrAsync('item:').then(id => {
        const key = `item:${id}`;
        return client.zaddAsync('items:', id, key).then(() => {
            const item = Object.assign({}, details, { id });
            return client.hmsetAsync(`item:${id}`, item).then(() => item);
        });
    });

const readAllItems = () =>
    client.zrangeAsync('items:', 0, -1).then(keys =>
        Promise.map(keys, key => client.hgetallAsync(key)));

const readItem = id =>
    client.hgetallAsync(`item:${id}`);

const updateItem = (id, details) => {
    const key = `item:${id}`;
    return client.hgetallAsync(key).then(item => {
        if (item) {
            item.firstName = details.firstName;
            item.lastName = details.lastName;
            item.email = details.email;
            return client.hmsetAsync(key, item).then(() => item);
        }
        return null;
    });
};

const deleteItem = id => {
    const key = `item:${id}`;
    return client.hkeysAsync(key).then(fieldNames =>
        client.hdelAsync(key, fieldNames).then(numFieldsRemoved => {
            if (numFieldsRemoved === fieldNames.length) {
                return client.zremAsync('items:', key).then(numMembersRemoved =>
                    numMembersRemoved === 1);
            }
            return false;
        }));
};

module.exports = {
    createItem,
    readAllItems,
    readItem,
    updateItem,
    deleteItem
};
