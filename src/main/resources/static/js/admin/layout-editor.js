// layout-editor.js
// 🍽 オブジェクト指向版（保存・配置・行列操作 + popupメニュー + ドラッグ対応）

class LayoutEditor {
	constructor() {
		this.layoutItems = layoutItems; // ✅ ここで受け取る
		this.grid = document.getElementById("layout-grid");
		this.tbody = this.grid.querySelector("tbody");
		this.theadRow = this.grid.querySelector("thead tr");
		this.popup = document.getElementById("popup-menu");
		this.selectedCellDisplay = document.getElementById("selected-cell");
		this.objHeightInput = document.getElementById("obj-height");
		this.objWidthInput = document.getElementById("obj-width");
		this.objNameInput = document.getElementById("obj-name");
		this.objColorInput = document.getElementById("obj-color");
		this.placeBtn = document.getElementById("place-btn");
		this.deleteBtn = document.getElementById("delete-btn");
		this.confirmBtn = document.getElementById("confirm-btn");
		this.unsavedWarning = document.getElementById("unsaved-warning");
		this.horizontalDivider = document.getElementById("horizontal-divider");
		this.layoutGridWrapper = document.getElementById("layout-grid-wrapper");
		this.bottomPanelWrapper = document.getElementById("bottom-panel-wrapper");
		this.container = document.getElementById("layout-editor-container");
		this.verticalDivider = document.getElementById("vertical-divider");
		this.horizontalFlexWrapper = document.getElementById("horizontal-flex-wrapper");
		this.editorPanel = document.getElementById("editor-panel");
		this.tableList = document.getElementById("table-list");

		this.selectedRow = null;
		this.selectedCol = null;
		this.gridData = [];
		this.unsaved = false;
		this.COLS = 10;
		this.ROWS = 8;
		this.isDraggingVertical = false;
		this.isDraggingHorizontal = false;

		this.deleteBtn.style.display = "none";
		this.initialize();
		this.renumberColumns();
		this.markUnsaved();
	}

	initialize() {
		this.createGrid();
		this.bindEvents();
		window.insertRowAfter = (index) => this.insertRowAfter(index);
		window.insertColumnAfter = (index) => this.insertColumnAfter(index);
		window.deleteRow = (index) => this.deleteRow(index);
		window.deleteColumn = (index) => this.deleteColumn(index);
		window.hideMenu = () => this.hideMenu();
	}

	bindEvents() {
		this.placeBtn.addEventListener("click", () => this.handlePlace());
		this.deleteBtn.addEventListener("click", () => this.handleDelete());
		this.confirmBtn.addEventListener("click", () => this.handleConfirm());
		this.objHeightInput.addEventListener("input", () => this.highlightArea());
		this.objWidthInput.addEventListener("input", () => this.highlightArea());
		document.querySelectorAll("input[name='obj-type']").forEach((input) => {
			input.addEventListener("change", () => this.toggleColorPicker());
		});
		this.horizontalDivider.addEventListener("mousedown", (e) => this.startVerticalDrag(e));
		this.verticalDivider.addEventListener("mousedown", (e) => this.startHorizontalDrag(e));
		document.addEventListener("mousemove", (e) => this.handleDrag(e));
		document.addEventListener("mouseup", () => this.stopDrag());
		window.addEventListener("click", (e) => this.handleOutsideClick(e));
	}

	// === グリッド管理 ===
	getColumnLabel(index) {
		let label = '';
		do {
			label = String.fromCharCode(65 + (index % 26)) + label;
			index = Math.floor(index / 26) - 1;
		} while (index >= 0);
		return label;
	}

	createGrid() {
		this.theadRow.innerHTML = "<th></th>";
		for (let c = 0; c < this.COLS; c++) {
			const th = document.createElement("th");
			th.textContent = this.getColumnLabel(c);
			th.dataset.col = c;
			th.addEventListener("click", (e) => this.showColMenu(e, c));
			this.theadRow.appendChild(th);
		}

		this.tbody.innerHTML = "";
		this.gridData = [];
		for (let r = 0; r < this.ROWS; r++) {
			const tr = document.createElement("tr");
			const th = document.createElement("th");
			th.textContent = r + 1;
			th.dataset.row = r;
			th.addEventListener("click", (e) => this.showRowMenu(e, r));
			tr.appendChild(th);

			const rowData = [];
			for (let c = 0; c < this.COLS; c++) {
				const td = document.createElement("td");
				td.dataset.row = r;
				td.dataset.col = c;
				this.setCellClickEvent(td, r, c);
				tr.appendChild(td);
				rowData.push({ type: null, name: null, color: null, isBase: false });
			}
			this.tbody.appendChild(tr);
			this.gridData.push(rowData);
		}
		// 🧩 ここで layoutItems を gridData に反映！
		if (this.layoutItems?.length) {
			this.layoutItems.forEach(item => {
				const r = item.rowIndex;
				const c = item.colIndex;
				
				// 行と列の範囲チェック
				if (this.gridData[r] && this.gridData[r][c]) {
					this.gridData[r][c] = {
						type: item.type,
						name: item.name,
						color: item.color,
						isBase: true
					};
					const td = this.tbody.rows[r].cells[c + 1]; // +1 は左側の行番号th分
					if (td) {
						td.setAttribute("rowspan", item.rowspan);
						td.setAttribute("colspan", item.colspan);
					}
				}
			});
		}
	}

	setCellClickEvent(td, row, col) {
		td.removeEventListener("click", td.onclick);
		td.addEventListener("click", () => this.selectCell(row, col));
	}

	// === ベースセル特定 ===
	findBaseCell(r, c) {
		for (let i = r; i >= 0; i--) {
			for (let j = c; j >= 0; j--) {
				if (this.gridData[i][j].isBase) {
					const baseCell = this.tbody.rows[i].cells[j + 1];
					const rowspan = parseInt(baseCell.getAttribute("rowspan") || 1);
					const colspan = parseInt(baseCell.getAttribute("colspan") || 1);
					if (i <= r && r < i + rowspan && j <= c && c < j + colspan) {
						return { row: i, col: j };
					}
				}
			}
		}
		return { row: r, col: c }; // ベースセルが見つからない場合はクリックしたセルを返す
	}

	// === セル選択とハイライト ===
	selectCell(r, c) {
		const { row, col } = this.findBaseCell(r, c);
		this.selectedRow = row;
		this.selectedCol = col;
		this.selectedCellDisplay.textContent = `${this.getColumnLabel(col)}${row + 1}`;
		const data = this.gridData[row][col];
		const baseCell = this.tbody.rows[row]?.cells[col + 1];
		if (data.type && baseCell) {
			this.objNameInput.value = data.name || "";
			this.objColorInput.value = data.color || "#cccccc";
			document.querySelector(`input[name='obj-type'][value='${data.type}']`).checked = true;
			this.objHeightInput.value = baseCell.getAttribute("rowspan") || 1;
			this.objWidthInput.value = baseCell.getAttribute("colspan") || 1;
			this.placeBtn.textContent = "編集";
			this.deleteBtn.style.display = "inline-block";
		} else {
			this.objNameInput.value = "";
			this.objColorInput.value = "#cccccc";
			this.objHeightInput.value = 1;
			this.objWidthInput.value = 1;
			document.querySelector("input[name='obj-type'][value='table']").checked = true;
			this.placeBtn.textContent = "配置";
			this.deleteBtn.style.display = "none";
		}
		this.toggleColorPicker();
		this.highlightArea();
	}

	highlightArea() {
		this.clearHighlights();
		if (this.selectedRow === null || this.selectedCol === null) return;
		const h = parseInt(this.objHeightInput.value, 10);
		const w = parseInt(this.objWidthInput.value, 10);
		for (let r = this.selectedRow; r < this.selectedRow + h; r++) {
			for (let c = this.selectedCol; c < this.selectedCol + w; c++) {
				const cell = this.tbody.rows[r]?.cells[c + 1];
				if (cell) cell.classList.add(this.gridData[r][c].type ? "overlap" : "highlight");
			}
		}
	}

	clearHighlights() {
		for (let row of this.tbody.rows) {
			for (let cell of row.cells) {
				cell.classList.remove("highlight", "overlap");
			}
		}
	}

	// === 配置・削除・保存 ===
	markUnsaved() {
		this.unsaved = true;
		this.unsavedWarning.style.display = "block";
	}

	handlePlace() {
		if (this.selectedRow === null || this.selectedCol === null) return;
		const h = parseInt(this.objHeightInput.value, 10);
		const w = parseInt(this.objWidthInput.value, 10);
		const name = this.objNameInput.value.trim();
		const color = this.objColorInput.value;
		const type = document.querySelector("input[name='obj-type']:checked").value;

		if (type === "table" && !name) return alert("テーブル名を入力してください");

		const baseCell = this.tbody.rows[this.selectedRow].cells[this.selectedCol + 1];
		const oldH = parseInt(baseCell.getAttribute("rowspan") || 1);
		const oldW = parseInt(baseCell.getAttribute("colspan") || 1);

		// 既存の範囲をクリア
		for (let r = this.selectedRow; r < this.selectedRow + oldH; r++) {
			for (let c = this.selectedCol; c < this.selectedCol + oldW; c++) {
				const cell = this.tbody.rows[r]?.cells[c + 1];
				if (cell) {
					cell.innerHTML = "";
					cell.removeAttribute("rowspan");
					cell.removeAttribute("colspan");
					cell.style.backgroundColor = "";
					cell.style.display = "";
					this.gridData[r][c] = { type: null, name: null, color: null, isBase: false };
				}
			}
		}

		// 新しい範囲を準備
		for (let r = this.selectedRow; r < this.selectedRow + h; r++) {
			for (let c = this.selectedCol; c < this.selectedCol + w; c++) {
				const cell = this.tbody.rows[r]?.cells[c + 1];
				if (cell) {
					cell.innerHTML = "";
					cell.removeAttribute("rowspan");
					cell.removeAttribute("colspan");
					cell.style.display = "";
				}
			}
		}

		// ベースセルを設定
		baseCell.textContent = name;
		baseCell.style.backgroundColor = color;
		baseCell.setAttribute("rowspan", h);
		baseCell.setAttribute("colspan", w);

		for (let r = this.selectedRow; r < this.selectedRow + h; r++) {
			for (let c = this.selectedCol; c < this.selectedCol + w; c++) {
				if (r === this.selectedRow && c === this.selectedCol) {
					this.gridData[r][c] = { type, name, color, isBase: true };
				} else {
					const cell = this.tbody.rows[r].cells[c + 1];
					if (cell) cell.style.display = "none";
					this.gridData[r][c] = { type, name, color, isBase: false };
				}
			}
		}
		this.clearHighlights();
		this.markUnsaved();
		this.placeBtn.textContent = "編集";
		this.deleteBtn.style.display = "inline-block";
	}

	handleDelete() {
		if (this.selectedRow === null || this.selectedCol === null) return;
		const h = parseInt(this.objHeightInput.value, 10);
		const w = parseInt(this.objWidthInput.value, 10);
		for (let r = this.selectedRow; r < this.selectedRow + h; r++) {
			for (let c = this.selectedCol; c < this.selectedCol + w; c++) {
				const cell = this.tbody.rows[r]?.cells[c + 1];
				if (cell) {
					cell.textContent = "";
					cell.style.backgroundColor = "";
					cell.removeAttribute("rowspan");
					cell.removeAttribute("colspan");
					cell.style.display = "";
					this.gridData[r][c] = { type: null, name: null, color: null, isBase: false };
				}
			}
		}
		this.clearHighlights();
		this.markUnsaved();
		this.placeBtn.textContent = "配置";
		this.deleteBtn.style.display = "none";
	}

	handleConfirm() {
		const shopId = document.getElementById("shop-id").value;
		const dataToSave = [];
		this.gridData.forEach((row, r) => {
			row.forEach((cell, c) => {
				if (cell?.type) {
					dataToSave.push({
						rowIndex: r,
						colIndex: c,
						type: cell.type,
						name: cell.name,
						color: cell.color,
						rowspan: parseInt(this.tbody.rows[r].cells[c + 1]?.getAttribute("rowspan") || 1),
						colspan: parseInt(this.tbody.rows[r].cells[c + 1]?.getAttribute("colspan") || 1),
						isBase: cell.isBase
					});
				}
			});
		});

		fetch(`/admin/${shopId}_dashboard/layout/save`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(dataToSave),
		})
			.then((res) => res.text())
			.then((result) => {
				if (result === "OK") {
					alert("保存しました！");
					window.location.href = `/admin/${shopId}_dashboard/layout`;
				} else {
					alert("保存失敗: " + result);
				}
			})
			.catch((err) => {
				console.error("通信エラー:", err);
				alert("通信に失敗しました");
			});
	}

	// === UI操作 ===
	toggleColorPicker() {
		document.getElementById("color-picker-label").style.display =
			document.querySelector("input[name='obj-type']:checked").value === "other" ? "inline" : "none";
	}

	startVerticalDrag(e) {
		this.isDraggingVertical = true;
		document.body.style.cursor = "row-resize";
		e.preventDefault();
	}

	startHorizontalDrag(e) {
		this.isDraggingHorizontal = true;
		document.body.style.cursor = "col-resize";
		e.preventDefault();
	}

	handleDrag(e) {
		if (this.isDraggingVertical) {
			const containerRect = this.container.getBoundingClientRect();
			const y = e.clientY - containerRect.top;
			const totalHeight = this.container.offsetHeight;
			const dividerHeight = this.horizontalDivider.offsetHeight;
			const topMin = 100;
			const bottomMin = 150;
			const topMax = totalHeight - bottomMin - dividerHeight;

			if (y >= topMin && y <= topMax) {
				this.layoutGridWrapper.style.height = `${y}px`;
				this.bottomPanelWrapper.style.height = `${totalHeight - y - dividerHeight}px`;
			}
		} else if (this.isDraggingHorizontal) {
			const containerRect = this.horizontalFlexWrapper.getBoundingClientRect();
			const x = e.clientX - containerRect.left;
			const totalWidth = this.horizontalFlexWrapper.offsetWidth;
			const dividerWidth = this.verticalDivider.offsetWidth;
			const leftMin = 200;
			const rightMin = 200;
			const leftMax = totalWidth - rightMin - dividerWidth;

			if (x >= leftMin && x <= leftMax) {
				this.editorPanel.style.width = `${x}px`;
				this.tableList.style.width = `${totalWidth - x - dividerWidth}px`;
				this.verticalDivider.style.left = `${x}px`;
			}
		}
	}

	stopDrag() {
		this.isDraggingVertical = false;
		this.isDraggingHorizontal = false;
		document.body.style.cursor = "";
	}

	// === ポップアップメニュー ===
	showRowMenu(e, rowIndex) {
		e.stopPropagation();
		this.popup.innerHTML = `
      <button onclick="insertRowAfter(${rowIndex}); hideMenu();">下に追加</button>
      <button onclick="deleteRow(${rowIndex}); hideMenu();">この行を削除</button>
    `;
		this.showMenuAt(e.clientX, e.clientY);
	}

	showColMenu(e, colIndex) {
		e.stopPropagation();
		this.popup.innerHTML = `
      <button onclick="insertColumnAfter(${colIndex}); hideMenu();">右に追加</button>
      <button onclick="deleteColumn(${colIndex}); hideMenu();">この列を削除</button>
    `;
		this.showMenuAt(e.clientX, e.clientY);
	}

	showMenuAt(x, y) {
		this.popup.style.left = `${x + 5}px`;
		this.popup.style.top = `${y + 5}px`;
		this.popup.style.display = "block";
	}

	hideMenu() {
		this.popup.style.display = "none";
	}

	handleOutsideClick(e) {
		if (!this.popup.contains(e.target)) this.hideMenu();
	}

	// === 行・列操作 ===
	insertRowAfter(index) {
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		th.textContent = index + 2;
		th.dataset.row = index + 1;
		th.addEventListener("click", (e) => this.showRowMenu(e, index + 1));
		tr.appendChild(th);

		const rowData = [];
		for (let i = 0; i < this.COLS; i++) {
			const td = document.createElement("td");
			td.dataset.row = index + 1;
			td.dataset.col = i;
			this.setCellClickEvent(td, index + 1, i);
			tr.appendChild(td);
			rowData.push({ type: null, name: null, color: null, isBase: false });
		}
		this.tbody.insertBefore(tr, this.tbody.rows[index + 1]);
		this.gridData.splice(index + 1, 0, rowData);
		this.ROWS++;
		this.renumberRows();
		this.markUnsaved();
	}

	insertColumnAfter(index) {
		const th = document.createElement("th");
		th.textContent = this.getColumnLabel(index + 1);
		th.dataset.col = index + 1;
		th.addEventListener("click", (e) => this.showColMenu(e, index + 1));
		this.theadRow.insertBefore(th, this.theadRow.children[index + 2]);

		for (let r = 0; r < this.ROWS; r++) {
			const td = document.createElement("td");
			td.dataset.row = r;
			td.dataset.col = index + 1;
			this.setCellClickEvent(td, r, index + 1);
			this.tbody.rows[r].insertBefore(td, this.tbody.rows[r].cells[index + 2]);
			this.gridData[r].splice(index + 1, 0, { type: null, name: null, color: null, isBase: false });
		}
		this.COLS++;
		this.renumberColumns();
		this.markUnsaved();
	}

	deleteRow(index) {
		if (this.ROWS <= 1) return alert("最低1行は必要です");
		this.tbody.deleteRow(index);
		this.gridData.splice(index, 1);
		this.ROWS--;
		this.renumberRows();
		this.markUnsaved();
	}

	deleteColumn(index) {
		if (this.COLS <= 1) return alert("最低1列は必要です");
		this.theadRow.deleteCell(index + 1);
		for (let r = 0; r < this.ROWS; r++) {
			this.tbody.rows[r].deleteCell(index + 1);
			this.gridData[r].splice(index, 1);
		}
		this.COLS--;
		this.renumberColumns();
		this.markUnsaved();
	}

	renumberRows() {
		for (let r = 0; r < this.ROWS; r++) {
			const row = this.tbody.rows[r];
			const th = row.cells[0];
			th.textContent = r + 1;
			th.dataset.row = r;
			th.onclick = (e) => this.showRowMenu(e, r);
			for (let c = 0; c < this.COLS; c++) {
				const td = row.cells[c + 1];
				if (td) {
					td.dataset.row = r;
					this.setCellClickEvent(td, r, c);
				}
			}
		}
	}

	renumberColumns() {
		const headerCells = this.theadRow.querySelectorAll("th");
		for (let c = 1; c <= this.COLS; c++) {
			const th = headerCells[c];
			const colIndex = c - 1;
			th.textContent = this.getColumnLabel(colIndex);
			th.dataset.col = colIndex;
			th.onclick = (e) => this.showColMenu(e, colIndex);
		}
		for (let r = 0; r < this.ROWS; r++) {
			const row = this.tbody.rows[r];
			for (let c = 0; c < this.COLS; c++) {
				const td = row.cells[c + 1];
				if (td) {
					td.dataset.col = c;
					this.setCellClickEvent(td, r, c);
				}
			}
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	window.editor = new LayoutEditor(layoutItems);
});
