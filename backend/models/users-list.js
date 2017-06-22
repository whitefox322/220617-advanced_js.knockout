const User = require("./user");
const UserSnapshot = require("./userSnapshot");
const PagedSet = require("./pagedSet");
const uuid = require("uuid");

class UsersList {
	constructor(data) {
		if (typeof data === "string") {
			data = JSON.parse(data);
		}

		if (!Array.isArray(data)) {
			throw new Error("Only users array supported!");
		}
		this.__data = [];
		data.forEach(this.__prepend.bind(this));
	}

	get(id) {
		return this.__data.find(u => u.id === id);
	}

	paged(curPage, limit) {
		const startIndex = (curPage - 1) * limit;
		const data = this.__data.slice(startIndex, startIndex + +limit);
		return new PagedSet(data, curPage, this.__data.length, limit);
	}

	pagedSnapshots(curPage, limit) {
		const startIndex = (curPage - 1) * limit;
		const data = this.__data.slice(startIndex, startIndex + +limit);
		return new PagedSet(data.map(u => new UserSnapshot(u)), curPage, this.__data.length, limit);
	}

	add(user) {
		user = ensureUserInstance(user);
		user.id = uuid.v4();
		return this.__prepend(user);
	}

	update(newUser) {
		newUser = ensureUserInstance(newUser);
		const oldUser = this.get(newUser.id);

		if (oldUser) {
			this.remove(oldUser.id);
			return this.__prepend(newUser);
		} else {
			throw new Error("You cannot update. Specified user does not exists or have different id.");
		}
	}

	remove(id) {
		const known = this.get(id);
		if (known) {
			const index = this.__data.indexOf(known);
			this.__data.splice(index, 1);
		}
	}

	__prepend(user) {
		user = ensureUserInstance(user);
		this.__data.unshift(user);

		return user;
	}
}

function ensureUserInstance(u) {
	return u instanceof User ? u : new User(u);
}

module.exports = UsersList;