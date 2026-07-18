---
title: Groups and Series Validation Sample
summary: IMPLEMENT 검증 문서 사이의 series와 group 탐색을 확인하는 공개 샘플.
category: IMPLEMENT
createdAt: 2026-07-07
updatedAt: 2026-07-07
tags:
  - metadata
  - groups
  - series
groups:
  - runtime-validation
series:
  id: implement-validation-samples
  title: IMPLEMENT Validation Samples
  order: 2
---

# Groups and Series Validation Sample

## Frontmatter shape

reference 문서에서 가져올 group/series 입력은 다음 모양이다.

```yaml
groups:
  - numerical-sampling-theory
  - diffusion-theory
series: numerical-sampling-foundations
series_title: 샘플링과 수치적분 기초
series_order: 1
```

현재 사이트 코드에서는 아래 객체형 series도 읽는다.

```yaml
series:
  id: groups-series-import
  title: Groups and Series Import
  order: 1
```

## Page metadata

이 문서는 `runtime-validation` group에 들어간다.

이 문서는 `IMPLEMENT Validation Samples` series의 2번 문서다.

같은 series의 1번 문서는 `Rendering Validation Sample`이다.

## Export target

`documents.json`에는 문서별 `groups`와 `series`가 들어간다.

`series.json`에는 같은 series에 속한 문서 목록이 들어간다.

`groups.json`에는 group별 문서 목록이 들어간다.

## Navigation check

본문 아래 `Series and Groups` 영역에서 이전 문서와 같은 group의 관련 문서가 보여야 한다.

검색 화면에서는 `series:implement-validation-samples`와 `group:runtime-validation` 쿼리로 같은 두 문서를 확인할 수 있어야 한다.
