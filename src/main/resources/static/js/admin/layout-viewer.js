document.addEventListener("DOMContentLoaded", () => {
	const grid = document.getElementById("layout-grid");
	const ROWS = 8;
	const COLS = 10;

	// ヘッダ作成（オプション）
	const thead = document.createElement("thead");
	const headRow = document.createElement("tr");
	for (let c = 0; c < COLS; c++) {
		const th = document.createElement("th");
		th.textContent = String.fromCharCode(65 + c); // A, B, C...
		headRow.appendChild(th);
	}
	thead.appendChild(headRow);
	grid.appendChild(thead);

	// tbody構築
	const tbody = document.createElement("tbody");
	for (let r = 0; r < ROWS; r++) {
		const tr = document.createElement("tr");
		for (let c = 0; c < COLS; c++) {
			const td = document.createElement("td");
			td.dataset.row = r;
			td.dataset.col = c;
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	grid.appendChild(tbody);

	// データ埋め込み
	layoutItems.forEach(item => {
		if (item.isBase) {
			const r = item.rowIndex;
			const c = item.colIndex;
			const td = tbody.rows[r]?.cells[c];
			if (td) {
				td.textContent = item.name;
				td.style.backgroundColor = item.color;
				td.setAttribute("rowspan", item.rowspan);
				td.setAttribute("colspan", item.colspan);
			}
		}
	});


	console.log("layoutItems:", layoutItems);

});
