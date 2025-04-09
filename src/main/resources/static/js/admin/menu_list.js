// static/js/admin/menu_list.js

window.initMenuList = function () {
  console.log("✅ menu_list.js loaded");

  document.querySelectorAll(".category-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const categoryId = btn.dataset.categoryId;
      const target = document.getElementById("category-" + categoryId);
      if (target) {
        target.style.display = (target.style.display === "none") ? "block" : "none";
      }
    });
  });

  // 他にも初期処理があればここにまとめる
};
