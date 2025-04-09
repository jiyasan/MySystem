// static/js/admin/menu_list.js

window.initMenuList = function () {
  console.log("✅ menu_list.js loaded");

document.querySelectorAll(".category-toggle").forEach(btn => {
	btn.addEventListener("click", () => {
		const categoryId = btn.dataset.categoryId;
		const area = document.getElementById("category-" + categoryId);
		const icon = btn.querySelector(".toggle-icon");
		if (area) {
			const isOpen = area.style.display !== "none";
			area.style.display = isOpen ? "none" : "block";
			if (icon) icon.textContent = isOpen ? "▶" : "▼";
		}
	});
});

document.querySelectorAll(".subcategory-toggle").forEach(btn => {
	btn.addEventListener("click", () => {
		const subId = btn.dataset.subcategoryId;
		const area = document.getElementById("subcategory-" + subId);
		const icon = btn.querySelector(".toggle-icon");
		if (area) {
			const isOpen = area.style.display !== "none";
			area.style.display = isOpen ? "none" : "block";
			if (icon) icon.textContent = isOpen ? "▶" : "▼";
		}
	});
});


  document.querySelectorAll(".category-toggle a").forEach(a =>
  a.addEventListener("click", e => e.stopPropagation())
);

};
