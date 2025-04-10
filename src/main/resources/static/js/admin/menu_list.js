// /js/admin/menu_list.js

window.initMenuList = function () {
	
  if (window.__menuListInitialized__) return;
  window.__menuListInitialized__ = true;
  
  console.log("menu_list 初期化完了");

  // 🔽 大分類（category）のアコーディオン処理
  document.querySelectorAll(".category-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const categoryId = button.dataset.categoryId;
      const area = document.getElementById(`category-${categoryId}`);
      const icon = button.querySelector(".toggle-icon");
      if (area) {
        const isOpen = area.style.display !== "none";
        area.style.display = isOpen ? "none" : "block";
        if (icon) icon.textContent = isOpen ? "▶" : "▼";
      }
    });
  });

  // 🔽 中分類（subcategory）のアコーディオン処理
  document.querySelectorAll(".subcategory-toggle").forEach(button => {
    button.addEventListener("click", () => {
      const subId = button.dataset.subcategoryId;
      const content = document.getElementById(`subcategory-${subId}`);
      const icon = button.querySelector(".toggle-icon");
      if (content) {
        const isOpen = content.style.display !== "none";
        content.style.display = isOpen ? "none" : "block";
        if (icon) icon.textContent = isOpen ? "▶" : "▼";
      }
    });
  });

  // ✅ 売り切れ商品の表示切替（オプション）
  const toggleBtn = document.getElementById("toggleSoldOut");
  if (toggleBtn) {
    let showSoldOut = false;
    toggleBtn.addEventListener("click", () => {
      showSoldOut = !showSoldOut;
      toggleBtn.textContent = showSoldOut ? "全商品を表示" : "売り切れ商品を表示";
      document.querySelectorAll("tbody tr").forEach(row => {
        const isVisible = row.querySelector("td:nth-child(4)")?.innerHTML.includes("○");
        const isOrderable = row.querySelector("td:nth-child(5)")?.innerHTML.includes("○");
        const shouldHide = !showSoldOut && (!isVisible || !isOrderable);
        row.style.display = shouldHide ? "none" : "";
      });

      // 全アコーディオンを開く
      document.querySelectorAll(".subcategory-content").forEach(div => {
        div.style.display = "block";
      });
      document.querySelectorAll(".subcategory-toggle .toggle-icon").forEach(icon => {
        icon.textContent = "▼";
      });
      document.querySelectorAll(".subcategory-area").forEach(div => {
        div.style.display = "block";
      });
      document.querySelectorAll(".category-toggle .toggle-icon").forEach(icon => {
        icon.textContent = "▼";
      });
    });
  }
};
