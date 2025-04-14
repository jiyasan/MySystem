// /js/admin/workstation-app.js

import { TabManager } from "./tab-manager.js";

// ✅ DOM構成での表示対象コンテナ
const shopId = document.body.dataset.shopId;
const manager = new TabManager("tab-content-area");

// ✅ 各タブを登録
manager.addTab("menu", {
	url: `/admin/${shopId}_dashboard/workstation/menu/list`,
	initFnName: "initMenuList"
});

manager.addTab("table", {
	url: `/admin/${shopId}_dashboard/workstation/table/list`,
	initFnName: "initTableList"
});

manager.addTab("order", {
	url: `/admin/${shopId}_dashboard/workstation/order/list`,
	initFnName: "initOrderList"
});

window.addEventListener("DOMContentLoaded", () => {
	const hash = location.hash.replace("#", "") || "menu";
	manager.loadTab(hash);

	// ✅ 上部タブクリック処理
	document.querySelectorAll(".dashboard-tab-button").forEach(btn => {
		const view = btn.dataset.view;
		btn.addEventListener("click", e => {
			e.preventDefault();
			if (manager.currentView === view) {
				manager.resetTab(view); // 再クリックで初期表示に戻す
			} else {
				location.hash = view;
			}
		});
	});

	// ✅ hashchange対応（タブ切替）
	window.addEventListener("hashchange", () => {
		const view = location.hash.replace("#", "") || "menu";
		manager.loadTab(view);
	});

	// ✅ タブ内リンク対応（例: メニュー詳細から戻るなど）
	document.addEventListener("click", e => {
		const target = e.target.closest("a[data-tab-link]");
		if (!target) return;
		e.preventDefault();

		const view = target.dataset.view;
		const tab = manager.tabs[view];
		if (!tab) return;

		fetch(target.href)
			.then(res => res.text())
			.then(html => {
				const wrapper = document.createElement("div");
				wrapper.innerHTML = html;
				manager.tabContainer.innerHTML = "";
				manager.tabContainer.appendChild(wrapper);
				tab.currentNode = wrapper;
				manager._runInit(view);
			})
			.catch(err => {
				console.error("[Tab内遷移失敗]", err);
				manager.tabContainer.innerHTML = `<div class='text-danger'>読み込みに失敗しました</div>`;
			});
	});
});
