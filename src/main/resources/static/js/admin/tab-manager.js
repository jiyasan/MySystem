export class TabManager {
	constructor(containerId) {
		this.tabContainer = document.getElementById(containerId);
		if (!this.tabContainer) throw new Error(`Tab container #${containerId} not found`);
		this.tabs = {}; // { menu: { url, initFnName, currentNode, listNode, initialized } }
		this.currentView = null;
	}

	addTab(viewName, { url, initFnName }) {
		this.tabs[viewName] = {
			url,
			initFnName,
			currentNode: null,
			listNode: null,
			initialized: false
		};
	}

	loadTab(viewName, forceList = false) {
		const tab = this.tabs[viewName];
		if (!tab) {
			this._showError(`[TabManager] 未登録のタブ: ${viewName}`);
			return;
		}

		// 同一タブ再クリック → listNodeに戻す
		if (viewName === this.currentView && !forceList && tab.listNode) {
			this._swapContent(tab.listNode);
			tab.currentNode = tab.listNode;
			this._runInit(viewName);
			return;
		}

		// 再表示（キャッシュあり）
		if (tab.currentNode && !forceList) {
			this._swapContent(tab.currentNode);
			this._runInit(viewName);
			this.currentView = viewName;
			return;
		}

		// 初回取得
		fetch(tab.url)
			.then(res => {
				if (!res.ok) throw new Error("fetch失敗");
				return res.text();
			})
			.then(html => {
				const wrapper = document.createElement("div");
				wrapper.innerHTML = html;

				this._swapContent(wrapper);
				tab.currentNode = wrapper;
				tab.listNode = wrapper;
				this._runInit(viewName);
				this.currentView = viewName;
				tab.initialized = true;
			})
			.catch(err => {
				this._showError(`[TabManager] 読み込み失敗: ${viewName}`);
				console.error(err);
			});
	}

	resetTab(viewName) {
		const tab = this.tabs[viewName];
		if (!tab?.listNode) return;
		this._swapContent(tab.listNode);
		tab.currentNode = tab.listNode;
		this._runInit(viewName);
	}

	_runInit(viewName) {
		const tab = this.tabs[viewName];
		if (!tab?.initFnName) return;

		const fn = window[tab.initFnName];

		if (typeof fn === "function") {
			fn();
		} else {
			console.warn(`[TabManager] 初期化関数 ${tab.initFnName} が存在しません → 読み込み試行`);

			const script = document.createElement("script");
			script.type = "module";
			script.src = `/js/admin/${viewName}_list.js`;
			script.onload = () => {
				if (typeof window[tab.initFnName] === "function") {
					window[tab.initFnName]();
				} else {
					console.error(`[TabManager] ${tab.initFnName} は読み込み後も存在しません`);
				}
			};
			script.onerror = () => {
				console.error(`[TabManager] スクリプトの読み込みに失敗: ${script.src}`);
			};
			document.body.appendChild(script);
		}
	}

	_swapContent(node) {
		this.tabContainer.innerHTML = "";
		this.tabContainer.appendChild(node);
	}

	_showError(msg) {
		this.tabContainer.innerHTML = `<div class='text-danger'>${msg}</div>`;
	}
}
