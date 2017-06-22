const uuid = require("uuid");

class User {
	constructor(json) {
		this.id = (json.id || "").toLowerCase();
		this.fullName = json.fullName;
		this.birthday = new Date(json.birthday);
		this.profession = json.profession;
		this.email = json.email;
		this.address = json.address;
		this.country = json.country;
		this.shortInfo = json.shortInfo;
		this.fullInfo = json.fullInfo;
		this.photo = json.photo || "http://loremflickr.com/150/150/boy?random=" + uuid.v4()
	}

	isSame(other) {
		return this.id === other.id;
	}
}

module.exports = User;