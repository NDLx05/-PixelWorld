/**
 * Landmark art for the first PixelWorld village art pass.
 * Drawn in world coordinates so the camera scrolls it with the terrain.
 * Original canvas pixel art; no external game assets are copied.
 */
function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(ctx,pts,color,stroke){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fillStyle=color;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
function house(ctx,x,y,w,h,variant=0){
  // Ground shadow and timber-framed plaster walls.
  rect(ctx,x+5,y+h-3,w-2,7,"#1c2b25");rect(ctx,x+8,y+18,w-16,h-18,variant?"#d7b77b":"#e6c995");
  rect(ctx,x+11,y+21,5,h-23,"#79513a");rect(ctx,x+w-17,y+21,5,h-23,"#79513a");
  rect(ctx,x+8,y+18,w-16,5,"#f4dfae");rect(ctx,x+8,y+h-8,w-16,5,"#8a5838");
  // Roof with layered terracotta shingles.
  poly(ctx,[[x-5,y+22],[x+w*.5,y-5],[x+w+5,y+22],[x+w-2,y+29],[x+w*.5,y+5],[x+2,y+29]],variant?"#70423a":"#914b3c","#422e2b");
  poly(ctx,[[x+3,y+20],[x+w*.5,y+1],[x+w-3,y+20],[x+w-7,y+23],[x+w*.5,y+7],[x+7,y+23]],variant?"#b66a4d":"#cf7950");
  for(let row=0;row<3;row++)for(let col=0;col<5;col++){const sx=x+10+col*(w-22)/5+(row%2)*3,sy=y+8+row*5;rect(ctx,sx,sy,7,2,row%2?"#e39a63":"#e9ad70");rect(ctx,sx+1,sy+2,5,1,"#8a4939");}
  // Windows, door, lintel and warm glass.
  const wy=y+31;for(const wx of [x+20,x+w-31]){rect(ctx,wx-2,wy-2,16,18,"#573c31");rect(ctx,wx,wy,12,14,"#5e9ca0");rect(ctx,wx+2,wy+2,4,5,"#d8edc0");rect(ctx,wx+6,wy+2,4,5,"#9bc7c2");rect(ctx,wx+5,wy,2,14,"#e4c78d");rect(ctx,wx,wy+6,12,2,"#e4c78d");}
  rect(ctx,x+w*.5-7,y+h-26,15,25,"#54392e");rect(ctx,x+w*.5-5,y+h-24,11,22,"#a66c45");rect(ctx,x+w*.5+3,y+h-14,2,2,"#f4d37d");
  rect(ctx,x+w*.5-10,y+h-28,21,3,"#f0d69b");
  // Chimney and hanging sign.
  rect(ctx,x+w-27,y+1,9,13,"#704b3c");rect(ctx,x+w-29,y-1,13,4,"#b66b4c");
  rect(ctx,x+5,y+27,3,18,"#553c2d");rect(ctx,x-1,y+39,15,12,"#805437");rect(ctx,x+1,y+41,11,8,"#e7c47c");
}
function tree(ctx,x,y,scale=1,blossom=false){
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  rect(ctx,-4,-3,9,22,"#68432e");rect(ctx,-8,14,6,4,"#50372a");rect(ctx,3,13,8,4,"#50372a");
  const base=blossom?"#9b4f86":"#17452d",mid=blossom?"#d56fa7":"#287044",light=blossom?"#f39ac3":"#4d9851";
  for(const [ox,oy,r] of [[-10,-17,13],[5,-23,15],[16,-12,12],[-4,-5,14]]){ctx.fillStyle=base;ctx.beginPath();ctx.arc(ox,oy,r,0,Math.PI*2);ctx.fill();}
  for(const [ox,oy,r] of [[-9,-19,10],[5,-24,11],[15,-13,9],[-3,-7,10]]){ctx.fillStyle=mid;ctx.beginPath();ctx.arc(ox,oy,r,0,Math.PI*2);ctx.fill();}
  rect(ctx,-10,-24,7,4,light);rect(ctx,2,-30,8,4,light);rect(ctx,12,-18,6,4,light);
  if(blossom){rect(ctx,-7,-27,3,3,"#ffe1f0");rect(ctx,5,-18,3,3,"#fff0f5");rect(ctx,15,-23,3,3,"#ffe1f0");}
  else{rect(ctx,-3,-27,3,3,"#d2e48a");rect(ctx,8,-21,3,3,"#c2dc7a");}
  ctx.restore();
}
function well(ctx,x,y){
  ctx.fillStyle="#293c3c";ctx.beginPath();ctx.ellipse(x,y+12,20,7,0,0,Math.PI*2);ctx.fill();
  rect(ctx,x-16,y-1,32,14,"#7c7770");rect(ctx,x-13,y+1,26,9,"#9b9a88");rect(ctx,x-11,y+3,22,6,"#327a9b");
  rect(ctx,x-13,y-19,4,21,"#704a32");rect(ctx,x+9,y-19,4,21,"#704a32");rect(ctx,x-17,y-22,34,5,"#9b613c");rect(ctx,x-12,y-26,24,4,"#c28a50");
}
function bridge(ctx,x,y){
  rect(ctx,x,y+9,92,20,"#60452f");rect(ctx,x+2,y+11,88,15,"#b17b4a");
  for(let i=0;i<8;i++){rect(ctx,x+5+i*11,y+12,8,12,i%2?"#d7a36a":"#c28b54");rect(ctx,x+5+i*11,y+2,4,11,"#704b32");rect(ctx,x+5+i*11,y,4,3,"#e1bd7b");}
  rect(ctx,x+2,y+1,88,4,"#8e5d3c");rect(ctx,x+2,y+1,88,2,"#d4a36a");
}
export function drawVillageLandmarks(ctx,cameraX=0,cameraY=0,timeMs=0){
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(-cameraX,-cameraY);
  // Two occupied building plots already reserved by the village collision map.
  house(ctx,145,184,178,150,0);
  house(ctx,625,184,178,150,1);
  // Small market awning beside the east house.
  rect(ctx,821,267,62,42,"#8a5939");rect(ctx,825,271,54,35,"#d7b77b");
  rect(ctx,821,262,62,9,"#f1e3c3");for(let i=0;i<6;i++)rect(ctx,822+i*10,262,7,9,i%2?"#d8e3d5":"#b94f43");
  // Village well, timber bridge, lamp posts and ornamental trees.
  well(ctx,474,438);bridge(ctx,86,526);
  tree(ctx,76,166,1.15,true);tree(ctx,414,148,1.05,false);tree(ctx,867,470,1.18,false);tree(ctx,372,608,.9,true);
  for(const [x,y] of [[385,390],[568,350],[852,390],[118,410]]){
    rect(ctx,x-2,y-1,4,22,"#59402e");rect(ctx,x-5,y-7,10,10,"#e8c17a");rect(ctx,x-3,y-5,6,6,"#fff0b0");rect(ctx,x-1,y-3,2,3,"#ffe8a0");
  }
  // Flower beds and tiny stones add scale around paths without blocking play lanes.
  for(let i=0;i<22;i++){const x=30+(i*83)%900,y=360+(i*47)%330;const color=["#f4d5e8","#f4d47d","#d9e8fa","#f39a9a"][i%4];rect(ctx,x,y,3,2,"#28633c");rect(ctx,x+1,y-2,2,2,color);rect(ctx,x+4,y,2,1,"#fff0c4");}
  // A subtle moving sparkle over the well water.
  const pulse=(Math.sin(timeMs*.003)+1)*.5;ctx.globalAlpha=.35+pulse*.45;rect(ctx,470+(pulse*10|0),441,3,2,"#e3fbff");
  ctx.restore();
}
