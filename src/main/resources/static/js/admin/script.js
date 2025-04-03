// static/js/admin/script.js

const WorkstationApp = (function () {
  // DOM要素
  const tabContainer = document.getElementById('tab-content-area');
  const clockEl = document.getElementById('clock');
  const messageEl = document.getElementById('system-message');
  const shopId = document.body.dataset.shopId;

  // ビュー読み込み関数
  function loadTabView(view) {
    const url = `/workstation/${view}?shopId=${shopId}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("読み込み失敗");
        return res.text();
      })
      .then(html => {
        tabContainer.innerHTML = html;
        setActiveTab(view);
        showMessage(`${getTabLabel(view)}を表示中`);
      })
      .catch(err => {
        tabContainer.innerHTML = `<div class="text-danger">ビューの読み込みに失敗しました</div>`;
        showMessage("ビューの読み込みに失敗しました");
        console.error(err);
      });
  }

  // タブアクティブ切替
  function setActiveTab(view) {
    document.querySelectorAll('.dashboard-tab-button').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.view === view) {
        btn.classList.add('active');
      }
    });
  }

  // タブ名の表示ラベル（任意でカスタム）
  function getTabLabel(view) {
    switch (view) {
      case 'table_list': return 'テーブル一覧';
      case 'menu_list': return 'メニュー一覧';
      case 'order_list': return 'オーダー一覧';
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

  // 時計表示（1秒ごと更新）
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

  // ハッシュ監視
  function handleHashChange() {
    const hash = location.hash.replace('#', '') || 'table';
    loadTabView(hash + '_list');
  }

  // 初期化
  function init() {
    if (!tabContainer || !shopId) return;
    startClock();
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
  }

  // 公開API
  return {
    init: init,
    showMessage: showMessage
  };
})();

// 起動
window.addEventListener('DOMContentLoaded', () => {
  WorkstationApp.init();
});
