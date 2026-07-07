const { getUsers, parseBody, json } = require("../_lib/store");

module.exports = function handler(req, res) {
  const users = getUsers();
  const { id } = req.query;
  const idx = users.findIndex((user) => String(user.id) === String(id));

  if (req.method === "GET") {
    if (idx === -1) {
      return json(res, 404, { message: "User not found" });
    }
    return json(res, 200, users[idx]);
  }

  if (req.method === "PUT") {
    if (idx === -1) {
      return json(res, 404, { message: "User not found" });
    }

    const payload = parseBody(req);
    if (!payload || typeof payload !== "object") {
      return json(res, 400, { message: "Invalid request body" });
    }

    const nextUser = { ...payload, id: String(id) };
    users[idx] = nextUser;
    return json(res, 200, nextUser);
  }

  if (req.method === "PATCH") {
    if (idx === -1) {
      return json(res, 404, { message: "User not found" });
    }

    const payload = parseBody(req);
    if (!payload || typeof payload !== "object") {
      return json(res, 400, { message: "Invalid request body" });
    }

    users[idx] = { ...users[idx], ...payload, id: String(id) };
    return json(res, 200, users[idx]);
  }

  if (req.method === "DELETE") {
    if (idx === -1) {
      return json(res, 404, { message: "User not found" });
    }

    const deleted = users.splice(idx, 1)[0];
    return json(res, 200, deleted);
  }

  res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
  return json(res, 405, { message: "Method Not Allowed" });
};
