module.exports = {
	fillArray: function (l) {
		let a;
		for (a = []; 0 < l; l -= 1, a[l] = 0);
		return a;
	},
};
