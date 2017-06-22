class PagedSet {
	constructor(data, currPage, totalItems, limit) {
		this.data = data;
		this.page = +currPage;
		this.totalItems = +totalItems;
		this.limit = +limit;
		this.totalPages = Math.ceil(this.totalItems / this.limit);
	}
}
module.exports = PagedSet;