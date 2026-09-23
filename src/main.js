import "./style.css";
import { parseGDR2 } from "./gdr2.js";
import { convertToWBGDR2 } from "./wbgdr2.js";

const input=document.querySelector("#file");
const button=document.querySelector("#convert");
const status=document.querySelector("#status");
const info=document.querySelector("#info");
const details=document.querySelector("#details");
const drop=document.querySelector("#drop");
let file=null,replay=null;

async function load(f){
  file=f; replay=null; button.disabled=true;
  try{
    replay=parseGDR2(new Uint8Array(await f.arrayBuffer()));
    details.innerHTML=[
      ["Archivo",f.name],["Nivel",replay.level.name||"(sin nombre)"],
      ["ID",replay.level.id],["FPS",replay.framerate],
      ["Frames",replay.duration],["Inputs",replay.inputs.length],
      ["Muertes",replay.deaths.length],["Autor",replay.author||"(sin autor)"]
    ].map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join("");
    info.hidden=false; button.disabled=false;
    status.textContent="✅ GDR2 leído correctamente.";
  }catch(e){status.textContent="❌ "+e.message; status.dataset.error="true";}
}
input.onchange=()=>{if(input.files[0])load(input.files[0])};
["dragenter","dragover"].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.add("drag")}));
["dragleave","drop"].forEach(x=>drop.addEventListener(x,e=>{e.preventDefault();drop.classList.remove("drag")}));
drop.ondrop=e=>{const f=e.dataTransfer.files[0];if(f)load(f)};
button.onclick=()=>{
  try{
    const out=convertToWBGDR2(replay);
    const blob=new Blob([JSON.stringify(out)],{type:"application/json"});
    const url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url; a.download=file.name.replace(/\.(gdr2|gdr)$/i,"")+".wbgdr2"; a.click();
    URL.revokeObjectURL(url);
    status.textContent="✅ Convertido: "+out.frames.length+" frames.";
  }catch(e){status.textContent="❌ "+e.message;status.dataset.error="true";}
};
