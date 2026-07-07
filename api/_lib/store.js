const initialDb = require("../../server/db.json");

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getDb() {
  if (!globalThis.__projectManagerDb) {
    globalThis.__projectManagerDb = deepClone(initialDb);
  }
  return globalThis.__projectManagerDb;
}

function getUsers() {
  const db = getDb();
  if (!Array.isArray(db.users)) {
    db.users = [];
  }
  return db.users;
}

function parseBody(req) {
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body;
}

function json(res, statusCode, data) {
  res.status(statusCode).json(data);
}

module.exports = {
  getUsers,
  parseBody,
  json,
};
