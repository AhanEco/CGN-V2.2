# Currency Gravity Network (CGN) Framework
**Theory & Mathematical Proofs**

The Erosion of Dollar Hegemony is formalised via the inter-linkages between global trade networks, beliefs of state actors regarding transaction risk, and the macroeconomic structural gravity of trade. We articulate this through three theoretical pillars.

## Pillar 1: Monetary Triadic Closure (MTC)

**Definition**: Network structures are path-dependent. If Country $A$ trades with Country $B$ using Currency $X$, and Country $B$ trades with Country $C$ using Currency $X$, the probability of Country $A$ executing a trade with Country $C$ using Currency $X$ increases non-linearly.

Let $G(V, E)$ represent a directed weighted graph, where $V$ is the set of $N$ sovereign nodes (countries), and $E$ is the set of bilateral trade links.

Let $e_{ij}^X \in [0, 1]$ represent the normalized weight of trade between country $i$ and $j$ settled in currency $X$ (e.g., USD, RMB).

The pure unadjusted probability of transaction between $i$ and $k$ in currency $X$, defined by structural triadic closure, is given by the intermediate coupling parameter over all shared partners $j$:

$$ \mathcal{P}(e_{ik}^X > 0 | e_{ij}^X, e_{jk}^X) = 1 - \prod_{j \in \{V \setminus i, k\}} \left( 1 - \alpha (e_{ij}^X \cdot e_{jk}^X) \right) $$

where $\alpha \in [0,1]$ represents the transactional friction efficiency gain (the reduction in bilateral friction when adopting a common dominant intermediary currency).

## Pillar 2: DeGroot-Nash Belief Updating & Tipping Point ($\tau$)

**Definition**: The dominant currency survives not solely on macroeconomic fundamentals but on the *coordination of beliefs*. We model this via a non-Bayesian learning mechanism (DeGroot Learning) embedded in a generalized Nash equilibrium protocol.

Let $b_i(t) \in [0,1]$ be Country $i$'s belief at time $t$ in the structural safety and liquidity of Currency $X$ as a reserve asset.
Instead of rational expectations, governments update their beliefs dynamically based on the weighted average of their trading partners' beliefs:

$$ b_i(t+1) = \lambda m_i(t) + (1-\lambda) \sum_{j \neq i} W_{ij} b_j(t) $$

where:
*   $m_i(t)$ is the domestic macroeconomic fundamental signal (inflation targeting, FX reserves).
*   $W_{ij}$ is the trade dependency weight matrix, satisfying $\sum_j W_{ij} = 1$.
*   $\lambda \in [0,1]$ is the stubbornness or sovereignty coefficient.

As $G$ clusters under sanctions or geopolitical fracturing, belief formation splinters into sub-graphs. 
The **Tipping Point** $\tau \in [0,1]$ emerges strictly when the dominant eigenvalue of the opponent bloc's belief matrix $W_{B}$ satisfies:
$$ \rho(W_B) > \frac{\lambda}{1-\lambda} $$
At precisely this threshold $\tau$, cascading rapid defection away from Currency $X$ initiates, solving for the non-linear "erosion" effect.

## Pillar 3: Centrality-Adjusted Macroeconomic Gravity

**Definition**: Standard Krugman or Anderson-van Wincoop gravity models utilize GDP mass and bilateral distance. The CGN Framework appends a non-linear network centrality term derived from Pillars 1 & 2.

The baseline gravity model for predicting bilateral trade volume $T_{ij}$ is:

$$ T_{ij} = G_0 \frac{(Y_i)^{\beta_1} (Y_j)^{\beta_2}}{(D_{ij})^{\gamma}} $$

In the CGN Framework, we proxy the **reserve currency share** $S_{ij}^X$ of that bilateral volume as:

$$ S_{ij}^X = \Phi_0 \left( \underbrace{Y_i^{\beta_1} Y_j^{\beta_2} F_i^{\delta_1} F_j^{\delta_2}}_{\text{Fundamentals}} \right) \times \exp \left( \theta \cdot C_i^X \cdot C_j^X \right) $$

where:
*   $Y$ is GDP mass.
*   $F$ is Financial Depth (M2/GDP, bond market cap).
*   $C_i^X$ is the **Network Centrality** of country $i$ operating in the Currency $X$ subsystem (calculated via Graph Neural Networks incorporating MTC).
*   $\theta$ is the centrality elasticity of trade share.

Taking logs yields the empirical estimating equation to be tested via Python/LASSO/Panel Regression:

$$ \ln(S_{ij}^X) = \ln(\Phi_0) + \beta_1 \ln(Y_i) + \beta_2 \ln(Y_j) + \delta_1 \ln(F_i) + \delta_2 \ln(F_j) + \theta (C_i^X \cdot C_j^X) + \epsilon_{ij} $$

The theory asserts that $\theta > 0$ and is heavily significant. This proves that an erosion in Network Centrality $C$ drives rapid non-linear de-dollarization (driven by falling $b_i$ below $\tau$), severely outpacing standard GDP decay.
