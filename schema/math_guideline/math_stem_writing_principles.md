# 필수 지침

문서를 시작하기 전에, 먼저 사용할 universe $\mathcal{U}$를 정하고 이를 밝힌다. 

여기서 universe는 수학, 특히 집합론, 카테고리 이론, 타입 이론, 수학기초론 등에서 쓰이는 의미를 차용한 용어로, 본문에서 다룰 수학적 대상들의 collection을 뜻한다.

본문에 등장하는 대상은 모두 $\mathcal{U}$ 안에서 얻어져야 하므로, $\mathcal{U}$는 처음부터 충분히 크게 잡아야 한다.

<br>

### 대상의 기술 원칙

* 기본적으로 집합과 그 사이의 사상으로 기술한다.

* 카테고리 이론의 것들을 다룰 때에는 카테고리, 펑터, 자연변환 등으로 기술한다.

* 사상이나 카테고리 이론의 arrow, 펑터 등의 경우 정의역과 공역을 분명히 명시한다.

<br>

모든 추상적인 개념은 반드시 구체적인 예시를 들며, 가급적 일부를 원소나열법으로 보여줄 수 있어야 한다. 추상적 정의만 남기지 않는다.

---

## 예시: 조건부 표기 $P(Y \mid X)$의 수학적 해석


### 1. Universe 설정

이 예시에서는 universe를 다음과 같이 설정한다.

$$
\mathcal{U} = \{(\Omega, \mathcal{F}, \mathbb{P}), (S, \mathcal{S}), (T, \mathcal{T}), X:\Omega \to S, Y:\Omega \to T\}
$$

* $(\Omega, \mathcal{F}, \mathbb{P})$: 확률공간

* $(S, \mathcal{S})$, $(T, \mathcal{T})$: standard Borel space

* $X:\Omega \to S$, $Y:\Omega \to T$: 가측함수

<br>


### 2. 수학적 구조 및 사상 정의

조건부 표기 $P(Y \mid X)$는 $S$에서 $T$로 가는 Markov kernel, 즉 regular conditional distribution의 한 version으로 해석한다.

$$
\kappa: S \times \mathcal{T} \to [0, 1]
$$

이 매핑은 고정하는 변수에 따라 다음과 같은 성질을 가진다.

* $x \in S$를 고정하면: $\kappa(x, -)$는 가측공간 $(T, \mathcal{T})$ 위의 확률측도이다.

* $B \in \mathcal{T}$를 고정하면: $\kappa(-, B): S \to [0, 1]$는 $\mathcal{S}$-가측함수이다.

<br>


### 3. 구체적인 예시 

공간 $S$와 $T$를 다음과 같이 유한집합으로 정의한다.

* $S = \{1, 2, 3\} \implies \mathcal{S} = 2^S$

* $T = \{a, b\} \implies \mathcal{T} = 2^T$

<br>


### 3.1. $x$를 고정하는 경우 (확률측도)

$x$를 고정하면 $T$ 위의 확률분포가 대응된다. 고정한 $x$에 대응되는 측도를 $\mu_x$라 하자.

$$
1 \mapsto \mu_1, \qquad 2 \mapsto \mu_2, \qquad 3 \mapsto \mu_3
$$

예를 들어 $x=1$에 대응되는 측도 $\mu_1$은 다음과 같이 구체적으로 줄 수 있다.

* $\mu_1(\{a\}) = 0.8$

* $\mu_1(\{b\}) = 0.2$

* $\mu_1(\{a, b\}) = 1$

* $\mu_1(\varnothing) = 0$

<br>


### 3.2. $B$를 고정하는 경우 (가측함수)

반대로 $B$를 고정하면 $S$ 위의 가측함수가 대응된다. 고정한 $B$에 대응되는 가측함수를 $g_B$라 하자.

$$
B \mapsto g_B, \qquad g_B(x) = \kappa(x, B)
$$

예를 들어 $B=\{a\}$에 대응되는 함수 $g_{\{a\}}$는 다음과 같이 구체적으로 줄 수 있다.

* $g_{\{a\}}(1) = 0.8$

* $g_{\{a\}}(2) = 0.5$

* $g_{\{a\}}(3) = 0.1$

<br>


> 결론적으로 같은 kernel $\kappa$에서 어느 변수를 고정하느냐에 따라 확률측도 $\mu_x$가 되기도 하고, 가측함수 $g_B$가 되기도 한다.