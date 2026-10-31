/**
 * ============================================================================
 * STARK INDUSTRIES // MARK-85 QUANTUM SCIENTIFIC CALCULATOR ENGINE
 * ============================================================================
 * Features:
 * - High-Precision Mathematical Parser (Shunting-Yard & AST Evaluator)
 * - Trigonometric, Hyperbolic, Logarithmic, Exponential, Permutation/Combination
 * - Web Audio API Procedural Sound Synthesizer (Zero external dependencies)
 * - J.A.R.V.I.S. Speech Synthesis Voice Feedback
 * - 6 Dynamic Marvel Hero Themes (Iron Man, Wakanda, Thor, Thanos, Cap, Spidey)
 * - Interactive Arc Reactor Quantum Core
 * - Mission History Logs & Stark Quantum Unit Converter
 * - Full Keyboard & Gesture Navigation
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const state = {
    expression: '',            // Full mathematical formula string
    displayValue: '0',        // Displayed text on screen
    lastAnswer: 0,            // ANS storage
    memory: 0,                // M memory storage
    angleMode: 'DEG',         // 'DEG' or 'RAD'
    is2ndActive: false,       // 2nd inverse functions
    isHypActive: false,       // Hyperbolic functions
    soundEnabled: true,       // Audio SFX toggle
    voiceEnabled: false,      // Speech synthesis toggle
    theme: 'ironman',         // Current active Marvel theme
    history: [],              // Mission logs
    isEvaluated: false        // Whether '=' was just pressed
  };

  // --------------------------------------------------------------------------
  // CONSTANTS & MARVEL METRICS
  // --------------------------------------------------------------------------
  const MATH_CONSTANTS = {
    pi: Math.PI,
    e: Math.E,
    phi: 1.618033988749895,
    c: 299792458,              // Speed of Light (m/s)
    h: 6.62607015e-34,         // Planck's Constant (J·s)
    G: 6.6743e-11              // Gravitational Constant (m³/kg·s²)
  };

  const THEME_DATA = {
    ironman: {
      name: 'STARK PROTOCOL',
      status: 'J.A.R.V.I.S. PROTOCOL : ONLINE',
      subtext: 'INDUSTRIES // OS MARK-85',
      greeting: 'Stark Industries Mark 85 online. Systems nominal, Mr. Stark.',
      tip: 'Repulsor core power at 100%. Ready for trajectory calculation.'
    },
    wakanda: {
      name: 'VIBRANIUM WEAVE',
      status: 'SHURI VIBRANIUM LINK : SECURE',
      subtext: 'KINGDOM OF WAKANDA // BAST OS',
      greeting: 'Wakanda Forever. Vibranium quantum lattice activated.',
      tip: 'Kinetic energy absorption active. Ready for nano-assembly computations.'
    },
    thor: {
      name: 'BIFROST THUNDER',
      status: 'ASGARDIAN BIFROST : STABLE',
      subtext: 'REALM OF ASGARD // STORMBREAKER',
      greeting: 'By Odin’s beard! Lightning calculation primed.',
      tip: 'Celestial thunder reserves charged. Cosmic harmonics aligned.'
    },
    thanos: {
      name: 'INFINITY GAUNTLET',
      status: 'INFINITY STONES : BALANCED',
      subtext: 'TITAN CORE // 6 COSMIC SINGULARITIES',
      greeting: 'I am inevitable. The six Infinity Stones are in balance.',
      tip: 'Reality can be whatever you calculate.'
    },
    captain: {
      name: 'FIRST AVENGER',
      status: 'STRATEGIC HOMELAND DEFENSE : READY',
      subtext: 'SHIELD TECH // VIBRANIUM ALLOY',
      greeting: 'Captain on deck. Tactical battlefield math ready.',
      tip: 'I can calculate this all day.'
    },
    spiderman: {
      name: 'IRON SPIDER',
      status: 'PETER PARKER NANO-TECH : LINKED',
      subtext: 'QUEENS TECH LABS // STARK SUIT',
      greeting: 'Hey Mr. Stark! Spider-Sense telemetry calibrated.',
      tip: 'With great power comes great calculation precision.'
    }
  };

  // --------------------------------------------------------------------------
  // DOM ELEMENT SELECTORS
  // --------------------------------------------------------------------------
  const elements = {
    body: document.body,
    expressionDisplay: document.getElementById('expressionDisplay'),
    mainDisplay: document.getElementById('mainDisplay'),
    livePreview: document.getElementById('livePreview'),
    previewValue: document.getElementById('previewValue'),
    badgeAngle: document.getElementById('badgeAngle'),
    badge2nd: document.getElementById('badge2nd'),
    badgeHyp: document.getElementById('badgeHyp'),
    badgeMem: document.getElementById('badgeMem'),
    coreEnergyText: document.getElementById('coreEnergyText'),
    systemStatusText: document.getElementById('systemStatusText'),
    hudSubtext: document.getElementById('hudSubtext'),
    themeActiveBadge: document.getElementById('themeActiveBadge'),
    formulaTip: document.getElementById('formulaTip'),
    arcReactor: document.getElementById('arcReactor'),
    themeSelect: document.getElementById('themeSelect'),
    btnSound: document.getElementById('btnSound'),
    soundIcon: document.getElementById('soundIcon'),
    btnVoice: document.getElementById('btnVoice'),
    btnConverter: document.getElementById('btnConverter'),
    btnHistory: document.getElementById('btnHistory'),
    btnToggleAngle: document.getElementById('btnToggleAngle'),
    btnToggle2nd: document.getElementById('btnToggle2nd'),
    btnToggleHyp: document.getElementById('btnToggleHyp'),
    btnMemoryClear: document.getElementById('btnMemoryClear'),
    btnMemoryRecall: document.getElementById('btnMemoryRecall'),
    btnMemoryAdd: document.getElementById('btnMemoryAdd'),
    btnMemorySub: document.getElementById('btnMemorySub'),
    btnMemoryStore: document.getElementById('btnMemoryStore'),
    btnEquals: document.getElementById('btnEquals'),
    historyDrawer: document.getElementById('historyDrawer'),
    btnCloseHistory: document.getElementById('btnCloseHistory'),
    historyList: document.getElementById('historyList'),
    btnClearHistory: document.getElementById('btnClearHistory'),
    btnCopyHistory: document.getElementById('btnCopyHistory'),
    converterModal: document.getElementById('converterModal'),
    btnCloseConverter: document.getElementById('btnCloseConverter'),
    convertFromVal: document.getElementById('convertFromVal'),
    convertToVal: document.getElementById('convertToVal'),
    convertFromUnit: document.getElementById('convertFromUnit'),
    convertToUnit: document.getElementById('convertToUnit'),
    btnTransferToCalc: document.getElementById('btnTransferToCalc'),
    infinityStonesRibbon: document.getElementById('infinityStonesRibbon'),
    // Dynamic 2nd/HYP function buttons
    fnSin: document.getElementById('fnSin'),
    fnCos: document.getElementById('fnCos'),
    fnTan: document.getElementById('fnTan'),
    fnPow: document.getElementById('fnPow'),
    fnLn: document.getElementById('fnLn'),
    fnLog: document.getElementById('fnLog'),
    fnSqrt: document.getElementById('fnSqrt'),
    fnCbrt: document.getElementById('fnCbrt'),
    fnPerm: document.getElementById('fnPerm')
  };

  // --------------------------------------------------------------------------
  // WEB AUDIO API SYNTHESIZER (ZERO EXTERNAL ASSETS NEEDED)
  // --------------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const SoundFX = {
    // Holographic Button Beep
    click(freq = 800, duration = 0.04) {
      if (!state.soundEnabled) return;
      initAudio();
      if (!audioCtx) return;

      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + duration);

        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // Audio error fallback
      }
    },

    // Operator Tone
    operator() {
      SoundFX.click(1200, 0.06);
    },

    // Function Tone
    func() {
      SoundFX.click(1600, 0.07);
    },

    // Arc Reactor / Repulsor Unleash Blast on '='
    repulsorBlast() {
      if (!state.soundEnabled) return;
      initAudio();
      if (!audioCtx) return;

      try {
        const now = audioCtx.currentTime;

        // Low Sub-Bass Oscillator
        const oscSub = audioCtx.createOscillator();
        const gainSub = audioCtx.createGain();
        oscSub.type = 'sawtooth';
        oscSub.frequency.setValueAtTime(150, now);
        oscSub.frequency.exponentialRampToValueAtTime(45, now + 0.35);

        gainSub.gain.setValueAtTime(0.15, now);
        gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        oscSub.connect(gainSub);
        gainSub.connect(audioCtx.destination);
        oscSub.start(now);
        oscSub.stop(now + 0.35);

        // High Laser Swell
        const oscLaser = audioCtx.createOscillator();
        const gainLaser = audioCtx.createGain();
        oscLaser.type = 'sine';
        oscLaser.frequency.setValueAtTime(400, now);
        oscLaser.frequency.exponentialRampToValueAtTime(2400, now + 0.12);
        oscLaser.frequency.exponentialRampToValueAtTime(800, now + 0.3);

        gainLaser.gain.setValueAtTime(0.12, now);
        gainLaser.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        oscLaser.connect(gainLaser);
        gainLaser.connect(audioCtx.destination);
        oscLaser.start(now);
        oscLaser.stop(now + 0.3);
      } catch (e) {}
    },

    // Arc Reactor Pulse Click
    arcPulse() {
      if (!state.soundEnabled) return;
      initAudio();
      if (!audioCtx) return;

      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.18);
        osc.frequency.linearRampToValueAtTime(440, now + 0.4);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } catch (e) {}
    },

    // Reset / Purge Sound
    purge() {
      if (!state.soundEnabled) return;
      initAudio();
      if (!audioCtx) return;

      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch (e) {}
    },

    // Infinity Stone Chime
    stoneChime(pitch = 523.25) {
      if (!state.soundEnabled) return;
      initAudio();
      if (!audioCtx) return;

      try {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(pitch * 2, now + 0.3);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } catch (e) {}
    }
  };

  // --------------------------------------------------------------------------
  // J.A.R.V.I.S. VOICE ASSISTANT (SPEECH SYNTHESIS)
  // --------------------------------------------------------------------------
  function speak(text) {
    if (!state.voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      
      // Attempt to pick a smooth robotic/English voice if available
      const voices = window.speechSynthesis.getVoices();
      const ukOrUsVoice = voices.find(v => v.lang.startsWith('en-GB') || v.lang.startsWith('en-US'));
      if (ukOrUsVoice) {
        utterance.voice = ukOrUsVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // MATHEMATICAL FUNCTIONS & HELPERS
  // --------------------------------------------------------------------------
  // Factorial with memoization & gamma fallback
  function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // JS Number overflow
    if (Math.floor(n) === n) {
      let res = 1;
      for (let i = 2; i <= n; i++) res *= i;
      return res;
    }
    // Lanczos Gamma function approximation for non-integers
    return gammaLanczos(n + 1);
  }

  function gammaLanczos(z) {
    const p = [
      676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059,
      12.507343278686905, -0.13857109585620513,
      9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z));
    z -= 1;
    let x = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }

  // Permutations nPr = n! / (n - r)!
  function permutation(n, r) {
    if (r < 0 || r > n) return 0;
    return factorial(n) / factorial(n - r);
  }

  // Combinations nCr = n! / (r! * (n - r)!)
  function combination(n, r) {
    if (r < 0 || r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
  }

  // Angle conversions
  function toRadians(val) {
    return state.angleMode === 'DEG' ? (val * Math.PI) / 180 : val;
  }

  function fromRadians(val) {
    return state.angleMode === 'DEG' ? (val * 180) / Math.PI : val;
  }

  // Clean floating point imprecision (e.g. 0.1 + 0.2, sin(180) -> 0)
  function cleanFloat(num) {
    if (isNaN(num)) return NaN;
    if (!isFinite(num)) return num;

    // Zero out tiny floating artifacts near zero
    if (Math.abs(num) < 1e-14) return 0;

    // Use toPrecision to round rounding errors
    const str = num.toPrecision(14);
    const parsed = parseFloat(str);

    // Format if scientific notation is needed
    if (Math.abs(parsed) >= 1e15 || (Math.abs(parsed) > 0 && Math.abs(parsed) < 1e-6)) {
      return parsed.toExponential(8).replace(/\.?0+e/, 'e');
    }
    return parsed;
  }

  // Format large numbers for display
  function formatForDisplay(num) {
    if (isNaN(num)) return 'ERROR: INVALID SYNTAX';
    if (!isFinite(num)) return num > 0 ? 'INFINITY' : '-INFINITY';
    const cleaned = cleanFloat(num);
    return cleaned.toString();
  }

  // --------------------------------------------------------------------------
  // ROBUST MATHEMATICAL EVALUATOR (TOKENIZER + SHUNTING-YARD ALGORITHM)
  // --------------------------------------------------------------------------
  /**
   * Tokenizes an expression string into structured mathematical tokens.
   * Handles:
   * - Numbers (including scientific notation e.g. 1.2e5, .5, 42)
   * - Operators (+, -, *, /, ^, %, mod, nPr, nCr, !)
   * - Parentheses ( )
   * - Functions (sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, ln, log, sqrt, cbrt, abs, rand)
   * - Constants (pi, e, c, h, G, phi, ANS)
   * - Implicit multiplication (e.g. 2pi, 5(3+2), (1+2)(3+4), 4sin(30))
   */
  function tokenize(rawExpr) {
    let str = rawExpr.replace(/\s+/g, '');
    
    // Replace visual symbols with standard tokens
    str = str.replace(/×/g, '*')
             .replace(/÷/g, '/')
             .replace(/−/g, '-')
             .replace(/π/g, 'pi')
             .replace(/ϕ/g, 'phi');

    const tokens = [];
    let i = 0;

    while (i < str.length) {
      const char = str[i];

      // 1. Numbers (integers, decimals, and scientific 'E' notation)
      if (/[0-9.]/.test(char)) {
        let numStr = '';
        while (i < str.length && /[0-9.]/.test(str[i])) {
          numStr += str[i];
          i++;
        }
        // Handle scientific E notation if part of number e.g. 1.5E6
        if (i < str.length && (str[i] === 'E' || str[i] === 'e') && (i + 1 < str.length) && /[0-9+-]/.test(str[i + 1])) {
          numStr += 'e';
          i++;
          if (str[i] === '+' || str[i] === '-') {
            numStr += str[i];
            i++;
          }
          while (i < str.length && /[0-9]/.test(str[i])) {
            numStr += str[i];
            i++;
          }
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
        continue;
      }

      // 2. Multi-letter Words (Functions, Operators like mod/nPr/nCr, Constants)
      if (/[a-zA-Z]/.test(char)) {
        let word = '';
        while (i < str.length && /[a-zA-Z0-9]/.test(str[i])) {
          word += str[i];
          i++;
        }
        
        const lower = word.toLowerCase();
        if (['mod', 'npr', 'ncr'].includes(lower)) {
          tokens.push({ type: 'OPERATOR', value: lower });
        } else if (['pi', 'e', 'c', 'h', 'g', 'phi', 'ans'].includes(lower)) {
          tokens.push({ type: 'CONSTANT', value: lower });
        } else {
          tokens.push({ type: 'FUNCTION', value: lower });
        }
        continue;
      }

      // 3. Operators and Parentheses
      if ('+-*/^%()!'.includes(char)) {
        if (char === '(') {
          tokens.push({ type: 'LPAREN', value: '(' });
        } else if (char === ')') {
          tokens.push({ type: 'RPAREN', value: ')' });
        } else if (char === '!') {
          tokens.push({ type: 'POSTFIX_OP', value: '!' });
        } else {
          tokens.push({ type: 'OPERATOR', value: char });
        }
        i++;
        continue;
      }

      // Skip unknown character
      i++;
    }

    // Insert implicit multiplications:
    // e.g., 2pi -> 2 * pi, (2)(3) -> (2) * (3), 3sin(x) -> 3 * sin(x)
    const refined = [];
    for (let k = 0; k < tokens.length; k++) {
      const cur = tokens[k];
      const prev = tokens[k - 1];

      if (prev) {
        const prevCanMultiply = 
          prev.type === 'NUMBER' || 
          prev.type === 'CONSTANT' || 
          prev.type === 'RPAREN' || 
          prev.type === 'POSTFIX_OP';

        const curNeedsMultiply = 
          cur.type === 'NUMBER' || 
          cur.type === 'CONSTANT' || 
          cur.type === 'FUNCTION' || 
          cur.type === 'LPAREN';

        if (prevCanMultiply && curNeedsMultiply) {
          // Unary minus/plus check: don't multiply before an explicit operator
          refined.push({ type: 'OPERATOR', value: '*' });
        }
      }
      refined.push(cur);
    }

    return refined;
  }

  /**
   * Shunting-Yard Parser converting Tokens into Reverse Polish Notation (RPN),
   * correctly resolving operator precedence and unary minus/plus.
   */
  function parseToRPN(tokens) {
    const outputQueue = [];
    const opStack = [];

    const PRECEDENCE = {
      '+': 2, '-': 2,
      '*': 3, '/': 3, '%': 3, 'mod': 3,
      '^': 4, 'npr': 4, 'ncr': 4,
      'UNARY_MINUS': 5, 'UNARY_PLUS': 5
    };

    const RIGHT_ASSOCIATIVE = {
      '^': true,
      'UNARY_MINUS': true,
      'UNARY_PLUS': true
    };

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'NUMBER') {
        outputQueue.push(token);
      } else if (token.type === 'CONSTANT') {
        outputQueue.push(token);
      } else if (token.type === 'FUNCTION') {
        opStack.push(token);
      } else if (token.type === 'POSTFIX_OP') {
        outputQueue.push(token);
      } else if (token.type === 'OPERATOR') {
        let op = token.value;

        // Determine if unary + or -
        const prev = tokens[i - 1];
        const isUnary = (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN');
        if (isUnary) {
          if (op === '-') op = 'UNARY_MINUS';
          else if (op === '+') op = 'UNARY_PLUS';
        }

        while (
          opStack.length > 0 &&
          opStack[opStack.length - 1].type !== 'LPAREN' &&
          (
            opStack[opStack.length - 1].type === 'FUNCTION' ||
            PRECEDENCE[opStack[opStack.length - 1].value] > PRECEDENCE[op] ||
            (
              PRECEDENCE[opStack[opStack.length - 1].value] === PRECEDENCE[op] &&
              !RIGHT_ASSOCIATIVE[op]
            )
          )
        ) {
          outputQueue.push(opStack.pop());
        }
        opStack.push({ type: 'OPERATOR', value: op });
      } else if (token.type === 'LPAREN') {
        opStack.push(token);
      } else if (token.type === 'RPAREN') {
        while (opStack.length > 0 && opStack[opStack.length - 1].type !== 'LPAREN') {
          outputQueue.push(opStack.pop());
        }
        if (opStack.length > 0 && opStack[opStack.length - 1].type === 'LPAREN') {
          opStack.pop(); // Remove '('
        }
        // If top of stack is now a function, pop it to output
        if (opStack.length > 0 && opStack[opStack.length - 1].type === 'FUNCTION') {
          outputQueue.push(opStack.pop());
        }
      }
    }

    // Drain remaining operators (auto-closing any dangling parens)
    while (opStack.length > 0) {
      const top = opStack.pop();
      if (top.type !== 'LPAREN') {
        outputQueue.push(top);
      }
    }

    return outputQueue;
  }

  /**
   * Evaluates the Reverse Polish Notation (RPN) queue to a single scalar value.
   */
  function evaluateRPN(rpnQueue) {
    const stack = [];

    function popVal() {
      if (stack.length === 0) throw new Error('Missing operand');
      return stack.pop();
    }

    for (const token of rpnQueue) {
      if (token.type === 'NUMBER') {
        stack.push(token.value);
      } else if (token.type === 'CONSTANT') {
        const c = token.value.toLowerCase();
        if (c === 'ans') {
          stack.push(state.lastAnswer);
        } else if (MATH_CONSTANTS[c] !== undefined) {
          stack.push(MATH_CONSTANTS[c]);
        } else {
          throw new Error('Unknown constant: ' + c);
        }
      } else if (token.type === 'POSTFIX_OP') {
        if (token.value === '!') {
          const val = popVal();
          stack.push(factorial(val));
        }
      } else if (token.type === 'FUNCTION') {
        const fn = token.value.toLowerCase();
        const arg = popVal();

        switch (fn) {
          case 'sin':
            stack.push(Math.sin(toRadians(arg)));
            break;
          case 'cos':
            stack.push(Math.cos(toRadians(arg)));
            break;
          case 'tan': {
            const rad = toRadians(arg);
            // Handle undefined tan(90 deg)
            if (state.angleMode === 'DEG' && (Math.abs(arg % 180) === 90)) {
              throw new Error('Undefined');
            }
            stack.push(Math.tan(rad));
            break;
          }
          case 'asin': {
            if (arg < -1 || arg > 1) throw new Error('Domain Error');
            stack.push(fromRadians(Math.asin(arg)));
            break;
          }
          case 'acos': {
            if (arg < -1 || arg > 1) throw new Error('Domain Error');
            stack.push(fromRadians(Math.acos(arg)));
            break;
          }
          case 'atan':
            stack.push(fromRadians(Math.atan(arg)));
            break;
          case 'sinh':
            stack.push(Math.sinh(arg));
            break;
          case 'cosh':
            stack.push(Math.cosh(arg));
            break;
          case 'tanh':
            stack.push(Math.tanh(arg));
            break;
          case 'asinh':
            stack.push(Math.asinh(arg));
            break;
          case 'acosh':
            if (arg < 1) throw new Error('Domain Error');
            stack.push(Math.acosh(arg));
            break;
          case 'atanh':
            if (arg <= -1 || arg >= 1) throw new Error('Domain Error');
            stack.push(Math.atanh(arg));
            break;
          case 'ln':
            if (arg <= 0) throw new Error('Domain Error');
            stack.push(Math.log(arg));
            break;
          case 'log':
            if (arg <= 0) throw new Error('Domain Error');
            stack.push(Math.log10(arg));
            break;
          case 'log2':
            if (arg <= 0) throw new Error('Domain Error');
            stack.push(Math.log2(arg));
            break;
          case 'exp':
            stack.push(Math.exp(arg));
            break;
          case 'pow10':
            stack.push(Math.pow(10, arg));
            break;
          case 'sqrt':
            if (arg < 0) throw new Error('Domain Error');
            stack.push(Math.sqrt(arg));
            break;
          case 'cbrt':
            stack.push(Math.cbrt(arg));
            break;
          case 'sqr':
            stack.push(Math.pow(arg, 2));
            break;
          case 'cube':
            stack.push(Math.pow(arg, 3));
            break;
          case 'inv':
            if (arg === 0) throw new Error('Division by zero');
            stack.push(1 / arg);
            break;
          case 'abs':
            stack.push(Math.abs(arg));
            break;
          case 'rand':
            stack.push(Math.random());
            break;
          default:
            throw new Error('Unknown function: ' + fn);
        }
      } else if (token.type === 'OPERATOR') {
        const op = token.value;

        if (op === 'UNARY_MINUS') {
          const val = popVal();
          stack.push(-val);
        } else if (op === 'UNARY_PLUS') {
          const val = popVal();
          stack.push(+val);
        } else {
          const b = popVal();
          const a = popVal();

          switch (op) {
            case '+':
              stack.push(a + b);
              break;
            case '-':
              stack.push(a - b);
              break;
            case '*':
              stack.push(a * b);
              break;
            case '/':
              if (b === 0) throw new Error('Division by zero');
              stack.push(a / b);
              break;
            case '%':
              stack.push(a * (b / 100));
              break;
            case 'mod':
              stack.push(a % b);
              break;
            case '^':
              stack.push(Math.pow(a, b));
              break;
            case 'npr':
              stack.push(permutation(a, b));
              break;
            case 'ncr':
              stack.push(combination(a, b));
              break;
            default:
              throw new Error('Unknown operator: ' + op);
          }
        }
      }
    }

    if (stack.length !== 1) throw new Error('Syntax error');
    return stack[0];
  }

  /**
   * Top-level calculation wrapper.
   */
  function calculateExpression(exprStr) {
    if (!exprStr || exprStr.trim() === '') return 0;
    const tokens = tokenize(exprStr);
    const rpn = parseToRPN(tokens);
    return evaluateRPN(rpn);
  }

  // --------------------------------------------------------------------------
  // USER INPUT & UI INTERACTIONS
  // --------------------------------------------------------------------------
  function updateDisplays() {
    elements.expressionDisplay.textContent = state.expression;
    elements.mainDisplay.textContent = state.displayValue;

    // Mode badges
    elements.badgeAngle.textContent = state.angleMode;
    elements.badgeAngle.classList.add('active');

    elements.badge2nd.classList.toggle('active', state.is2ndActive);
    elements.badgeHyp.classList.toggle('active', state.isHypActive);
    elements.badgeMem.textContent = `M: ${cleanFloat(state.memory)}`;
    elements.badgeMem.classList.toggle('active', state.memory !== 0);

    // Compute live preview in background without throwing errors
    try {
      if (state.expression && !state.isEvaluated) {
        const val = calculateExpression(state.expression);
        if (!isNaN(val) && isFinite(val)) {
          elements.previewValue.textContent = formatForDisplay(val);
          elements.livePreview.style.opacity = '1';
        } else {
          elements.livePreview.style.opacity = '0.4';
        }
      } else {
        elements.livePreview.style.opacity = '0.4';
      }
    } catch (e) {
      elements.livePreview.style.opacity = '0.3';
    }
  }

  function insertDigit(digit) {
    SoundFX.click(650, 0.04);
    if (state.isEvaluated) {
      state.expression = '';
      state.displayValue = '';
      state.isEvaluated = false;
    }

    if (state.displayValue === '0' && digit !== '.') {
      state.displayValue = digit;
      state.expression = state.expression.slice(0, -1) + digit;
    } else {
      // Don't allow multiple dots in current number
      if (digit === '.') {
        const parts = state.expression.split(/[+\-*/^%() ]/);
        const currentPart = parts[parts.length - 1];
        if (currentPart.includes('.')) return;
      }
      state.displayValue += digit;
      state.expression += digit;
    }
    updateDisplays();
  }

  function insertOperator(op) {
    SoundFX.operator();
    if (state.isEvaluated) {
      state.isEvaluated = false;
    }

    if (state.expression === '' && op === '-') {
      // Unary negative at start
      state.expression = '-';
      state.displayValue = '-';
      updateDisplays();
      return;
    }

    // Mapping for readable operators
    let symbol = op;
    if (op === '*') symbol = ' × ';
    else if (op === '/') symbol = ' ÷ ';
    else if (op === '+') symbol = ' + ';
    else if (op === '-') symbol = ' − ';
    else if (op === 'mod') symbol = ' mod ';
    else if (op === '^') symbol = '^';
    else if (op === 'nPr') symbol = ' nPr ';
    else if (op === 'nCr') symbol = ' nCr ';

    state.expression += symbol;
    state.displayValue = '';
    updateDisplays();
  }

  function insertFunction(fnName) {
    SoundFX.func();
    if (state.isEvaluated) {
      state.expression = '';
      state.displayValue = '';
      state.isEvaluated = false;
    }

    let actualFn = fnName;

    // Check dynamic 2nd and HYP states
    if (fnName === 'sin') {
      if (state.isHypActive && state.is2ndActive) actualFn = 'asinh';
      else if (state.isHypActive) actualFn = 'sinh';
      else if (state.is2ndActive) actualFn = 'asin';
    } else if (fnName === 'cos') {
      if (state.isHypActive && state.is2ndActive) actualFn = 'acosh';
      else if (state.isHypActive) actualFn = 'cosh';
      else if (state.is2ndActive) actualFn = 'acos';
    } else if (fnName === 'tan') {
      if (state.isHypActive && state.is2ndActive) actualFn = 'atanh';
      else if (state.isHypActive) actualFn = 'tanh';
      else if (state.is2ndActive) actualFn = 'atan';
    } else if (fnName === 'ln') {
      if (state.is2ndActive) actualFn = 'exp';
    } else if (fnName === 'log') {
      if (state.is2ndActive) actualFn = 'pow10';
    } else if (fnName === 'sqrt') {
      if (state.is2ndActive) actualFn = 'sqr';
    } else if (fnName === 'cbrt') {
      if (state.is2ndActive) actualFn = 'cube';
    }

    if (actualFn === 'rand') {
      const r = Math.random();
      state.expression += cleanFloat(r);
      state.displayValue = cleanFloat(r).toString();
    } else {
      state.expression += `${actualFn}(`;
      state.displayValue = '';
    }
    updateDisplays();
  }

  function insertConstant(constName) {
    SoundFX.func();
    if (state.isEvaluated) {
      state.expression = '';
      state.displayValue = '';
      state.isEvaluated = false;
    }
    state.expression += constName;
    state.displayValue = constName;
    updateDisplays();
  }

  function insertSymbol(sym) {
    SoundFX.click(900, 0.05);
    if (state.isEvaluated) {
      if (sym === '(') state.expression = '';
      state.isEvaluated = false;
    }
    state.expression += sym;
    state.displayValue += sym;
    updateDisplays();
  }

  function insertAns() {
    SoundFX.func();
    if (state.isEvaluated) {
      state.expression = '';
      state.isEvaluated = false;
    }
    state.expression += 'ANS';
    state.displayValue = 'ANS';
    updateDisplays();
  }

  function clearAll() {
    SoundFX.purge();
    state.expression = '';
    state.displayValue = '0';
    state.isEvaluated = false;
    updateDisplays();
  }

  function backspace() {
    SoundFX.click(500, 0.04);
    if (state.isEvaluated) {
      clearAll();
      return;
    }
    if (state.expression.length > 0) {
      state.expression = state.expression.trimEnd();
      // Remove last token or character
      state.expression = state.expression.slice(0, -1);
      state.displayValue = state.displayValue.slice(0, -1);
      if (state.expression === '') {
        state.displayValue = '0';
      }
      updateDisplays();
    }
  }

  function toggleNegate() {
    SoundFX.click(750, 0.04);
    if (state.expression === '' || state.expression === '0') {
      state.expression = '-';
      state.displayValue = '-';
    } else {
      state.expression = `-(${state.expression})`;
      state.displayValue = state.expression;
    }
    updateDisplays();
  }

  // Execute Main Equals Calculation
  function computeResult() {
    if (!state.expression || state.expression.trim() === '') return;

    SoundFX.repulsorBlast();
    triggerArcReactorDischarge();

    const eqCopy = state.expression;

    try {
      const res = calculateExpression(state.expression);
      if (isNaN(res)) throw new Error('Invalid Computation');

      const formatted = formatForDisplay(res);
      state.lastAnswer = res;
      state.displayValue = formatted;
      state.isEvaluated = true;

      // Visual flash animation
      elements.mainDisplay.classList.remove('flash');
      void elements.mainDisplay.offsetWidth; // Trigger reflow
      elements.mainDisplay.classList.add('flash');

      // Add to mission logs history
      addHistoryRecord(eqCopy, formatted);

      // Voice readout if enabled
      if (state.voiceEnabled) {
        speak(`Calculated. Answer is ${formatted}`);
      }

      updateDisplays();
    } catch (err) {
      state.displayValue = 'ERROR: ' + (err.message || 'SYNTAX');
      elements.mainDisplay.classList.add('flash');
      SoundFX.purge();
      if (state.voiceEnabled) {
        speak('Warning. Calculation error detected.');
      }
      updateDisplays();
    }
  }

  // --------------------------------------------------------------------------
  // ARC REACTOR INTERACTION
  // --------------------------------------------------------------------------
  function triggerArcReactorDischarge() {
    elements.arcReactor.classList.remove('reactor-discharge');
    void elements.arcReactor.offsetWidth;
    elements.arcReactor.classList.add('reactor-discharge');
  }

  elements.arcReactor.addEventListener('click', () => {
    SoundFX.arcPulse();
    triggerArcReactorDischarge();
    elements.coreEnergyText.textContent = 'OVERLOAD: 120%';
    setTimeout(() => {
      elements.coreEnergyText.textContent = 'ENERGY: 100%';
    }, 1200);
    if (state.voiceEnabled) {
      speak('Arc reactor output at maximum capacity.');
    }
  });

  // --------------------------------------------------------------------------
  // THEME MANAGEMENT (MARVEL PROTOCOLS)
  // --------------------------------------------------------------------------
  function setTheme(themeId) {
    if (!THEME_DATA[themeId]) return;
    state.theme = themeId;
    elements.body.setAttribute('data-theme', themeId);
    elements.themeSelect.value = themeId;

    const data = THEME_DATA[themeId];
    elements.hudSubtext.textContent = data.subtext;
    elements.systemStatusText.textContent = data.status;
    elements.themeActiveBadge.textContent = data.name;
    elements.formulaTip.textContent = data.tip;

    SoundFX.func();

    if (state.voiceEnabled) {
      speak(data.greeting);
    }

    try {
      localStorage.setItem('stark_calc_theme', themeId);
    } catch (e) {}
  }

  elements.themeSelect.addEventListener('change', (e) => {
    setTheme(e.target.value);
  });

  // Infinity Stones click interactions (Thanos & cosmic powers)
  elements.infinityStonesRibbon.querySelectorAll('.stone-item').forEach((stone, idx) => {
    const freqs = [440, 493.88, 554.37, 587.33, 659.25, 739.99]; // Harmonic scale
    stone.addEventListener('click', () => {
      SoundFX.stoneChime(freqs[idx % freqs.length]);
      stone.classList.add('active');
      setTimeout(() => stone.classList.remove('active'), 800);
      const name = stone.getAttribute('data-stone');
      if (state.voiceEnabled) {
        speak(`${name} Stone harnessed.`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // MODE TOGGLES (DEG/RAD, 2nd, HYP, MEMORY)
  // --------------------------------------------------------------------------
  elements.btnToggleAngle.addEventListener('click', () => {
    SoundFX.click(900, 0.05);
    state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
    elements.btnToggleAngle.textContent = state.angleMode;
    elements.badgeAngle.textContent = state.angleMode;
    updateDisplays();
  });

  function updateDynamicButtonLabels() {
    elements.btnToggle2nd.classList.toggle('active', state.is2ndActive);
    elements.btnToggleHyp.classList.toggle('active', state.isHypActive);

    // Update button text for 2nd and HYP combinations
    if (state.isHypActive && state.is2ndActive) {
      elements.fnSin.textContent = 'asinh';
      elements.fnCos.textContent = 'acosh';
      elements.fnTan.textContent = 'atanh';
    } else if (state.isHypActive) {
      elements.fnSin.textContent = 'sinh';
      elements.fnCos.textContent = 'cosh';
      elements.fnTan.textContent = 'tanh';
    } else if (state.is2ndActive) {
      elements.fnSin.textContent = 'sin⁻¹';
      elements.fnCos.textContent = 'cos⁻¹';
      elements.fnTan.textContent = 'tan⁻¹';
    } else {
      elements.fnSin.textContent = 'sin';
      elements.fnCos.textContent = 'cos';
      elements.fnTan.textContent = 'tan';
    }

    if (state.is2ndActive) {
      elements.fnPow.textContent = 'ʸ√x';
      elements.fnLn.textContent = 'eˣ';
      elements.fnLog.textContent = '10ˣ';
      elements.fnSqrt.textContent = 'x²';
      elements.fnCbrt.textContent = 'x³';
      elements.fnPerm.textContent = 'nCr';
    } else {
      elements.fnPow.textContent = 'xʸ';
      elements.fnLn.textContent = 'ln';
      elements.fnLog.textContent = 'log';
      elements.fnSqrt.textContent = '√x';
      elements.fnCbrt.textContent = '∛x';
      elements.fnPerm.textContent = 'nPr';
    }
  }

  elements.btnToggle2nd.addEventListener('click', () => {
    SoundFX.click(1000, 0.05);
    state.is2ndActive = !state.is2ndActive;
    updateDynamicButtonLabels();
    updateDisplays();
  });

  elements.btnToggleHyp.addEventListener('click', () => {
    SoundFX.click(1000, 0.05);
    state.isHypActive = !state.isHypActive;
    updateDynamicButtonLabels();
    updateDisplays();
  });

  // Memory Functions
  elements.btnMemoryClear.addEventListener('click', () => {
    SoundFX.func();
    state.memory = 0;
    updateDisplays();
  });

  elements.btnMemoryRecall.addEventListener('click', () => {
    SoundFX.func();
    insertDigit(cleanFloat(state.memory).toString());
  });

  elements.btnMemoryAdd.addEventListener('click', () => {
    SoundFX.func();
    try {
      const cur = calculateExpression(state.expression || state.displayValue);
      if (!isNaN(cur)) state.memory += cur;
      updateDisplays();
    } catch (e) {}
  });

  elements.btnMemorySub.addEventListener('click', () => {
    SoundFX.func();
    try {
      const cur = calculateExpression(state.expression || state.displayValue);
      if (!isNaN(cur)) state.memory -= cur;
      updateDisplays();
    } catch (e) {}
  });

  elements.btnMemoryStore.addEventListener('click', () => {
    SoundFX.func();
    try {
      const cur = calculateExpression(state.expression || state.displayValue);
      if (!isNaN(cur)) state.memory = cur;
      updateDisplays();
    } catch (e) {}
  });

  // --------------------------------------------------------------------------
  // AUDIO & VOICE TOGGLES
  // --------------------------------------------------------------------------
  elements.btnSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    elements.btnSound.classList.toggle('active', state.soundEnabled);
    elements.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
    SoundFX.click(900, 0.04);
  });

  elements.btnVoice.addEventListener('click', () => {
    state.voiceEnabled = !state.voiceEnabled;
    elements.btnVoice.classList.toggle('active', state.voiceEnabled);
    SoundFX.click(1100, 0.06);
    if (state.voiceEnabled) {
      speak('J.A.R.V.I.S. voice feedback activated.');
    }
  });

  // --------------------------------------------------------------------------
  // MISSION HISTORY DRAWER (STARK ARCHIVES)
  // --------------------------------------------------------------------------
  function addHistoryRecord(expr, res) {
    const item = {
      id: Date.now(),
      expr: expr,
      res: res,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    state.history.unshift(item);
    if (state.history.length > 50) state.history.pop(); // Keep last 50
    renderHistory();
    try {
      localStorage.setItem('stark_calc_history', JSON.stringify(state.history));
    } catch (e) {}
  }

  function renderHistory() {
    if (state.history.length === 0) {
      elements.historyList.innerHTML = '<div class="history-empty">NO MISSION CALCULATIONS RECORDED</div>';
      return;
    }

    elements.historyList.innerHTML = state.history.map(item => `
      <div class="history-card" data-expr="${encodeURIComponent(item.expr)}" data-res="${encodeURIComponent(item.res)}">
        <span class="history-time">[TIME: ${item.time}]</span>
        <span class="history-expr">${item.expr} =</span>
        <span class="history-res">${item.res}</span>
      </div>
    `).join('');

    // Attach click to restore into calculator
    elements.historyList.querySelectorAll('.history-card').forEach(card => {
      card.addEventListener('click', () => {
        SoundFX.click(800, 0.05);
        const expr = decodeURIComponent(card.getAttribute('data-expr'));
        const res = decodeURIComponent(card.getAttribute('data-res'));
        state.expression = expr;
        state.displayValue = res;
        state.isEvaluated = true;
        updateDisplays();
        elements.historyDrawer.classList.remove('open');
      });
    });
  }

  elements.btnHistory.addEventListener('click', () => {
    SoundFX.func();
    elements.historyDrawer.classList.add('open');
    elements.historyDrawer.setAttribute('aria-hidden', 'false');
  });

  elements.btnCloseHistory.addEventListener('click', () => {
    SoundFX.click(500, 0.04);
    elements.historyDrawer.classList.remove('open');
    elements.historyDrawer.setAttribute('aria-hidden', 'true');
  });

  elements.btnClearHistory.addEventListener('click', () => {
    SoundFX.purge();
    state.history = [];
    renderHistory();
    try {
      localStorage.removeItem('stark_calc_history');
    } catch (e) {}
  });

  elements.btnCopyHistory.addEventListener('click', () => {
    SoundFX.click(900, 0.05);
    const text = state.history.map(h => `${h.expr} = ${h.res}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      elements.btnCopyHistory.textContent = 'COPIED!';
      setTimeout(() => elements.btnCopyHistory.textContent = 'COPY ALL', 1500);
    });
  });

  // --------------------------------------------------------------------------
  // QUANTUM UNIT CONVERTER
  // --------------------------------------------------------------------------
  const CONVERTER_UNITS = {
    energy: {
      units: [
        { id: 'j', name: 'Joules (J)', factor: 1 },
        { id: 'kj', name: 'Kilojoules (kJ)', factor: 1000 },
        { id: 'mj', name: 'Megajoules (MJ)', factor: 1e6 },
        { id: 'kwh', name: 'Kilowatt-hours (kWh)', factor: 3.6e6 },
        { id: 'ev', name: 'Electronvolts (eV)', factor: 1.60218e-19 },
        { id: 'arc', name: 'Arc Reactor Cores (3.14 GJ)', factor: 3.14e9 },
        { id: 'tnt', name: 'Tons of TNT', factor: 4.184e9 }
      ],
      easterEgg: '💡 Stark Fact: Mark-85 Arc Reactor outputs ~3.14 Gigajoules per second at peak combat overload.'
    },
    speed: {
      units: [
        { id: 'mps', name: 'Meters / sec (m/s)', factor: 1 },
        { id: 'kph', name: 'Kilometers / hr (km/h)', factor: 0.277778 },
        { id: 'mph', name: 'Miles / hr (mph)', factor: 0.44704 },
        { id: 'mach', name: 'Mach (Sound Speed)', factor: 343 },
        { id: 'c', name: 'Speed of Light (c)', factor: 299792458 }
      ],
      easterEgg: '⚡ Stark Fact: Iron Man Mark 85 repulsor flight reaches Mach 10 in sub-orbital sprint.'
    },
    length: {
      units: [
        { id: 'm', name: 'Meters (m)', factor: 1 },
        { id: 'km', name: 'Kilometers (km)', factor: 1000 },
        { id: 'cm', name: 'Centimeters (cm)', factor: 0.01 },
        { id: 'mm', name: 'Millimeters (mm)', factor: 0.001 },
        { id: 'ft', name: 'Feet (ft)', factor: 0.3048 },
        { id: 'mi', name: 'Miles (mi)', factor: 1609.34 },
        { id: 'ly', name: 'Light-Years', factor: 9.461e15 },
        { id: 'nano', name: 'Quantum Nanometers (nm)', factor: 1e-9 }
      ],
      easterEgg: '⚛️ Stark Fact: Quantum Realm navigation requires precision below 10⁻¹⁵ meters (sub-atomic).'
    },
    mass: {
      units: [
        { id: 'kg', name: 'Kilograms (kg)', factor: 1 },
        { id: 'g', name: 'Grams (g)', factor: 0.001 },
        { id: 'lb', name: 'Pounds (lbs)', factor: 0.453592 },
        { id: 'oz', name: 'Ounces (oz)', factor: 0.0283495 },
        { id: 'shield', name: 'Vibranium Shields (5.4 kg)', factor: 5.4 },
        { id: 'ton', name: 'Metric Tons', factor: 1000 }
      ],
      easterEgg: '⭐ Stark Fact: Captain America’s pure Vibranium shield weighs exactly 5.4 kg.'
    },
    temp: {
      units: [
        { id: 'c', name: 'Celsius (°C)', factor: 1 },
        { id: 'f', name: 'Fahrenheit (°F)', factor: 1 },
        { id: 'k', name: 'Kelvin (K)', factor: 1 }
      ],
      easterEgg: '🔥 Stark Fact: Repulsor beam core temperature exceeds 10,000 Kelvin at point-blank discharge.'
    }
  };

  let activeConverterCat = 'energy';

  function populateConverterCategory(catKey) {
    activeConverterCat = catKey;
    const cat = CONVERTER_UNITS[catKey];
    elements.converterEasterEgg.textContent = cat.easterEgg;

    // Fill dropdowns
    const optionsHtml = cat.units.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
    elements.convertFromUnit.innerHTML = optionsHtml;
    elements.convertToUnit.innerHTML = optionsHtml;

    if (cat.units.length > 1) {
      elements.convertToUnit.selectedIndex = 1;
    }

    calculateConversion();
  }

  function calculateConversion() {
    const val = parseFloat(elements.convertFromVal.value);
    if (isNaN(val)) {
      elements.convertToVal.value = '---';
      return;
    }

    const catKey = activeConverterCat;
    const cat = CONVERTER_UNITS[catKey];
    const fromUnitId = elements.convertFromUnit.value;
    const toUnitId = elements.convertToUnit.value;

    let result;

    if (catKey === 'temp') {
      // Temperature custom logic
      let celsius = val;
      if (fromUnitId === 'f') celsius = (val - 32) * (5 / 9);
      else if (fromUnitId === 'k') celsius = val - 273.15;

      if (toUnitId === 'c') result = celsius;
      else if (toUnitId === 'f') result = (celsius * 9 / 5) + 32;
      else if (toUnitId === 'k') result = celsius + 273.15;
    } else {
      const fromObj = cat.units.find(u => u.id === fromUnitId);
      const toObj = cat.units.find(u => u.id === toUnitId);
      if (fromObj && toObj) {
        const baseVal = val * fromObj.factor;
        result = baseVal / toObj.factor;
      }
    }

    elements.convertToVal.value = cleanFloat(result);
  }

  elements.btnConverter.addEventListener('click', () => {
    SoundFX.func();
    elements.converterModal.classList.add('open');
    elements.converterModal.setAttribute('aria-hidden', 'false');
    populateConverterCategory('energy');
  });

  elements.btnCloseConverter.addEventListener('click', () => {
    SoundFX.click(500, 0.04);
    elements.converterModal.classList.remove('open');
    elements.converterModal.setAttribute('aria-hidden', 'true');
  });

  elements.converterModal.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      SoundFX.click(800, 0.04);
      elements.converterModal.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      populateConverterCategory(btn.getAttribute('data-cat'));
    });
  });

  elements.convertFromVal.addEventListener('input', calculateConversion);
  elements.convertFromUnit.addEventListener('change', calculateConversion);
  elements.convertToUnit.addEventListener('change', calculateConversion);

  elements.btnTransferToCalc.addEventListener('click', () => {
    SoundFX.repulsorBlast();
    const val = elements.convertToVal.value;
    if (val && val !== '---') {
      state.expression = val;
      state.displayValue = val;
      state.isEvaluated = true;
      updateDisplays();
      elements.converterModal.classList.remove('open');
    }
  });

  // --------------------------------------------------------------------------
  // KEYPAD BUTTON DISPATCHER
  // --------------------------------------------------------------------------
  document.querySelector('.grid-keypad').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Visual active press bounce
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 120);

    const action = btn.getAttribute('data-action');
    const value = btn.getAttribute('data-value');

    switch (action) {
      case 'insert-digit':
        insertDigit(value);
        break;
      case 'insert-op':
        // Check dynamic 2nd state for ops like nPr/nCr or ^ / root
        let opVal = value;
        if (btn.classList.contains('dynamic-fn')) {
          opVal = state.is2ndActive ? btn.getAttribute('data-inv') : btn.getAttribute('data-primary');
        }
        insertOperator(opVal);
        break;
      case 'insert-func':
        const fnName = btn.getAttribute('data-primary') || value;
        insertFunction(fnName);
        break;
      case 'insert-const':
        insertConstant(value);
        break;
      case 'insert-symbol':
        insertSymbol(value);
        break;
      case 'insert-ans':
        insertAns();
        break;
      case 'clear-all':
        clearAll();
        break;
      case 'backspace':
        backspace();
        break;
      case 'negate':
        toggleNegate();
        break;
      case 'calculate':
        computeResult();
        break;
    }
  });

  // --------------------------------------------------------------------------
  // KEYBOARD NAVIGATION & HOTKEYS
  // --------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    // If modal is open and user types in input, do not capture calculator keys
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      if (e.key === 'Escape') {
        elements.converterModal.classList.remove('open');
        elements.historyDrawer.classList.remove('open');
      }
      return;
    }

    if (e.key >= '0' && e.key <= '9') {
      insertDigit(e.key);
    } else if (e.key === '.') {
      insertDigit('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '^' || e.key === '%') {
      insertOperator(e.key);
    } else if (e.key === '(' || e.key === ')') {
      insertSymbol(e.key);
    } else if (e.key === '!' || e.key === 'e' || e.key === 'E') {
      insertSymbol(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      computeResult();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      backspace();
    } else if (e.key === 'Escape' || e.key === 'Delete') {
      clearAll();
    } else if (e.key === 's') {
      insertFunction('sin');
    } else if (e.key === 'c') {
      insertFunction('cos');
    } else if (e.key === 't') {
      insertFunction('tan');
    } else if (e.key === 'l') {
      insertFunction('log');
    } else if (e.key === 'n') {
      insertFunction('ln');
    } else if (e.key === 'p') {
      insertConstant('pi');
    }
  });

  // --------------------------------------------------------------------------
  // INITIALIZATION ON LOAD
  // --------------------------------------------------------------------------
  function init() {
    // Restore saved theme
    try {
      const savedTheme = localStorage.getItem('stark_calc_theme');
      if (savedTheme && THEME_DATA[savedTheme]) {
        setTheme(savedTheme);
      } else {
        setTheme('ironman');
      }

      const savedHistory = localStorage.getItem('stark_calc_history');
      if (savedHistory) {
        state.history = JSON.parse(savedHistory);
        renderHistory();
      }
    } catch (e) {}

    updateDynamicButtonLabels();
    updateDisplays();
  }

  window.addEventListener('DOMContentLoaded', init);

})();
