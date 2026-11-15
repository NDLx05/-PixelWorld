/**
 * Original pixel-art landmarks for forest and cave maps.
 * Fixed world coordinates keep props stable while the camera scrolls.
 */
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function tree(c,x,y,s=1,variant=0){
  rect(c,x-3*s,y+8*s,8*s,24*s,"#593b2a");rect(c,x-5*s,y+25*s,12*s,5*s,"#392d25");
  const colors=variant?["#173e32","#245b3e","#34784a","#5b9954"]:["#19452f","#286341","#3d7d48","#6b9b50"];
  for(let i=0;i<4;i++){const r=(15-i*2)*s;rect(c,x-r*.65,y-r*.35+i*5*s,r*1.3,r*.72,colors[i]);}
  rect(c,x-4*s,y-13*s,3*s,3*s,"#a4bd67");rect(c,x+6*s,y-5*s,2*s,2*s,"#a4bd67");
}
function mushroom(c,x,y,s=1){
  rect(c,x-2*s,y,4*s,6*s,"#e4d7b5");rect(c,x-5*s,y-3*s,10*s,4*s,"#b94d4b");
  rect(c,x-2*s,y-4*s,2*s,2*s,"#f4c58b");
}
function crystal(c,x,y,s=1,color="#63d9df"){
  rect(c,x-2*s,y-10*s,4*s,10*s,"#244f63");rect(c,x-1*s,y-13*s,3*s,5*s,color);
  rect(c,x-1*s,y-10*s,1*s,7*s,"#d6ffff");rect(c,x+4*s,y-6*s,3*s,6*s,"#315d73");rect(c,x+5*s,y-9*s,2*s,5*s,color);
}
function caveRock(c,x,y,s=1){
  rect(c,x-10*s,y-3*s,20*s,6*s,"#273d48");rect(c,x-7*s,y-7*s,14*s,5*s,"#526b72");
  rect(c,x-4*s,y-9*s,8*s,3*s,"#71858a");rect(c,x-5*s,y-2*s,3*s,2*s,"#91a1a0");
}
export function drawBiomeLandmarks(ctx,world,cameraX=0,cameraY=0,time=0){
  if(world!=="forest"&&world!=="cave")return;
  ctx.save();ctx.imageSmoothingEnabled=false;
  if(world==="forest"){
    tree(ctx,105-cameraX,100-cameraY,1.2,0);tree(ctx,250-cameraX,82-cameraY,.9,1);
    tree(ctx,790-cameraX,118-cameraY,1.15,1);tree(ctx,865-cameraX,510-cameraY,1.25,0);
    tree(ctx,135-cameraX,590-cameraY,1.05,1);tree(ctx,510-cameraX,640-cameraY,.85,0);
    rect(ctx,355-cameraX,430-cameraY,70,8,"#513a2b");rect(ctx,362-cameraX,425-cameraY,58,5,"#79543a");
    for(const [x,y,s] of [[300,190,1],[324,202,.7],[700,570,.9],[735,585,.65],[570,120,.7]])mushroom(ctx,x-cameraX,y-cameraY,s);
    // Fireflies pulse gently without changing the landmarks' positions.
    const pulse=.55+.45*Math.sin(time*.004);
    ctx.globalAlpha=pulse;rect(ctx,470-cameraX,250-cameraY,2,2,"#e8f5a0");rect(ctx,620-cameraX,390-cameraY,2,2,"#e8f5a0");rect(ctx,210-cameraX,490-cameraY,2,2,"#e8f5a0");
  }else{
    caveRock(ctx,120-cameraX,150-cameraY,1.2);caveRock(ctx,820-cameraX,205-cameraY,1.35);
    caveRock(ctx,250-cameraX,600-cameraY,1.1);caveRock(ctx,720-cameraX,560-cameraY,1.2);
    crystal(ctx,180-cameraX,330-cameraY,1.2);crystal(ctx,205-cameraX,340-cameraY,.8);
    crystal(ctx,650-cameraX,180-cameraY,1.4,"#9c8aff");crystal(ctx,675-cameraX,188-cameraY,.8,"#9c8aff");
    crystal(ctx,480-cameraX,610-cameraY,1.1,"#6fe6b2");
    const glow=.65+.2*Math.sin(time*.003);
    ctx.globalAlpha=glow;rect(ctx,176-cameraX,315-cameraY,2,2,"#d9ffff");rect(ctx,646-cameraX,164-cameraY,2,2,"#eee1ff");
  }
  ctx.restore();
}
