// /js/admin/layout-viewer.js

import { renderLayoutGrid } from "./layout-grid.js";

window.addEventListener("DOMContentLoaded", () => {
	const tbody = document.querySelector("#layout-grid tbody");
	const theadRow = document.querySelector("#layout-grid thead tr");

	if (tbody && theadRow && window.layoutItems) {
		renderLayoutGrid(tbody, theadRow, window.layoutItems, {
			showColumnHeader: false,
		});
	} else {
		console.warn("[layout-viewer] グリッド要素または layoutItems が見つかりません");
	}
});
