const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => console.log("Redis Error:", err));
client.on("connect", () => console.log("Connected to Redis"));

// Example function to cache data
async function setCache(key, value, expiry = 3600) {
    await client.set(key, JSON.stringify(value), "EX", expiry);
}

async function getCache(key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
}

module.exports = { setCache, getCache };
