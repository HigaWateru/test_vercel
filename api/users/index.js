const { getUsers, parseBody, json } = require("../_lib/store");

module.exports = function handler(req, res) {
  const users = getUsers();

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

  res.setHeader("Allow", "GET, POST");
  return json(res, 405, { message: "Method Not Allowed" });
};
