const mode=new URLSearchParams(location.search).get('mode')||'random';
const $=id=>document.getElementById(id);
const EXAM_COUNT=50,EXAM_SECONDS=45*60,PRACTICE_PASS=35;
let all=[],queue=[],index=0,answers=[],timerId=null,remaining=EXAM_SECONDS,submitted=false;
const info={random:['PRACTICE','랜덤 문제','전체 문제은행에서 무작위 문제를 가볍게 학습합니다.'],exam:['PRACTICE','AZ-900 실전 모의고사','45분 동안 50문제를 풀고, 제출한 뒤 점수와 해설을 확인하세요.'],wrong:['REVIEW','오답노트','이전에 틀린 문제만 다시 풉니다.']};
const correctSet=q=>new Set(q.answers||[q.answer]);
const sameSet=(a,b)=>a.size===b.size&&[...a].every(v=>b.has(v));
const isCorrect=(q,a)=>Boolean(a)&&sameSet(new Set(a.choices),correctSet(q));
const letters=q=>[...correctSet(q)].sort((a,b)=>a-b).map(i=>i+1).join(', ');
const easyHelp=q=>{
  const guides={'공유 책임':'아파트에 비유하면 건물 안전은 Azure가, 집 안 데이터와 출입 관리는 고객이 맡습니다. SaaS로 갈수록 Azure의 관리 범위가 넓어집니다.','서비스 모델':'IaaS는 빈 사무실을 직접 꾸미는 것, PaaS는 시설이 준비된 공유 오피스, SaaS는 완성된 서비스를 바로 쓰는 것에 가깝습니다.','비용':'Azure 비용은 크기·사용 시간·저장량·송신 데이터·리전에 따라 달라집니다. VM을 꺼도 남은 디스크에는 비용이 들 수 있습니다.','Policy':'Policy는 무엇을 배포할 수 있는지 정하는 규칙입니다. 누가 작업할 수 있는지를 정하는 RBAC와 구분하세요.','RBAC':'RBAC는 출입증과 같습니다. 사용자에게 역할을 주고 구독·리소스 그룹·리소스 중 적용 범위를 정합니다.','스토리지':'Blob은 파일 창고, Files는 네트워크 드라이브, Queue는 업무 쪽지함, Disk는 VM 하드디스크라고 생각하면 쉽습니다.','네트워크 보안':'NSG는 서브넷·NIC 앞의 출입 규칙표이고 Azure Firewall은 여러 네트워크를 중앙에서 검사하는 방화벽입니다.','SLA':'SLA는 속도가 아니라 사용 가능 시간에 대한 약속입니다.','가용성 영역':'가용성 영역은 같은 리전 안의 독립 데이터센터입니다.','Service Health':'Azure Status는 전 세계 현황판이고 Service Health는 내 구독에 영향을 주는 장애·유지관리 알림판입니다.','조건부 액세스':'사용자, 위치, 장치 상태와 위험 신호를 보고 MFA를 요구하거나 접근을 차단하는 로그인 문지기입니다.','Monitor':'Azure Monitor는 관측 데이터의 큰 우산입니다. Log Analytics는 로그 질의, Application Insights는 앱 성능 분석에 특화됩니다.'};
  return guides[q.topic]||guides[Object.keys(guides).find(k=>q.topic.includes(k))]||'서비스 이름보다 누가 관리하는지, 어느 범위에 적용되는지, 어떤 문제를 해결하는지를 먼저 구분하세요.';
};
function examDomain(q){if(q.domain==='클라우드 개념')return'cloud';if(q.domain.includes('아키텍처')||q.domain.includes('ID'))return'architecture';return'management'}
function buildExam(){const counts={cloud:14,architecture:19,management:17};const exam=Object.entries(counts).flatMap(([d,n])=>shuffle(all.filter(q=>examDomain(q)===d)).slice(0,n)).sort(()=>Math.random()-.5);return exam.slice(0,EXAM_COUNT)}
async function init(){
  [$('modeKicker').textContent,$('modeTitle').textContent,$('modeDesc').textContent]=info[mode]||info.random;
  try{all=await loadQuestions()}catch(e){return fail(e.message)}
  if(mode==='wrong'){const ids=new Set(getWrongIds());queue=shuffle(all.filter(q=>ids.has(q.id)));if(!queue.length)return fail('저장된 오답이 없습니다.')}
  else queue=mode==='exam'?buildExam():shuffle(all).slice(0,10);
  answers=Array(queue.length).fill(null);$('quizBar').hidden=false;if(mode==='exam')startTimer();render();
}
function render(){
  const q=queue[index],a=answers[index],multi=Array.isArray(q.answers),locked=a?.locked&&mode!=='exam';
  const answered=answers.filter(x=>x?.choices?.length).length;
  $('progressText').textContent=`${index+1} / ${queue.length}`;
  $('scoreText').textContent=mode==='exam'?`${answered}문제 답변`:`자유 학습 · 정답 ${queue.filter((x,i)=>isCorrect(x,answers[i])).length} / ${answers.filter(x=>x?.locked).length}`;
  $('progressFill').style.width=`${(index+1)/queue.length*100}%`;
  const source=q.officialSource?'Microsoft 공식':`자료 Q${q.sourceQuestion}`;
  const navigator=mode==='exam'?`<section class="answer-status"><div class="status-head"><b>답안 현황</b><span>${answered} / ${queue.length} 답변</span></div><div class="question-map">${queue.map((_,i)=>`<button data-q="${i}" class="${i===index?'current':''} ${answers[i]?.choices?.length?'answered':''}" aria-label="${i+1}번 문제">${i+1}</button>`).join('')}</div></section>`:'';
  const choiceLabel=i=>mode==='exam'?i+1:String.fromCharCode(65+i);
  const nav=mode==='exam'?`<div class="exam-nav"><a class="btn exit-btn" href="index.html">나가기</a><div><button class="btn ghost" id="prev" ${index===0?'disabled':''}>이전</button>${index<queue.length-1?'<button class="btn ghost" id="next">다음</button>':''}<button class="btn" id="submit">답안 제출</button></div></div>`:`<div class="practice-nav"><a class="btn exit-btn" href="index.html">나가기</a><div>${index>0?'<button class="btn ghost" id="prev">이전 문제</button>':''}${index<queue.length-1?'<button class="btn" id="next">다음 문제</button>':'<button class="btn" id="submit">결과 보기</button>'}</div></div>`;
  const choiceClass=i=>{const selected=a?.choices?.includes(i);if(!locked)return selected?'selected':'';if(correctSet(q).has(i))return'correct';if(selected)return'wrong';return''};
  $('quizArea').innerHTML=`${navigator}<article class="question ${mode==='exam'?'exam-question':'practice-question'}"><div class="qmeta"><span>${source}</span><span>${q.topic}</span>${multi?'<span>복수 선택</span>':''}</div><div class="qnum">QUESTION ${String(index+1).padStart(2,'0')}</div><h2>${q.question}</h2>${multi?'<p class="multi-note">해당하는 답변을 모두 선택하세요.</p>':''}<div class="choices">${q.choices.map((c,i)=>`<button data-i="${i}" class="${choiceClass(i)}" ${locked?'disabled':''}><i>${choiceLabel(i)}</i><span>${c}</span></button>`).join('')}</div>${multi&&!locked&&mode!=='exam'?'<button class="confirm-answer" id="confirmAnswer">선택 확정</button>':''}${locked?feedback(q,a):''}${nav}</article>`;
  document.querySelectorAll('.choices button[data-i]').forEach(b=>b.onclick=()=>choose(+b.dataset.i));
  document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{index=+b.dataset.q;render()});
  const c=$('confirmAnswer');if(c)c.onclick=confirmMulti;
  const p=$('prev');if(p)p.onclick=()=>{index--;render()};const n=$('next');if(n)n.onclick=()=>{index++;render()};const s=$('submit');if(s)s.onclick=()=>submit(false);
}
function choose(choice){const q=queue[index],multi=Array.isArray(q.answers);if(multi){const selected=new Set(answers[index]?.choices||[]);selected.has(choice)?selected.delete(choice):selected.add(choice);answers[index]={choices:[...selected],locked:mode==='exam'}}else{answers[index]={choices:[choice],locked:mode!=='exam'};if(mode!=='exam')setWrong(q.id,!isCorrect(q,answers[index]))}render()}
function confirmMulti(){const q=queue[index],a=answers[index];if(!a?.choices.length)return;answers[index]={...a,locked:true};setWrong(q.id,!isCorrect(q,answers[index]));render()}
function explanationParts(q){const marker='쉽게 말하면';const at=q.explanation.indexOf(marker);return at>=0?{detail:q.explanation.slice(0,at).trim(),easy:q.explanation.slice(at).trim()}:{detail:q.explanation.trim(),easy:`쉽게 말하면 ${easyHelp(q)}`}}
function feedback(q,a){const ok=isCorrect(q,a),x=explanationParts(q);return `<div class="feedback ${ok?'ok':'no'}"><b>${ok?'정답입니다':'오답입니다'}</b><div class="explanation-detail"><strong>해설</strong><p>${x.detail}</p></div><div class="easy-explanation"><strong>쉽게 풀어보기</strong><p>${x.easy.replace(/^쉽게 말하면\s*/, '')}</p></div></div>`}
function submit(timedOut=false){
  if(submitted)return;const unanswered=answers.filter(a=>!a?.choices?.length).length;
  if(mode==='exam'&&!timedOut&&unanswered&&!confirm(`답하지 않은 문제가 ${unanswered}개 있습니다. 그대로 제출할까요?`))return;
  submitted=true;clearInterval(timerId);queue.forEach((q,i)=>setWrong(q.id,!isCorrect(q,answers[i])));
  const correct=queue.filter((q,i)=>isCorrect(q,answers[i])).length,pct=Math.round(correct/queue.length*100),practicePass=correct>=PRACTICE_PASS,scaled=pct*10;
  if(mode==='exam')saveHistory({date:new Date().toISOString(),correct,total:queue.length,pct,practicePass});
  $('quizArea').hidden=true;$('quizBar').hidden=true;$('timer').hidden=true;$('resultArea').hidden=false;
  $('resultArea').innerHTML=`<p class="eyebrow">${timedOut?'TIME EXPIRED':'RESULT'}</p><h2>${correct} / ${queue.length}</h2><strong class="result-score">${mode==='exam'?`${practicePass?'학습 합격':'학습 불합격'} · 예상 ${scaled}점`:`${pct}점`}</strong><p>${mode==='exam'?(practicePass?'35문항 이상 정답으로 모의 합격 기준을 넘었습니다.':'35문항 이상을 목표로 오답을 복습하세요.'):(pct>=70?'학습 목표를 넘었습니다.':'70%를 목표로 오답을 복습하세요.')}</p>${mode==='exam'?'<p class="score-note">실제 시험은 1~1,000점 환산 점수 중 700점 이상이 합격입니다. 난이도와 배점이 반영되므로 예상 점수와 실제 점수는 다를 수 있습니다.</p>':''}<div class="result-list">${queue.map((q,i)=>{const x=explanationParts(q);return `<details class="${isCorrect(q,answers[i])?'pass':'miss'}"><summary>${i+1}. ${q.question}<b>${isCorrect(q,answers[i])?'정답':answers[i]?.choices?.length?'오답':'미응답'}</b></summary><p>${q.officialSource?'Microsoft 공식 연습 문제':`자료 Q${q.sourceQuestion}`} · 정답: ${letters(q)}</p><div class="result-explanation"><b>해설</b><p>${x.detail}</p><b>쉽게 풀어보기</b><p>${x.easy.replace(/^쉽게 말하면\s*/, '')}</p></div></details>`}).join('')}</div><div class="actions"><a class="btn" href="quiz.html?mode=${mode}">새 모의고사</a><a class="btn ghost" href="quiz.html?mode=wrong">오답 복습</a></div>`;
}
function startTimer(){$('timer').hidden=false;tick();timerId=setInterval(()=>{remaining--;tick();if(remaining<=0)submit(true)},1000)}
function tick(){const m=String(Math.floor(remaining/60)).padStart(2,'0'),s=String(remaining%60).padStart(2,'0');$('timerText').textContent=`${m}:${s}`;$('timer').classList.toggle('urgent',remaining<=300)}
function fail(msg){$('quizArea').innerHTML=`<div class="empty"><h2>학습을 시작할 수 없습니다</h2><p>${msg}</p><a class="btn" href="index.html">홈으로</a></div>`}
init();
