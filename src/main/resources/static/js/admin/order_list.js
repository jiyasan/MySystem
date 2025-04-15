// static/js/admin/order_list.js
function initOrderList() {
	console.log("[initOrderList] 🧾 オーダータブ初期化OK！");

	const buttons = document.querySelectorAll(".tab-btn-group button");
	const views = document.querySelectorAll(".tab-view");

	// タブごとの開いていたアコーディオンID（複数）を記録
	const accordionState = {};

	buttons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const target = btn.getAttribute("data-target");

			// 📌 現在アクティブなタブで「開いてるアコーディオンのID」を全部保存
			const activeView = document.querySelector(".tab-view.active");
			if (activeView) {
				const openAccordions = Array.from(activeView.querySelectorAll(".accordion-collapse.show"));
				accordionState[activeView.id] = openAccordions.map(acc => acc.id);
			}

			// タブ切り替え
			views.forEach((view) => view.classList.remove("active"));
			const targetView = document.querySelector(`#tab-${target}`);
			if (targetView) {
				targetView.classList.add("active");

				// 💡 保存された複数のアコーディオンを開く
				const prevOpenIds = accordionState[`tab-${target}`] || [];
				const allAccordions = targetView.querySelectorAll(".accordion-collapse");
				allAccordions.forEach(acc => acc.classList.remove("show")); // 全閉じ

				prevOpenIds.forEach(id => {
					const acc = targetView.querySelector(`#${id}`);
					if (acc) acc.classList.add("show");
				});
			}

			// ボタン状態切替
			buttons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
		});
	});
}

window.initOrderList = initOrderList;
