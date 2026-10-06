const test=require('node:test');
const assert=require('node:assert/strict');
const T=require('../timeline.js');
test('23 eindeutige Datierungen sind chronologisch sortierbar',()=>{assert.equal(T.EVENTS.length,23);assert.equal(new Set(T.EVENTS.map(e=>e.id)).size,23);for(const e of T.EVENTS){assert.equal(typeof e.year,'number');assert.ok(e.date&&e.title&&e.module);}});
test('Niveaus erzeugen vier, fünf oder sechs verschiedene Ereignisse',()=>{for(const [level,count] of Object.entries(T.COUNTS)){const round=T.createRound(level,()=>.37);assert.equal(round.length,count);assert.equal(new Set(round.map(e=>e.id)).size,count);assert.equal(T.evaluate(round).correct,false);}});
test('Verschieben und Auswerten funktionieren exakt',()=>{const source=T.EVENTS.slice(0,4);assert.equal(T.evaluate(source).correct,true);const moved=T.move(source,1,-1);assert.equal(T.evaluate(moved).correct,false);assert.deepEqual(T.evaluate(moved).correctOrder.map(e=>e.id),source.map(e=>e.id));assert.deepEqual(T.move(source,0,-1),source);});
test('Ungültige gespeicherte Werte werden bereinigt',()=>{assert.deepEqual(T.restore({played:-1,perfect:5,streak:'x',best:2}),{played:0,perfect:0,streak:0,best:2});});
