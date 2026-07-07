const { getUsers, parseBody, json } = require("../_lib/store");

module.exports = function handler(req, res) {
  const users = getUsers();
  const id = req.query && req.query.id ? String(req.query.id) : null;
  const idx = id ? users.findIndex((user) => String(user.id) === id) : -1;

  if (id && req.method === "GET") {
    if (idx === -1) return json(res, 404, { message: "User not found" });
    return json(res, 200, users[idx]);
  }

  if (id && req.method === "PUT") {
    if (idx === -1) return json(res, 404, { message: "User not found" });
    const payload = parseBody(req);
    if (!payload || typeof payload !== "object") {
      return json(res, 400, { message: "Invalid request body" });
    }
    const nextUser = { ...payload, id };
    users[idx] = nextUser;
    return json(res, 200, nextUser);
  }

  if (id && req.method === "PATCH") {
    if (idx === -1) return json(res, 404, { message: "User not found" });
    const payload = parseBody(req);
    if (!payload || typeof payload !== "object") {
      return json(res, 400, { message: "Invalid request body" });
    }
    users[idx] = { ...users[idx], ...payload, id };
    return json(res, 200, users[idx]);
  }

  if (id && req.method === "DELETE") {
    if (idx === -1) return json(res, 404, { message: "User not found" });
    const deleted = users.splice(idx, 1)[0];
    return json(res, 200, deleted);
  }

  if (req.method === "GET") {
    return json(res, 200, users);
  }

  if (req.method === "POST") {
    const payload = parseBody(req);
    if (!payload || typeof payload !== "object") {
      return json(res, 400, { message: "Invalid request body" });
    }

    if (!payload.id) {
      payload.id = String(Date.now());
    }

    users.push(payload);
    return json(res, 201, payload);
  }

  res.setHeader("Allow", "GET, POST, PUT, PATCH, DELETE");
  return json(res, 405, { message: "Method Not Allowed" });
};
