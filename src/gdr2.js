export class GDR2Error extends Error{
  constructor(message,offset=null){super(offset===null?message:`${message} (offset 0x${offset.toString(16)})`);this.name="GDR2Error";this.offset=offset;}
}
function fail(m,s){throw new GDR2Error(m,s.offset)}
function byte(b,s){if(s.offset>=b.length)fail("Fin inesperado",s);return b[s.offset++]}
function varint(b,s){let v=0,shift=0;while(s.offset<b.length){const x=byte(b,s);v+=(x&127)*2**shift;if(!(x&128))return v;shift+=7;if(shift>49)fail("Varint demasiado grande",s)}fail("Varint incompleto",s)}
function cstr(b,s){const start=s.offset;while(s.offset<b.length&&b[s.offset]!==0)s.offset++;if(s.offset>=b.length)fail("String sin NUL",s);const x=new TextDecoder().decode(b.subarray(start,s.offset));s.offset++;return x}
function bytes(b,s,n){if(!Number.isSafeInteger(n)||n<0||s.offset+n>b.length)fail("Bloque fuera de límites",s);const x=b.subarray(s.offset,s.offset+n);s.offset+=n;return x}
function bool(b,s){return byte(b,s)!==0}
function unpack(v,platformer){return platformer?{frameDelta:Math.floor(v/16),button:Math.floor(v/4)%4,down:Math.floor(v/2)%2===1}:{frameDelta:Math.floor(v/4),button:1,down:Math.floor(v/2)%2===1}}
export function parseGDR2(input){
 const b=input instanceof Uint8Array?input:new Uint8Array(input),s={offset:0};
 if(b.length<4||b[0]!==71||b[1]!==68||b[2]!==82)throw new GDR2Error("El archivo no comienza con GDR");
 s.offset=3;const version=varint(b,s);if(version!==2)throw new GDR2Error("Versión GDR no soportada: "+version,3);
 const inputTag=cstr(b,s);
 const r={format:"gdr2",version,inputTag,author:cstr(b,s),description:cstr(b,s),duration:varint(b,s),gameVersion:varint(b,s),framerate:varint(b,s),seed:varint(b,s),coins:varint(b,s),ldm:bool(b,s),platformer:bool(b,s),bot:{name:cstr(b,s),version:varint(b,s)},level:{id:varint(b,s),name:cstr(b,s)}};
 const ext=varint(b,s);bytes(b,s,ext);
 const deathCount=varint(b,s),deaths=[];let df=0;
 for(let i=0;i<deathCount;i++){df+=varint(b,s);deaths.push(df)}
 const count=varint(b,s),p1Count=varint(b,s);if(p1Count>count)fail("P1 Input Count es mayor que Input Count",s);
 const p1=[],p2=[];
 for(let i=0;i<count;i++){
   const player2=i>=p1Count,p=unpack(varint(b,s),r.platformer),ex=varint(b,s);bytes(b,s,ex);
   const list=player2?p2:p1,prev=list.length?list[list.length-1].frame:0;
   list.push({frame:prev+p.frameDelta,button:p.button,player2,down:p.down});
 }
 r.deaths=deaths;r.player1Inputs=p1;r.player2Inputs=p2;r.inputs=[...p1,...p2].sort((a,c)=>a.frame-c.frame||Number(a.player2)-Number(c.player2));
 r.bytesRead=s.offset;r.trailingBytes=b.length-s.offset;r.size=b.length;return r;
}
