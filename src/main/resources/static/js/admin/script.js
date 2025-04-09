const WorkstationApp = (function () {
  const tabContainer = document.getElementById('tab-content-area');
  const clockEl = document.getElementById('clock');
  const messageEl = document.getElementById('system-message');
  const shopId = document.body.dataset.shopId;

  // ビュー読み込み関数
  function loadTabView(view) {
    const url = `/admin/${shopId}_dashboard/workstation/${view}/list`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("読み込み失敗");
        return res.text();
      })
      .then(html => {
        tabContainer.innerHTML = html;
        setActiveTab(view);
        showMessage(`${getTabLabel(view)}を表示中`);

        let scriptPath = null;

        if (view === "menu") scriptPath = "/js/admin/menu_list.js";
        if (view === "table") scriptPath = "/js/admin/table.js";
        if (view === "order") scriptPath = "/js/admin/order.js";

        if (scriptPath) {
          const script = document.createElement("script");
          script.src = scriptPath;
          script.defer = true;
          script.onload = () => {
            // 動的読み込み後の初期化呼び出し
            if (view === "menu" && typeof window.initMenuList === "function") {
              window.initMenuList();
            }
            if (view === "table" && typeof window.initTableList === "function") {
              window.initTableList();
            }
            if (view === "order" && typeof window.initOrderList === "function") {
              window.initOrderList();
            }
          };
          document.body.appendChild(script);
        }

      })
      .catch(err => {
        tabContainer.innerHTML = `<div class="text-danger">ビューの読み込みに失敗しました</div>`;
        showMessage("ビューの読み込みに失敗しました");
        console.error(err);
      });
  }

  // タブのアクティブ切替
  function setActiveTab(view) {
    document.querySelectorAll('.dashboard-tab-button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === view) {
        btn.classList.add('active');
      }
    });
  }

  // タブ名の表示ラベル
  function getTabLabel(view) {
    switch (view) {
      case 'table': return 'テーブル一覧';
      case 'menu': return 'メニュー一覧';
      case 'order': return 'オーダー一覧';
      default: return '不明なビュー';
    }
  }

  // メッセージ表示
  function showMessage(text) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.classList.add('visible');

    setTimeout(() => {
      messageEl.classList.remove('visible');
      messageEl.textContent = '';
    }, 5000);
  }

  // 時計
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

  // ハッシュ変更時の処理
  function handleHashChange() {
    const hash = location.hash.replace('#', '');
    const view = hash || 'table';
    loadTabView(view);
  }

  // タブボタンにイベント付与（preventDefault）
  function bindTabEvents() {
    document.querySelectorAll('.dashboard-tab-button').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); // ✅ ページ遷移を防止
        const view = btn.dataset.view;
        location.hash = view;
      });
    });
  }

  // 初期化
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
