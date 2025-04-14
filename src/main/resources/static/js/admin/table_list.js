import { renderLayoutGrid } from "./layout-grid.js";

window.initTableList = function () {
	const wrapper = document.getElementById("layout-grid-wrapper");
	const shopId = window.shopId || parseInt(wrapper?.dataset?.shopId || 0);
	const layoutItems = window.__tableData?.[shopId]?.layoutItems || JSON.parse(wrapper?.dataset?.layoutItems || "[]");
	const tableIdMap = typeof window.tableIdMap === "string"
		? JSON.parse(window.tableIdMap)
		: (window.tableIdMap || {});

	console.log("✅ initTableList 実行");
	console.log("layoutItems:", layoutItems);
	console.log("tableIdMap:", tableIdMap);

	const grid = document.getElementById("layout-grid");
	const theadRow = grid.querySelector("thead tr");
	const tbody = grid.querySelector("tbody");

	renderLayoutGrid(tbody, theadRow, layoutItems, {
		rows: 8,
		cols: 10,
		extendGridToFitItems: true,
		disableEqualSize: true
	});

	const statusStyles = {
		empty: { symbol: "○", color: "#66b3ff" },
		using: { symbol: "✖", color: "#ff6666" },
		preparing: { symbol: "▲", color: "#ffcc66" }
	};

	layoutItems.forEach(item => {
		const r = item.rowIndex;
		const c = item.colIndex;
		const td = tbody.rows[r]?.cells[c + 1];
		if (!td || !item.isBase) return;

		if (item.type === "table") {
			const s = statusStyles[item.status] || statusStyles.empty;
			const tableId = tableIdMap?.[item.name];

			if (tableId) {
				const a = document.createElement("a");
				a.href = `/admin/${shopId}_dashboard/workstation/table/detail/${tableId}`;
				a.textContent = `${item.name} ${s.symbol}`;
				td.innerHTML = "";
				td.appendChild(a);
			} else {
				td.textContent = `${item.name} ${s.symbol}`;
			}
			td.style.backgroundColor = s.color;
			td.classList.add("table-cell", `status-${item.status}`);
		} else {
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

	setEqualCellSize();
	window.addEventListener("resize", setEqualCellSize);

	function setEqualCellSize() {
		const wrapperWidth = wrapper.offsetWidth;
		const cols = theadRow.children.length - 1;
		const size = Math.floor(wrapperWidth / cols);
		tbody.querySelectorAll("td").forEach(td => {
			if (td.style.display === "none") return;
			td.style.width = `${size}px`;
			td.style.height = `${size}px`;
		});
	}
};
