# 문서 작성 시 중복·메타 서술·불필요한 반대 맥락 방지 지침

## 목적

이 문서는 수학 문서, 기술 문서, 개념 비교 문서에서 불필요한 설명을 줄이기 위한 지침이다.

특히 다음 유형을 피한다.

1. 그래프, 표, 수식에 이미 들어 있는 정보를 본문에서 다시 반복하는 경우.
2. 독자가 실제로 필요로 하지 않는 문서·표·그림 자체에 대한 메타 설명을 덧붙이는 경우.
3. 명시적으로 주의를 붙일 가치가 확인되지 않았는데도 “A가 아니라 B” 형식으로 불필요한 반대 맥락을 추가하는 경우.

---

## 1. 그래프 안의 정보를 본문에서 반복하지 않는다

### 금지 유형

그래프나 구조 사슬에 이미 들어 있는 대상, 조건, 방향을 본문에서 다시 풀어 쓰지 않는다.

### 나쁜 예

$$
\begin{array}{l}
\text{바탕 집합 } M \\[1ex]
\quad \downarrow\ \text{(+ topology }\tau\text{)} \\[1ex]
\text{위상공간 }(M,\tau) \\[1ex]
\quad \downarrow\ \text{(+ metric }d\text{ inducing }\tau\text{)} \\[1ex]
\text{거리공간 }(M,d) \\[1ex]
\quad \downarrow\ \text{(+ vector space structure and compatible norm)} \\[1ex]
\text{노름공간} \\[1ex]
\quad \downarrow\ \text{(+ 노름거리의 완비조건)} \\[1ex]
\text{Banach space} \\[1ex]
\quad \downarrow\ \text{(+ inner product inducing the norm)} \\[1ex]
\text{Hilbert space}
\end{array}
$$

> 가장 느슨한 대상인 바탕 집합에서 출발한다. 여기에 topology, metric, vector space structure, norm, completeness, inner product를 차례로 추가하면 Hilbert space에 이른다.

그래프에 있는 내용을 문장에서 굳이 또 쓰므로 삭제한다.

### 좋은 예

그래프만 둔다.

$$
\begin{array}{l}
\text{바탕 집합 } M \\[1ex]
\quad \downarrow\ \text{(+ topology }\tau\text{)} \\[1ex]
\text{위상공간 }(M,\tau) \\[1ex]
\quad \downarrow\ \text{(+ metric }d\text{ inducing }\tau\text{)} \\[1ex]
\text{거리공간 }(M,d) \\[1ex]
\quad \downarrow\ \text{(+ vector space structure and compatible norm)} \\[1ex]
\text{노름공간} \\[1ex]
\quad \downarrow\ \text{(+ 노름거리의 완비조건)} \\[1ex]
\text{Banach space} \\[1ex]
\quad \downarrow\ \text{(+ inner product inducing the norm)} \\[1ex]
\text{Hilbert space}
\end{array}
$$

### 다른 나쁜 예

$$
\begin{array}{l}
\text{국소 마팅게일} \\[1ex]
\quad \downarrow\ \text{(+ }M_0=0\text{, 연속 경로, }\langle M\rangle_t=t\text{)} \\[1ex]
\text{위너 과정}
\end{array}
$$

> 단순히 국소 마팅게일이라는 사실만으로는 부족하다. $M_0=0$, 연속 경로, $\langle M\rangle_t=t$ 조건이 함께 필요하다.

화살표 조건에 이미 적힌 내용을 아래 문장에서 다시 반복하고 있으므로 삭제한다.

---

## 2. 표의 열 이름이나 행 내용을 문장으로 다시 읽어주지 않는다

### 금지 유형

표가 이미 비교축을 제공하는데, 본문에서 같은 축을 다시 나열하지 않는다.

### 나쁜 예

$$
\begin{array}{c|ccccc}
& \text{상태공간} & \text{변분대상 공간} & \text{범함수} & \text{정류조건} & \text{산출대상} \\
\hline
\cdots
\end{array}
$$

> 위 표는 상태공간, 변분대상 공간, 범함수, 정류조건, 산출대상이 각 분야에서 어떻게 나타나는지를 정리한다.

표의 열 이름을 문장으로 다시 읽고 있으므로 삭제한다.

### 좋은 예

표만 둔다.

$$
\begin{array}{c|ccccc}
& \text{상태공간} & \text{변분대상 공간} & \text{범함수} & \text{정류조건} & \text{산출대상} \\
\hline
\cdots
\end{array}
$$

표 아래에는 표에 없는 해석만 짧게 적는다.

---

## 3. 표·그림·문서 자체를 설명하는 메타 문장을 피한다

### 금지 유형

내용을 설명하는 대신, 표나 문서가 “무엇을 하기 위한 것인지”를 메타적으로 소개하지 않는다.

### 나쁜 예

> 이 표는 공통 구조를 드러내기 위한 것이다.

> 이 다이어그램은 구조 추가 관계를 시각적으로 보여주기 위한 것이다.

> 이 절에서는 수학적 구조 비교의 필요성을 설명한다.

문서 제목, 절 제목, 표 자체가 이미 그 역할을 하고 있다면 이런 문장은 삭제한다.

### 좋은 예

내용으로 바로 들어간다.

$$
\begin{array}{c|ccc}
& \text{대상} & \text{구조} & \text{조건} \\
\hline
\cdots
\end{array}
$$

메타 설명이 꼭 필요하면 제목이나 소제목으로 처리하고, 본문 문장으로 다시 반복하지 않는다.

---

## 4. “A가 아니라 B”는 사용자가 허락한 주의문구일 때만 쓴다

### 원칙

명시적으로 **주의**를 붙일 만한 가치가 있는 경우가 아니라면, “A가 아니라 B”라고 쓰지 않는다.

그 판단은 사용자가 한다. AI 에이전트는 내용의 수학적 정확성을 검토하는 과정에서 “이 지점은 주의문구를 넣는 편이 안전하다”고 권유할 수는 있지만, 사용자의 허락 없이 멋대로 부정형 주의문구를 넣지 않는다.

### 금지 유형

>A가 아니라 B이다.

이 형식은 A라는 불필요한 맥락을 새로 만든다. 독자에게 “코끼리를 생각하지 마”라고 말하는 것처럼, 문서에 필요 없는 반대 개념을 끌어들인다.

### 나쁜 예

> 조건부 표기 $P(Y\mid X)$는 단순한 조건부확률 숫자가 아니라, Markov kernel이다.

> $L^2(\Omega)$는 단순한 함수들의 집합이 아니라, 동치류로 이루어진 Hilbert space이다.

> $\sup_{f\in\mathcal F}|P_nf-Pf|$는 단순한 실수값 표현이 아니라, 표본 $D_n$에 의존하는 확률변수이다.

### 좋은 예

처음부터 B만 말한다.

> 조건부 표기 $P(Y\mid X)$는 Markov kernel로 해석한다.

> $L^2(\Omega)$는 거의 모든 곳에서 같은 함수를 동일시한 동치류들의 Hilbert space이다.

> $\sup_{f\in\mathcal F}|P_nf-Pf|$는 표본 $D_n$에 의존하는 확률변수이다.

### 예외

사용자가 명시적으로 주의문구를 요청했거나, 해당 반대 명제가 실제로 문서 안에서 등장한 경우에는 “A가 아니라 B” 형식을 쓸 수 있다.
