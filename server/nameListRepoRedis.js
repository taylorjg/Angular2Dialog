'use strict';

const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);

const client = process.env.REDIS_URL
    ? redis.createClient(process.env.REDIS_URL)
    : redis.createClient();

client.on('error', err => console.error(`Redis error: ${err}`));

const createItem = details =>
    client.incrAsync('item:')
        .then(id => {
            const key = `item:${id}`;
            const item = Object.assign({}, details, { id });
            return client.hmsetAsync(key, item).then(() => [key, item]);
        })
        .then(arr => {
            const key = arr[0];
            const item = arr[1];
            return client.rpushAsync('items:', key).then(() => item);
        });

const readAllItems = () =>
    client.lrangeAsync('items:', 0, -1)
        .then(keys => Promise.map(keys, key => client.hgetallAsync(key)));

const readItem = id =>
    client.hgetallAsync(`item:${id}`);

const updateItem = (id, details) => {
    const key = `item:${id}`;
    return client.hgetallAsync(key)
        .then(item => {
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
    return client.lremAsync('items:', 0, key)
        .then(numRemoved =>
            numRemoved > 0 ? client.hkeysAsync(key) : [])
        .then(fieldNames =>
            fieldNames.length > 0 ? client.hdelAsync(key, fieldNames).then(() => true) : false);
};

module.exports = {
    createItem,
    readAllItems,
    readItem,
    updateItem,
    deleteItem
};
