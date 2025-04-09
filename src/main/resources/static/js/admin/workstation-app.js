/*  /js/admin/workstation-app.js  */
const WorkstationApp = (function() {
	console.log("bindTabLinks() 実行された");

	const tabContainer = document.getElementById('tab-content-area');
	const clockEl = document.getElementById('clock');
	const messageEl = document.getElementById('system-message');
	const shopId = document.body.dataset.shopId;

	const tabCache = {
		menu: { currentHTML: null, listHTML: null },
		table: { currentHTML: null, listHTML: null },
		order: { currentHTML: null, listHTML: null }
	};
	let currentView = null;

	// ✅ ← ここに追加（WorkstationApp 内）
	function bindTabLinks() {
		tabContainer.addEventListener('click', e => {
			const target = e.target.closest('[data-tab-link]');
			if (!target) return;

			e.preventDefault();
			const href = target.getAttribute('href');
			const view = target.dataset.view;

			fetch(href)
				.then(res => res.text())
				.then(html => {
					tabContainer.innerHTML = html;
					tabCache[view].currentHTML = html; // キャッシュ上書き
					showMessage("画面を切り替えました");
					runTabInit(view);
				})
				.catch(err => {
					tabContainer.innerHTML = `<p class="text-danger">画面の読み込みに失敗しました</p>`;
					console.error(err);
				});
		});
	}

	// ...（他の関数省略）

	function init() {
		if (!tabContainer || !shopId) return;
		startClock();
		bindTabEvents();
		bindTabLinks(); // ✅ ここで呼ぶ！
		handleHashChange();
		window.addEventListener('hashchange', handleHashChange);
	}

	return {
		init: init,
		showMessage: showMessage
	};
})();
