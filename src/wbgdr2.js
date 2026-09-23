const stateTemplate={
y:30,lastY:30,lastGroundPosY:30,yVelocity:0,onGround:true,canJump:true,isJumping:false,
gravityFlipped:false,isFlying:true,isBall:false,isWave:false,isUfo:false,isSpider:false,isBird:false,
isDart:false,isRobot:false,isSwing:false,isJetpack:false,isMini:false,wasBoosted:false,
_slopeBounceActive:false,pendingVelocity:null,collideTop:0,collideBottom:0,onCeiling:false,
upKeyDown:false,upKeyPressed:false,queuedHold:false,_orbActivationConsumedForPress:false,isDead:false,
mirrored:false,isDashing:false,dashYVelocity:0,isDual:false,ignorePortals:false,_robotHold:false,
_robotHoldTimer:0,_spiderTeleportNoclipDeathPending:false,ballShouldRotate:false,ballRotateOpposite:false,
ballNormalRotate:0.86,ballHitPad:false,ballRotation2:0.86,diedThisFrame:false,touchingRing:false,
wasUpKeyDown:false,diedLastFrame:false,lastGroundY:197
};
function clone(){return structuredClone(stateTemplate)}
export function convertToWBGDR2(r){
 const duration=Math.max(Number(r.duration)||0,r.inputs.reduce((m,x)=>Math.max(m,x.frame),0)+1);
 const events=new Map();for(const x of r.inputs){if(x.player2)continue;if(!events.has(x.frame))events.set(x.frame,[]);events.get(x.frame).push(x)}
 const frames=[];let held=false,previousHeld=false,x=0,speed=11.54;
 for(let frame=1;frame<=duration;frame++){
   const ev=events.get(frame)||[];
   for(const e of ev)if(e.button===1)held=e.down;
   const st=clone();st.upKeyDown=held;st.upKeyPressed=held&&!previousHeld;st.queuedHold=held;st.wasUpKeyDown=previousHeld;
   x+=speed/4.45;
   frames.push({frame,playerWorldX:x,cameraX:Math.max(-419,x-419),cameraY:160,speed,dual:false,player:{state:st,rotation:0,mode:"ship"},dualPlayer:null});
   previousHeld=held;
 }
 return {meta:{author:"GDR2 → WBGDR2 Converter",level:r.level.name||String(r.level.id||"unknown"),version:2,name:r.level.name||"converted"},frames};
}
