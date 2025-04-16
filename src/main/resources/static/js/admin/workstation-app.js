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

				// ✅ 編集：描画後に初期化を遅延実行（DOM確定後）
				requestAnimationFrame(() => {
					console.log("[DEBUG] DOM rendering completed, calling _runInit:", view);
					manager._runInit(view);
				});


				// ✅ 動的 import（フォーム用JSなど）
				if (target.href.includes("/menu/add")) {
					import("/js/admin/category_form.js")
						.then(mod => mod.initCategoryForm?.())
						.catch(err => console.error("initCategoryForm 読み込み失敗", err));
				}

				if (target.href.includes("/menu/") && target.href.includes("/edit")) {
					import("/js/admin/edit_category_form.js")
						.then(mod => mod.initEditCategoryForm?.())
						.catch(err => console.error("initEditCategoryForm 読み込み失敗", err));
				}
			})
			.catch(err => {
				console.error("[Tab内遷移失敗]", err);
				manager.tabContainer.innerHTML = `<div class='text-danger'>読み込みに失敗しました</div>`;
			});
	});
});
