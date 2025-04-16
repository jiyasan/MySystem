const cart = {};                   // ← すでにあるカートオブジェクト

// 1. カートモーダルを開いた瞬間のアイテムID一覧を保存しておく
let cartSnapshotIds = new Set();

document.getElementById('cart-button').addEventListener('click', () => {
	// snapshot を作成（この時点で存在してた商品IDだけ記録）
	cartSnapshotIds = new Set(
		Object.entries(cart)
			.filter(([_, { quantity }]) => quantity > 0)
			.map(([id]) => id)
	);

	renderCartModal();
	new bootstrap.Modal(document.getElementById('cart-modal')).show();
});

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
		const link = document.createElement("a");
		link.textContent = sub.name;
		link.href = "#";
		link.classList.add("d-block", "text-decoration-none", "py-1", "px-2", "border-bottom", "text-dark");
		link.setAttribute("data-sub-id", sub.id);

		link.addEventListener("click", e => {
			e.preventDefault();
			filterItemsBySubcategory(sub.id);
		});

		sidebar.appendChild(link);
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

	// 全商品対象、quantity 0含む
	const items = Object.values(cart);

	if (items.length === 0 || !Object.keys(cart).some(id => cartSnapshotIds.has(id))) {
		container.innerHTML = '<p>カートが空です。</p>';
		return;
	}

	let html = '<ul class="list-group">';
	items.forEach(({ item, quantity }) => {
		// ✅ 表示条件：カートスナップショット時に存在していた or quantity > 0
		if (quantity <= 0 && !cartSnapshotIds.has(String(item.id))) return;

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

	html += `
		<div class="mt-3 text-end">
			<button class="btn btn-success" onclick="submitOrder()">✅ 注文を送信する</button>
		</div>
	`;

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

function initCategoryScrollWatcher() {
	const navbar = document.getElementById('category-navbar');
	if (!navbar) return;

	let timeoutId = null;

	navbar.addEventListener('scroll', () => {
		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			const children = [...navbar.children];
			const leftEdge = navbar.scrollLeft;

			let closest = null;
			let minDist = Infinity;

			for (const el of children) {
				const dist = Math.abs(el.offsetLeft - leftEdge);
				if (dist < minDist) {
					closest = el;
					minDist = dist;
				}
			}

			if (closest) {
				children.forEach(el => el.classList.remove('active'));
				closest.classList.add('active');

				const categoryId = closest.getAttribute('data-category-id');
				if (categoryId) {
					updateSubcategoriesAndItems(categoryId);
				}
			}
		}, 100); // 遅延で発火
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

window.submitOrder = function () {
	const sessionId = document.body.dataset.sessionId;
	const shopId = Number(document.body.dataset.shopId);
	const createdBy = document.body.dataset.nickname || "anonymous";
	const note = prompt("注文にメモがあれば入力してください：", "");

	const items = Object.values(cart)
		.filter(({ quantity }) => quantity > 0)
		.map(({ item, quantity }) => ({
			menuItemId: item.id,
			quantity,
			nickname: createdBy,
			colorCode: document.body.dataset.nicknameColor || "#999",
			status: 0
		}));

	if (items.length === 0) {
		alert("カートが空です");
		return;
	}

	const totalPrice = items.reduce((sum, item) => {
		const found = window._debugItems.find(i => i.id === item.menuItemId);
		return sum + (found ? found.price * item.quantity : 0);
	}, 0);

	const payload = {
		sessionId,
		shopId,
		note: note || "",
		createdBy,
		totalPrice,
		items
	};

	fetch('/guest/api/order', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
	.then(res => {
		if (!res.ok) throw new Error("送信失敗");
		return res.text();
	})
	.then(()=> {
		alert("✅ 注文を送信しました！");
		Object.keys(cart).forEach(key => delete cart[key]);
		updateQuantityDisplays();
		renderCartModal();

const modalEl = document.getElementById('cart-modal');
const modal = bootstrap.Modal.getInstance(modalEl);
if (modal) {
	modal.hide();
} 

// ✅ モーダルを閉じる処理のあとにコレ入れる（submitOrderの.then内）
setTimeout(() => {
	document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
	document.body.classList.remove('modal-open');
	document.body.style = ""; // ← 余計なスタイル解除
}, 300); // アニメーション完了を待つ

	})
	.catch(err => {
		alert("❌ 注文送信中にエラーが発生しました");
		console.error(err);
	});
}

window.addEventListener('DOMContentLoaded', () => {
	initCategoryScrollWatcher();
});

