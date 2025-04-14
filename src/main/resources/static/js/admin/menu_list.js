// /js/admin/menu_list.js

window.initMenuList = function () {
  console.log("[menu_list] 初期化再実行");

  const root = document.getElementById("tab-content-area");
  if (!root) return;

  // ✅ 大分類アコーディオン
  root.querySelectorAll(".category-toggle").forEach(button => {
    const categoryId = button.dataset.categoryId;
    if (!categoryId) return;

    if (button._clickHandler) {
      button.removeEventListener("click", button._clickHandler);
    }

    const handler = () => {
      const area = root.querySelector(`#category-${categoryId}`);
      const icon = button.querySelector(".toggle-icon");
      if (area) {
        const isOpen = area.style.display !== "none";
        area.style.display = isOpen ? "none" : "block";
        if (icon) icon.textContent = isOpen ? "▶" : "▼";
      }
    };

    button.addEventListener("click", handler);
    button._clickHandler = handler;
  });

  // ✅ 中分類アコーディオン
  root.querySelectorAll(".subcategory-toggle").forEach(button => {
    const subId = button.dataset.subcategoryId;
    if (!subId) return;

    if (button._clickHandler) {
      button.removeEventListener("click", button._clickHandler);
    }

    const handler = () => {
      const content = root.querySelector(`#subcategory-${subId}`);
      const icon = button.querySelector(".toggle-icon");
      if (content) {
        const isOpen = content.style.display !== "none";
        content.style.display = isOpen ? "none" : "block";
        if (icon) icon.textContent = isOpen ? "▶" : "▼";
      }
    };

    button.addEventListener("click", handler);
    button._clickHandler = handler;
  });

  // ✅ 売り切れ表示トグル
  const toggleBtn = root.querySelector("#toggleSoldOut");
  if (toggleBtn) {
    if (toggleBtn._clickHandler) {
      toggleBtn.removeEventListener("click", toggleBtn._clickHandler);
    }

    let showSoldOut = false;

    const handler = () => {
      showSoldOut = !showSoldOut;
      toggleBtn.textContent = showSoldOut ? "全商品を表示" : "売り切れ商品を表示";

      root.querySelectorAll("tbody tr").forEach(row => {
        const isVisible = row.querySelector("td:nth-child(4)")?.innerHTML.includes("○");
        const isOrderable = row.querySelector("td:nth-child(5)")?.innerHTML.includes("○");
        const shouldHide = !showSoldOut && (!isVisible || !isOrderable);
        row.style.display = shouldHide ? "none" : "";
      });

      // 全アコーディオンを開く
      root.querySelectorAll(".subcategory-content, .subcategory-area").forEach(div => {
        div.style.display = "block";
      });
      root.querySelectorAll(".toggle-icon").forEach(icon => {
        icon.textContent = "▼";
      });
    };

    toggleBtn.addEventListener("click", handler);
    toggleBtn._clickHandler = handler;
  }
};