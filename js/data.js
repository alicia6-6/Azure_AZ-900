const STORE={wrong:'az900_wrong_v2',history:'az900_history_v2'};
async function loadQuestions(){const r=await fetch('data/questions.json');if(!r.ok)throw Error('문제 데이터를 불러오지 못했습니다.');return (await r.json()).questions.map(q=>({...q,sourceQuestion:q.sourceQuestion??'WEB'}))}
function getWrongIds(){try{return JSON.parse(localStorage.getItem(STORE.wrong))||[]}catch{return[]}}
function setWrong(id,isWrong){const s=new Set(getWrongIds());isWrong?s.add(id):s.delete(id);localStorage.setItem(STORE.wrong,JSON.stringify([...s]))}
function getHistory(){try{return JSON.parse(localStorage.getItem(STORE.history))||[]}catch{return[]}}
function saveHistory(v){localStorage.setItem(STORE.history,JSON.stringify([v,...getHistory()].slice(0,20)))}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
