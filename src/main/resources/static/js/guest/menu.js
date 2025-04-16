const cart = {};

function addToCart(item) {
	if (!cart[item.id]) cart[item.id] = { item: item, quantity: 0 };
	cart[item.id].quantity += 1;
	updateQuantityDisplays();
}

function removeFromCart(item) {
	if (!cart[item.id]) return;
	cart[item.id].quantity -= 1;
	if (cart[item.id].quantity < 0) cart[item.id].quantity = 0;
	updateQuantityDisplays();
}

function updateQuantityDisplays() {
	Object.entries(cart).forEach(([id, entry]) => {
		const els = document.querySelectorAll(`[data-id="${id}"]`);
		els.forEach(el => el.textContent = entry.quantity);
	});
}

function renderItems(items) {
	const panel = document.getElementById("menu-panel");
	panel.innerHTML = '';
	window._debugItems = items;

	items.forEach(item => {
		if (!item.visible) return;
		const qty = cart[item.id]?.quantity || 0;

		const col = document.createElement("div");
		col.classList.add("col-6", "border", "p-1");

		const card = document.createElement("div");
		card.classList.add("card", "h-100");
		card.onclick = () => openItemModal(item);

		card.innerHTML = `
			<div class="d-flex align-items-start">
				<div class="flex-grow-1 p-2">
					<h5>${item.name}</h5>
					<p class="text-muted">${item.detail}</p>
					<p class="fw-bold">${item.price}円</p>
				</div>
				<div class="p-2">
					${item.image ? `<img src="${item.image}" class="img-fluid" style="max-width: 100px;">` : ''}
					<div class="mt-2 d-flex align-items-center gap-1">
						<button class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation(); removeFromCart(window._debugItems.find(i => i.id === ${item.id}))">−</button>
						<span class="fw-bold" data-id="${item.id}">${qty}</span>
						<button class="btn btn-sm btn-outline-secondary" onclick="event.stopPropagation(); addToCart(window._debugItems.find(i => i.id === ${item.id}))">＋</button>
					</div>
				</div>
			</div>
		`;

		col.appendChild(card);
		panel.appendChild(col);
	});
}

function renderSubcategories(subs) {
	const sidebar = document.getElementById("subcategory-sidebar");
	sidebar.innerHTML = '';
	subs.forEach(sub => {
		const btn = document.createElement("button");
		btn.textContent = sub.name;
		btn.classList.add("btn", "btn-light", "w-100", "border", "mb-1");
		btn.onclick = () => filterItemsBySubcategory(sub.id);
		sidebar.appendChild(btn);
	});
}

function filterItemsBySubcategory(subId) {
	const cards = document.querySelectorAll('#menu-panel .col-6');
	cards.forEach(card => {
		const match = card.querySelector(`[data-subcategory-id="${subId}"]`);
		card.style.display = match ? 'block' : 'none';
	});
}

function openItemModal(item) {
	const modal = new bootstrap.Modal(document.getElementById('item-modal'));
	const modalBody = document.querySelector('#item-modal .modal-body');

	const qty = cart[item.id]?.quantity || 0;

	modalBody.innerHTML = `
		<div class="text-center">
			${item.image ? `<img src="${item.image}" class="img-fluid mb-3" alt="${item.name}">` : ''}
			<h5>${item.name}</h5>
			<p>${item.detail}</p>
			<p class="fw-bold mb-2">${item.price}円</p>
			<div class="d-flex justify-content-center align-items-center gap-2">
				<button class="btn btn-outline-secondary btn-sm" onclick="removeFromCartAndUpdate(${item.id})">−</button>
				<span class="fw-bold fs-5" id="modal-qty-${item.id}">${qty}</span>
				<button class="btn btn-outline-secondary btn-sm" onclick="addToCartAndUpdate(${item.id})">＋</button>
			</div>
		</div>
	`;

	modal.show();
}

function addToCartAndUpdate(id) {
	addToCart(window._debugItems.find(i => i.id === id));
	document.getElementById(`modal-qty-${id}`).textContent = cart[id]?.quantity || 0;
	updateQuantityDisplays();
}

function removeFromCartAndUpdate(id) {
	removeFromCart(window._debugItems.find(i => i.id === id));
	document.getElementById(`modal-qty-${id}`).textContent = cart[id]?.quantity || 0;
	updateQuantityDisplays();
}

function renderCartModal() {
	const container = document.getElementById('cart-content');
	if (!container) return;

	const items = Object.values(cart).filter(({ quantity }) => quantity > 0);
	if (items.length === 0) {
		container.innerHTML = '<p>カートが空です。</p>';
		return;
	}

	let html = '<ul class="list-group">';
	items.forEach(({ item, quantity }) => {
		html += `
			<li class="list-group-item d-flex justify-content-between align-items-center">
				<div>
					<strong>${item.name}</strong><br>
					<small class="text-muted">${item.price}円</small>
				</div>
				<div class="d-flex gap-2 align-items-center">
					<button class="btn btn-sm btn-outline-secondary" onclick="removeFromCartAndRender(${item.id})">−</button>
					<span class="fw-bold">${quantity}</span>
					<button class="btn btn-sm btn-outline-secondary" onclick="addToCartAndRender(${item.id})">＋</button>
				</div>
			</li>
		`;
	});
	html += '</ul>';
	container.innerHTML = html;
}

function addToCartAndRender(id) {
	addToCart(window._debugItems.find(i => i.id === id));
	renderCartModal();
	updateQuantityDisplays();
}

function removeFromCartAndRender(id) {
	removeFromCart(window._debugItems.find(i => i.id === id));
	renderCartModal();
	updateQuantityDisplays();
}

document.getElementById('cart-button').addEventListener('click', () => {
	renderCartModal();
	new bootstrap.Modal(document.getElementById('cart-modal')).show();
});

document.getElementById('cart-modal').addEventListener('hidden.bs.modal', () => {
	for (const [id, { quantity }] of Object.entries(cart)) {
		if (quantity === 0) delete cart[id];
	}
	updateQuantityDisplays();
});

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

window.addEventListener('DOMContentLoaded', () => {
	const firstCategory = document.querySelector('#category-navbar .nav-link');
	if (firstCategory) {
		const categoryId = firstCategory.getAttribute('data-category-id');
		updateSubcategoriesAndItems(categoryId);
	}

	document.querySelectorAll('#category-navbar .nav-link').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
			const categoryId = link.getAttribute('data-category-id');
			updateSubcategoriesAndItems(categoryId);
		});
	});
});
