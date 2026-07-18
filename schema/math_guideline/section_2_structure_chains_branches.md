# 2. 구조 부가 사슬 및 분기 추적

## 목적

구조가 부가될 때 대상의 클래스가 어떻게 좁혀지는지, 같은 출발점에서 조건에 따라 어디서 분기하는지를 추적한다.

## 작성 원칙

1. **화살표의 의미**

   화살표는 의존성 순서가 아니라, 수학적으로 증명할 수 있는 엄밀한 관계만을 나타낸다.

2. **관계 엣지의 분리**

   하나의 LaTeX 그림 안에는 한 종류의 관계 엣지만 사용한다.

   구조 추가 관계와 inclusion 관계가 둘 다 필요하면, 서로 다른 그림으로 나눈다. 즉, 하나의 그림에는 하나의 관계 엣지만 둔다.

3. **구조 추가 관계**

   구조나 조건을 추가하여 더 좁은 클래스로 내려가는 관계는 다음과 같이 나타낸다.

$$
\downarrow\ \text{(+ 조건)}
$$

4. **Inclusion 관계**

   더 좁은 클래스가 더 큰 클래스에 포함되는 관계는 다음 기호로 나타낸다.

$$
\hookrightarrow,
\qquad
\subset
$$

5. **부연 제한**

   그림에서 바로 읽히는 내용은 본문에서 반복하지 않는다.

   부연은 그래프 밖에서 반드시 따로 확인해야 하고, 그 조건을 잘못 두면 명제 자체가 틀어지는 경우에만 짧게 적는다.

---

## 예시 1. 집합에서 Hilbert space까지

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

---

## 예시 2. 확률과정에서 조건에 따른 분기

$$
\begin{array}{ccccccc}
& & \text{확률과정 }X & & \\[1ex]
& \swarrow & & \searrow & \\[1ex]
\begin{array}{l}
\text{(+ }X_0=0\text{, 독립 증분, 정상 증분, 확률연속성)} \\[1ex]
\text{레비 과정} \\[1ex]
\quad \downarrow\ \text{(+ 연속 경로)} \\[1ex]
\text{드리프트 있는 브라운 운동} \\[1ex]
\quad \downarrow\ \text{(+ 드리프트 }0\text{, 표준 공분산)} \\[1ex]
\text{위너 과정}
\end{array}
& & & &
\begin{array}{l}
\text{(+ 세미마팅게일 분해)} \\[1ex]
\text{세미마팅게일} \\[1ex]
\quad \downarrow\ \text{(+ 유계변동 부분 }A=0\text{)} \\[1ex]
\text{국소 마팅게일} \\[1ex]
\quad \downarrow\ \text{(+ }M_0=0\text{, 연속 경로, }\langle M\rangle_t=t\text{)} \\[1ex]
\text{위너 과정}
\end{array}
\end{array}
$$

---

## 예시 3. 함수공간의 inclusion 사슬

$$
C_c^\infty(\Omega)\subset H^1(\Omega)=W^{1,2}(\Omega)\subset L^2(\Omega).
$$

$\Omega\subset\mathbb{R}^d$가 open set이고, $|\Omega|<\infty$, $1\le p\le2$이면 다음 inclusion 사슬을 쓸 수 있다.

$$
C_c^\infty(\Omega)
\subset
H^1(\Omega)=W^{1,2}(\Omega)
\subset
W^{1,p}(\Omega)
\subset
L^p(\Omega).
$$
