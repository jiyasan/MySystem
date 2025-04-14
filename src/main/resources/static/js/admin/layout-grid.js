export function renderLayoutGrid(tbody, theadRow, layoutItems, options = {}) {
  const rows = options.rows || 8;
  const cols = options.cols || 10;
  const extendGrid = options.extendGridToFitItems !== false;
  const disableEqualSize = options.disableEqualSize === true;

  // 行列の最大値を決める
  let maxRow = rows;
  let maxCol = cols;
  if (extendGrid) {
    for (const item of layoutItems) {
      if (item.isDeleted) continue;
      const endRow = item.rowIndex + (item.rowspan || 1);
      const endCol = item.colIndex + (item.colspan || 1);
      maxRow = Math.max(maxRow, endRow);
      maxCol = Math.max(maxCol, endCol);
    }
  }

  // 列ラベル A, B, C ...
  if (theadRow) {
    theadRow.innerHTML = "<th></th>"; // 左上空白セル
    for (let c = 0; c < maxCol; c++) {
      const th = document.createElement("th");
      th.textContent = getColumnLabel(c);
      theadRow.appendChild(th);
    }
  }

  // tbody 初期化
  tbody.innerHTML = "";

  const occupiedMap = {};
  const itemMap = {};

  // 配置マップ構築
  for (const item of layoutItems) {
    if (item.isDeleted) continue;
    const r = item.rowIndex;
    const c = item.colIndex;
    itemMap[`${r}-${c}`] = item;

    const rowSpan = item.rowspan || 1;
    const colSpan = item.colspan || 1;

    for (let dr = 0; dr < rowSpan; dr++) {
      for (let dc = 0; dc < colSpan; dc++) {
        const rr = r + dr;
        const cc = c + dc;
        occupiedMap[rr] = occupiedMap[rr] || {};
        occupiedMap[rr][cc] = true;
      }
    }
  }

  // 実グリッド描画
  for (let r = 0; r < maxRow; r++) {
    const tr = document.createElement("tr");

    // 行ラベル 1〜
    const th = document.createElement("th");
    th.textContent = r + 1;
    tr.appendChild(th);

    for (let c = 0; c < maxCol; c++) {
      const key = `${r}-${c}`;
      const item = itemMap[key];
      const isBase = item?.isBase;

      if (!isBase && occupiedMap[r]?.[c]) {
        const td = document.createElement("td");
        td.style.display = "none";
        tr.appendChild(td);
        continue;
      }

      const td = document.createElement("td");
      td.dataset.row = r;
      td.dataset.col = c;

      if (item) {
        td.setAttribute("rowspan", item.rowspan || 1);
        td.setAttribute("colspan", item.colspan || 1);
        td.textContent = item.name || "";
        td.style.backgroundColor = item.color || "#fff";
        td.dataset.type = item.type || "";
        td.classList.add("layout-cell");
      }

      tr.appendChild(td);
    }

    tbody.appendChild(tr);
  }

  if (!disableEqualSize) {
    setEqualCellSize(tbody);
  }
}

export function getColumnLabel(index) {
  let label = "";
  while (index >= 0) {
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
}

export function setEqualCellSize(tbody) {
  const size = "60px";
  tbody.querySelectorAll("td").forEach(td => {
    if (td.style.display === "none") return;
    td.style.width = size;
    td.style.height = size;
  });
}
