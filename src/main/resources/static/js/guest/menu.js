// 大分類選択時にサブカテゴリと商品を取得
function updateSubcategoriesAndItems(categoryId) {
	fetch(`/api/menu/category/${categoryId}`)
		.then(res => res.json())
		.then(data => {
			renderSubcategories(data.subcategories);
			renderItems(data.items);
		})
		.catch(err => {
			console.error("メニュー取得失敗", err);
		});
}

// 中分類ボタン描画
function renderSubcategories(subs) {
	const sidebar = document.getElementById("subcategory-sidebar");
	sidebar.innerHTML = '';
	subs.forEach(sub => {
		const btn = document.createElement("button");
		btn.textContent = sub.name;
		btn.classList.add("btn", "btn-outline-secondary", "w-100", "mb-2");
		btn.onclick = () => filterItemsBySubcategory(sub.id);
		sidebar.appendChild(btn);
	});
}

// 商品カード描画
function renderItems(items) {
		console.log("[DEBUG] 商品数:", items.length); // ← 追加
	console.log("[DEBUG] items =", items);       // ← 追加
	const panel = document.getElementById("menu-panel");
	panel.innerHTML = '';
	items.forEach(item => {
		if (!item.isVisible) return;

		const card = document.createElement("div");
		card.classList.add("card", "h-100");
		card.setAttribute("data-subcategory-id", item.subcategoryId);

		card.innerHTML = `
			<img src="${item.image}" class="card-img-top" alt="${item.name}">
			<div class="card-body">
				<h5 class="card-title">${item.name}</h5>
				<p class="card-text">${item.detail}</p>
				<p class="card-text"><strong>${item.price}円</strong></p>
			</div>
		`;

		const col = document.createElement("div");
		col.classList.add("col-6", "mb-3");
		col.appendChild(card);
		panel.appendChild(col);
	});
}

// 中分類フィルター
function filterItemsBySubcategory(subId) {
	const allItems = document.querySelectorAll("#menu-panel .card");
	allItems.forEach(card => {
		const isMatch = card.getAttribute("data-subcategory-id") == subId;
		card.parentElement.style.display = isMatch ? 'block' : 'none';
	});
}

// 初期動作：最初のカテゴリを自動読み込み
window.addEventListener('DOMContentLoaded', () => {
	const firstCategory = document.querySelector('#category-navbar .nav-link');
	if (firstCategory) {
		const categoryId = firstCategory.getAttribute('data-category-id');
		updateSubcategoriesAndItems(categoryId);
	}
});
