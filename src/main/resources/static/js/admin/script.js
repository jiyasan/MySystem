// 時計などグローバルUI
function initGlobalUI() {
	const clock = document.getElementById("clock");
	if (clock) {
		setInterval(() => {
			const now = new Date();
			clock.textContent = now.toLocaleTimeString();
		}, 1000);
	}
}

window.addEventListener("DOMContentLoaded", () => {
	initGlobalUI(); // 時計の更新など

	const btn = document.getElementById("submitForm");
	const form = document.getElementById("categoryForm");

	console.log("[DEBUG] script.js loaded");
	console.log("[DEBUG] btn:", btn);
	console.log("[DEBUG] form:", form);

	if (!btn || !form) return;

	btn.addEventListener("click", () => {
		console.log("[DEBUG] 登録ボタンクリック");

		const formData = new FormData(form);
		const shopId = formData.get("shopId");

		// fetch でフォーム送信（POST）
		fetch(form.action, {
			method: "POST",
			body: formData
		})
			.then(res => {
				if (!res.ok) throw new Error("登録に失敗");
				return fetch(`/admin/${shopId}_dashboard/workstation/menu/list`);
			})
			.then(res => res.text())
			.then(html => {
				// タブ内コンテンツを更新
				const area = document.getElementById("tab-content-area");
				area.innerHTML = html;

				// menu_list.js を再初期化
				const script = document.createElement("script");
				script.src = "/js/admin/menu_list.js";
				script.defer = true;
				document.body.appendChild(script);
			})
			.catch(err => {
				alert("エラー: " + err.message);
			});
	});
});
