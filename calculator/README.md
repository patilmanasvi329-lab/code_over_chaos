# ⚡ STARK INDUSTRIES // QUANTUM SCIENTIFIC CALCULATOR

An ultra-modern, high-precision Marvel-themed scientific calculator built with cybernetic Stark HUD aesthetics, procedural sound effects, speech synthesis, and an extensive suite of scientific math functions.

---

## 🚀 Quick Start

- **Option 1**: Double-click [`start_calculator.bat`](file:///c:/Users/Mangauri/OneDrive/Desktop/code_over_chaos/calculator/start_calculator.bat)
- **Option 2**: Open [`index.html`](file:///c:/Users/Mangauri/OneDrive/Desktop/code_over_chaos/calculator/index.html) directly in Google Chrome, Microsoft Edge, Brave, or Firefox.
- **Option 3**: Run a local HTTP server:
  ```powershell
  python -m http.server 8080
  ```
  and visit `http://localhost:8080` in your browser.

---

## 🦸‍♂️ Marvel Superhero Themes

Switch hero protocols dynamically using the top header selector:

1. **🔴 Iron Man (Mark 85)**:
   - Repulsor cyan glow, Stark crimson & gold armor, J.A.R.V.I.S. operating protocol.
   - Interactive spinning Arc Reactor that discharges energy pulses upon calculation.
2. **🟣 Wakanda (Black Panther)**:
   - Deep Vibranium purple, Shuri neural link, kinetic energy weave visuals.
3. **⚡ Thor (God of Thunder)**:
   - Asgardian lightning blue & Bifrost celestial gold, Stormbreaker resonance.
4. **💎 Thanos (Infinity Gauntlet)**:
   - Cosmic Titan armor with interactive glowing Infinity Stones (Space, Mind, Reality, Power, Time, Soul).
5. **⭐ Captain America (First Avenger)**:
   - Vibranium star silver, combat shield blue & crimson, tactical battle HUD.
6. **🕷️ Spider-Man (Iron Spider)**:
   - Nanotech spider crimson, cobalt web telemetry, Stark nanotech suit link.

---

## 🧮 Scientific Calculator Capabilities

### 1. Arithmetic & Expression Parsing
- **Operators**: `+`, `−`, `×`, `÷`, `%` (percentage), `mod` (modulo division), `^` (exponentiation).
- **Implicit Multiplication**: Supports intuitive expressions like `2π`, `5(3+4)`, `(2+3)(4+5)`, and `4sin(30)`.
- **Precedence & Brackets**: Strict Shunting-Yard algorithm adhering to correct algebraic precedence and nested parenthesis resolution `(`, `)`.
- **Live Output Preview**: Evaluates valid mathematical formulas continuously as you type before hitting `=`.

### 2. Trigonometry & Hyperbolic Functions
- **Angle Modes**: Toggle between **DEG** (Degrees) and **RAD** (Radians) with a single tap.
- **Direct Trig**: $\sin(x)$, $\cos(x)$, $\tan(x)$.
- **Inverse Trig (`2nd` Mode)**: $\sin^{-1}(x)$, $\cos^{-1}(x)$, $\tan^{-1}(x)$.
- **Hyperbolic Trig (`HYP` Mode)**: $\sinh(x)$, $\cosh(x)$, $\tanh(x)$, and inverse hyperbolic $\text{asinh}$, $\text{acosh}$, $\text{atanh}$.

### 3. Powers, Roots & Logarithms
- $x^y$, $x^2$, $x^3$, $e^x$, $10^x$.
- Square root $\sqrt{x}$, cube root $\sqrt[3]{x}$, $y$-th root $\sqrt[y]{x}$.
- Natural logarithm $\ln(x)$, common logarithm $\log_{10}(x)$, $\log_2(x)$.

### 4. Combinatorics, Probability & Number Theory
- Postfix Factorial $n!$ with Lanczos Gamma support.
- Permutations: $n\text{P}r$.
- Combinations: $n\text{C}r$.
- Absolute value: $|x|$.
- Reciprocal: $1/x$.
- Pseudo-random number generator: $\text{RND}$ ($0 \le x < 1$).
- Sign negation: $\pm$.

### 5. Universal Physical & Mathematical Constants
- $\pi$ ($3.14159265...$)
- $e$ ($2.71828182...$)
- $\phi$ (Golden Ratio: $1.618033...$)
- $c$ (Speed of light: $299,792,458\text{ m/s}$)
- $h$ (Planck's Quantum Constant: $6.62607015 \times 10^{-34}\text{ J}\cdot\text{s}$)
- $G$ (Gravitational Constant: $6.6743 \times 10^{-11}\text{ m}^3/(\text{kg}\cdot\text{s}^2)$)

### 6. Memory Operations
- `MC`: Memory Clear
- `MR`: Memory Recall
- `M+`: Add current value to memory
- `M-`: Subtract current value from memory
- `MS`: Store current value into memory
- Real-time `M: [val]` status badge on the HUD.

---

## 🔊 Audio & Futuristic SFX Engine

- **Procedural Web Audio API Synthesizer**: 100% self-contained synthesized sounds without relying on external `.mp3` or `.wav` files!
  - High-tech holographic button beeps.
  - Iron Man repulsor blast discharge sound effect on `= UNLEASH =`.
  - Arc Reactor power hum when tapping the central reactor.
  - Infinity Stone harmonic chime scale.
- **J.A.R.V.I.S. Voice Assistant**:
  - Optional toggle to enable browser speech synthesis (`window.speechSynthesis`).
  - Announces calculated results, hero protocol activation, and system diagnostics.

---

## 📜 Mission Archives (History Log) & ⚛️ Quantum Converter

- **Stark Mission Archives (`LOGS` button)**:
  - Records prior calculations with timestamp, formula, and result.
  - Click any archived calculation to restore it back into the calculator.
  - Copy all logs to clipboard or purge.
- **Stark Quantum Converter (`CONVERT` button)**:
  - Convert between units for **Energy** (Joules, Megajoules, kWh, Electronvolts, Arc Reactor Cores, Tons of TNT), **Velocity** (m/s, km/h, mph, Mach, Speed of Light $c$), **Length**, **Mass** (including Captain America's Vibranium shield weight), and **Temperature**.
  - One-click transfer of converted values directly into the main calculation input.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `0` - `9`, `.` | Insert digits and decimal point |
| `+`, `-`, `*`, `/`, `^`, `%` | Arithmetic operators |
| `(`, `)` | Parentheses |
| `Enter` or `=` | Calculate / Unleash repulsor |
| `Backspace` | Delete last character |
| `Escape` or `Delete` | All Clear (`AC`) |
| `s` | $\sin($ |
| `c` | $\cos($ |
| `t` | $\tan($ |
| `l` | $\log($ |
| `n` | $\ln($ |
| `p` | $\pi$ |
| `e` | $e$ |
