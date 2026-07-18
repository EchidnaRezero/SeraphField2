# 3. 수학적 구조 비교

## 목적

수학의 세부 분야 사이, 또는 물리, 통계, 머신러닝, 제어 등 서로 다른 도메인 사이에 공통의 수학 구조가 있는지를 비교한다.

비교의 기준은 표면적인 용어가 아니라 반복해서 나타나는 같은 수학적 형식이다.

---

## 예시 1. 변분원리의 공통 구조

### 비교표

$$
\begin{array}{c|ccccc}
& \text{상태공간} & \text{변분대상 공간} & \text{범함수} & \text{정류조건} & \text{산출대상} \\
\hline
\text{해석역학} & Q\ (\text{배위공간}) & \mathrm{Path}(Q) & S[q]=\int L\,dt & \delta S=0 & \text{오일러--라그랑주 방정식} \\
\text{통계역학} & X\ (\text{상태공간}) & \mathcal{P}(X) & \mathcal{F}[\rho]=\int E\,d\rho+T\int\log\frac{d\rho}{d\mu}\,d\rho & \delta\mathcal{F}=0 & \text{Gibbs 측도} \\
\text{유클리드 QFT} & \Phi\ (\text{장 배치 공간}) & \mathcal{P}(\Phi) & \mathcal{F}[\rho]=\int S_E\,d\rho+\hbar\int\log\frac{d\rho}{d\mu}\,d\rho & \delta\mathcal{F}=0 & \text{형식적 유클리드 경로측도}
\end{array}
$$

---

## 예시 2. Gibbs 구조의 동일성: 통계역학과 유클리드 경로적분

### 비교표

$$
\begin{array}{c|ccccc}
& \text{대상공간} & \text{실수값 함수} & \text{스케일 매개변수} & \text{기준측도} & \text{정규화 상수} \\
\hline
\text{통계역학} & x\in X & E:X\to\mathbb{R} & \beta & \mu & Z=\int_X e^{-\beta E}\,d\mu \\
\text{유클리드 QFT} & \phi\in\Phi & S_E:\Phi\to\mathbb{R} & 1/\hbar & \mathcal{D}\phi\ (\text{형식적}) & Z_E=\int e^{-S_E/\hbar}\,\mathcal{D}\phi
\end{array}
$$

### 주의

$\mathcal{D}\phi$는 일반적으로 유한차원 Lebesgue measure 같은 엄밀한 측도가 아니라 형식적 표기이므로, 엄밀화가 필요한 지점이다.

---

## 예시 3. Hessian 구조를 기준으로 본 공분산과 Fisher 계량

### 비교표

$$
\begin{array}{c|ccccc}
& \text{입력 대상} & \text{scalar potential} & \text{Hessian 변수} & \text{산출되는 2차 형식} & \text{작용 대상} \\
\hline
\text{Hessian 행렬}
& z\in U\subset\mathbb R^d
& F:U\to\mathbb R
& z
& H_F(z)=\nabla_z^2F(z)
& v,w\in T_zU \\
\text{공분산 행렬}
& X:\Omega\to\mathbb R^d
& K(s)=\log \mathbb E[e^{\langle s,X\rangle}]
& s\text{ at }s=0
& \nabla_s^2K(0)=\operatorname{Cov}(X)
& a,b\in (\mathbb R^d)^* \\
\text{Fisher 계량}
& \{p_\theta\}_{\theta\in\Theta}
& D_{\mathrm{KL}}(p_\theta\|p_{\theta'})
& \theta'\text{ at }\theta'=\theta
& g_\theta=\left.\nabla_{\theta'}^2D_{\mathrm{KL}}(p_\theta\|p_{\theta'})\right|_{\theta'=\theta}
& u,v\in T_\theta\Theta
\end{array}
$$

### Exponential family에서의 연결

Exponential family에서는 log-partition function이 공분산과 Fisher 계량을 같은 Hessian 구조로 연결한다.

$$
p_\theta(x)=\exp(\langle\theta,T(x)\rangle-A(\theta))
$$

$$
\nabla_\theta^2A(\theta)
=
\operatorname{Cov}_\theta(T(X))
=
g_\theta
$$

---

## 예시 4. 해밀턴 방정식, 해밀턴--야코비 방정식, 해밀턴--야코비--벨만 방정식

### 비교표

$$
\begin{array}{c|cccccc}
& \text{대상의 층위} & \text{상태공간} & \text{구하는 대상} & \text{해밀토니언형 항} & \text{방정식} & \text{해의 의미} \\
\hline
\text{해밀턴 방정식}
& \text{입자 궤적}
& T^*Q
& (q(t),p(t))
& H(q,p)
& \dot q=\partial_pH,\quad \dot p=-\partial_qH
& \text{위상공간의 적분곡선} \\
\text{해밀턴--야코비 방정식}
& \text{장}
& [0,T]\times Q
& S(t,q)
& H(q,\partial_qS)
& \partial_tS+H(q,\partial_qS)=0
& \text{작용함수 또는 생성함수} \\
\text{해밀턴--야코비--벨만 방정식}
& \text{제어입력이 들어간 장}
& [0,T]\times X
& V(t,x),\ u^*(t,x)\ \text{argmin 존재 시}
& \inf_{u\in U}\{\ell(x,u)+\langle\nabla V, f(x,u)\rangle\}
& \partial_tV+\inf_{u\in U}\{\ell(x,u)+\langle\nabla V, f(x,u)\rangle\}=0
& \text{가치함수와 최적정책}
\end{array}
$$
