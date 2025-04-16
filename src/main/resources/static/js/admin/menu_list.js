window.initMenuList = function () {
  console.log("[menu_list] 初期化再実行");

  const root = document.getElementById("tab-content-area");
  console.log("[LOG] tab-content-area =", root);
  if (!root) return;

  // ✅ 大分類アコーディオン
  const categoryButtons = root.querySelectorAll(".category-toggle");
  console.log("[LOG] category-toggle buttons:", categoryButtons);

  categoryButtons.forEach(button => {
    const categoryId = button.dataset.categoryId;
    console.log(`[LOG] button for categoryId = ${categoryId}`);
    if (!categoryId) return;

    if (button._clickHandler) {
      button.removeEventListener("click", button._clickHandler);
      console.log(`[LOG] Removed previous handler for category ${categoryId}`);
    }

    const handler = () => {
      const area = root.querySelector(`#category-${categoryId}`);
      const icon = button.querySelector(".toggle-icon");
      console.log(`[LOG] toggle handler: area =`, area, "icon =", icon);
      if (area) {
        const isOpen = area.style.display !== "none";
        area.style.display = isOpen ? "none" : "block";
        if (icon) icon.textContent = isOpen ? "▶" : "▼";
        console.log(`[LOG] toggled ${categoryId}, isOpen = ${!isOpen}`);
      }
    };

    button.addEventListener("click", handler);
    button._clickHandler = handler;
    console.log(`[LOG] Added click handler to category ${categoryId}`);
  });

  // ✅ 中分類アコーディオン
  const subButtons = root.querySelectorAll(".subcategory-toggle");
  console.log("[LOG] subcategory-toggle buttons:", subButtons);

  subButtons.forEach(button => {
    const subId = button.dataset.subcategoryId;
    console.log(`[LOG] button for subcategoryId = ${subId}`);
    if (!subId) return;

    if (button._clickHandler) {
      button.removeEventListener("click", button._clickHandler);
      console.log(`[LOG] Removed previous handler for subcategory ${subId}`);
    }

    const handler = () => {
      const content = root.querySelector(`#subcategory-${subId}`);
      const icon = button.querySelector(".toggle-icon");
      console.log(`[LOG] toggle handler: content =`, content, "icon =", icon);
      if (content) {
        const isOpen = content.style.display !== "none";
        content.style.display = isOpen ? "none" : "block";
        if (icon) icon.textContent = isOpen ? "▶" : "▼";
        console.log(`[LOG] toggled subcategory ${subId}, isOpen = ${!isOpen}`);
      }
    };

    button.addEventListener("click", handler);
    button._clickHandler = handler;
    console.log(`[LOG] Added click handler to subcategory ${subId}`);
  });

  // ✅ 売り切れトグル
  const toggleBtn = root.querySelector("#toggleSoldOut");
  console.log("[LOG] toggleSoldOut button:", toggleBtn);

  if (toggleBtn) {
    if (toggleBtn._clickHandler) {
      toggleBtn.removeEventListener("click", toggleBtn._clickHandler);
      console.log("[LOG] Removed previous sold-out handler");
    }

    let showSoldOut = false;

    const handler = () => {
      showSoldOut = !showSoldOut;
      toggleBtn.textContent = showSoldOut ? "全商品を表示" : "売り切れ商品を表示";
      console.log(`[LOG] showSoldOut = ${showSoldOut}`);

      root.querySelectorAll("tbody tr").forEach(row => {
        const isVisible = row.querySelector("td:nth-child(4)")?.innerHTML.includes("○");
        const isOrderable = row.querySelector("td:nth-child(5)")?.innerHTML.includes("○");
        const shouldHide = !showSoldOut && (!isVisible || !isOrderable);
        row.style.display = shouldHide ? "none" : "";
        console.log(`[LOG] row display set: ${row.style.display}`);
      });

      root.querySelectorAll(".subcategory-content, .subcategory-area").forEach(div => {
        div.style.display = "block";
      });
      root.querySelectorAll(".toggle-icon").forEach(icon => {
        icon.textContent = "▼";
      });
      console.log("[LOG] 全アコーディオン展開");
    };

    toggleBtn.addEventListener("click", handler);
    toggleBtn._clickHandler = handler;
    console.log("[LOG] 売り切れトグル ハンドラ登録完了");
  }
};
