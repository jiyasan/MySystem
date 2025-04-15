function initOrderList() {
	console.log("[initOrderList] 🧾 オーダータブ初期化OK！");

	const buttons = document.querySelectorAll(".tab-btn-group button");
	const views = document.querySelectorAll(".tab-view");

	const accordionState = {}; // タブ単位で保持

	buttons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const target = btn.getAttribute("data-target");

			// 現在のタブで開いていた collapse ID を記録
			const activeView = document.querySelector(".tab-view.active");
			if (activeView) {
				const openIds = Array.from(activeView.querySelectorAll(".accordion-collapse.show"))
					.map(acc => acc.id);
				accordionState[activeView.id] = openIds;
			}

			// タブ切り替え
			views.forEach((view) => view.classList.remove("active"));
			const targetView = document.querySelector(`#tab-${target}`);
			if (targetView) {
				targetView.classList.add("active");

				// 過去に開いていたIDだけ再度 .show を追加（それ以外は触らない）
				const openIds = accordionState[`tab-${target}`] || [];
				openIds.forEach(id => {
					const acc = document.getElementById(id);
					if (acc && !acc.classList.contains("show")) {
						acc.classList.add("show");
					}
				});
			}

			// ボタン切り替え
			buttons.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");
		});
	});
}

window.initOrderList = initOrderList;
