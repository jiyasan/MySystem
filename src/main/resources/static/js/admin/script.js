const WorkstationApp = (function () {
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

  function loadTabView(view, forceList = false) {
    // 再クリック時に listHTML を使ってリセット
    if (view === currentView && !forceList && tabCache[view]?.listHTML) {
      tabContainer.innerHTML = tabCache[view].listHTML;
      tabCache[view].currentHTML = tabCache[view].listHTML;
      setActiveTab(view);
      showMessage(`${getTabLabel(view)}を表示中`);
      currentView = view;
      runTabInit(view); // 🔁 初期化関数を必ず呼ぶ
      return;
    }

    // 通常キャッシュから復元
    if (tabCache[view]?.currentHTML && !forceList) {
      tabContainer.innerHTML = tabCache[view].currentHTML;
      setActiveTab(view);
      showMessage(`${getTabLabel(view)}を表示中`);
      currentView = view;
      runTabInit(view); // 🔁 初期化関数を必ず呼ぶ
      return;
    }

    // サーバーから読み込み
    const url = `/admin/${shopId}_dashboard/workstation/${view}/list`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("読み込み失敗");
        return res.text();
      })
      .then(html => {
        tabContainer.innerHTML = html;
        tabCache[view] = {
          currentHTML: html,
          listHTML: html
        };
        setActiveTab(view);
        showMessage(`${getTabLabel(view)}を表示中`);
        currentView = view;

        // JSファイル動的読み込み（初回のみ）
        let scriptPath = null;
        if (view === "menu") scriptPath = "/js/admin/menu_list.js";
        if (view === "table") scriptPath = "/js/admin/table.js";
        if (view === "order") scriptPath = "/js/admin/order.js";

        if (scriptPath) {
          const script = document.createElement("script");
          script.src = scriptPath;
          script.defer = true;
          script.onload = () => runTabInit(view); // ✅ 読み込み後に初期化
          document.body.appendChild(script);
        } else {
          runTabInit(view); // ✅ scriptPathなしでも実行（保険）
        }
      })
      .catch(err => {
        tabContainer.innerHTML = `<div class="text-danger">ビューの読み込みに失敗しました</div>`;
        showMessage("ビューの読み込みに失敗しました");
        console.error(err);
      });
  }

  function runTabInit(view) {
    if (view === "menu" && typeof window.initMenuList === "function") {
      window.initMenuList();
    }
    if (view === "table" && typeof window.initTableList === "function") {
      window.initTableList();
    }
    if (view === "order" && typeof window.initOrderList === "function") {
      window.initOrderList();
    }
  }

  function setActiveTab(view) {
    document.querySelectorAll('.dashboard-tab-button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === view) {
        btn.classList.add('active');
      }
    });
  }

  function getTabLabel(view) {
    switch (view) {
      case 'table': return 'テーブル一覧';
      case 'menu': return 'メニュー一覧';
      case 'order': return 'オーダー一覧';
      default: return '不明なビュー';
    }
  }

  function showMessage(text) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.add('visible');
    setTimeout(() => {
      messageEl.classList.remove('visible');
      messageEl.textContent = '';
    }, 5000);
  }

  function startClock() {
    if (!clockEl) return;
    const update = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      clockEl.textContent = time;
    };
    update();
    setInterval(update, 1000);
  }

  function handleHashChange() {
    const hash = location.hash.replace('#', '') || 'table';
    loadTabView(hash);
  }

  function bindTabEvents() {
    document.querySelectorAll('.dashboard-tab-button').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const view = btn.dataset.view;

        // 再クリックで一覧リセット
        if (view === currentView) {
          loadTabView(view, true);
        } else {
          location.hash = view;
        }
      });
    });
  }

  function init() {
    if (!tabContainer || !shopId) return;
    startClock();
    bindTabEvents();
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
  }

  return {
    init: init,
    showMessage: showMessage
  };
})();

window.addEventListener('DOMContentLoaded', () => {
  WorkstationApp.init();
});
