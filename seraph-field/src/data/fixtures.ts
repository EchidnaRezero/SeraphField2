import type { DocumentRecord } from './types';

export const fixtureDocuments: DocumentRecord[] = [
  {
    slug: 'theory/sobolev-spaces',
    title: 'Sobolev Spaces',
    summary:
      '약미분과 함수공간의 관점에서 PDE 문서군의 공통 언어를 정리한다.',
    category: 'THEORY',
    wikiRelpath: 'theory/sobolev-spaces.md',
    createdAt: '2026-06-12',
    updatedAt: '2026-07-01',
    tags: ['functional-analysis', 'pde', 'weak-derivative'],
    groups: ['Analysis Core'],
    series: {
      id: 'function-spaces',
      title: 'Function Spaces Roadmap',
      order: 2,
    },
    roadmap: [
      'Weak derivative',
      'Distribution viewpoint',
      'Embedding theorem',
      'PDE regularity link',
    ],
    sections: [
      {
        id: 'weak-derivative',
        title: 'Weak derivative',
        markdown:
          '고전미분은 점마다 도함수를 요구하지만, 약미분은 test function과의 적분 관계로 미분을 정의한다.\n\nSobolev space는 함수 자체뿐 아니라 약미분까지 같은 적분 가능성 조건으로 묶는다.\n\n$$\nW^{k,p}(\\Omega) = \\{u \\in L^p(\\Omega): D^\\alpha u \\in L^p(\\Omega)\\}\n$$',
      },
      {
        id: 'distribution-viewpoint',
        title: 'Distribution viewpoint',
        markdown:
          '분포 관점에서는 함수가 점별로 매끄럽지 않아도 test function에 작용하는 선형 범함수로 다룰 수 있다.\n\n이 관점은 약미분을 계산 가능한 적분 항등식으로 바꾸는 데 쓰인다.',
      },
      {
        id: 'embedding-theorem',
        title: 'Embedding theorem',
        markdown:
          'Embedding theorem은 함수와 약도함수의 적분 가능성이 연속성이나 더 높은 적분 가능성으로 이어지는 조건을 설명한다.\n\n이 문서에서는 정리의 전체 증명보다 어떤 PDE 문서에서 해당 조건을 호출하는지에 집중한다.',
      },
      {
        id: 'pde-regularity-link',
        title: 'PDE regularity link',
        markdown:
          'PDE regularity 문서에서는 해의 존재성 이후 해가 어느 함수공간에 속하는지를 추적한다.\n\nSobolev 공간 문서는 이론 문서와 구현 로그 사이의 공통 용어집 역할을 한다.',
      },
    ],
  },
  {
    slug: 'theory/function-spaces',
    title: 'Function Spaces Roadmap',
    summary:
      '해석학 문서군을 Banach, Hilbert, Sobolev 계층으로 연결하는 로드맵.',
    category: 'THEORY',
    wikiRelpath: 'theory/function-spaces.md',
    createdAt: '2026-06-08',
    updatedAt: '2026-06-30',
    tags: ['banach', 'hilbert', 'roadmap'],
    groups: ['Analysis Core'],
    series: {
      id: 'function-spaces',
      title: 'Function Spaces Roadmap',
      order: 1,
    },
    roadmap: ['Normed spaces', 'Banach spaces', 'Hilbert spaces', 'Sobolev spaces'],
    sections: [
      {
        id: 'normed-spaces',
        title: 'Normed spaces',
        markdown:
          'Normed space는 벡터공간 위에 크기 개념을 올린 구조다.\n\n수렴, 연속성, 완비성 같은 이후 항목은 모두 norm을 기준으로 정의된다.',
      },
      {
        id: 'banach-spaces',
        title: 'Banach spaces',
        markdown:
          'Banach space는 normed space 중 Cauchy sequence가 항상 공간 안에서 수렴하는 완비 공간이다.\n\n해석학 문서군에서는 존재 정리와 fixed point argument를 다룰 때 이 층을 참조한다.',
      },
      {
        id: 'hilbert-spaces',
        title: 'Hilbert spaces',
        markdown:
          'Hilbert space는 inner product에서 norm이 유도되는 완비 공간이다.\n\n직교성, projection, adjoint operator는 Hilbert 구조가 있을 때 자연스럽게 정리된다.',
      },
      {
        id: 'sobolev-spaces',
        title: 'Sobolev spaces',
        markdown:
          'Sobolev space는 함수와 약도함수를 함께 관리하는 함수공간이다.\n\n각 함수공간 문서는 이전 문서의 전제를 짧게 재사용하고, 깊은 증명은 별도 문서로 분리한다.',
      },
    ],
  },
  {
    slug: 'paper/diffusion-score',
    title: 'Diffusion Score Notes',
    summary:
      '확률 흐름, score matching, sampling 절차를 논문 읽기 노트로 압축한다.',
    category: 'PAPER',
    wikiRelpath: 'paper/diffusion-score.md',
    createdAt: '2026-06-20',
    updatedAt: '2026-07-02',
    tags: ['diffusion', 'score-matching', 'sampling'],
    groups: ['ML Papers'],
    series: {
      id: 'generative-models',
      title: 'Generative Models',
      order: 3,
    },
    roadmap: ['Problem setup', 'Training objective', 'Sampler', 'Open questions'],
    sections: [
      {
        id: 'problem-setup',
        title: 'Problem setup',
        markdown:
          '문제 설정은 데이터 분포에서 샘플을 생성하는 과정을 확률 흐름으로 재구성하는 것이다.\n\n논문 노트는 주장, 전제, 구현 난점을 같은 순서로 정리한다.',
      },
      {
        id: 'training-objective',
        title: 'Training objective',
        markdown:
          'Score matching 목적함수는 각 noise level에서 분포의 score를 추정하도록 모델을 학습시킨다.\n\n수식은 원문 복제가 아니라 내부 재사용을 위한 최소 형태로 유지한다.',
      },
      {
        id: 'sampler',
        title: 'Sampler',
        markdown:
          'Sampler는 학습된 score를 사용해 noise 상태에서 데이터 상태로 되돌아가는 절차를 구현한다.\n\n구현 문서와 연결되는 부분은 repository export의 스냅샷 정보로 확장할 수 있다.',
      },
      {
        id: 'open-questions',
        title: 'Open questions',
        markdown:
          '실험 조건, 시간 discretization, sampler 안정성은 별도 구현 로그에서 다시 검증해야 한다.',
      },
    ],
  },
  {
    slug: 'repo/seraph-field-site',
    title: 'Seraph Field Site Shell',
    summary:
      'GitHub Pages 배포를 위한 정적 사이트 셸과 export JSON 연결 방식을 설명한다.',
    category: 'REPO',
    wikiRelpath: 'repo/seraph-field-site.md',
    createdAt: '2026-06-25',
    updatedAt: '2026-07-05',
    tags: ['github-pages', 'vite', 'static-export'],
    groups: ['Site Runtime'],
    repository: {
      owner: 'SeraphField',
      name: 'seraph-field',
      url: 'https://github.com/SeraphField/seraph-field',
    },
    roadmap: ['Routing', 'Data exports', 'Search index', 'Deployment'],
    sections: [
      {
        id: 'routing',
        title: 'Routing',
        markdown:
          '빌드 산출물은 상대 경로와 hash route를 사용해 GitHub Pages 하위 경로에서도 동작해야 한다.',
      },
      {
        id: 'data-exports',
        title: 'Data exports',
        markdown:
          '공개 사이트는 raw, draft, SQLite 원본에 접근하지 않는다.\n\n문서 목록은 `db/exports/documents.json`에서 읽고, 파일이 없을 때만 내장 fixture로 대체한다.',
      },
      {
        id: 'search-index',
        title: 'Search index',
        markdown:
          '검색 인덱스는 제목, 태그, 그룹, 시리즈 단위 탐색을 빠르게 만들기 위한 공개 JSON으로 분리할 수 있다.',
      },
      {
        id: 'deployment',
        title: 'Deployment',
        markdown:
          'GitHub Pages 배포에서는 Vite base 경로와 정적 asset 경로가 저장소 하위 경로에서도 깨지지 않아야 한다.',
      },
    ],
  },
  {
    slug: 'implement/json-export-pipeline',
    title: 'JSON Export Pipeline',
    summary:
      'SQLite 로컬 DB에서 공개 가능한 문서 메타데이터를 JSON으로 내보내는 작업 흐름.',
    category: 'IMPLEMENT',
    wikiRelpath: 'implement/json-export-pipeline.md',
    createdAt: '2026-06-28',
    updatedAt: '2026-07-04',
    tags: ['sqlite', 'json', 'pipeline'],
    groups: ['Site Runtime'],
    roadmap: ['Select public rows', 'Normalize paths', 'Write exports', 'Validate'],
    sections: [
      {
        id: 'select-public-rows',
        title: 'Select public rows',
        markdown:
          'export 스크립트는 공개 가능한 문서만 선택하고 raw, draft, 로컬 DB 경로를 제외한다.',
      },
      {
        id: 'normalize-paths',
        title: 'Normalize paths',
        markdown:
          '`wiki_relpath`는 저장소 기준 상대 경로로 정규화하고, 공개 사이트에서는 UI에 노출하지 않는다.',
      },
      {
        id: 'write-exports',
        title: 'Write exports',
        markdown:
          '검색 인덱스는 사이트 런타임에서 재가공하지 않도록 JSON 단계에서 충분한 필드를 포함한다.',
      },
      {
        id: 'validate',
        title: 'Validate',
        markdown:
          '검증 단계에서는 공개 금지 경로, 빈 slug, 깨진 section id, 누락된 검색 필드를 확인한다.',
      },
    ],
  },
  {
    slug: 'profile',
    title: 'Profile',
    summary: 'Seraph Field 문서 운영자 프로필 영역.',
    category: 'PROFILE',
    wikiRelpath: 'profile.md',
    createdAt: '2026-06-01',
    updatedAt: '2026-07-01',
    tags: ['profile', 'field-owner'],
    groups: ['System'],
    roadmap: ['Identity', 'Contact', 'Field policy'],
    sections: [
      {
        id: 'identity',
        title: 'Identity',
        markdown:
          '프로필 페이지는 같은 위키 레이아웃을 사용하되, 카테고리 로비에는 노출하지 않는다.',
      },
      {
        id: 'contact',
        title: 'Contact',
        markdown:
          '외부 연락처나 링크는 공개 export가 명시적으로 제공할 때만 렌더링한다.',
      },
      {
        id: 'field-policy',
        title: 'Field policy',
        markdown:
          '이미지나 로고는 문서 export가 제공할 때만 별도 필드로 연결한다.',
      },
    ],
  },
];
