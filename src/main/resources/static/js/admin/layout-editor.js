// layout-editor.js

document.addEventListener("DOMContentLoaded", () => {
	const grid = document.getElementById("layout-grid");
	const tbody = grid.querySelector("tbody");
	const theadRow = grid.querySelector("thead tr");
	const selectedCellDisplay = document.getElementById("selected-cell");
	const objHeightInput = document.getElementById("obj-height");
	const objWidthInput = document.getElementById("obj-width");
	const objNameInput = document.getElementById("obj-name");
	const objColorInput = document.getElementById("obj-color");
	const placeBtn = document.getElementById("place-btn");
	const deleteBtn = document.getElementById("delete-btn");
	const confirmBtn = document.getElementById("confirm-btn");
	const unsavedWarning = document.getElementById("unsaved-warning");

	let selectedRow = null;
	let selectedCol = null;
	let gridData = [];
	let unsaved = false;

	const COLS = 10; // A-J
	const ROWS = 8;  // 1-8

	const columnLabels = Array.from({ length: COLS }, (_, i) =>
		String.fromCharCode("A".charCodeAt(0) + i)
	);

	function createGrid() {
		theadRow.innerHTML = "<th></th>";
		columnLabels.forEach(label => {
			const th = document.createElement("th");
			th.textContent = label;
			theadRow.appendChild(th);
		});

		tbody.innerHTML = "";
		gridData = [];

		for (let r = 0; r < ROWS; r++) {
			const row = document.createElement("tr");
			const label = document.createElement("th");
			label.textContent = r + 1;
			row.appendChild(label);

			const rowData = [];

			for (let c = 0; c < COLS; c++) {
				const cell = document.createElement("td");
				cell.dataset.row = r;
				cell.dataset.col = c;
				cell.addEventListener("click", () => selectCell(r, c));
				row.appendChild(cell);
				rowData.push({ type: null, name: null });
			}

			tbody.appendChild(row);
			gridData.push(rowData);
		}
	}

	function selectCell(r, c) {
		selectedRow = r;
		selectedCol = c;
		const colLabel = columnLabels[c];
		selectedCellDisplay.textContent = `${colLabel}${r + 1}`;

		const data = gridData[r][c];
		if (data.type) {
			objNameInput.value = data.name || "";
			objColorInput.value = data.color || "#ffffff";
			document.querySelector(`input[name='obj-type'][value='${data.type}']`).checked = true;
			placeBtn.textContent = "編集";
			deleteBtn.style.display = "inline-block";
		} else {
			objNameInput.value = "";
			objColorInput.value = "#ffffff";
			placeBtn.textContent = "配置";
			deleteBtn.style.display = "none";
		}

		document.getElementById("color-picker-label").style.display =
			document.querySelector("input[name='obj-type']:checked").value === "other" ? "inline" : "none";

		highlightArea();
	}

	function highlightArea() {
		clearHighlights();
		if (selectedRow === null || selectedCol === null) return;

		const h = parseInt(objHeightInput.value, 10);
		const w = parseInt(objWidthInput.value, 10);
		let overlap = false;

		for (let r = selectedRow; r < selectedRow + h; r++) {
			for (let c = selectedCol; c < selectedCol + w; c++) {
				const cell = tbody.rows[r]?.cells[c + 1];
				if (cell) {
					const data = gridData[r][c];
					if (data.type) {
						cell.classList.add("overlap");
						overlap = true;
					} else {
						cell.classList.add("highlight");
					}
				}
			}
		}
	}

	function clearHighlights() {
		for (let row of tbody.rows) {
			for (let cell of row.cells) {
				cell.classList.remove("highlight", "overlap");
			}
		}
	}

	function markUnsaved() {
		unsaved = true;
		unsavedWarning.style.display = "block";
	}

	objHeightInput.addEventListener("input", highlightArea);
	objWidthInput.addEventListener("input", highlightArea);

	placeBtn.addEventListener("click", () => {
		if (selectedRow === null || selectedCol === null) return;

		const h = parseInt(objHeightInput.value, 10);
		const w = parseInt(objWidthInput.value, 10);
		const name = objNameInput.value.trim();
		const color = objColorInput.value;
		const type = document.querySelector("input[name='obj-type']:checked").value;

		if (type === "table" && !name) {
			alert("テーブル名を入力してください");
			return;
		}

		// clear existing content before merging
		for (let r = selectedRow; r < selectedRow + h; r++) {
			for (let c = selectedCol; c < selectedCol + w; c++) {
				const cell = tbody.rows[r]?.cells[c + 1];
				if (cell) {
					cell.innerHTML = "";
					cell.removeAttribute("rowspan");
					cell.removeAttribute("colspan");
					cell.style.display = "";
				}
			}
		}

		const baseCell = tbody.rows[selectedRow].cells[selectedCol + 1];
		baseCell.textContent = name;
		baseCell.style.backgroundColor = color;
		baseCell.setAttribute("rowspan", h);
		baseCell.setAttribute("colspan", w);

		for (let r = selectedRow; r < selectedRow + h; r++) {
			for (let c = selectedCol; c < selectedCol + w; c++) {
				if (r === selectedRow && c === selectedCol) continue;
				const cell = tbody.rows[r].cells[c + 1];
				if (cell) cell.style.display = "none";
			}
		}

		for (let r = selectedRow; r < selectedRow + h; r++) {
			for (let c = selectedCol; c < selectedCol + w; c++) {
				gridData[r][c] = { type, name, color };
			}
		}

		clearHighlights();
		markUnsaved();
	});

	deleteBtn?.addEventListener("click", () => {
		if (selectedRow === null || selectedCol === null) return;

		const h = parseInt(objHeightInput.value, 10);
		const w = parseInt(objWidthInput.value, 10);

		for (let r = selectedRow; r < selectedRow + h; r++) {
			for (let c = selectedCol; c < selectedCol + w; c++) {
				const cell = tbody.rows[r]?.cells[c + 1];
				if (cell) {
					cell.textContent = "";
					cell.style.backgroundColor = "";
					cell.removeAttribute("rowspan");
					cell.removeAttribute("colspan");
					cell.style.display = "";
				}
				gridData[r][c] = { type: null, name: null, color: null };
			}
		}

		clearHighlights();
		markUnsaved();
		placeBtn.textContent = "配置";
		deleteBtn.style.display = "none";
		objNameInput.value = "";
		objColorInput.value = "#ffffff";
	});

	confirmBtn.addEventListener("click", () => {
		unsaved = false;
		unsavedWarning.style.display = "none";
		alert("配置を保存しました（仮）");
	});

	document.querySelectorAll("input[name='obj-type']").forEach(input => {
		input.addEventListener("change", () => {
			const type = document.querySelector("input[name='obj-type']:checked").value;
			document.getElementById("color-picker-label").style.display = type === "other" ? "inline" : "none";
		});
	});

	createGrid();
});
