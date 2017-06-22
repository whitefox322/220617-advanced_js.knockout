const UsersList = require("../models/users-list");

function init(usersJson) {
	const users = new UsersList(usersJson);
	return new UsersController(users);
}

class UsersController {
	constructor(users) {
		this.users = users;
	}

	add(req, res) {
		let user = req.body;
		if (!user) {
			return res.status(400)
				.send({
					message: "Please check arguments you sent to server. Request body is empty!"
				});
		}

		user = this.users.add(user);
		return res.send(user);
	}

	update(req, res) {
		let updatedUser = req.body || {};

		let status = 200,
			response;
		try {
			response = this.users.update(updatedUser);
		} catch(e) {
			status = 400;
			response = {
				message: e.message
			};
		}

		return res.status(status)
			.send(response);
	}

	get(req, res) {
		const id = req.params.id,
			data = this.users.get(id);

		res.status(data ? 200 : 404)
			.send(data);
	}

	paged(req, res) {
		const paged = this.users.paged(req.params.page, req.params.limit);
		if (paged.page > paged.totalPages) {
			return res.status(404).end();
		}

		return res.send(paged);
	}

	pagedPreview(req, res) {
		const paged = this.users.pagedSnapshots(req.params.page, req.params.limit);
		if (paged.page > paged.totalPages) {
			return res.status(404).end();
		}

		return res.send(paged);
	}

	del(req, res) {
		const id = req.params.id;
		const u = this.users.get(id);

		if (!u) {
			return res.status(400)
				.end();
		}

		this.users.remove(id);
		res.send(u);
	}
}

exports.init = init;