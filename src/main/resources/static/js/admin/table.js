// static/js/admin/table.js

document.addEventListener("DOMContentLoaded", () => {
	const shopId = window.shopId || 0;
	const layoutItems = window.layoutItems || [];

	console.log("✅ layoutItems", layoutItems);

	const defaultRows = 8;
	const defaultCols = 10;

	const maxRow = Math.max(...layoutItems.map(i => i.rowIndex + (i.rowspan || 1)), 0);
	const maxCol = Math.max(...layoutItems.map(i => i.colIndex + (i.colspan || 1)), 0);

	const ROWS = Math.max(defaultRows, maxRow);
	const COLS = Math.max(defaultCols, maxCol);

	const grid = document.getElementById("layout-grid");
	const tbody = grid.querySelector("tbody");
	const theadRow = grid.querySelector("thead tr");

	// 📌 状態に応じた記号・色マップ
	const statusStyles = {
		empty: { symbol: "○", color: "#66b3ff" },      // 青
		using: { symbol: "✖", color: "#ff6666" },      // 赤
		preparing: { symbol: "▲", color: "#ffcc66" }   // 黄
	};

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

	// レイアウト反映
	layoutItems.forEach(item => {
		const r = item.rowIndex;
		const c = item.colIndex;
		const td = tbody.rows[r]?.cells[c + 1]; // +1 = 行番号<th>分

		if (!td || !item.base) return;

		// テーブルの場合のみ記号と状態色をつける
		if (item.type === "table") {
			const status = item.status || "empty";
			const statusInfo = statusStyles[status] || statusStyles.empty;

			td.textContent = `${item.name} ${statusInfo.symbol}`;
			td.style.backgroundColor = statusInfo.color;
			td.classList.add("table-cell", `status-${status}`);
		} else {
			// other系（カウンター・キッチンなど）はそのまま表示
			td.textContent = item.name;
			if (item.color) td.style.backgroundColor = item.color;
		}

		td.setAttribute("rowspan", item.rowspan);
		td.setAttribute("colspan", item.colspan);

		// 非ベースセルを非表示
		for (let i = r; i < r + item.rowspan; i++) {
			for (let j = c; j < c + item.colspan; j++) {
				if (i === r && j === c) continue;
				const otherTd = tbody.rows[i]?.cells[j + 1];
				if (otherTd) otherTd.style.display = "none";
			}
		}
	});


	// セルの幅を均等・正方形に
	setEqualCellSize(COLS);

	// 画面リサイズ時も対応
	window.addEventListener("resize", () => setEqualCellSize(COLS));

	function getColumnLabel(index) {
		let label = '';
		do {
			label = String.fromCharCode(65 + (index % 26)) + label;
			index = Math.floor(index / 26) - 1;
		} while (index >= 0);
		return label;
	}

	function setEqualCellSize(cols) {
		const wrapperWidth = document.getElementById("layout-grid-wrapper").offsetWidth;
		const cellSize = Math.floor(wrapperWidth / cols);

		document.querySelectorAll("#layout-grid td").forEach(td => {
			td.style.width = `${cellSize}px`;
			td.style.height = `${cellSize}px`;
		});
	}
});
