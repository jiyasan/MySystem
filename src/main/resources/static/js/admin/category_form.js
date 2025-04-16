// category_form.js
export function initCategoryForm() {
	const btn = document.getElementById("submitForm");
	const form = document.getElementById("categoryForm");
	if (!btn || !form) return;

	btn.addEventListener("click", () => {
		const formData = new FormData(form);
		const shopId = formData.get("shopId");

		fetch(form.action, {
			method: "POST",
			body: formData
		})
			.then(res => {
				if (!res.ok) throw new Error("登録に失敗しました");
				return fetch(`/admin/${shopId}_dashboard/workstation/menu/list`);
			})
			.then(res => res.text())
			.then(html => {
				const area = document.getElementById("tab-content-area");
				area.innerHTML = html;
				import("/js/admin/menu_list.js").then(m => m.initMenuList?.());
			})
			.catch(err => alert("エラー: " + err.message));
	});
}
