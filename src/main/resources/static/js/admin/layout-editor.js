
// layout-editor.final.with-popup.js
// 🍽 完全統合版（保存・配置・行列操作 + popupメニュー対応）

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("layout-grid");
  const tbody = grid.querySelector("tbody");
  const theadRow = grid.querySelector("thead tr");
  const popup = document.getElementById("popup-menu");
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
  let COLS = 10;
  let ROWS = 8;

  function getColumnLabel(index) {
    let label = '';
    do {
      label = String.fromCharCode(65 + (index % 26)) + label;
      index = Math.floor(index / 26) - 1;
    } while (index >= 0);
    return label;
  }

  function createGrid() {
    theadRow.innerHTML = "<th></th>";
    for (let c = 0; c < COLS; c++) {
      const th = document.createElement("th");
      th.textContent = getColumnLabel(c);
      th.dataset.col = c;
      th.addEventListener("click", (e) => showColMenu(e, c));
      theadRow.appendChild(th);
    }

    tbody.innerHTML = "";
    gridData = [];

    for (let r = 0; r < ROWS; r++) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = r + 1;
      th.dataset.row = r;
      th.onclick = ((rowIndex) => (e) => showRowMenu(e, rowIndex))(r);
    th.addEventListener("click", (e) => showRowMenu(e, r));
      tr.appendChild(th);

      const rowData = [];
      for (let c = 0; c < COLS; c++) {
        const td = document.createElement("td");
        td.dataset.row = r;
        td.dataset.col = c;
      td.setAttribute("data-col", c);
        td.addEventListener("click", () => selectCell(r, c));
        tr.appendChild(td);
        rowData.push({ type: null, name: null });
      }

      tbody.appendChild(tr);
      gridData.push(rowData);
    }
  }

  function selectCell(r, c) {
    selectedRow = r;
    selectedCol = c;
    selectedCellDisplay.textContent = `${getColumnLabel(c)}${r + 1}`;

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

    for (let r = selectedRow; r < selectedRow + h; r++) {
      for (let c = selectedCol; c < selectedCol + w; c++) {
        const cell = tbody.rows[r]?.cells[c + 1];
        if (cell) {
          const data = gridData[r][c];
          cell.classList.add(data.type ? "overlap" : "highlight");
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
    const shopId = document.getElementById("shop-id").value;
    const dataToSave = [];

    gridData.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell && cell.type) {
          dataToSave.push({
            row: r,
            col: c,
            type: cell.type,
            name: cell.name,
            color: cell.color,
            rowspan: parseInt(tbody.rows[r].cells[c + 1]?.getAttribute("rowspan") || 1),
            colspan: parseInt(tbody.rows[r].cells[c + 1]?.getAttribute("colspan") || 1)
          });
        }
      });
    });

    fetch(`/admin/${shopId}_dashboard/layout/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave)
    })
      .then(res => res.text())
      .then(result => {
        if (result === "OK") {
          alert("保存しました！");
          window.location.href = `/admin/${shopId}_dashboard/layout`;
        } else {
          alert("保存失敗: " + result);
        }
      })
      .catch(err => {
        console.error("通信エラー:", err);
        alert("通信に失敗しました");
      });
  });

  document.querySelectorAll("input[name='obj-type']").forEach(input => {
    input.addEventListener("change", () => {
      const type = document.querySelector("input[name='obj-type']:checked").value;
      document.getElementById("color-picker-label").style.display = type === "other" ? "inline" : "none";
    });
  });

  // === 📌 popupメニュー（ヘッダークリック） ===

  function showRowMenu(e, rowIndex) {
    e.stopPropagation();
    popup.innerHTML = `
      <button onclick="insertRowAfter(${rowIndex}); hideMenu();">下に追加</button>
      <button onclick="deleteRow(${rowIndex}); hideMenu();">この行を削除</button>
    `;
    showMenuAt(e.clientX, e.clientY);
  }

  function showColMenu(e, colIndex) {
    e.stopPropagation();
    popup.innerHTML = `
      <button onclick="insertColumnAfter(${colIndex}); hideMenu();">右に追加</button>
      <button onclick="deleteColumn(${colIndex}); hideMenu();">この列を削除</button>
    `;
    showMenuAt(e.clientX, e.clientY);
  }

  function showMenuAt(x, y) {
    popup.style.left = `${x + 5}px`;
    popup.style.top = `${y + 5}px`;
    popup.style.display = "block";
  }

  function hideMenu() {
    popup.style.display = "none";
  }

  window.addEventListener("click", (e) => {
    if (!popup.contains(e.target)) hideMenu();
  });

  // === 行・列追加削除 ===

  function insertRowAfter(index) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = index + 2;
    th.dataset.row = index + 1;
    th.addEventListener("click", (e) => showRowMenu(e, index + 1));
    tr.appendChild(th);

    const rowData = [];
    for (let i = 0; i < COLS; i++) {
      const td = document.createElement("td");
      td.dataset.row = index + 1;
      td.dataset.col = i;
      td.addEventListener("click", () => selectCell(index + 1, i));
      tr.appendChild(td);
      rowData.push({ type: null, name: null });
    }

    tbody.insertBefore(tr, tbody.rows[index + 1]);
    gridData.splice(index + 1, 0, rowData);
    ROWS++;
    renumberRows();
  }

  function insertColumnAfter(index) {
    const label = getColumnLabel(index + 1);
    const th = document.createElement("th");
    th.textContent = label;
    th.dataset.col = index + 1;
    th.addEventListener("click", (e) => showColMenu(e, index + 1));
    theadRow.insertBefore(th, theadRow.children[index + 2]);

    for (let r = 0; r < ROWS; r++) {
      const td = document.createElement("td");
      td.dataset.row = r;
      td.dataset.col = index + 1;
      td.addEventListener("click", () => selectCell(r, index + 1));
      tbody.rows[r].insertBefore(td, tbody.rows[r].cells[index + 1]);
      gridData[r].splice(index + 1, 0, { type: null, name: null });
    }

    COLS++;
    renumberColumns();
  }

  function deleteRow(index) {
    if (ROWS <= 1) return alert("最低1行は必要です");
    tbody.deleteRow(index);
    gridData.splice(index, 1);
    ROWS--;
    renumberRows();
  }

  function deleteColumn(index) {
    if (COLS <= 1) return alert("最低1列は必要です");
    theadRow.deleteCell(index + 1);
    for (let r = 0; r < ROWS; r++) {
      tbody.rows[r].deleteCell(index + 1);
      gridData[r].splice(index, 1);
    }
    COLS--;
    renumberColumns();
  }

  function renumberRows() {
    for (let r = 0; r < ROWS; r++) {
      const row = tbody.rows[r];
      const th = row.querySelector("th");
      th.textContent = r + 1;
      th.dataset.row = r;
      th.onclick = ((rowIndex) => (e) => showRowMenu(e, rowIndex))(r);
    for (let c = 0; c < COLS; c++) {
        const td = row.cells[c + 1];
        if (td) td.dataset.row = r;
      }
    }
  }

  
function renumberColumns() {
  const headerCells = theadRow.querySelectorAll("th");
  for (let c = 1; c <= COLS; c++) {
    const th = headerCells[c];
    const colIndex = c - 1;
    th.textContent = getColumnLabel(colIndex);
    th.dataset.col = colIndex;
    th.onclick = ((colIndex) => (e) => showColMenu(e, colIndex))(colIndex);
  }

  for (let r = 0; r < ROWS; r++) {

      const row = tbody.rows[r];
      for (let c = 0; c < COLS; c++) {
        const td = row.cells[c + 1];
        if (td) td.dataset.col = c;
      td.setAttribute("data-col", c);
      }
    }
  }

  createGrid();
  window.insertRowAfter = insertRowAfter;
  window.insertColumnAfter = insertColumnAfter;
  window.deleteRow = deleteRow;
  window.deleteColumn = deleteColumn;
  window.hideMenu = hideMenu;
});
