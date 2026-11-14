export function tileSeed(x, y, id = 0) {
  let n = Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263) ^ Math.imul(id + 1, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n ^ (n >>> 16)) >>> 0;
}

export function drawTile(ctx, id, world, x, y, size, tx, ty) {
  const seed = tileSeed(tx, ty, id);
  const pick = n => (seed >>> (n * 3)) % 17;
  const rect = (color, ox, oy, w, h) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x + ox), Math.round(y + oy), w, h); };

  if (world === "village") {
    const colors = {1:"#527d43",3:"#276e91",7:"#b99b62",10:"#80503a",11:"#454b42"};
    rect(colors[id] || "#527d43", 0, 0, size, size);
  } else if (world === "forest") {
    const colors = {1:"#356b3d",2:"#1c432e",3:"#276e91",7:"#b99b62"};
    rect(colors[id] || "#356b3d", 0, 0, size, size);
  } else {
    const colors = {4:"#405663",5:"#243944",6:"#4d6570",8:"#77766b"};
    rect(colors[id] || "#405663", 0, 0, size, size);
  }

  // Bevelled tile edges give the ground a readable, hand-built pixel-art surface.
  rect("#ffffff12", 1, 1, size - 2, 1);
  rect("#00000022", 1, size - 2, size - 2, 1);

  if (id === 1) {
    rect("#244f32", 3 + pick(0), 5 + pick(1) % 11, 2, 2);
    rect("#78a957", 5 + pick(2) % 14, 4 + pick(3) % 15, 2, 1);
    rect("#a1c66b", 6 + pick(4) % 13, 5 + pick(5) % 14, 1, 1);
    if (pick(6) % 3 === 0) {
      rect("#244f32", 14 + pick(7) % 6, 15 + pick(8) % 5, 2, 3);
      rect("#8ebd60", 13 + pick(9) % 7, 14 + pick(10) % 4, 2, 1);
    }
  } else if (id === 2 || id === 11 || id === 5) {
    const foliage = world === "cave" ? "#344e58" : "#245337";
    rect("#142b24", 2, 18, size - 4, 4);
    rect(foliage, 2 + pick(0) % 4, 4 + pick(1) % 5, size - 6, 14);
    rect(world === "cave" ? "#6c8589" : "#3d7948", 5 + pick(2) % 5, 4, 8, 3);
    rect(world === "cave" ? "#1a303a" : "#173d2b", 4, 16, size - 8, 3);
    rect("#9ab87955", 7 + pick(3) % 8, 7 + pick(4) % 6, 2, 2);
  } else if (id === 3) {
    rect("#1c5a7b", 0, 4 + pick(0) % 12, size, 2);
    rect("#68b7c0", 3 + pick(1) % 15, 7 + pick(2) % 12, 7, 1);
    rect("#b4e1cf", 5 + pick(3) % 12, 8 + pick(4) % 10, 3, 1);
    rect("#164663", 1, 20, size - 2, 2);
  } else if (id === 7) {
    rect("#d2b77d", 2, 2, size - 4, size - 4);
    rect("#9d8050", 4 + pick(0) % 13, 5 + pick(1) % 13, 2, 1);
    rect("#ead49a", 7 + pick(2) % 12, 4 + pick(3) % 14, 3, 1);
    rect("#806b49", 5 + pick(4) % 13, 17 + pick(5) % 4, 2, 2);
  } else if (id === 4 || id === 8 || id === 6 || id === 10) {
    if (id === 6) {
      rect("#1f536c", 2, 18, size - 4, 4);
      rect("#2c8bb2", 5, 9, 5, 11);
      rect("#73d9eb", 9, 3, 6, 17);
      rect("#c4fbf4", 10, 5, 2, 9);
      rect("#367fa1", 15, 11, 4, 9);
    } else if (id === 10 && world === "village") {
      rect("#4a302b", 1, 4, size - 2, size - 5);
      rect("#b66a43", 2, 3, size - 4, 6);
      rect("#e5a36a", 4, 5, 6, 2);
      rect("#382820", 8, 13, 7, 10);
      rect("#d4b16c", 9, 14, 2, 3);
      rect("#523c30", 2, 22, size - 4, 2);
    } else {
      rect("#273c47", 3, 5, size - 6, size - 8);
      rect("#738b91", 4 + pick(0) % 6, 5 + pick(1) % 6, 8, 2);
      rect("#9aaba4", 6 + pick(2) % 10, 10 + pick(3) % 8, 3, 2);
      rect("#172b35", 3, 20, size - 6, 2);
    }
  }

  // Fine tile seams keep adjacent ground readable without a noisy grid.
  if (id !== 3) rect("#0a171b18", size - 1, 2, 1, size - 3);
}
