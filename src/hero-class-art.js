/** Small class identity accents drawn behind the existing animated hero sprite. */
export function drawHeroClassAura(ctx,cls,x,y,time=0,active=false){
  const palettes={warrior:["#f3b85e","#ffe7a1"],mage:["#78d8ff","#d8c7ff"],ranger:["#8ed66f","#d8f2a2"]};
  const p=palettes[cls]||palettes.warrior, pulse=.75+.25*Math.sin(time*.006);
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=active?1:.58*pulse;
  ctx.strokeStyle=p[0];ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y+9,active?21:16,active?7:5,0,0,Math.PI*2);ctx.stroke();
  if(cls==="warrior"){
    ctx.fillStyle=p[1];for(let i=0;i<3;i++){const a=time*.004+i*Math.PI*2/3;ctx.fillRect(Math.round(x+Math.cos(a)*19),Math.round(y+7+Math.sin(a)*6),2,3);}
  }else if(cls==="mage"){
    for(let i=0;i<3;i++){const a=-time*.002+i*Math.PI*2/3;const sx=Math.round(x+Math.cos(a)*19),sy=Math.round(y+Math.sin(a)*9-3);ctx.fillStyle=p[i%2];ctx.fillRect(sx,sy,3,3);ctx.fillRect(sx+1,sy-2,1,2);}
  }else{
    for(let i=0;i<3;i++){const a=time*.003+i*Math.PI*2/3;const sx=Math.round(x+Math.cos(a)*19),sy=Math.round(y+Math.sin(a)*7-4);ctx.fillStyle=p[i%2];ctx.fillRect(sx,sy,2,4);ctx.fillRect(sx+2,sy-2,2,2);}
  }
  ctx.restore();
}
