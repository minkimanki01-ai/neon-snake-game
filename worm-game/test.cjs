const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const els=new Map(),noop=()=>{},ctx=new Proxy({},{get:()=>noop,set:()=>true});
function el(id){if(!els.has(id))els.set(id,{value:'115',textContent:'',hidden:false,addEventListener:noop,getContext:()=>ctx});return els.get(id);}
const sandbox={document:{getElementById:el,querySelectorAll:()=>[],addEventListener:noop},localStorage:{getItem:()=>null,setItem:noop},setInterval:()=>1,clearInterval:noop};
let source=fs.readFileSync('dist/game.js','utf8').replace('reset();draw();\n})();','reset();draw();globalThis.test={start,step,turn,pause,get:()=>({snake,score,state,queue}),food:p=>food=p};\n})();');
vm.runInNewContext(source,sandbox);const t=sandbox.test;
t.start();t.turn('left');t.step();assert.equal(t.get().snake[0].x,11);
t.food({x:12,y:12});t.step();assert.equal(t.get().score,10);assert.equal(t.get().snake.length,5);
t.pause();let x=t.get().snake[0].x;t.step();assert.equal(t.get().snake[0].x,x);assert.equal(t.get().state,'paused');t.pause();
for(let i=0;i<30;i++)t.step();assert.equal(t.get().state,'over');
t.start();t.turn('up');t.turn('left');t.step();t.step();assert.equal(t.get().snake[0].y,11);assert.equal(t.get().snake[0].x,9);
console.log('PASS: movement, reverse prevention, food/growth/score, pause, wall collision, queued turns');
