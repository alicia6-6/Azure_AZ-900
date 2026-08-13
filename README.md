# AZ-900 Study Hub

Microsoft Azure Fundamentals(AZ-900)를 준비하기 위한 한국어 정적 학습 사이트입니다. 요약노트와 `resources`의 덤프 PDF에서 선별·번역한 연습문제를 제공합니다.

## 기능

- 출제 비중을 반영한 핵심 요약노트
- 번역된 덤프 문제 중 무작위 10문항 즉시 채점
- 무작위 30문항, 35분 모의고사
- 제출 후 정답과 전체 해설 확인
- 틀린 문제 자동 저장 및 오답 재풀이
- 모의고사 최근 응시 기록 저장
- 모바일·데스크톱 반응형 UI

학습 기록은 서버로 전송하지 않고 브라우저 `localStorage`에만 저장됩니다.

## 로컬 실행

JSON을 `fetch()`하므로 파일을 직접 열지 말고 저장소 루트에서 정적 서버를 실행합니다.

```bash
npx serve .
```

또는 Python이 설치되어 있다면:

```bash
python -m http.server 8000
```

## GitHub Pages 배포

1. 이 폴더를 GitHub 저장소의 기본 브랜치에 push합니다.
2. 저장소의 **Settings → Pages**를 엽니다.
3. **Deploy from a branch**를 선택합니다.
4. 기본 브랜치와 `/ (root)`를 선택하고 저장합니다.

모든 링크가 상대 경로라 사용자/조직 페이지와 프로젝트 페이지 모두에서 동작합니다. `resources/`는 저작권이 있는 개인 참고 자료이므로 `.gitignore`에서 공개 저장소 및 배포 대상에서 제외됩니다.

## 파일 구조

```text
index.html              홈과 출제 비중
summary.html            핵심 요약노트
quiz.html               랜덤·모의고사·오답 화면
css/style.css           반응형 디자인
js/data.js              문제 로딩과 로컬 저장
js/quiz.js              출제·타이머·채점·결과
data/questions.json     덤프 번역 문제, 정답, 해설, 원문 번호
resources/              로컬 참고 PDF (Git 제외)
```

## 콘텐츠 원칙

- 문제은행은 로컬 덤프 PDF의 문항을 한국어로 번역해 구성합니다.
- 원문이 이미지 누락으로 불완전하거나 정답 오류가 명백한 문항은 제외합니다.
- 오래된 서비스 명칭은 현재 명칭으로 정리합니다.
- 출제 범위와 시험 정책은 바뀔 수 있으므로 응시 전 [Microsoft 공식 AZ-900 학습 가이드](https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-900)를 확인하세요.
- 이 프로젝트는 Microsoft의 공식 사이트나 공식 문제은행이 아닙니다.
