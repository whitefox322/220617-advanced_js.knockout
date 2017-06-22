const express = require("express");
const nodeStatic = require("node-static");
const bodyParser = require("body-parser");
const fs = require("fs");
const userHandlerInit = require("./backend/handlers/user-handler").init;

const
	file = new nodeStatic.Server("."),
	app = express(),
	USERS_PATH = __dirname + "/resources/data.json",
	LISTEN_PORT = 8081;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const usersJsonStr = fs.readFileSync(USERS_PATH, "utf8");
const users = JSON.parse(usersJsonStr);
const userHandler = userHandlerInit(users);

app.get("/api/users/:id", userHandler.get.bind(userHandler));
app.get("/api/users/:page/:limit", userHandler.paged.bind(userHandler));
app.get("/api/users/:page/:limit/preview", userHandler.pagedPreview.bind(userHandler));

app.post("/api/users", userHandler.add.bind(userHandler));
app.put("/api/users", userHandler.update.bind(userHandler));
app.delete("/api/users/:id", userHandler.del.bind(userHandler));

app.get("/api/countries", function (req, res) {
	const c = [];
	for (let i = 0; i < users.length; i++) {
		if (c.indexOf(users[i].country) === -1) {
			c.push(users[i].country);
		}
	}

	res.send(c);
});

console.log("Users API is ready...");

app.get("*", function (req, res) {
	file.serve(req, res);
});

app.listen(LISTEN_PORT);
console.log("Listen port " + LISTEN_PORT);