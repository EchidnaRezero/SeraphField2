import type { CategoryDefinition } from './types';

export const categories: CategoryDefinition[] = [
  {
    id: 'THEORY',
    label: 'Theory',
    shortLabel: 'TH',
    description: '수학적 정의, 정리, 증명 흐름을 정리한 문서군',
  },
  {
    id: 'PAPER',
    label: 'Paper',
    shortLabel: 'PA',
    description: '논문 요약, 핵심 주장, 재현 포인트를 추적하는 문서군',
  },
  {
    id: 'REPO',
    label: 'Repo',
    shortLabel: 'RP',
    description: '저장소 구조와 구현 단위를 연결하는 문서군',
  },
  {
    id: 'IMPLEMENT',
    label: 'Implement',
    shortLabel: 'IM',
    description: '실험, 구현 로그, 작업 절차를 기록하는 문서군',
  },
];
