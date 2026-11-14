/**
 * Small layered world props for PixelWorld's fantasy MMORPG look.
 * All drawing is canvas-native and keeps the game's nearest-neighbour pixel style.
 */
function polygon(ctx, points, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i=1;i<points.length;i++) ctx.lineTo(points[i][0],points[i][1]);
  ctx.closePath();
  ctx.fillStyle=fill; ctx.fill();
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
}

export function drawResourceNode(ctx, type, x, y, world="forest", seed=0) {
  const v=(n)=>((Math.imul((seed+1)^(n*0x45d9f3b),0x27d4eb2d)>>>0)%7);
  ctx.save(); ctx.imageSmoothingEnabled=false;
  ctx.fillStyle="#09140e88"; ctx.beginPath();
  ctx.ellipse(Math.round(x),Math.round(y+7),type==="tree"?16:12,4,0,0,Math.PI*2);ctx.fill();

  if(type==="tree"){
    // Trunk, roots and layered crown.
    ctx.fillStyle="#4a3022";ctx.fillRect(x-3,y-5,7,14);
    ctx.fillStyle="#805033";ctx.fillRect(x-2,y-10,3,17);
    ctx.fillStyle="#39291f";ctx.fillRect(x-8,y+5,6,2);ctx.fillRect(x+2,y+5,7,2);
    const shades=world==="cave"?["#173e3b","#24665b","#3d8b72"]:["#17472f","#22613a","#347c43","#4d9650"];
    polygon(ctx,[[x-15,y-8],[x-13,y-19],[x-7,y-24],[x-8,y-31],[x-1,y-35],[x+8,y-30],[x+14,y-22],[x+15,y-10],[x+8,y-4],[x-8,y-4]],shades[0]);
    polygon(ctx,[[x-12,y-14],[x-9,y-25],[x-2,y-29],[x+7,y-27],[x+12,y-18],[x+8,y-9],[x-7,y-8]],shades[1]);
    polygon(ctx,[[x-8,y-20],[x-4,y-29],[x+4,y-31],[x+10,y-23],[x+5,y-17],[x-3,y-16]],shades[2]);
    ctx.fillStyle=shades[3]||"#4d9650";ctx.fillRect(x-5,y-27,5,3);ctx.fillRect(x+3,y-23,4,3);
    ctx.fillStyle="#a9c96b";ctx.fillRect(x-4,y-29,3,2);ctx.fillRect(x+5,y-25,2,2);
    ctx.fillStyle="#c6d87a";ctx.fillRect(x-2,y-24,2,1);
  } else if(type==="crystal"){
    polygon(ctx,[[x-12,y+7],[x-10,y-5],[x-3,y-19],[x+1,y-8],[x+6,y-24],[x+13,y-7],[x+11,y+7]],"#245c7d","#102f49");
    polygon(ctx,[[x-9,y+4],[x-5,y-6],[x-3,y-18],[x+1,y-6],[x+2,y+5]],"#55b7d5");
    polygon(ctx,[[x+2,y+5],[x+6,y-24],[x+11,y-7],[x+10,y+6]],"#8ce8f0");
    ctx.fillStyle="#e0ffff";ctx.fillRect(x+5,y-20,2,8);ctx.fillRect(x-4,y-11,2,5);
  } else if(type==="ore") {
    polygon(ctx,[[x-13,y+6],[x-11,y-5],[x-4,y-12],[x+4,y-10],[x+13,y-3],[x+11,y+7]],"#35434a","#18282d");
    ctx.fillStyle="#778b8b";ctx.fillRect(x-7,y-5,7,3);ctx.fillRect(x+3,y-2,5,2);
    ctx.fillStyle="#d1a86a";ctx.fillRect(x-2,y-8,3,3);ctx.fillRect(x+5,y-5,2,2);
  } else {
    polygon(ctx,[[x-13,y+6],[x-10,y-5],[x-3,y-12],[x+6,y-10],[x+13,y-3],[x+11,y+7]],"#4b5960","#24343a");
    polygon(ctx,[[x-8,y-4],[x-3,y-10],[x+4,y-8],[x+7,y-3],[x,y-1]],"#89979a");
    ctx.fillStyle="#b7c0b6";ctx.fillRect(x-5,y-7,4,2);
    ctx.fillStyle="#303f45";ctx.fillRect(x-9,y+4,15,2);
  }
  // Tiny ambient glints make resource silhouettes easier to read.
  if(type==="crystal"||type==="ore"){
    ctx.globalAlpha=.45;ctx.fillStyle=type==="crystal"?"#9df5ff":"#f2c87e";
    ctx.fillRect(x-15-v(1),y-7-v(2),1,1);ctx.fillRect(x+13+v(3),y-14-v(4),1,1);
  }
  ctx.restore();
}

export function drawWorldAtmosphere(ctx, world, width, height, timeMs=0) {
  ctx.save();
  const cave=world==="cave", village=world==="village";
  const tint=cave?"rgba(64,153,198,.10)":village?"rgba(255,203,126,.055)":"rgba(110,191,100,.07)";
  ctx.fillStyle=tint;ctx.fillRect(0,0,width,height);
  const pulse=.5+.5*Math.sin(timeMs*.00045);
  const glow=ctx.createRadialGradient(width*.48,height*.43,8,width*.48,height*.43,width*.72);
  glow.addColorStop(0,cave?"rgba(88,191,232,.08)":village?"rgba(255,220,151,.08)":"rgba(193,229,132,.08)");
  glow.addColorStop(1,"rgba(0,0,0,.24)");
  ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  // Sparse, slowly drifting pixel motes; deterministic, no per-frame randomness.
  for(let i=0;i<9;i++){
    const x=(i*67+Math.sin(timeMs*.00018+i*2.1)*9+width)%width;
    const y=(i*43+Math.cos(timeMs*.00014+i*1.7)*6+height)%height;
    ctx.globalAlpha=.18+pulse*.18;
    ctx.fillStyle=cave?"#8deaff":village?"#ffe3a1":"#d9f4a0";
    ctx.fillRect(Math.round(x),Math.round(y),i%3===0?2:1,1);
  }
  ctx.restore();
}
