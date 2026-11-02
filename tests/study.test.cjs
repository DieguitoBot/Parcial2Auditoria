const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const content=fs.readFileSync('content.js','utf8');
const app=fs.readFileSync('app.js','utf8');
function boot(saved=null){
 const elements=new Map();
 const el=()=>({innerHTML:'',textContent:'',hidden:true,value:'all',querySelectorAll:()=>[],focus(){},classList:{toggle(){}},setAttribute(){},removeAttribute(){}});
 const storage=new Map(saved?[['audita-progress-v1',saved]]:[]);
 const context=vm.createContext({document:{querySelector:s=>{if(!elements.has(s))elements.set(s,el());return elements.get(s)},querySelectorAll:()=>[]},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},location:{hash:'#inicio'},window:{addEventListener(){},scrollTo(){}},setInterval:()=>1,clearInterval(){},console});
 vm.runInContext(content+'\n'+app,context);
 return {run:code=>vm.runInContext(code,context),elements,storage};
}
test('Banco completo, referencias y alternativas coherentes',()=>{const {run}=boot();assert.equal(run('QUESTIONS.length'),30);assert.equal(run('new Set(QUESTIONS.map(q=>q.id)).size'),30);assert.equal(run('TOPICS.every(t=>QUESTIONS.filter(q=>q.topic===t.id).length===6 && SOURCES[t.ref])'),true);assert.equal(run('QUESTIONS.every(q=>q.options.length===4&&new Set(q.options).size===4&&q.explanation&&q.options[q.answer])'),true);assert.equal(run('CARDS.length'),15);});
test('Simulacro equilibrado, puntuación y persistencia',()=>{const {run,storage}=boot();run("start('exam',TOPICS.flatMap(t=>shuffle(QUESTIONS.filter(q=>q.topic===t.id)).slice(0,3)))");assert.equal(run('session.questions.length'),15);assert.equal(run('TOPICS.every(t=>session.questions.filter(q=>q.topic===t.id).length===3)'),true);run('session.questions.forEach(q=>session.responses[q.id]=q.answer);finish()');assert.equal(run('state.exams[0]'),20);assert.equal(Object.values(JSON.parse(storage.get('audita-progress-v1')).answers).filter(Boolean).length,15);});
test('Entrega por tiempo registra preguntas sin responder como incorrectas',()=>{const {run,elements}=boot();run("start('exam',QUESTIONS.slice(0,3));session.responses[1]=0;finish(true)");assert.equal(run('Object.values(state.answers).filter(v=>!v).length'),2);assert.match(elements.get('#main').innerHTML,/Se agotó el tiempo/);assert.match(elements.get('#main').innerHTML,/Sin responder/);});
test('Corregir un error lo elimina del repaso y sobrevive al reinicio',()=>{const b=boot();b.run('state.answers[1]=false;save()');assert.equal(b.elements.get('#error-count').textContent,1);b.run('state.answers[1]=true;save()');assert.equal(b.elements.get('#error-count').textContent,0);const c=boot(b.storage.get('audita-progress-v1'));assert.equal(c.run('state.answers[1]'),true);});
test('Almacenamiento corrupto no rompe la aplicación',()=>{const b=boot('{invalid');assert.equal(b.run('Object.keys(state.answers).length'),0);assert.match(b.elements.get('#main').innerHTML,/Tu ruta de estudio/);});
test('Rutas y tarjetas renderizan, incluida la última tarjeta',()=>{const b=boot();for(const path of ['temas','tema-7','practica-8','simulacro','errores','tarjetas','fuentes']){b.run(`location.hash='#${path}';route()`);assert.ok(b.elements.get('#main').innerHTML.length>100);}b.run("cardTopic='11';cardIndex=2;flipped=true;cards()");assert.match(b.elements.get('#main').innerHTML,/Correspondencia con ISO\/IEC 27018/);});
