import type { Project } from '../types/content';

export const projectsData: Project[] = [
  {
    id: 'krri',
    title: '대중교통 경로 탐색 알고리즘 기반 접근성 분석 플랫폼 (한국철도기술연구원)',
    introduction: '한국철도기술연구원 <철도산업 디지털 및 친환경 분야 핵심기술 개발>(과제코드: PK2503D2) 연구 과제의 일환으로 진행한 프로젝트로, 대중교통 경로 탐색 및 접근성 분석을 통해 사용자에게 효율적인 이동 경로를 제공하고 지역별 대중교통 접근성을 시각화하는 플랫폼입니다.',
    date: '2025-02-03',
    period: '2025.02 - 2025.04',
    statusTags: ['# 국가 R&D 프로젝트', '# 인턴십 프로젝트', '# 한국철도기술연구원'],
    technologies: ['Python', 'JavaScript', 'FastAPI', 'Docker', 'AWS', 'Flask', 'Github Actions', 'CI/CD'],
    keyFeatures: [
      'GTFS 기반 대중교통 최적 경로 탐색 알고리즘(RAPTOR)',
      '실제 이동 소요 시간과 시간대별 대중교통 상황을 고려한 분석',
      '지역별 대중교통 접근성 시각화',
    ],
    teamInfo: '구성: 프론트엔드/백엔드 및 알고리즘 구축 2명',
    myRole: '담당 역할: 알고리즘 구축 및 프론트/백엔드 리드 (기여도 80%)',
    images: ['/images/projects/krri_01.svg', '/images/projects/krri_02.svg'],
    velogUrl: 'https://velog.io/@yongjun0702/krri',
  },
  {
    id: 'vinteum',
    title: '빈틈 - 시간표의 빈틈을 찾아주는 플랫폼',
    introduction: '대학생들의 팀 프로젝트와 모임을 위한 애플리케이션입니다. 각자 다른 시간표에서 모두가 비어있는 공강 시간을 자동으로 찾아줍니다. AI 기술로 시간표 사진을 분석하고, 그룹원 전체의 겹치는 빈 시간을 계산해 최적의 만남 시간을 다양한 UI로 제공합니다.',
    date: '2024-06',
    period: '2024.06 - 2025.02',
    statusTags: ['# iOS / Android 출시', '# 대학생 대상 프로젝트', '# 모바일 어플리케이션'],
    technologies: ['Flutter', 'RestAPI', 'Provider', 'Github', 'Figma'],
    keyFeatures: [
      '시간표 사진 업로드 및 AI 분석',
      '개인 시간표 추가 및 수정',
      '그룹별 공강 시간 계산',
    ],
    teamInfo: '구성: 프론트엔드 3명, 백엔드 1명, 디자인 1명',
    myRole: '담당 역할: 프론트엔드 개발 (기여도 60%)',
    images: ['/images/projects/vinteum_01.svg', '/images/projects/vinteum_02.svg'],
    appStoreUrl: 'https://apps.apple.com/kr/app/id6740912910',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=lab.aiia.vinteum',
    velogUrl: 'https://velog.io/@yongjun0702/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%9A%8C%EA%B3%A0%EB%A1%9D-%EC%95%B1-%EA%B0%9C%EB%B0%9C%EC%9D%84-%EC%B2%98%EC%9D%8C-%EC%A0%91%ED%95%98%EA%B3%A0-%EC%B6%9C%EC%8B%9C%EA%B9%8C%EC%A7%80-%EA%B1%B0%EB%A1%9C%EC%98%A8-%EA%B2%BD%ED%97%98'
  },
  {
    id: 'letsmerge',
    title: '렛츠머지 - 실시간 택시팟 매칭 플랫폼',
    introduction: '같은 방향으로 가는 사람들과 빠르게 매칭하고, 합리적인 비용으로 편하게 이동할 수 있는 모바일 택시팟 플랫폼입니다. 위치 기반 서비스를 통해 실시간으로 택시팟을 찾고 자유로운 매칭 및 채팅 시스템을 제공합니다.',
    date: '2025-01',
    period: '2025.01 - 2025.02',
    statusTags: ['# 사이드 프로젝트', '# 모바일 어플리케이션'],
    technologies: ['Flutter', 'Supabase', 'Riverpod', 'NAVER Maps API', 'PostGIS', 'Figma', 'GitHub'],
    keyFeatures: [
      '실시간 주변 택시팟 찾기 및 생성',
      '실시간 위치 공유 기능',
      'Supabase Realtime 기반 실시간 채팅 기능',
      '거리/시간 기반 택시 요금 자동 산정 기능 구현'
    ],
    teamInfo: '구성: 프론트엔드/백엔드 3명',
    myRole: '담당 역할: 프론트엔드 및 백엔드 개발 (기여도 33%)',
    images: ['/images/projects/letsmerge_01.svg'],
    githubUrl: 'https://github.com/joonseo1227/LetsMerge-FE',
  }
]; 