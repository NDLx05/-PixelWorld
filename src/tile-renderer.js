/**
 * Deterministic, canvas-native pixel terrain.
 * Art direction: warm hand-painted fantasy MMORPG tiles, with a clear top-left light.
 * Every variation is derived from world coordinates so the map never flickers.
 */
export function tileSeed(x, y, id = 0) {
  let n = Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263) ^ Math.imul(id + 1, 1442695041);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n ^ (n >>> 16)) >>> 0;
}

export function drawTile(ctx, id, world, x, y, size, tx, ty) {
  const seed = tileSeed(tx, ty, id);
  const pick = n => (seed >>> ((n * 3) % 27)) % 19;
  const s = size / 24;
  const px = n => Math.round(n * s);
  const box = (color, ox, oy, w, h) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x + px(ox)), Math.round(y + px(oy)), Math.max(1, px(w)), Math.max(1, px(h)));
  };
  const dot = (color, ox, oy, w = 1, h = 1) => box(color, ox, oy, w, h);
  const grass = world === "village" ? ["#527d43","#598447","#4c773e"] : ["#356b3d","#3b7541","#2f6339"];
  const cave = world === "cave";

  if (world === "village") {
    const colors = {1:grass[pick(0)%3],3:"#276e91",7:"#b99b62",10:"#80503a",11:"#454b42"};
    box(colors[id] || grass[0],0,0,24,24);
  } else if (world === "forest") {
    const colors = {1:grass[pick(0)%3],2:"#1c432e",3:"#276e91",7:"#b99b62"};
    box(colors[id] || grass[0],0,0,24,24);
  } else {
    const colors = {4:"#405663",5:"#243944",6:"#4d6570",8:"#77766b"};
    box(colors[id] || "#405663",0,0,24,24);
  }

  // Top-left sunlight and lower-right contact shade.
  box("#ffffff12",1,1,22,1);
  box("#ffffff0b",1,2,1,19);
  box("#00000016",1,22,22,1);
  box("#00000012",22,2,1,20);

  if (id === 1) {
    // Meadow: layered grass blades, tiny flowers and ground variation.
    for (let i=0;i<5;i++) {
      const gx=2+pick(i+1)%19, gy=3+pick(i+7)%18;
      dot(i%2?"#244f32":"#2e5b35",gx,gy,2,2);
      dot(i%2?"#80ad55":"#6f9d4d",gx+1,gy-1,2,1);
      if (pick(i+12)%4===0) dot("#d6d28a",gx+2,gy-2,1,1);
    }
    if (pick(15)%3===0) {
      dot("#f0d58a",4+pick(16)%15,5+pick(17)%13,2,2);
      dot("#fff0bd",5+pick(16)%15,5+pick(17)%13,1,1);
    }
    if (pick(18)%4===0) box("#254b32",2+pick(5)%18,18+pick(8)%4,3,1);
  } else if (id === 2 || id === 11 || (id === 5 && cave)) {
    // Dense canopy / cave wall tiles use overlapping masses instead of flat blocks.
    const dark=cave?"#172d35":"#142d22", mid=cave?"#344e58":"#245337", light=cave?"#6c8589":"#3d7948";
    box(dark,1,5,22,17); box(mid,2,4,20,13);
    box(light,4+pick(0)%4,3,10,4);
    box(cave?"#9aada7":"#5c9852",7+pick(3)%8,6+pick(4)%6,5,2);
    box(dark,3,17,18,4);
    dot(cave?"#8ca5a4":"#a0c56b",5+pick(9)%13,8+pick(10)%9,2,1);
    dot(cave?"#203a43":"#183d2a",2+pick(11)%18,14+pick(12)%7,2,2);
  } else if (id === 3) {
    // Shallow water: layered banks, broken ripples and reflected light.
    box("#1c5876",0,2,24,20);
    box("#287c9b",1,5,22,13);
    box("#1b5b7c",0,18,24,4);
    box("#6bb8bf",2+pick(0)%14,5+pick(1)%12,5,1);
    box("#a8ded0",4+pick(2)%14,6+pick(3)%12,3,1);
    dot("#d0ead2",6+pick(4)%14,4+pick(5)%14,1,1);
    box("#164663",0,22,24,2);
  } else if (id === 7) {
    // Worn dirt path with compacted patches and pebbles.
    box("#a58a58",0,0,24,24);
    box("#c7ad75",1,2,22,19);
    box("#d9c18a",3,3,15,2);
    box("#92764b",2,19,19,2);
    for(let i=0;i<5;i++) dot(i%2?"#806b49":"#ead49a",3+pick(i)%18,4+pick(i+6)%16,2,1);
    dot("#f0dca5",5+pick(14)%14,5+pick(15)%12,2,1);
  } else if (id === 6 && cave) {
    // Crystal seam embedded in rock.
    box("#243e4a",0,0,24,24);
    box("#1f536c",2,16,20,6);
    box("#2c8bb2",4,9,6,12);
    box("#73d9eb",9,3,6,18);
    box("#c4fbf4",10,5,2,11);
    box("#367fa1",15,10,5,11);
    dot("#efffff",11,4,2,2);
    box("#142f3a",2,21,20,2);
  } else if (id === 10 && world === "village") {
    // Building floor / roof tile with timber and warm trim.
    box("#4a302b",0,2,24,22); box("#b66a43",1,2,22,7);
    box("#e5a36a",3,4,18,2); box("#382820",2,11,20,11);
    box("#6f4935",4,13,16,8); box("#d4b16c",6,14,3,5);
    box("#523c30",1,22,22,2);
  } else if ([4,5,8].includes(id) && cave) {
    // Cave floor and fractured stone.
    box(id===8?"#706e65":"#2b414d",2,3,20,18);
    box("#738b91",3+pick(0)%7,4+pick(1)%7,8,2);
    box("#9aaba4",6+pick(2)%12,9+pick(3)%8,3,2);
    box("#172b35",2,20,20,2);
    dot("#b1c4bd",5+pick(6)%14,5+pick(7)%13,1,1);
    box("#263b46",12+pick(8)%7,15+pick(9)%5,3,1);
  }

  // Subtle seams preserve tile readability without a visible checkerboard.
  if (id !== 3) box("#0a171b18",23,2,1,20);
}
