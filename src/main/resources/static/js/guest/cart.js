// ✅ カート構造（itemIdをキー）
const cart = {};

// ✅ 数量加算
function addToCart(item) {
	if (!cart[item.id]) {
		cart[item.id] = { item, quantity: 1 };
	} else {
		cart[item.id].quantity++;
	}
	updateQuantityDisplays();
}

// ✅ 数量減算
function removeFromCart(item) {
	if (cart[item.id]) {
		cart[item.id].quantity--;
		if (cart[item.id].quantity <= 0) {
			delete cart[item.id];
		}
	}
	updateQuantityDisplays();
}

// ✅ 数量表示更新（全商品カードをスキャン）
function updateQuantityDisplays() {
	Object.values(cart).forEach(({ item, quantity }) => {
		const span = document.querySelector(`.qty-display[data-id="${item.id}"]`);
		if (span) span.textContent = quantity;
	});
	// 0のカードは空表示
	document.querySelectorAll('.qty-display').forEach(span => {
		if (!span.textContent || span.textContent === "0") {
			span.textContent = "";
		}
	});
}

// ✅ カートを空に
function clearCart() {
	for (let key in cart) {
		delete cart[key];
	}
	updateQuantityDisplays();
}

// ✅ 注文送信処理
function submitOrder() {
	const sessionId = document.body.dataset.sessionId;
	const deviceToken = localStorage.getItem("deviceToken");

	const items = Object.values(cart).map(({ item, quantity }) => ({
		menuItemId: item.id,
		quantity: quantity
	}));

	fetch('/api/orders', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ sessionId, deviceToken, items })
	})
		.then(res => {
			if (!res.ok) throw new Error();
			return res.json();
		})
		.then(() => {
			clearCart();
			const modal = bootstrap.Modal.getInstance(document.getElementById('cart-modal'));
			modal.hide();
			showGlobalMessage("ご注文をお受けしました！", 'success', 5000);
		})
		.catch(() => {
			showGlobalMessage("注文送信に失敗しました。再試行してください。", 'danger', 5000);
		});
}

// ✅ 共通メッセージ表示ユーティリティ
function showGlobalMessage(text, type = 'info', duration = 5000) {
	const el = document.getElementById("global-message");
	el.className = `alert alert-${type} text-center my-2`;
	el.textContent = text;
	el.style.display = 'block';
	setTimeout(() => el.style.display = 'none', duration);
}
