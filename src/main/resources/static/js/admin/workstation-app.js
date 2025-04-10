const WorkstationApp = (function () {
  const tabContainer = document.getElementById('tab-content-area');
  const messageEl = document.getElementById('system-message');
  const shopId = document.body.dataset.shopId;

  const tabCache = {
    menu: { currentHTML: null, listHTML: null },
    table: { currentHTML: null, listHTML: null },
    order: { currentHTML: null, listHTML: null }
  };
  let currentView = null;

  function loadTabView(view, forceList = false) {
    if (!tabContainer || !shopId) return;

    // 再クリック → listHTMLに戻す
    if (view === currentView && !forceList && tabCache[view]?.listHTML) {
      tabContainer.innerHTML = tabCache[view].listHTML;
      tabCache[view].currentHTML = tabCache[view].listHTML;
      setActiveTab(view);
      showMessage(`${getTabLabel(view)}を表示中`);
      currentView = view;
      runTabInit(view);
      return;
    }

    // キャッシュから復元
    if (tabCache[view]?.currentHTML && !forceList) {
      tabContainer.innerHTML = tabCache[view].currentHTML;
      setActiveTab(view);
      showMessage(`${getTabLabel(view)}を表示中`);
      currentView = view;
      runTabInit(view);
      return;
    }

    // fetchで取得
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

        // 対応する view_list.js を動的に読み込む
        const scriptPath = `/js/admin/${view}_list.js`;
        const script = document.createElement("script");
        script.src = scriptPath;
        script.defer = true;
        script.onload = () => runTabInit(view);
        document.body.appendChild(script);
      })
      .catch(err => {
        tabContainer.innerHTML = `<div class="text-danger">読み込み失敗</div>`;
        showMessage("読み込みに失敗しました");
        console.error(err);
      });
  }

  function bindTabClicks() {
    // タブボタン（上部UI）
    document.querySelectorAll('.dashboard-tab-button').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const view = btn.dataset.view;
        if (view === currentView) {
          loadTabView(view, true); // 再クリックでリセット
        } else {
          location.hash = view;
        }
      });
    });

    // data-tab-link を使った内部リンク
    document.addEventListener('click', e => {
      const target = e.target.closest('a[data-tab-link]');
      if (!target) return;

      e.preventDefault();
      const href = target.getAttribute('href');
      const view = target.dataset.view;

      fetch(href)
        .then(res => res.text())
        .then(html => {
          tabContainer.innerHTML = html;
          tabCache[view].currentHTML = html;
          showMessage("画面を切り替えました");

          const scriptPath = `/js/admin/${view}_list.js`;
          const script = document.createElement("script");
          script.src = scriptPath;
          script.defer = true;
          script.onload = () => runTabInit(view);
          document.body.appendChild(script);
        })
        .catch(err => {
          tabContainer.innerHTML = `<p class="text-danger">読み込みに失敗しました</p>`;
          console.error(err);
        });
    });
  }

  function runTabInit(view) {
    const fn = window[`init${capitalize(view)}List`];
    if (typeof fn === "function") {
      fn();
    }
  }

  function setActiveTab(view) {
    document.querySelectorAll('.dashboard-tab-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
  }

  function getTabLabel(view) {
    switch (view) {
      case 'table': return 'テーブル一覧';
      case 'menu': return 'メニュー一覧';
      case 'order': return 'オーダー一覧';
      default: return 'ビュー';
    }
  }

  function showMessage(text) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.style.visibility = 'visible';
    messageEl.style.opacity = '1';

    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.visibility = 'hidden';
      messageEl.textContent = '';
    }, 4000);
  }

  function handleHashChange() {
    const hash = location.hash.replace('#', '') || 'table';
    loadTabView(hash);
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function init() {
    bindTabClicks();
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
