const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/merge-ms-practice.js <extracted-json>');

const bankPath = path.join(root, 'data', 'questions.json');
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const extracted = JSON.parse(fs.readFileSync(source, 'utf8'));

const sourceUrl = 'https://learn.microsoft.com/ko-kr/credentials/certifications/azure-fundamentals/practice/assessment?assessment-type=practice&assessmentId=23&practice-assessment-type=certification';

function classify(question) {
  const cloud = /클라우드 모델|퍼블릭 클라우드|프라이빗 클라우드|하이브리드 클라우드|IaaS|PaaS|SaaS|소비 기반|자본 지출|운영 지출|민첩성|탄력성|수직.*크기|수평.*크기|공동 책임|서비스 수준 계약|SLA|서버리스/i;
  const management = /Policy|정책|리소스 잠금|리소스 태그|비용|청구|예산|Pricing|TCO|Advisor|Service Health|Monitor|Log Analytics|Application Insights|Portal|CLI|PowerShell|Cloud Shell|Azure Arc|ARM|관리 그룹|리소스 그룹|구독|규정 준수|Purview|지원/i;
  if (cloud.test(question)) return '클라우드 개념';
  if (management.test(question)) return '관리와 거버넌스';
  return 'Azure 아키텍처와 서비스';
}

function topic(question) {
  const rules = [
    ['Cost Management', /비용|청구|예산|가격|Pricing|TCO|예약|Reservations/i],
    ['Azure Policy', /Policy|정책/i], ['Azure RBAC', /RBAC|역할 기반|권한을 부여|액세스.*관리/i],
    ['Microsoft Entra ID', /Entra|인증|SSO|MFA|조건부 액세스/i],
    ['Azure Monitor', /Monitor|Log Analytics|Application Insights|메트릭|로그|자동 크기 조정/i],
    ['Service Health', /Service Health|서비스 중단|유지 관리|RCA/i], ['Azure Advisor', /Advisor|권장 사항/i],
    ['스토리지', /Storage|스토리지|Blob|Files|SMB|NFS|디스크|보관|Archive/i],
    ['네트워크', /가상 네트워크|VNet|VPN|ExpressRoute|Bastion|Firewall|NSG|네트워크/i],
    ['컴퓨팅', /가상 머신|VM|컨테이너|AKS|Functions|App Service/i],
    ['가용성', /가용성 영역|지역 쌍|리전 쌍|SLA|고가용성/i],
    ['서비스 모델', /IaaS|PaaS|SaaS|서비스 모델/i], ['클라우드 개념', /클라우드|소비 기반|자본 지출|운영 지출|민첩성|탄력성|확장/i],
    ['거버넌스', /관리 그룹|리소스 그룹|구독|잠금|태그|규정 준수|Purview/i]
  ];
  return rules.find(([, re]) => re.test(question))?.[0] || 'Azure 핵심 서비스';
}

function easyExplanation(q, domain, itemTopic) {
  const guides = {
    'Cost Management': '쉽게 말하면 배포 전 견적은 Pricing Calculator, 온-프레미스 비교는 TCO Calculator, 실제 사용 비용 분석과 예산 관리는 Cost Management로 구분하면 됩니다.',
    'Azure Policy': '쉽게 말하면 Policy는 무엇을 배포할 수 있는지 정하는 규칙이고, RBAC는 누가 작업할 수 있는지 정하는 권한입니다.',
    'Azure RBAC': '쉽게 말하면 RBAC는 출입증과 같습니다. 사용자에게 역할을 주고 그 권한이 적용될 구독·리소스 그룹·리소스 범위를 정합니다.',
    'Microsoft Entra ID': '쉽게 말하면 인증은 사용자가 누구인지 확인하고, 권한 부여는 확인된 사용자가 무엇을 할 수 있는지 결정합니다.',
    'Azure Monitor': '쉽게 말하면 Azure Monitor는 메트릭과 로그를 모으는 큰 관측 플랫폼이며, Log Analytics와 Application Insights는 각각 로그와 앱 분석에 특화됩니다.',
    'Service Health': '쉽게 말하면 Service Health는 전 세계 일반 현황이 아니라 내 구독에 영향을 주는 장애와 유지 관리 정보를 보여줍니다.',
    'Azure Advisor': '쉽게 말하면 Advisor는 현재 리소스 구성을 분석해 비용·성능·안정성·보안 개선 방법을 추천하는 서비스입니다.',
    '스토리지': '쉽게 말하면 Blob은 개체 파일 창고, Files는 네트워크 공유, Disk는 VM 디스크, Queue는 비동기 메시지 저장소입니다.',
    '네트워크': '쉽게 말하면 연결이 필요한 대상과 경계를 먼저 보세요. VNet은 사설 네트워크, VPN·ExpressRoute는 온-프레미스 연결, NSG·Firewall은 트래픽 제어입니다.',
    '컴퓨팅': '쉽게 말하면 OS를 직접 관리하면 VM, 웹앱 플랫폼이 필요하면 App Service, 이벤트 코드는 Functions, 컨테이너 관리는 ACI나 AKS를 선택합니다.',
    '가용성': '쉽게 말하면 가용성 영역은 한 리전 내부의 독립 데이터센터이고, 여러 리전 구성은 리전 전체 장애까지 대비합니다.',
    '서비스 모델': '쉽게 말하면 IaaS는 OS부터 직접 관리하고, PaaS는 앱 개발에 집중하며, SaaS는 완성된 소프트웨어를 바로 사용합니다.',
    '클라우드 개념': '쉽게 말하면 문제에서 빠른 배포는 민첩성, 용량 증가는 확장성, 수요에 따른 자동 증감은 탄력성으로 구분하면 됩니다.',
    '거버넌스': '쉽게 말하면 권한은 RBAC, 배포 규칙은 Policy, 삭제 방지는 Lock, 비용 분류는 Tag를 선택하면 됩니다.',
    'Azure 핵심 서비스': domain === '클라우드 개념' ? '쉽게 말하면 관리 책임과 비용 방식이 어디에서 나뉘는지를 먼저 확인하면 정답을 좁힐 수 있습니다.' : '쉽게 말하면 서비스 이름보다 어떤 자원을 관리하고 어떤 문제를 해결하는지를 먼저 확인하세요.'
  };
  const official = (q.explanation || '')
    .split(/\r?\n/)
    .filter(line => line.trim() && !/^https?:\/\//.test(line.trim()) && !/Microsoft Learn$/.test(line.trim()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `${official} ${guides[itemTopic]}`.trim();
}

const official = extracted.map((q, index) => {
  const domain = classify(q.question);
  const itemTopic = topic(q.question);
  const result = {
    id: `ms-live-${String(index + 1).padStart(3, '0')}`,
    domain,
    topic: itemTopic,
    sourceQuestion: `LIVE-${index + 1}`,
    sourceUrl,
    sourceLabel: 'Microsoft Learn AZ-900 Practice Assessment · 10회 수집',
    officialSource: true,
    mockExamSource: true,
    observedRuns: q.occurrences,
    question: q.question,
    choices: q.choices,
    explanation: easyExplanation(q, domain, itemTopic)
  };
  if (q.correct.length > 1) result.answers = q.correct;
  else result.answer = q.correct[0];
  if (q.links?.length) result.referenceUrls = [...new Set(q.links)];
  return result;
});

// 기존 수동 입력 공식 문항은 최신 로그인 세션에서 직접 수집한 공식 풀로 교체한다.
bank.questions = [...bank.questions.filter(q => !q.officialSource), ...official];
fs.writeFileSync(bankPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ imported: official.length, total: bank.questions.length }, null, 2));
