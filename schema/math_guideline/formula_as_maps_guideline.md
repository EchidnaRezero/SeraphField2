# 수식을 사상으로 읽는 실전 가이드라인

## 목적

공학, 딥러닝, 제어, 로봇 논문에서 복잡한 수식을 **관계, 사상, 부분 사상들의 합성, 시스템 기능**으로 읽기 위한 절차를 정리한다.

$$
\text{수식}
\to
\text{타입 판정}
\to
\text{입출력화}
\to
\text{부분 사상 분해}
\to
\text{기능 해석}
$$

공학 수식은 등식, 제약식, 목적함수, 동역학, 업데이트 식으로 주어지는 경우가 많다. 먼저 식이 정의하는 구조를 판정하고, 어떤 변수를 입력과 출력으로 볼지 정한다.

---

공간 세팅이 길어질 때는 본문 절차를 먼저 적용하고, 필요한 경우 Appendix에서 함수공간, 다양체, 군, 측도공간 후보를 확인한다.

---
## 1. 식의 타입을 먼저 판정한다

등호와 부등호는 수식의 역할에 따라 다르게 읽는다.

$$
y=f(x)
$$

은 입력 $x$에서 출력 $y$를 만드는 사상으로 읽기 쉽다.

$$
g(x)\le 0
$$

은 허용 가능한 점들의 집합을 정한다.

$$
M(q)\ddot q+C(q,\dot q)\dot q+g(q)=\tau
$$

은 자세, 속도, 가속도, 토크 사이의 균형 조건을 정한다.

따라서 첫 단계에서는 식을 다음 중 하나로 분류한다.

| 타입 | 읽는 대상 | 기본 형태 |
|---|---|---|
| 값 생성식 | 출력 사상 | $X\to Y$ |
| 제약식 | 허용 집합 | $\{x\in X\mid g(x)\le 0\}$ |
| 균형식 | 관계 | $R\subseteq X_1\times\cdots\times X_n$ |
| 목적함수 | 평가 사상 | $\Theta\to\mathbb R$ |
| 업데이트 식 | 자기 사상 | $\Theta\to\Theta$ 또는 $X\to X$ |
| 동역학 | 변화율 또는 다음 상태 | $X\times U\to TX$ 또는 $X\times U\to X$ |

---

## 2. 고정값과 변수를 분리한다

수식 하나가 어떤 사상인지는 이번 독해에서 무엇을 고정하고 무엇을 움직이는지에 따라 달라진다.

제어식

$$
u=-Kx
$$

에서 $K$를 고정하면 상태에서 제어 입력으로 가는 사상이다.

$$
\pi_K:X\to U
$$

$$
\pi_K(x)=-Kx
$$

상태 $x$를 고정하고 $K$를 설계 대상으로 보면 gain에서 입력으로 가는 사상이 된다.

$$
\Phi_x:\mathcal K\to U
$$

$$
\Phi_x(K)=-Kx
$$

실전에서는 기호를 길게 나열하기보다 세 덩어리로 나눈다.

| 덩어리 | 예 | 역할 |
|---|---|---|
| 움직이는 변수 | $x,q,\dot q,\theta,u,\tau$ | 이번 사상의 입력 또는 상태 |
| 고정된 구조 | $A,B,D,\lambda,d_{\mathrm{model}}$ | 사상을 정의하는 배경값 |
| 산출 대상 | $\hat y,\mathcal L,x_{t+1},u,\ddot q$ | 출력, 판정값, 다음 상태 |

이 분리가 끝나면 수식의 정의역과 공역을 적을 수 있다.

---

## 3. 관계는 필요할 때 다가 사상으로 읽는다

관계

$$
R\subseteq X\times Y
$$

는 각 $x\in X$에 대해 가능한 $y\in Y$들의 모음을 줄 수 있다.

$$
\hat R:X\to\mathcal P(Y)
$$

$$
\hat R(x)=\{y\in Y\mid (x,y)\in R\}
$$

제약식

$$
g(x)\le 0
$$

의 측정 사상은 다음과 같다.

$$
g:X\to\mathbb R
$$

그 식이 정하는 허용 영역은 다음 부분집합이다.

$$
X_{\mathrm{feasible}}
=
\{x\in X\mid g(x)\le 0\}
$$

따라서 제약식은 측정 사상 $g$와 부분집합 $X_{\mathrm{feasible}}$를 함께 본다.

---

## 4. 부분 사상은 역할이 바뀌는 지점에서 자른다

복잡한 식은 중간 공간을 세워 읽는다.

예를 들어

$$
\theta_{t+1}
=
\theta_t-
\eta\nabla_\theta\ell(f_\theta(x),y)
$$

은 다음 흐름으로 분해된다.

$$
\theta
\mapsto
f_\theta(x)
\mapsto
\ell(f_\theta(x),y)
\mapsto
\nabla_\theta\ell(f_\theta(x),y)
\mapsto
\theta_{t+1}
$$

기능은 다음 순서로 바뀐다.

$$
\text{예측}
\to
\text{오차 측정}
\to
\text{방향 계산}
\to
\text{파라미터 이동}
$$

부분 사상은 역할이 바뀌는 지점에서 자른다.

| 자르는 지점 | 의미 |
|---|---|
| 공간이 바뀌는 곳 | 입력공간에서 표현공간으로 이동 |
| 스칼라로 내려가는 곳 | 예측이나 상태를 비용으로 평가 |
| 연산 성격이 바뀌는 곳 | gradient, argmin, projection, softmax |
| 가능한 영역이 바뀌는 곳 | constraint, barrier, regularizer |
| 시간 단계가 바뀌는 곳 | $x_t\mapsto x_{t+1}$, $\theta_t\mapsto\theta_{t+1}$ |

---

## 5. 동역학과 미분방정식은 변화 사상으로 읽는다

### 5.1 연속시간 동역학

제어 시스템

$$
\dot x=Ax+Bu
$$

은 상태와 입력에서 상태 변화율을 만든다.

$$
F:X\times U\to TX
$$

$$
F(x,u)=Ax+Bu
$$

제어기

$$
u=-Kx
$$

를 넣으면 닫힌계는

$$
\dot x=(A-BK)x
$$

이다.

$$
F_K:X\to TX
$$

$$
F_K(x)=(A-BK)x
$$

여기서 $u=-Kx$는 행동 생성 사상이고, $\dot x=Ax+Bu$는 시스템의 변화율 사상이다. 합성 결과가 닫힌계 벡터장이다.

### 5.2 이산시간 동역학

이산시간 시스템은 다음 상태를 직접 만든다.

$$
x_{t+1}=F(x_t,u_t)
$$

$$
F:X\times U\to X
$$

연속시간에서 $\dot x$가 변화율이면, 이산시간에서 $x_{t+1}$은 다음 상태다.

### 5.3 미분방정식

상미분방정식

$$
\dot x=f(x,t)
$$

은 시간 $t$와 상태 $x$에서 접벡터를 만든다.

$$
f:X\times T\to TX
$$

해는 초기조건을 궤적으로 보내는 사상으로 읽는다.

$$
\Phi:T\times X\to X
$$

$$
\Phi(t,x_0)=x(t)
$$

편미분방정식은 함수공간 위의 동역학으로 읽는다.

$$
\partial_t u=\mathcal F(u)
$$

$$
\mathcal F:\mathcal U\to T\mathcal U
$$

여기서 $u$는 공간 변수 전체에 대한 함수다.

### 5.4 로봇 동역학

로봇 동역학

$$
M(q)\ddot q+C(q,\dot q)\dot q+g(q)=\tau
$$

은 다음 관계를 정한다.

$$
R
=
\{(q,\dot q,\ddot q,\tau)
\mid
M(q)\ddot q+C(q,\dot q)\dot q+g(q)=\tau\}
$$

$$
R\subseteq Q\times TQ\times T^2Q\times U
$$

가속도를 출력으로 풀면 순동역학이다.

$$
(q,\dot q,\tau)
\mapsto
\ddot q
$$

토크를 출력으로 보면 역동역학이다.

$$
(q,\dot q,\ddot q)
\mapsto
\tau
$$

---

## 6. 딥러닝 수식의 첨자와 기호 읽기

딥러닝 수식은 층, 샘플, feature, token, head, 차원 첨자가 한 식 안에 겹친다. 먼저 첨자의 종류를 분리하고, 그다음 사상 단위로 읽는다.

---

### 6.1 층 인덱스 $[l]$

대괄호 첨자 $[l]$은 신경망의 층을 뜻한다.

$$
W^{[l]},\quad b^{[l]},\quad z^{[l]},\quad a^{[l]}
$$

한 층의 계산은 다음과 같다.

$$
z^{[l]}=W^{[l]}a^{[l-1]}+b^{[l]}
$$

$$
a^{[l]}=g^{[l]}(z^{[l]})
$$

사상 단위로는 다음 합성이다.

$$
a^{[l-1]}
\xrightarrow{\mathrm{affine}}
z^{[l]}
\xrightarrow{\mathrm{activation}}
a^{[l]}
$$

여기서 $W^{[l]}$와 $b^{[l]}$는 affine map을 정하는 파라미터이고, $g^{[l]}$는 비선형 사상이다.

---

### 6.2 샘플 인덱스 $(i)$와 feature 인덱스 $j$

위첨자 $(i)$는 데이터 샘플을 뜻한다.

$$
x^{(i)},\quad y^{(i)},\quad a^{[l](i)}
$$

아래첨자 $j$는 벡터 성분 또는 feature 좌표를 뜻한다.

$$
a_j^{[l](i)}
$$

$$
(i)=\text{샘플},
\qquad
[l]=\text{층},
\qquad
j=\text{feature 성분}
$$

따라서 $a_j^{[l](i)}$는 다음 흐름의 마지막 좌표값이다.

$$
x^{(i)}
\mapsto
a^{[1](i)}
\mapsto
\cdots
\mapsto
a^{[l](i)}
\mapsto
a_j^{[l](i)}
$$

마지막 화살표는 $j$번째 성분을 꺼내는 projection이다.

---

### 6.3 행렬 차원으로 보는 층 사상

$l$번째 층의 입력 차원을 $n_{l-1}$, 출력 차원을 $n_l$이라 두면 다음 타입을 갖는다.

$$
a^{[l-1]}\in\mathbb R^{n_{l-1}}
$$

$$
W^{[l]}\in\mathbb R^{n_l\times n_{l-1}}
$$

$$
b^{[l]}\in\mathbb R^{n_l}
$$

$$
z^{[l]},a^{[l]}\in\mathbb R^{n_l}
$$

$l$번째 층은 다음 사상이다.

$$
F^{[l]}:\mathbb R^{n_{l-1}}\to\mathbb R^{n_l}
$$

$$
F^{[l]}(a)=g^{[l]}(W^{[l]}a+b^{[l]})
$$

전체 신경망은 층 사상들의 합성이다.

$$
F
=
F^{[L]}\circ F^{[L-1]}\circ\cdots\circ F^{[1]}
$$

---

### 6.4 활성화 함수와 출력층

활성화 함수는 성분별 비선형 사상으로 자주 쓰인다.

$$
\sigma(z)={1\over 1+e^{-z}}
$$

$$
\mathrm{ReLU}(z)=\max(0,z)
$$

$$
\tanh(z)
$$

다중분류 출력에서는 softmax가 벡터를 확률벡터로 보낸다.

$$
\mathrm{softmax}(z)_i={e^{z_i}\over\sum_j e^{z_j}}
$$

$$
\mathrm{softmax}:\mathbb R^K\to\Delta^{K-1}
$$

여기서 $i$는 출력 class 성분이고, $j$는 합산되는 class 인덱스다.

---

### 6.5 Transformer의 token, 차원, head

토큰 시퀀스는 다음처럼 쓴다.

$$
x_{1:T}=(x_1,x_2,\dots,x_T)
$$

여기서 $T$는 시퀀스 길이이고, $t$는 token 위치다.

임베딩 후 표현은 보통 다음 행렬로 둔다.

$$
X\in\mathbb R^{T\times d_{\mathrm{model}}}
$$

$T$축은 token 위치이고, $d_{\mathrm{model}}$축은 각 token 표현의 feature 차원이다.

Attention에서는

$$
Q=XW_Q,
\qquad
K=XW_K,
\qquad
V=XW_V
$$

를 만든다.

$$
\mathrm{Attention}(Q,K,V)
=
\mathrm{softmax}\left({QK^T\over \sqrt{d_k}}\right)V
$$

사상 단위 흐름은 다음과 같다.

$$
X
\mapsto
(Q,K,V)
\mapsto
QK^T
\mapsto
\mathrm{softmax}\left({QK^T\over\sqrt{d_k}}\right)
\mapsto
\mathrm{Attention}(Q,K,V)
$$

기능은 query, key, value 생성, token 간 가중치 계산, value 혼합으로 이어진다.

Multi-head attention에서 head 수를 $h$라 하면 보통

$$
d_k={d_{\mathrm{model}}\over h}
$$

처럼 head별 차원을 둔다. $h$는 병렬 attention 사상의 개수다.

---

### 6.6 자기회귀 확률과 Perplexity

자기회귀 언어모델은 시퀀스 확률을 token 위치별 조건부 확률로 분해한다.

$$
P(x_{1:T})
=
\prod_{t=1}^{T}P(x_t\mid x_{<t})
$$

$t$는 token 위치이고, $x_{<t}$는 이전 token들의 prefix다.

Perplexity는 다음 평가값이다.

$$
\mathrm{PPL}
=
\exp\left(-{1\over T}\sum_{t=1}^{T}\log P(x_t\mid x_{<t})\right)
$$

구조적으로는 시퀀스와 모델을 실수 하나로 보내는 평가 사상이다.

---

## 7. 목적함수는 평가 사상, 업데이트는 자기 사상이다

데이터셋 $D$를 고정하면 목적함수는 파라미터 공간을 실수로 보낸다.

$$
\mathcal L_D:\Theta\to\mathbb R
$$

$$
\theta\mapsto\mathcal L_D(\theta)
$$

예를 들어

$$
\mathcal L(\theta)
=
\mathcal L_{\mathrm{task}}(\theta)
+
\lambda\mathcal L_{\mathrm{reg}}(\theta)
$$

에서 $\mathcal L_{\mathrm{task}}$는 목표 오차를 재고, $\mathcal L_{\mathrm{reg}}$는 파라미터나 표현의 특정 방향에 비용을 부여한다. $\lambda$는 두 평가 사상의 상대 세기를 정한다.

업데이트 식은 파라미터 공간 위의 자기 사상이다.

$$
\theta_{t+1}
=
\theta_t-
\eta\nabla_\theta\mathcal L(\theta_t)
$$

$$
U:\Theta\to\Theta
$$

$$
U(\theta)=\theta-
\eta\nabla_\theta\mathcal L(\theta)
$$

따라서 학습 수식은 예측, 평가, 방향 계산, 파라미터 이동의 흐름으로 읽는다.

---

## 8. 실전 압축 절차

수식 하나를 만났을 때 다음 순서만 적용한다.

1. 식의 타입을 잡는다.
2. 고정값과 변수를 나눈다.
3. 출력 대상을 정한다.
4. 관계식이면 허용 집합이나 다가 사상으로 읽는다.
5. 값 생성식이면 정의역과 공역을 적는다. 필요한 공간 후보는 Appendix에서 확인한다.
6. 역할이 바뀌는 지점에서만 부분 사상으로 자른다.
7. 시스템 기능으로 번역한다.

예를 들어 정규화는 목적함수의 기하를 바꾸고, feedback은 닫힌계 벡터장을 바꾼다.

---

## 9. 한 줄 요약

복잡한 공학 수식은 먼저 타입을 판정하고, 고정값과 변수를 나눈 뒤, 출력 대상을 정해 입출력화한다. 그다음 역할이 바뀌는 지점에서 부분 사상으로 쪼개면 된다.

$$
\text{복잡한 수식}
=
\text{관계 또는 전체 사상}
=
\text{역할 단위 부분 사상들의 합성}
=
\text{시스템 기능의 구조적 표현}
$$

---

## Appendix. 문제에 맞는 공간 세팅 잡기

수식을 사상이나 연산자로 읽으려면 먼저 그 기호들이 사는 공간을 정한다. 논문에 명시되지 않은 경우에는 변수의 역할, 차원, 연산, 제약, 미분 대상에서 암묵적 세팅을 복원한다.

$$
\text{기호}
\to
\text{공간}
\to
\text{허용 연산}
\to
\text{사상 타입}
$$

### A.1 공간 세팅을 정하는 질문

한 수식에 대해 다음 순서로 본다.

1. 원소인가, 함수인가, 분포인가, 궤적인가, 연산자인가?
2. 덧셈, 내적, 노름, 미분, 적분, 확률, 군 연산 중 무엇이 쓰이는가?
3. 제약이 있는가?
4. 시간 또는 공간 변수가 있는가?
5. 출력은 값, 함수, 분포, 다음 상태, 접벡터, 연산자 중 무엇인가?

예를 들어 $x\in\mathbb R^n$이면 유한차원 벡터이고, $u(t)$이면 시간함수이며, $p_\theta(x)$이면 파라미터가 붙은 확률밀도다. $R\in SO(3)$이면 행렬 모양을 갖지만 회전군의 원소로 읽는다.

---

### A.2 자주 쓰는 공간 세팅

| 등장 맥락 | 기본 공간 | 수식에서 보이는 단서 |
|---|---|---|
| 벡터/텐서 계산 | $\mathbb R^n$, $\mathbb R^{m\times n}$, tensor space | 행렬곱, 내적, batch 차원, feature 차원 |
| 신호와 함수 | $L^p(\Omega)$, $C^k(\Omega)$ | 적분, 노름, 미분 가능성, 신호 에너지 |
| PDE와 연속체 | Sobolev space $W^{k,p}(\Omega)$, $H^k(\Omega)$ | 약미분, 경계조건, energy estimate |
| 일반화 함수 | distribution space $\mathcal D'(\Omega)$ | delta, Green function, 약한 해 |
| 연산자 | $\mathcal L(X,Y)$, $\mathrm{End}(X)$ | 선형사상, kernel, integral operator |
| 최적화/학습 | parameter space $\Theta$, function class $\mathcal F$ | $\theta$, $f_\theta$, $\arg\min$, loss |
| 로봇/기하 | manifold $Q$, tangent bundle $TQ$, cotangent bundle $T^*Q$ | $q,\dot q,\ddot q$, force, momentum |
| 회전/자세 | $SO(3)$, $SE(3)$, Lie algebra $\mathfrak{so}(3)$, $\mathfrak{se}(3)$ | rotation matrix, pose, exponential map |
| 확률/통계 | probability space $(\Omega,\mathcal F,P)$, measure space | expectation, random variable, distribution |
| 정보기하 | simplex $\Delta^{K-1}$, statistical manifold $\{p_\theta\}$ | KL, Fisher information, score, likelihood |

표의 공간은 기본 후보이고, 실제 세팅은 수식의 연산과 조건으로 좁힌다.

---

### A.3 함수공간을 고르는 기준

함수 $u$가 시간이나 공간 변수에 의존하면 $u$ 자체를 한 점으로 보는 큰 공간을 잡는다.

$$
u: \Omega\to\mathbb R
$$

적분 노름이 중심이면 다음 후보를 둔다.

$$
u\in L^p(\Omega)
$$

미분과 경계조건이 중심이면 Sobolev 공간을 둔다.

$$
u\in W^{k,p}(\Omega)
$$

Hilbert 구조가 필요하면 보통 다음 공간을 쓴다.

$$
H^k(\Omega)=W^{k,2}(\Omega)
$$

PDE에서 해의 미분이 고전적으로 존재하지 않아도 식을 적분형으로 해석하면 약한 해 공간을 쓴다.

$$
\mathcal F: \mathcal U\to \mathcal U^*
$$

여기서 $\mathcal U$는 해 공간이고, $\mathcal U^*$는 test function에 작용하는 쌍대공간이다.

---

### A.4 사상공간과 연산자공간

모델이나 제어기를 하나의 점으로 보면 파라미터 공간을 쓴다.

$$
\theta\in\Theta
$$

모델 자체를 사상으로 보면 함수공간이나 사상공간을 쓴다.

$$
f_\theta\in \mathrm{Map}(X,Y)
$$

선형 연산자이면 다음처럼 둔다.

$$
A\in\mathcal L(X,Y)
$$

자기 공간 위에서 작용하면 endomorphism이다.

$$
A\in\mathrm{End}(X)=\mathcal L(X,X)
$$

학습은 보통 두 층위가 함께 나온다.

$$
\Theta\to \mathrm{Map}(X,Y)
$$

$$
\theta\mapsto f_\theta
$$

파라미터 업데이트는 $\Theta$ 위의 자기 사상이고, 모델 평가는 $X\to Y$ 사상이다.

---

### A.5 군, 다양체, 접공간

로봇 자세와 pose는 유클리드 공간보다 군이나 다양체로 잡는 경우가 많다.

$$
R\in SO(3)
$$

$$
T\in SE(3)
$$

속도는 해당 공간의 접공간에 놓인다.

$$
\dot q\in T_qQ
$$

힘이나 momentum은 쌍대공간에 놓인다.

$$
p\in T_q^*Q
$$

동역학은 상태에서 접벡터를 만드는 사상으로 읽는다.

$$
F:TQ\times U\to TTQ
$$

Lie group 위 업데이트는 군 연산이나 exponential map으로 표현된다.

$$
R_{t+1}=R_t\exp(\Delta t\,\hat\omega_t)
$$

여기서 $\omega_t\in\mathbb R^3$는 각속도 좌표이고, $\hat\omega_t\in\mathfrak{so}(3)$는 Lie algebra 원소다.

---

### A.6 확률, 측도, 정보기하

확률변수는 표본공간에서 값공간으로 가는 사상이다.

$$
X:\Omega\to E
$$

분포는 값공간 위의 측도다.

$$
P_X\in\mathcal P(E)
$$

밀도 모델은 파라미터가 측도나 밀도를 고르는 사상으로 읽는다.

$$
\Theta\to\mathcal P(E)
$$

$$
\theta\mapsto P_\theta
$$

정보기하에서는 확률분포들의 모임을 통계 다양체로 둔다.

$$
\mathcal M=\{p_\theta\mid \theta\in\Theta\}
$$

score와 Fisher information은 이 공간의 접방향과 계량을 만든다.

$$
\partial_i\log p_\theta(x)
$$

$$
I_{ij}(\theta)
=
\mathbb E_\theta[
\partial_i\log p_\theta(X)\,\partial_j\log p_\theta(X)
]
$$

---

### A.7 공간 세팅에서 바로 사상 타입으로 넘어가기

공간을 잡으면 수식의 타입이 빨리 정해진다.

$$
x\in X,
\qquad
u\in\mathcal U,
\qquad
\theta\in\Theta,
\qquad
P_\theta\in\mathcal P(E)
$$

예측 모델은 다음 사상이다.

$$
f_\theta:X\to Y
$$

손실은 다음 사상이다.

$$
\ell:Y\times Y\to\mathbb R
$$

학습 목적함수는 다음 사상이다.

$$
\mathcal L_D:\Theta\to\mathbb R
$$

PDE 연산자는 다음 사상이다.

$$
\mathcal A:\mathcal U\to\mathcal V
$$

확률모델은 다음 사상이다.

$$
\theta\mapsto P_\theta
$$

로봇 동역학은 다음 사상 또는 관계다.

$$
(q,\dot q,\tau)\mapsto\ddot q
$$

$$
R\subseteq TQ\times U\times T^2Q
$$
