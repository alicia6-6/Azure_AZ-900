const STORE={wrong:'az900_wrong_v2',history:'az900_history_v2'};
const EXPLANATION_GUIDES={
  '비용':'비용 문제는 배포 전 예상, 실제 사용량 분석, 장기 약정 할인을 구분해야 합니다. Pricing Calculator는 예상 비용, TCO Calculator는 온-프레미스 비교, Cost Management는 사용 후 분석·예산·예측, Reservations는 약정 할인에 사용합니다.',
  '비용 모델':'소비 기반 모델은 장비를 미리 사지 않고 사용한 양만큼 운영 비용으로 지불합니다. 사용하지 않는 자원을 중지하거나 삭제하면 불필요한 과금을 줄일 수 있습니다.',
  '서비스 모델':'관리 책임의 경계를 보면 쉽습니다. IaaS에서는 고객이 운영 체제를 관리하고, PaaS에서는 애플리케이션과 데이터에 집중하며, SaaS에서는 완성된 소프트웨어를 사용합니다.',
  '공유 책임':'클라우드 공급자는 물리 데이터센터·하드웨어·호스트를 보호합니다. 고객은 데이터, 계정, 접근 권한을 계속 책임지고 IaaS에서는 게스트 운영 체제와 애플리케이션도 관리합니다.',
  '공동 책임 모델':'물리 시설과 하드웨어는 Microsoft가 담당하지만, VM 운영 체제·설치한 앱·고객 데이터의 구성과 보호는 고객이 담당합니다.',
  'SLA':'SLA는 서비스가 사용 가능한 시간에 대한 약속입니다. 여러 종속 서비스가 모두 정상이어야 하면 각 가용성을 곱하므로 전체 SLA는 더 낮아집니다.',
  '고가용성':'가용성 영역은 한 리전 안의 독립된 데이터센터 위치입니다. 워크로드를 여러 영역에 분산하면 한 데이터센터 장애에도 서비스를 계속 제공할 수 있습니다.',
  '가용성 영역':'가용성 영역은 같은 리전 안에서 전원·냉각·네트워크가 분리된 위치입니다. 영역 장애를 견디려면 두 개 이상의 영역에 인스턴스를 분산합니다.',
  '리전':'리전은 저지연 네트워크로 연결된 데이터센터 집합이며, 가용성 영역은 리전 내부의 물리적으로 분리된 위치입니다.',
  '리전 쌍':'리전 쌍은 일반적으로 같은 지리 안의 두 리전을 재해 복구와 플랫폼 업데이트 순서에 활용하는 개념입니다.',
  '가상 머신':'VM은 물리 컴퓨터를 소프트웨어로 구현한 IaaS입니다. 고객이 운영 체제와 앱을 관리하며, 사용하지 않을 때 할당 해제하면 컴퓨팅 과금을 중단할 수 있습니다.',
  '수직 확장':'수직 확장은 기존 한 인스턴스의 CPU나 RAM을 늘리는 방식입니다. 인스턴스 개수를 늘리는 수평 확장과 구분해야 합니다.',
  '확장':'CPU·RAM처럼 한 장비의 성능을 높이면 수직 확장이고, VM 같은 인스턴스 수를 늘리면 수평 확장입니다.',
  '탄력성':'탄력성은 수요 변화에 맞춰 자원을 자동으로 늘리거나 줄이는 능력입니다. 단순히 늘릴 수 있다는 확장성보다 자동 조절에 초점이 있습니다.',
  '민첩성':'민첩성은 비즈니스 요구가 바뀔 때 리소스를 빠르게 배포하고 구성하는 능력입니다.',
  '서버리스':'서버리스에도 실제 서버는 존재하지만 공급자가 프로비저닝과 패치를 담당합니다. 사용자는 이벤트와 실행 코드에 집중합니다.',
  'PaaS':'PaaS에서는 공급자가 서버·운영 체제·런타임을 관리하므로 고객은 애플리케이션 코드와 데이터에 집중할 수 있습니다.',
  'IaaS':'IaaS는 물리 장비와 가상화는 공급자가 관리하고 운영 체제·앱·데이터는 고객이 관리하는 모델입니다.',
  'SaaS':'SaaS는 공급자가 완성된 애플리케이션과 기반 플랫폼을 운영하고 고객은 사용자·데이터·서비스 설정을 관리하는 모델입니다.',
  '컨테이너':'ACI는 컨테이너를 빠르게 실행하는 서비스이고 AKS는 많은 컨테이너의 배포·확장·복구를 Kubernetes로 관리합니다.',
  '스토리지':'Blob은 비정형 개체, Files는 SMB/NFS 파일 공유, Disk는 VM 디스크, Queue는 비동기 메시지, Table은 키-특성 NoSQL 데이터에 적합합니다.',
  '스토리지 계층':'Hot은 자주 읽는 데이터, Cool·Cold는 접근 빈도가 낮은 데이터, Archive는 장기 보관 데이터용입니다. Archive는 읽기 전에 재수화가 필요합니다.',
  'Blob Storage':'Blob Storage는 이미지·문서·동영상·백업 같은 비정형 개체 데이터를 HTTP(S)로 저장하고 제공하는 데 적합합니다.',
  'Azure Files':'Azure Files는 SMB와 NFS를 지원하는 관리형 네트워크 파일 공유입니다. 여러 VM에서 같은 공유를 탑재할 수 있습니다.',
  '분석':'Databricks는 Apache Spark 기반 빅데이터·머신러닝 처리에 적합하고, Synapse는 데이터 웨어하우스와 통합 분석에 적합합니다.',
  '분석 스토리지':'Synapse의 전용 SQL 풀은 대규모 관계형 분석에, Data Lake는 원시 파일과 대규모 분석 데이터를 저장하는 데 적합합니다.',
  '데이터베이스':'Cosmos DB는 JSON 같은 NoSQL 데이터를 여러 리전에 낮은 지연으로 제공할 때 적합합니다. Azure SQL Database는 관계형 SQL PaaS입니다.',
  '네트워크':'VNet은 Azure의 격리된 사설 네트워크이고 Subnet은 그 주소 공간을 더 작은 범위로 나눕니다.',
  '네트워크 격리':'서로 독립적인 네트워크 경계가 필요하면 별도 VNet을 사용합니다. Subnet은 하나의 VNet 내부를 나누는 방식입니다.',
  '하이브리드 네트워크':'VPN Gateway는 Azure 쪽 연결 장치이고 Local Network Gateway는 Azure에서 온-프레미스 VPN 장치와 주소 범위를 표현합니다.',
  '네트워크 보안':'NSG는 서브넷·NIC의 기본 트래픽 규칙이고 Azure Firewall은 여러 네트워크의 트래픽을 중앙에서 검사·제어합니다.',
  'NSG':'NSG 규칙은 원본·대상·포트·프로토콜·방향과 우선순위로 트래픽을 허용하거나 거부합니다.',
  'Firewall':'Azure Firewall의 DNAT 규칙은 공용 주소로 들어온 연결을 내부 사설 주소로 변환해 전달합니다.',
  '콘텐츠 전송':'CDN은 정적 콘텐츠를 사용자와 가까운 에지 위치에 캐시해 지연 시간과 원본 서버 부하를 줄입니다.',
  '보안':'Defender for Cloud는 Azure 환경의 보안 태세와 Secure Score를 보여주고 워크로드 보호 권장 사항을 제공합니다.',
  '심층 방어':'한 가지 장치에만 의존하지 않고 물리·ID·경계·네트워크·컴퓨팅·앱·데이터 계층을 겹쳐 보호하는 방식입니다.',
  'SIEM':'Microsoft Sentinel은 여러 환경의 보안 로그를 모아 위협을 탐지하고 조사·대응을 자동화하는 클라우드 SIEM/SOAR입니다.',
  'Key Vault':'Key Vault는 암호, 인증서, 암호화 키를 애플리케이션 코드 밖의 중앙 금고에 보관합니다.',
  'ID':'Microsoft Entra ID는 사용자와 애플리케이션의 클라우드 ID, 인증, SSO를 제공합니다.',
  'ID 보안':'Microsoft Entra ID Protection은 위험 사용자와 위험 로그인을 탐지하고 위험 기반 접근 정책에 신호를 제공합니다.',
  '조건부 액세스':'조건부 액세스는 사용자·위치·장치·위험 신호를 평가해 접근을 차단하거나 MFA 같은 추가 인증을 요구합니다.',
  'RBAC':'Azure RBAC는 보안 주체에게 역할을 할당해 특정 범위에서 수행할 수 있는 작업을 제어합니다.',
  'RBAC 범위':'역할 할당은 관리 그룹·구독·리소스 그룹·리소스 범위에 적용되며 상위 범위의 권한은 하위 리소스에 상속됩니다.',
  'Policy':'Azure Policy는 허용 리전이나 VM 크기처럼 리소스가 따라야 할 규칙을 감사하거나 강제합니다. 사용자의 작업 권한을 주는 RBAC와 다릅니다.',
  '잠금':'리소스 잠금은 권한과 별개로 삭제 또는 변경을 막습니다. 삭제하려면 충분한 권한이 있어도 먼저 잠금을 제거해야 합니다.',
  '태그':'태그는 부서·환경·소유자 같은 메타데이터로 리소스와 비용을 분류합니다. 권한이나 배포 위치를 바꾸지는 않습니다.',
  'ARM 템플릿':'ARM 템플릿은 원하는 최종 상태를 JSON으로 선언하는 IaC입니다. 같은 환경을 반복 가능하고 일관되게 배포합니다.',
  'IaC':'IaC는 인프라 구성을 코드로 관리해 반복 배포, 버전 관리, 검토와 자동화를 가능하게 합니다.',
  'Cloud Shell':'Cloud Shell은 브라우저에서 인증된 Azure CLI(Bash) 또는 Azure PowerShell 환경을 바로 사용할 수 있게 합니다.',
  'PowerShell':'Azure PowerShell은 PowerShell cmdlet로 Azure를 관리하며 Windows·macOS·Linux와 Cloud Shell에서 사용할 수 있습니다.',
  'Azure Arc':'Azure Arc는 온-프레미스나 다른 클라우드의 서버·Kubernetes를 Azure로 옮기지 않고 Azure 관리 평면에서 관리하게 합니다.',
  'Advisor':'Azure Advisor는 사용량과 구성을 분석해 비용·안정성·보안·성능·운영 우수성 개선 사항을 제안합니다.',
  'Monitor':'Azure Monitor는 메트릭과 로그를 수집하고 분석·경고·자동화에 연결하는 통합 관측 플랫폼입니다.',
  '로그 분석':'Azure Monitor가 수집한 로그는 Log Analytics 작업 영역에서 KQL로 검색하고 분석할 수 있습니다.',
  'Application Insights':'Application Insights는 웹앱의 요청, 응답 시간, 실패, 종속성, 사용자 동작을 분석하는 APM 기능입니다.',
  'Activity Log':'Activity Log는 Azure 제어 평면에서 누가 리소스를 만들고 변경하거나 삭제했는지 기록합니다.',
  'Service Health':'Service Health는 내 구독에 영향을 주는 장애·계획된 유지 관리·상태 권고와 장애 후 RCA를 제공합니다.',
  '규정 준수':'Compliance Manager는 규정 준수 개선 작업과 점수를 추적합니다. 감사 보고서와 인증 문서는 Service Trust Portal에서 확인합니다.',
  'GDPR':'GDPR은 EU 개인의 개인정보 처리와 보호 권리를 규정합니다. 조직 위치보다 EU 개인 데이터를 처리하는지가 중요합니다.',
  '개인정보':'개인정보처리방침은 개인 데이터를 어떤 목적으로 수집하고 사용하며 보호하는지 설명합니다.',
  '구독':'구독은 청구·액세스·서비스 할당량의 경계입니다. 리소스 그룹과 리소스는 하나의 구독에 속합니다.',
  '구독 할당량':'할당량은 구독별 서비스 사용 한도입니다. 한도가 부족하면 Azure 지원 요청을 통해 증액을 신청합니다.',
  '리소스 구성':'구독은 청구·접근 경계이고 리소스 그룹은 수명주기가 비슷한 리소스를 묶는 관리 범위입니다.',
  '리소스 이동':'지원되는 리소스는 구독이나 리소스 그룹 사이에서 이동할 수 있지만 종속성과 대상 구독의 조건을 먼저 확인해야 합니다.',
  '지원':'기술 지원 요청 가능 여부와 응답 시간은 지원 플랜에 따라 다릅니다. 서비스 장애 정보 확인은 지원 플랜이 아니라 Service Health의 역할입니다.',
  '서비스 수명주기':'미리 보기 기능은 시험·평가 단계라 기능과 지역이 제한될 수 있고 일반적으로 SLA가 없습니다. GA는 정식 출시 상태입니다.',
  '미리 보기':'Public Preview는 공개 시험 단계이지만 기능·리전·용량 제한이 있을 수 있으며 일반적으로 SLA가 제공되지 않습니다.',
  '수명주기':'Modern Lifecycle 제품은 고객이 최신 상태를 유지해야 하며 Microsoft는 서비스에 중대한 변경이나 종료가 있을 때 사전 통지합니다.'
};
function cleanExplanation(q){
  const original=q.explanation||'';
  const cleaned=original.split(/(?<=[.!?다요])\s+/).filter(s=>!/(덤프|스냅|이미지|화면)|^(공식 )?정답은|^정답입니다|선택 답|첫 번째 선택/.test(s)).join(' ').trim();
  const guide=EXPLANATION_GUIDES[q.topic]||'정답을 고를 때는 서비스 이름을 외우기보다 누가 관리하는지, 어느 범위에 적용되는지, 어떤 문제를 해결하는지를 먼저 확인하세요.';
  let result=cleaned.length>=70?cleaned:`${cleaned}${cleaned?' ':''}${guide}`;
  if(result.length<70)result+=' 문제의 제품명만 외우기보다 적용 범위, 관리 주체, 해결하려는 요구 사항을 다른 선택지와 비교하면 같은 개념의 변형 문제도 풀 수 있습니다.';
  return result;
}
async function loadQuestions(){const r=await fetch('data/questions.json');if(!r.ok)throw Error('문제 데이터를 불러오지 못했습니다.');return (await r.json()).questions.map(q=>({...q,sourceQuestion:q.sourceQuestion??'WEB',explanation:cleanExplanation(q)}))}
function getWrongIds(){try{return JSON.parse(localStorage.getItem(STORE.wrong))||[]}catch{return[]}}
function setWrong(id,isWrong){const s=new Set(getWrongIds());isWrong?s.add(id):s.delete(id);localStorage.setItem(STORE.wrong,JSON.stringify([...s]))}
function getHistory(){try{return JSON.parse(localStorage.getItem(STORE.history))||[]}catch{return[]}}
function saveHistory(v){localStorage.setItem(STORE.history,JSON.stringify([v,...getHistory()].slice(0,20)))}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
