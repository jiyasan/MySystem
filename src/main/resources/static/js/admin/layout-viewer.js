document.addEventListener("DOMContentLoaded", () => {
	const layoutItems = window.layoutItems || [];

	const defaultRows = 8;
	const defaultCols = 10;

	const maxRow = Math.max(...layoutItems.map(i => i.rowIndex + (i.rowspan || 1)), 0);
	const maxCol = Math.max(...layoutItems.map(i => i.colIndex + (i.colspan || 1)), 0);

	const ROWS = Math.max(defaultRows, maxRow);
	const COLS = Math.max(defaultCols, maxCol);

	const grid = document.getElementById("layout-grid");
	const tbody = grid.querySelector("tbody");
	const theadRow = grid.querySelector("thead tr");

	// ヘッダ生成
	theadRow.innerHTML = "<th></th>";
	for (let c = 0; c < COLS; c++) {
		const th = document.createElement("th");
		th.textContent = getColumnLabel(c);
		theadRow.appendChild(th);
	}

	// グリッド生成
	tbody.innerHTML = "";
	for (let r = 0; r < ROWS; r++) {
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		th.textContent = r + 1;
		tr.appendChild(th);

		for (let c = 0; c < COLS; c++) {
			const td = document.createElement("td");
			td.dataset.row = r;
			td.dataset.col = c;
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}

	// データ反映（ベースセルのみ）
	layoutItems.forEach(item => {
		if (!item.isBase) return;

		const r = item.rowIndex;
		const c = item.colIndex;
		const td = tbody.rows[r]?.cells[c + 1]; // +1は左の行番号<th>
		if (td) {
			td.textContent = item.name;
			if (item.color) td.style.backgroundColor = item.color;
			td.setAttribute("rowspan", item.rowspan);
			td.setAttribute("colspan", item.colspan);

			// 範囲内の非ベースセルを非表示
			for (let i = r; i < r + item.rowspan; i++) {
				for (let j = c; j < c + item.colspan; j++) {
					if (i === r && j === c) continue;
					const otherTd = tbody.rows[i]?.cells[j + 1];
					if (otherTd) otherTd.style.display = "none";
				}
			}
		}
	});

	function getColumnLabel(index) {
		let label = '';
		do {
			label = String.fromCharCode(65 + (index % 26)) + label;
			index = Math.floor(index / 26) - 1;
		} while (index >= 0);
		return label;
	}
});
