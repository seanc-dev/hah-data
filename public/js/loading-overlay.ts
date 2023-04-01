document.addEventListener("appready", function () {
	console.log("appready event fired");
	const overlay = document.getElementById("loadingOverlay");
	if (!overlay) return;
	overlay.classList.add("page-loaded");
	setTimeout(() => {
		overlay.classList.add("d-none");
	}, 1200);
});
