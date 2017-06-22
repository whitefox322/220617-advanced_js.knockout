class UserSnapshot {
	constructor(u) {
		this.id = u.id;
		this.photo = u.photo;
		this.fullName = u.fullName;
		this.country = u.country;
	}
}

module.exports = UserSnapshot;