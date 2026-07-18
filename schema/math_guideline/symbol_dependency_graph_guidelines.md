# 수식의 기호 의존성 그래프 가이드라인

## 목적

복잡한 수식이나 수학 명제를 읽을 때, 의미 해석 전에 먼저 다음을 파악한다.

1. 어떤 기호가 시작점인가
2. 어떤 기호가 다른 기호에 의해 유일하게 정해지는가
3. 어디서 선택이 들어가는가
4. 어떤 기호가 어떤 스코프 안에서만 유효한가
5. 어떤 기호가 최종 결과에 남고 어떤 기호가 중간에서 사라지는가

이 문서는 물리적 의미, 기하학적 의미, 통계적 의미를 해석하기 전 단계의 표면 기호 의존성을 정리하기 위한 가이드다.

---

## 핵심 표기

기본 구성요소는 세 개다.

$$
\boxed{\text{노드}=\text{기호 또는 기호 덩어리}}
$$

$$
\boxed{A\to B}
$$

$$
A\text{가 정해지면 }B\text{가 유일하게 정해진다.}
$$

$$
\boxed{A\dashrightarrow B}
$$

$$
A\text{가 정해져도 }B\text{가 유일하지 않아 조건에 맞게 선택한다.}
$$

$$
\boxed{\cdots}
$$

$$
\text{박스 안에서만 해당 기호가 유효하다.}
$$

---

## 노드 선정 규칙

### 1. 시작 노드

시작 노드 라벨은 두 개만 쓴다.

$$
\boxed{\mathrm{fixed}}
$$

$$
\text{처음부터 하나로 고정하고 시작하는 기호}
$$

$$
\boxed{\mathrm{arb}}
$$

$$
\text{허용 범위 안에서 임의로 하나 잡고 시작하는 기호}
$$

예:

$$
\boxed{X\ \mathrm{[fixed]}}
\qquad
\boxed{A\ \mathrm{[fixed]}}
\qquad
\boxed{f\ \mathrm{[fixed]}}
\qquad
\boxed{x\ \mathrm{[arb]}}
\qquad
\boxed{i\ \mathrm{[arb]}}
$$

기호가 집합인지, 원소인지, 행렬인지, 함수인지, 파라미터인지는 그래프 아래의 기호 설명표에 적는다.

### 2. 조합 노드

첨자, 함수 적용, 연산자 적용 등으로 만들어진 기호 덩어리다.

예:

$$
x_i,\quad \alpha_{ij},\quad f_\theta(x_i,z_j),\quad |f(x)-L|
$$

### 3. 결과 노드

최종적으로 정의되거나 계산되는 기호다.

예:

$$
y_i,\quad F(x),\quad |f(x)-L|<\epsilon
$$

---

## 첨자와 기호 덩어리 처리

### 성분 첨자

$$
x,i \to x_i
$$

$$
\alpha,i,j \to \alpha_{ij}
$$

### 함수족 첨자

$$
f,\theta \to f_\theta
$$

$$
f_\theta,x \to f_\theta(x)
$$

압축하면 다음과 같다.

$$
f,\theta,x \to f_\theta(x)
$$

### 텐서 첨자

$$
T,i,j,\uparrow,\downarrow \to T^i{}_j
$$

위첨자와 아래첨자는 표면 기호 수준에서는 위치 정보로 본다.

---

## 스코프 규칙

합, 적분, 극값 연산자, 전칭 기호, 존재 기호 등은 스코프를 만든다.

예:

$$
\boxed{
\sum_{j\in J_i}
\left[
\alpha_{ij}f_\theta(x_i,z_j)
\right]
}
$$

여기서

$$
j
$$

는 박스 안에서만 유효하다.

예:

$$
\boxed{
\arg\min_{\theta\in\Theta}
\left[
L(\theta)
\right]
}
$$

여기서

$$
\theta
$$

는 최적화 스코프 안에서만 도는 변수다.

---

## 표현 형식

화살표를 낱개로 끊어 세로로 나열하지 말고, 가능한 한 chain이나 DAG로 보여준다.

### chain이 적합한 경우

의존이 거의 일렬로 흐를 때 사용한다.

$$
A \to B \to C \to D
$$

### DAG가 적합한 경우

여러 입력이 한 노드로 모일 때 사용한다.

$$
A,B \to C \to D
$$

또는

$$
A \to C \leftarrow B
$$

### 너무 긴 경우

스코프 단위나 계산 덩어리 단위로 2~3줄로 나눈다.

$$
A,B \to C \to D
$$

$$
E,F \to G \to D
$$

---

## 기호 설명표

그래프 아래에는 기호 설명표를 하나만 둔다.

기호 설명표 형식:

$$
\begin{array}{c|c|c|c}
\text{기호} & \text{라벨} & \text{타입 / 설명} & \text{스코프 결과} \\
\hline
\text{기호} & \mathrm{fixed}\text{ 또는 }\mathrm{arb}\text{ 또는 }- & \text{set, element, function, matrix, index 등} & \text{전체 고정, free, bound, 최종 결과 등}
\end{array}
$$

예시 수식:

$$
y_i=
\boxed{
\sum_{j\in J_i}
\left[
a_{ij}
\right]
}
$$

기호 설명표:

$$
\begin{array}{c|c|c|c}
\text{기호} & \text{라벨} & \text{타입 / 설명} & \text{스코프 결과} \\
\hline
i & \mathrm{arb} & \text{index in } I & \text{free, 최종 } y_i \text{에 남음} \\
j & \mathrm{arb} & \text{index in } J_i & \text{bound, } \sum_{j\in J_i}[\cdots] \text{ 안에서만 유효} \\
a_{ij} & - & \text{indexed quantity} & \text{합 안에서 사용됨} \\
y_i & - & \text{output} & \text{최종 결과}
\end{array}
$$

---

## 그래프 작성 절차

복잡한 수식을 만나면 다음 순서로 쪼갠다.

### Step 1. 최종 결과를 찾는다

예:

$$
y_i=\sum_{j\in J_i}\alpha_{ij}f_\theta(x_i,z_j)
$$

최종 결과:

$$
y_i
$$

### Step 2. 스코프를 찾는다

예:

$$
\boxed{
\sum_{j\in J_i}
\left[
\alpha_{ij}f_\theta(x_i,z_j)
\right]
}
$$

### Step 3. 시작 기호에 fixed / arb 라벨을 붙인다

예:

$$
f\ \mathrm{[fixed]},
\quad
\theta\ \mathrm{[fixed]},
\quad
i\ \mathrm{[arb]},
\quad
j\ \mathrm{[arb]}
$$

### Step 4. 결정 엣지와 선택 엣지를 그린다

예:

$$
x,i \to x_i,
\quad
z,j \to z_j,
\quad
\alpha,i,j \to \alpha_{ij}
$$

예:

$$
\epsilon \dashrightarrow \delta
$$

### Step 5. chain 또는 DAG로 압축한다

예:

$$
x_i,z_j,f_\theta \to f_\theta(x_i,z_j)
$$

$$
\alpha_{ij},f_\theta(x_i,z_j)
\to
\alpha_{ij}f_\theta(x_i,z_j)
\to
\boxed{
\sum_{j\in J_i}[\cdots]
}
\to
y_i
$$

### Step 6. 그래프 아래에 기호 설명표를 붙인다

최종 출력 형식은 다음 순서로 둔다.

$$
\boxed{
\text{원수식}
\to
\text{스코프}
\to
\text{chain / DAG}
\to
\text{기호 설명표}
}
$$

---

## 예시 1: chain으로 보기 좋은 예

원수식:

$$
\forall \epsilon>0,\ \exists \delta>0,\ \forall x:\ 0<|x-a|<\delta\Longrightarrow |f(x)-L|<\epsilon
$$

스코프:

$$
\epsilon\text{은 바깥에서 시작}
$$

$$
\delta\text{는 }\epsilon\text{ 이후 선택}
$$

$$
x\text{는 조건부 영역 안에서 임의}
$$

chain 표현:

$$
\epsilon\ \mathrm{[arb]}
\dashrightarrow
\delta
\to
\boxed{0<|x-a|<\delta}
\to
x
\to
f(x)
\to
|f(x)-L|
\to
\bigl(|f(x)-L|<\epsilon\bigr)
$$

기호 설명표:

$$
\begin{array}{c|c|c|c}
\text{기호} & \text{라벨} & \text{타입 / 설명} & \text{스코프 결과} \\
\hline
\epsilon & \mathrm{arb} & \text{positive real number} & \text{그 뒤 명제 스코프에서 유효} \\
\delta & - & \text{positive real number} & \epsilon\text{ 이후 선택됨} \\
x & \mathrm{arb} & \text{element near } a & \text{조건 }0<|x-a|<\delta\text{ 안에서 유효} \\
f(x) & - & \text{function value} & x\text{가 정해지면 결정} \\
|f(x)-L|<\epsilon & - & \text{conclusion} & \text{최종 결론}
\end{array}
$$

---

## 예시 2: DAG로 보기 좋은 예

원수식:

$$
y_i=
\sum_{j\in J_i}
\alpha_{ij}f_\theta(x_i,z_j)
$$

스코프:

$$
\boxed{
\sum_{j\in J_i}
\left[
\alpha_{ij}f_\theta(x_i,z_j)
\right]
}
$$

DAG 표현:

$$
i \to J_i,
\quad
x,i \to x_i,
\quad
z,j \to z_j,
\quad
\alpha,i,j \to \alpha_{ij},
\quad
f,\theta \to f_\theta
$$

$$
x_i,z_j,f_\theta \to f_\theta(x_i,z_j)
$$

$$
\alpha_{ij},f_\theta(x_i,z_j)
\to
\alpha_{ij}f_\theta(x_i,z_j)
\to
\boxed{\sum_{j\in J_i}[\cdots]}
\to
y_i
$$

기호 설명표:

$$
\begin{array}{c|c|c|c}
\text{기호} & \text{라벨} & \text{타입 / 설명} & \text{스코프 결과} \\
\hline
i & \mathrm{arb} & \text{index in } I & \text{free, 최종 } y_i\text{에 남음} \\
j & \mathrm{arb} & \text{index in } J_i & \text{bound, 합의 스코프 안에서만 유효} \\
x_i & - & \text{indexed input} & i\text{가 정해지면 결정} \\
z_j & - & \text{indexed input} & j\text{가 정해지면 결정} \\
\theta & \mathrm{fixed} & \text{parameter} & \text{전체에서 고정} \\
\alpha_{ij} & - & \text{indexed weight} & i,j\text{가 정해지면 결정} \\
y_i & - & \text{output} & \text{최종 결과}
\end{array}
$$

---

## 의미 기반 엣지와 기호 변형의 분리

기본 템플릿은 표면 기호 의존성을 먼저 다룬다. 의미 기반 관계나 단순 기호 변형은 별도 층으로 분리한다.

예:

$$
h^{ab}
$$

는 표면 수준에서 다음처럼 본다.

$$
h,a,b,\uparrow \to h^{ab}
$$

예:

$$
h_{ab}
$$

는 표면 수준에서 다음처럼 본다.

$$
h,a,b,\downarrow \to h_{ab}
$$

다음 관계는 표면 기호 의존성이 아니라 의미 기반 관계다.

$$
h_{ab}\to h^{ab}
$$

---

## Markdown / LaTeX 작성 지침

LaTeX 수식은 백틱으로 감싸지 않는다.

올바른 방식:

$$
x_i
$$

$$
A\to B
$$

긴 수식과 그래프 표현은 block LaTeX으로 쓴다.

Markdown 표 안에 긴 LaTeX을 넣지 않는다. 긴 수식은 표 밖에 block LaTeX으로 따로 둔다.

---

## 최종 요약

$$
\boxed{
\text{실선 } A\to B = A\text{가 정해지면 }B\text{가 유일하게 정해짐}
}
$$

$$
\boxed{
\text{점선 } A\dashrightarrow B = A\text{를 보고 }B\text{를 조건에 맞게 선택}
}
$$

$$
\boxed{
\text{박스 } \boxed{\cdots} = \text{스코프}
}
$$

$$
\boxed{
\text{그래프 아래에는 기호 설명표 하나를 붙인다}
}
$$
