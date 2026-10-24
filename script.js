// ==========================================================================
// Helakuru Liyanaya — Core Sinhala Conversion Engine & Workspace Controller
// ==========================================================================

const inputElement = document.getElementById('converter');
const phoneticRadio = document.getElementById('phonetic');
const wijesekaraRadio = document.getElementById('wijesekara');
const englishRadio = document.getElementById('english');
const phoneticLabel = document.getElementById('label-phonetic');
const wijesekaraLabel = document.getElementById('label-wijesekara');
const englishLabel = document.getElementById('label-english');

const liveFeedbackEl = document.getElementById('live-key-feedback');
const modeIndicatorDot = document.getElementById('mode-indicator-dot');
const wordCountEl = document.getElementById('word-count');
const charCountEl = document.getElementById('char-count');
const draftStatusEl = document.getElementById('draft-status');

// --- Conversion State ---
var mPrevChar = 0;
var m2ndPrevChar = 0;
var m3rdPrevChar = 0;
var state = 'enable';
var type = localStorage.getItem('type');
if (type !== 'phonetic' && type !== 'wijesekara' && type !== 'english') {
  type = 'phonetic';
}
var lastSinhalaLayout = type === 'wijesekara' ? 'wijesekara' : 'phonetic';

// --- Sinhala Character Tables ---
var SWARA_EXCEPT_AYANNA = [3463, 3465, 3466, 3467, 3469, 3471, 3473, 3475, 3476];
var VYANJANA_LIST = [
  3482, 3483, 3484, 3485, 3487, 3488, 3489, 3490, 3491, 3492,
  3493, 3494, 3495, 3496, 3497, 3498, 3499, 3500, 3501, 3502,
  3503, 3504, 3505, 3507, 3508, 3509, 3510, 3511, 3512, 3513,
  3514, 3515, 3517, 3520, 3521, 3522, 3523, 3524, 3525, 3526
];
var PILI_EXCEPT_ALAPILLA = [3536, 3538, 3540, 3544, 3551, 3545, 3548];
var SWARA_PILI = [3536, 3538, 3540, 3544, 3545, 3548, 3551];
var VYANJANA_H_LIST = [3495, 3500, 3501, 3496, 3497, 3503, 3523, 3522, 3488, 3482, 3510, 3484, 3508, 3687, 3688];
var VYANJANA_SANYAKA_LIST = [3497, 3503, 3484, 3490, 3505, 3524, 3482];

var SWARA_DIRGA_SWARA_MAP = [];
SWARA_DIRGA_SWARA_MAP[3463] = 3464;
SWARA_DIRGA_SWARA_MAP[3465] = 3466;
SWARA_DIRGA_SWARA_MAP[3467] = 3468;
SWARA_DIRGA_SWARA_MAP[3469] = 3470;
SWARA_DIRGA_SWARA_MAP[3471] = 3472;
SWARA_DIRGA_SWARA_MAP[3473] = 3474;
SWARA_DIRGA_SWARA_MAP[3476] = 3477;

var SHIFTED_KEYS = [];
SHIFTED_KEYS[3461] = 3463;
SHIFTED_KEYS[3473] = 3475;
SHIFTED_KEYS[3505] = 3499;
SHIFTED_KEYS[3517] = 3525;
SHIFTED_KEYS[3484] = 3485;
SHIFTED_KEYS[3495] = 3496;
SHIFTED_KEYS[3497] = 3498;
SHIFTED_KEYS[3508] = 3509;
SHIFTED_KEYS[3510] = 3513;
SHIFTED_KEYS[3523] = 3522;
SHIFTED_KEYS[3488] = 3489;
SHIFTED_KEYS[3465] = 3466;
SHIFTED_KEYS[3458] = 3486;
SHIFTED_KEYS[3524] = 3459;
SHIFTED_KEYS[3490] = 3491;
SHIFTED_KEYS[3515] = 3469;

var SWARA_PILI_MAP = [];
SWARA_PILI_MAP[3463] = 3536;
SWARA_PILI_MAP[3465] = 3538;
SWARA_PILI_MAP[3466] = 3539;
SWARA_PILI_MAP[3467] = 3540;
SWARA_PILI_MAP[3469] = 3544;
SWARA_PILI_MAP[3471] = 3551;
SWARA_PILI_MAP[3473] = 3545;
SWARA_PILI_MAP[3475] = 3547;
SWARA_PILI_MAP[3476] = 3548;

var SWARA_DIRGA_PILI_MAP = [];
SWARA_DIRGA_PILI_MAP[3463] = 3537;
SWARA_DIRGA_PILI_MAP[3465] = 3539;
SWARA_DIRGA_PILI_MAP[3467] = 3542;
SWARA_DIRGA_PILI_MAP[3469] = 3570;
SWARA_DIRGA_PILI_MAP[3471] = 3571;
SWARA_DIRGA_PILI_MAP[3473] = 3546;
SWARA_DIRGA_PILI_MAP[3476] = 3549;

var VYANJANA_H_MAP = [];
VYANJANA_H_MAP[3495] = 3501;
VYANJANA_H_MAP[3501] = 3502;
VYANJANA_H_MAP[3496] = 3502;
VYANJANA_H_MAP[3497] = 3503;
VYANJANA_H_MAP[3503] = 3504;
VYANJANA_H_MAP[3523] = 3521;
VYANJANA_H_MAP[3522] = 3522;
VYANJANA_H_MAP[3488] = 3489;
VYANJANA_H_MAP[3482] = 3483;
VYANJANA_H_MAP[3510] = 3511;
VYANJANA_H_MAP[3484] = 3485;
VYANJANA_H_MAP[3508] = 3509;
VYANJANA_H_MAP[3500] = 3507;
VYANJANA_H_MAP[3687] = 3488;
VYANJANA_H_MAP[3688] = 3489;

var VYANJANA_SANYAKA_MAP = [];
VYANJANA_SANYAKA_MAP[3497] = 3500;
VYANJANA_SANYAKA_MAP[3503] = 3507;
VYANJANA_SANYAKA_MAP[3484] = 3487;
VYANJANA_SANYAKA_MAP[3490] = 3494;
VYANJANA_SANYAKA_MAP[3505] = 3458;
VYANJANA_SANYAKA_MAP[3524] = 3493;
VYANJANA_SANYAKA_MAP[3482] = 3492;

var ENGLISH_TO_SINHALA = [];
ENGLISH_TO_SINHALA['q'] = 3503; ENGLISH_TO_SINHALA['w'] = 3520; ENGLISH_TO_SINHALA['e'] = 3473;
ENGLISH_TO_SINHALA['r'] = 3515; ENGLISH_TO_SINHALA['t'] = 3495; ENGLISH_TO_SINHALA['y'] = 3514;
ENGLISH_TO_SINHALA['u'] = 3467; ENGLISH_TO_SINHALA['i'] = 3465; ENGLISH_TO_SINHALA['o'] = 3476;
ENGLISH_TO_SINHALA['p'] = 3508; ENGLISH_TO_SINHALA['a'] = 3461; ENGLISH_TO_SINHALA['s'] = 3523;
ENGLISH_TO_SINHALA['d'] = 3497; ENGLISH_TO_SINHALA['f'] = 3526; ENGLISH_TO_SINHALA['g'] = 3484;
ENGLISH_TO_SINHALA['h'] = 3524; ENGLISH_TO_SINHALA['j'] = 3490; ENGLISH_TO_SINHALA['k'] = 3482;
ENGLISH_TO_SINHALA['l'] = 3517; ENGLISH_TO_SINHALA['z'] = 3962; ENGLISH_TO_SINHALA['x'] = 3458;
ENGLISH_TO_SINHALA['c'] = 3687; ENGLISH_TO_SINHALA['v'] = 3520; ENGLISH_TO_SINHALA['b'] = 3510;
ENGLISH_TO_SINHALA['n'] = 3505; ENGLISH_TO_SINHALA['m'] = 3512;

ENGLISH_TO_SINHALA['Q'] = 3503; ENGLISH_TO_SINHALA['W'] = 3520; ENGLISH_TO_SINHALA['E'] = 3475;
ENGLISH_TO_SINHALA['R'] = 3469; ENGLISH_TO_SINHALA['T'] = 3496; ENGLISH_TO_SINHALA['Y'] = 3514;
ENGLISH_TO_SINHALA['U'] = 3467; ENGLISH_TO_SINHALA['I'] = 3466; ENGLISH_TO_SINHALA['O'] = 3476;
ENGLISH_TO_SINHALA['P'] = 3509; ENGLISH_TO_SINHALA['A'] = 3463; ENGLISH_TO_SINHALA['S'] = 3522;
ENGLISH_TO_SINHALA['D'] = 3498; ENGLISH_TO_SINHALA['F'] = 3526; ENGLISH_TO_SINHALA['G'] = 3485;
ENGLISH_TO_SINHALA['H'] = 3459; ENGLISH_TO_SINHALA['J'] = 3491; ENGLISH_TO_SINHALA['K'] = 3482;
ENGLISH_TO_SINHALA['L'] = 3525; ENGLISH_TO_SINHALA['Z'] = 3962; ENGLISH_TO_SINHALA['X'] = 3486;
ENGLISH_TO_SINHALA['C'] = 3687; ENGLISH_TO_SINHALA['V'] = 3520; ENGLISH_TO_SINHALA['B'] = 3513;
ENGLISH_TO_SINHALA['N'] = 3499; ENGLISH_TO_SINHALA['M'] = 3512;

var ENGLISH_TO_SINHALA_WIJESEKARA = [];
ENGLISH_TO_SINHALA_WIJESEKARA['q'] = 3540; ENGLISH_TO_SINHALA_WIJESEKARA['w'] = 3461;
ENGLISH_TO_SINHALA_WIJESEKARA['e'] = 3536; ENGLISH_TO_SINHALA_WIJESEKARA['r'] = 3515;
ENGLISH_TO_SINHALA_WIJESEKARA['t'] = 3473; ENGLISH_TO_SINHALA_WIJESEKARA['y'] = 3524;
ENGLISH_TO_SINHALA_WIJESEKARA['u'] = 3512; ENGLISH_TO_SINHALA_WIJESEKARA['i'] = 3523;
ENGLISH_TO_SINHALA_WIJESEKARA['o'] = 3503; ENGLISH_TO_SINHALA_WIJESEKARA['p'] = 3488;
ENGLISH_TO_SINHALA_WIJESEKARA['['] = 3492; ENGLISH_TO_SINHALA_WIJESEKARA[']'] = 59;
ENGLISH_TO_SINHALA_WIJESEKARA['\\'] = 8205; ENGLISH_TO_SINHALA_WIJESEKARA['a'] = 3530;
ENGLISH_TO_SINHALA_WIJESEKARA['s'] = 3538; ENGLISH_TO_SINHALA_WIJESEKARA['d'] = 3535;
ENGLISH_TO_SINHALA_WIJESEKARA['f'] = 3545; ENGLISH_TO_SINHALA_WIJESEKARA['g'] = 3495;
ENGLISH_TO_SINHALA_WIJESEKARA['h'] = 3514; ENGLISH_TO_SINHALA_WIJESEKARA['j'] = 3520;
ENGLISH_TO_SINHALA_WIJESEKARA['k'] = 3505; ENGLISH_TO_SINHALA_WIJESEKARA['l'] = 3482;
ENGLISH_TO_SINHALA_WIJESEKARA[';'] = 3501; ENGLISH_TO_SINHALA_WIJESEKARA["'"] = 46;
ENGLISH_TO_SINHALA_WIJESEKARA['z'] = 39;   ENGLISH_TO_SINHALA_WIJESEKARA['x'] = 3458;
ENGLISH_TO_SINHALA_WIJESEKARA['c'] = 3490; ENGLISH_TO_SINHALA_WIJESEKARA['v'] = 3497;
ENGLISH_TO_SINHALA_WIJESEKARA['b'] = 3465; ENGLISH_TO_SINHALA_WIJESEKARA['n'] = 3510;
ENGLISH_TO_SINHALA_WIJESEKARA['m'] = 3508; ENGLISH_TO_SINHALA_WIJESEKARA[','] = 3517;
ENGLISH_TO_SINHALA_WIJESEKARA['.'] = 3484; ENGLISH_TO_SINHALA_WIJESEKARA['/'] = 47;
ENGLISH_TO_SINHALA_WIJESEKARA['`'] = 3696;

ENGLISH_TO_SINHALA_WIJESEKARA['Q'] = 3542; ENGLISH_TO_SINHALA_WIJESEKARA['W'] = 3467;
ENGLISH_TO_SINHALA_WIJESEKARA['E'] = 3537; ENGLISH_TO_SINHALA_WIJESEKARA['R'] = 3469;
ENGLISH_TO_SINHALA_WIJESEKARA['T'] = 3476; ENGLISH_TO_SINHALA_WIJESEKARA['Y'] = 3521;
ENGLISH_TO_SINHALA_WIJESEKARA['U'] = 3513; ENGLISH_TO_SINHALA_WIJESEKARA['I'] = 3522;
ENGLISH_TO_SINHALA_WIJESEKARA['O'] = 3504; ENGLISH_TO_SINHALA_WIJESEKARA['P'] = 3489;
ENGLISH_TO_SINHALA_WIJESEKARA['{'] = 3493; ENGLISH_TO_SINHALA_WIJESEKARA['}'] = 58;
ENGLISH_TO_SINHALA_WIJESEKARA['A'] = 3551; ENGLISH_TO_SINHALA_WIJESEKARA['S'] = 3539;
ENGLISH_TO_SINHALA_WIJESEKARA['D'] = 3544; ENGLISH_TO_SINHALA_WIJESEKARA['F'] = 3526;
ENGLISH_TO_SINHALA_WIJESEKARA['G'] = 3496; ENGLISH_TO_SINHALA_WIJESEKARA['H'] = 3694;
ENGLISH_TO_SINHALA_WIJESEKARA['J'] = 3695; ENGLISH_TO_SINHALA_WIJESEKARA['K'] = 3499;
ENGLISH_TO_SINHALA_WIJESEKARA['L'] = 3483; ENGLISH_TO_SINHALA_WIJESEKARA[':'] = 3502;
ENGLISH_TO_SINHALA_WIJESEKARA['"'] = 44;   ENGLISH_TO_SINHALA_WIJESEKARA['Z'] = 34;
ENGLISH_TO_SINHALA_WIJESEKARA['X'] = 3486; ENGLISH_TO_SINHALA_WIJESEKARA['C'] = 3491;
ENGLISH_TO_SINHALA_WIJESEKARA['V'] = 3498; ENGLISH_TO_SINHALA_WIJESEKARA['B'] = 3466;
ENGLISH_TO_SINHALA_WIJESEKARA['N'] = 3511; ENGLISH_TO_SINHALA_WIJESEKARA['M'] = 3509;
ENGLISH_TO_SINHALA_WIJESEKARA['<'] = 3525; ENGLISH_TO_SINHALA_WIJESEKARA['>'] = 3485;
ENGLISH_TO_SINHALA_WIJESEKARA['?'] = 63;   ENGLISH_TO_SINHALA_WIJESEKARA['~'] = 3697;
ENGLISH_TO_SINHALA_WIJESEKARA['√'] = 3500; ENGLISH_TO_SINHALA_WIJESEKARA['ø'] = 3507;
ENGLISH_TO_SINHALA_WIJESEKARA['≥'] = 3487; ENGLISH_TO_SINHALA_WIJESEKARA['ç'] = 3494;
ENGLISH_TO_SINHALA_WIJESEKARA['¥'] = 3493; ENGLISH_TO_SINHALA_WIJESEKARA['¬'] = 3492;
ENGLISH_TO_SINHALA_WIJESEKARA['æ'] = 3572;

// ==========================================================================
// Deterministic Text Manipulation & Cursor Context Synchronization
// ==========================================================================

function syncContextFromCursor() {
  const pos = inputElement.selectionStart || 0;
  const val = inputElement.value;
  mPrevChar = pos >= 1 ? val.charCodeAt(pos - 1) : 0;
  m2ndPrevChar = pos >= 2 ? val.charCodeAt(pos - 2) : 0;
  m3rdPrevChar = pos >= 3 ? val.charCodeAt(pos - 3) : 0;
}

function appendChar(newText) {
  const start = inputElement.selectionStart;
  const end = inputElement.selectionEnd;
  if (typeof inputElement.setRangeText === 'function') {
    inputElement.setRangeText(newText, start, end, 'end');
  } else {
    document.execCommand('insertText', false, newText);
  }
  onEditorContentChange();
}

function deleteBackward() {
  const start = inputElement.selectionStart;
  const end = inputElement.selectionEnd;
  if (start === end && start > 0) {
    if (typeof inputElement.setRangeText === 'function') {
      // Strictly remove 1 UTF-16 code unit (e.g. only the virama \u0DCA, never the whole grapheme cluster)
      inputElement.setRangeText('', start - 1, start, 'end');
    } else {
      document.execCommand('delete', false, null);
    }
  } else if (start !== end) {
    inputElement.setRangeText('', start, end, 'end');
  }
  syncContextFromCursor();
  onEditorContentChange();
}

function deleteDefault() {
  deleteBackward();
}

function cleanDanglingZ() {
  if (mPrevChar === 3962) {
    deleteBackward();
  }
}

// ==========================================================================
// Mode Switching (Phonetic / Wijesekara / English)
// ==========================================================================

function setActiveMode(mode, focusEditor = false) {
  if (mode !== 'phonetic' && mode !== 'wijesekara' && mode !== 'english') {
    mode = 'phonetic';
  }

  cleanDanglingZ();
  type = mode;

  if (mode === 'english') {
    state = 'disable';
  } else {
    state = 'enable';
    lastSinhalaLayout = mode;
  }

  localStorage.setItem('type', mode);

  phoneticLabel.classList.toggle('active', mode === 'phonetic');
  wijesekaraLabel.classList.toggle('active', mode === 'wijesekara');
  englishLabel.classList.toggle('active', mode === 'english');

  phoneticRadio.checked = mode === 'phonetic';
  wijesekaraRadio.checked = mode === 'wijesekara';
  englishRadio.checked = mode === 'english';

  modeIndicatorDot.classList.toggle('english', mode === 'english');

  if (mode === 'phonetic') {
    inputElement.placeholder = 'Singlish වලින් ටයිප් කරන්න… (උදා: ayubowan sri lanka → ආයුබෝවන් ශ්‍රී ලංකා)';
    liveFeedbackEl.textContent = 'Phonetic (Singlish) active — type phonetically';
  } else if (mode === 'wijesekara') {
    inputElement.placeholder = 'විජේසේකර යතුරුපුවරුවෙන් ටයිප් කරන්න… (උදා: wdhaqfnajka → ආයුබෝවන්)';
    liveFeedbackEl.textContent = 'Wijesekara standard keyboard layout active';
  } else {
    inputElement.placeholder = 'Typing directly in English (Press Ctrl + Space to switch back to Sinhala)…';
    liveFeedbackEl.textContent = 'English passthrough active (Ctrl + Space for Sinhala)';
  }

  syncContextFromCursor();
  renderKeyGuide();

  if (focusEditor) {
    inputElement.focus();
  }
}

document.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (e.target.checked) {
      setActiveMode(e.target.value, true);
    }
  });
});

// Global Ctrl + Space shortcut to toggle between Sinhala and English inline
window.addEventListener('keydown', (ev) => {
  if (ev.ctrlKey && ev.code === 'Space') {
    ev.preventDefault();
    if (type === 'english') {
      setActiveMode(lastSinhalaLayout || 'phonetic', true);
    } else {
      setActiveMode('english', true);
    }
  }
});

// ==========================================================================
// Keyboard Event Handlers & Conversion Engine
// ==========================================================================

inputElement.addEventListener('keydown', function (ev) {
  // Handle Alt + key Sanyaka in Wijesekara mode reliably without browser menu bar stealing focus
  if (state === 'enable' && type === 'wijesekara' && ev.altKey && !ev.ctrlKey && !ev.metaKey && ev.key.length === 1) {
    const primaryCode = ENGLISH_TO_SINHALA_WIJESEKARA[ev.key];
    if (primaryCode && VYANJANA_SANYAKA_LIST.indexOf(primaryCode) !== -1) {
      ev.preventDefault();
      const sanyakaCode = VYANJANA_SANYAKA_MAP[primaryCode];
      appendChar(String.fromCharCode(sanyakaCode));
      m3rdPrevChar = m2ndPrevChar;
      m2ndPrevChar = mPrevChar;
      mPrevChar = sanyakaCode;
      updateLiveFeedback( 'Alt+' + ev.key );
      return;
    }
  }

  if (ev.key === 'Backspace' || ev.key === 'Delete') {
    // Allow native deletion, then sync context on keyup/input
    setTimeout(syncContextFromCursor, 0);
  }
});

inputElement.addEventListener('keyup', function (ev) {
  const navKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
  if (navKeys.includes(ev.key)) {
    syncContextFromCursor();
  }
});

inputElement.addEventListener('click', syncContextFromCursor);
inputElement.addEventListener('paste', () => setTimeout(syncContextFromCursor, 0));
inputElement.addEventListener('cut', () => setTimeout(syncContextFromCursor, 0));

inputElement.addEventListener('keypress', EventHandler, true);

function updateLiveFeedback(keyStr) {
  if (!liveFeedbackEl) return;
  const pos = inputElement.selectionStart || 0;
  const sliceStart = Math.max(0, pos - 4);
  const recentText = inputElement.value.slice(sliceStart, pos).trim();
  if (recentText) {
    liveFeedbackEl.innerHTML = `Key <code>${escapeHtml(keyStr)}</code> → ${escapeHtml(recentText)}`;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function EventHandler(evt) {
  if (document.activeElement !== inputElement) return;
  // Never hijack standard OS / browser shortcuts (Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+Z, etc.)
  if (evt.ctrlKey || evt.metaKey) return;

  var charCode = evt.which || evt.keyCode;
  if (!charCode || charCode < 32) {
    cleanDanglingZ();
    return;
  }

  var charStr = String.fromCharCode(charCode);
  var preventDflt = false;

  if (
    state === 'enable' &&
    ((type === 'phonetic' && ENGLISH_TO_SINHALA[charStr]) ||
      (type === 'wijesekara' && ENGLISH_TO_SINHALA_WIJESEKARA[charStr]))
  ) {
    evt.preventDefault();
    preventDflt = true;
  }

  if (state === 'enable') {
    if (type === 'phonetic') {
      if (ENGLISH_TO_SINHALA[charStr]) {
        if (!evt.defaultPrevented) deleteDefault();
        handlePhonetic(charStr);
        updateLiveFeedback(charStr);
        return false;
      } else {
        cleanDanglingZ();
        m3rdPrevChar = m2ndPrevChar;
        m2ndPrevChar = mPrevChar;
        mPrevChar = charCode;
        return false;
      }
    } else if (type === 'wijesekara') {
      if (
        VYANJANA_SANYAKA_LIST.indexOf(ENGLISH_TO_SINHALA_WIJESEKARA[charStr]) !== -1 &&
        evt.altKey
      ) {
        var primaryCode = ENGLISH_TO_SINHALA_WIJESEKARA[charStr];
        var sanyakaCode = VYANJANA_SANYAKA_MAP[primaryCode];
        appendChar(String.fromCharCode(sanyakaCode));
        m3rdPrevChar = m2ndPrevChar;
        m2ndPrevChar = mPrevChar;
        mPrevChar = sanyakaCode;
        updateLiveFeedback('Alt+' + charStr);
        return false;
      } else if (ENGLISH_TO_SINHALA_WIJESEKARA[charStr]) {
        if (!evt.defaultPrevented || !preventDflt) deleteDefault();
        handleWijesekara(charStr);
        updateLiveFeedback(charStr);
        return false;
      } else {
        m3rdPrevChar = m2ndPrevChar;
        m2ndPrevChar = mPrevChar;
        mPrevChar = charCode;
        return false;
      }
    } else {
      if (evt.defaultPrevented) appendChar(charStr);
      m3rdPrevChar = m2ndPrevChar;
      m2ndPrevChar = mPrevChar;
      mPrevChar = charCode;
      return false;
    }
  } else {
    if (evt.defaultPrevented) appendChar(charStr);
    m3rdPrevChar = m2ndPrevChar;
    m2ndPrevChar = mPrevChar;
    mPrevChar = charCode;
    return false;
  }
}

function handlePhonetic(charKey) {
  var primaryCode = ENGLISH_TO_SINHALA[charKey];

  // Handle 'z' prefix for Sanyaka letters (zg -> ඟ, zd -> ඳ, zq -> ඬ, zj -> ඦ, zk -> ඤ, zh -> ඥ, zn -> ං)
  if (mPrevChar === 3962) {
    if (VYANJANA_SANYAKA_LIST.indexOf(primaryCode) !== -1) {
      deleteBackward();
      primaryCode = VYANJANA_SANYAKA_MAP[primaryCode];
    } else {
      deleteBackward();
    }
  }

  if (primaryCode === 3461) {
    // 'a' (අ)
    if (mPrevChar === 3530) {
      deleteBackward();
    } else {
      if (mPrevChar === 3461) {
        deleteBackward();
        primaryCode = 3462;
      } else if (mPrevChar === 3463) {
        deleteBackward();
        primaryCode = 3464;
      } else if (mPrevChar === 3536) {
        deleteBackward();
        primaryCode = 3537;
      } else if (VYANJANA_LIST.indexOf(mPrevChar) !== -1) {
        primaryCode = 3535;
      }
      appendChar(String.fromCharCode(primaryCode));
      mPrevChar = primaryCode;
    }
  } else if (primaryCode === 3463) {
    // 'A' (ඇ)
    if (mPrevChar === 3530) {
      deleteBackward();
      primaryCode = 3536;
    } else if (mPrevChar === 3536) {
      deleteBackward();
      primaryCode = 3537;
    } else if (mPrevChar === 3461) {
      deleteBackward();
      primaryCode = 3463;
    } else if (mPrevChar === 3463) {
      deleteBackward();
      primaryCode = 3464;
    }
    appendChar(String.fromCharCode(primaryCode));
    mPrevChar = primaryCode;
  } else if (primaryCode === 3467) {
    // 'u' (උ)
    if (mPrevChar === 3530) {
      if (m2ndPrevChar === 3515 && m3rdPrevChar === 8205) {
        // 'kru' -> කෘ: remove 4 code units (\u0DCA, \u0DBB, \u200D, \u0DCA) before appending \u0DD8 (ෘ)
        deleteBackward();
        deleteBackward();
        deleteBackward();
        deleteBackward();
        primaryCode = 3544;
      } else {
        deleteBackward();
        primaryCode = 3540;
      }
    } else if (mPrevChar === 3467) {
      deleteBackward();
      primaryCode = 3468;
    } else if (mPrevChar === 3540) {
      deleteBackward();
      primaryCode = 3542;
    } else if (mPrevChar === 3469) {
      deleteBackward();
      primaryCode = 3470;
    } else if (mPrevChar === 3544) {
      deleteBackward();
      primaryCode = 3570;
    } else if (mPrevChar === 3476 || mPrevChar === 3461) {
      deleteBackward();
      primaryCode = 3478;
    } else if (mPrevChar === 3548) {
      // 'kou' -> කෞ
      deleteBackward();
      primaryCode = 3550;
    } else if (VYANJANA_LIST.indexOf(mPrevChar) !== -1) {
      primaryCode = 3550;
    }
    appendChar(String.fromCharCode(primaryCode));
    mPrevChar = primaryCode;
  } else if (SWARA_EXCEPT_AYANNA.indexOf(primaryCode) !== -1) {
    if (mPrevChar === 3530) {
      deleteBackward();
      primaryCode = SWARA_PILI_MAP[primaryCode];
    } else if (SWARA_PILI.indexOf(mPrevChar) !== -1 && mPrevChar === SWARA_PILI_MAP[primaryCode]) {
      deleteBackward();
      primaryCode = SWARA_DIRGA_PILI_MAP[primaryCode];
    } else if (primaryCode === 3465 && mPrevChar === 3461) {
      deleteBackward();
      primaryCode = 3475;
    } else if (primaryCode === 3465 && VYANJANA_LIST.indexOf(mPrevChar) !== -1) {
      primaryCode = 3547;
    } else if (primaryCode === 3467 && mPrevChar === 3461) {
      deleteBackward();
      primaryCode = 3478;
    } else if (primaryCode === 3467 && VYANJANA_LIST.indexOf(mPrevChar) !== -1) {
      primaryCode = 3550;
    } else if (primaryCode === mPrevChar && SWARA_DIRGA_SWARA_MAP[primaryCode]) {
      deleteBackward();
      primaryCode = SWARA_DIRGA_SWARA_MAP[primaryCode];
    }
    appendChar(String.fromCharCode(primaryCode));
    mPrevChar = primaryCode;
  } else if (VYANJANA_LIST.indexOf(primaryCode) !== -1) {
    if (primaryCode === 3524 && mPrevChar === 3530 && VYANJANA_H_LIST.indexOf(m2ndPrevChar) !== -1) {
      primaryCode = VYANJANA_H_MAP[m2ndPrevChar];
      deleteBackward();
      deleteBackward();
      appendChar(String.fromCharCode(primaryCode));
    } else if (primaryCode === 3515 && mPrevChar === 3530) {
      appendChar(String.fromCharCode(8205));
      m2ndPrevChar = primaryCode;
      mPrevChar = 8205;
      appendChar(String.fromCharCode(primaryCode));
    } else if (primaryCode === 3514 && mPrevChar === 3530) {
      appendChar(String.fromCharCode(8205));
      m2ndPrevChar = primaryCode;
      mPrevChar = 8205;
      appendChar(String.fromCharCode(primaryCode));
    } else {
      appendChar(String.fromCharCode(primaryCode));
    }
    appendChar(String.fromCharCode(3530));
    m3rdPrevChar = mPrevChar;
    m2ndPrevChar = primaryCode;
    mPrevChar = 3530;
  } else if (primaryCode === 3687 || primaryCode === 3688) {
    // 'c' or 'C': outputs ක් initially, upgrades to ච් / ඡ් if followed by 'h'
    appendChar(String.fromCharCode(3482));
    appendChar(String.fromCharCode(3530));
    m2ndPrevChar = primaryCode;
    mPrevChar = 3530;
  } else {
    appendChar(String.fromCharCode(primaryCode));
    m3rdPrevChar = m2ndPrevChar;
    m2ndPrevChar = mPrevChar;
    mPrevChar = primaryCode;
  }
}

function handleWijesekara(charKey) {
  var primaryCode = ENGLISH_TO_SINHALA_WIJESEKARA[charKey];
  if (primaryCode === 3535 && mPrevChar === 3461) {
    deleteBackward();
    appendChar(String.fromCharCode(3462));
    mPrevChar = 3462;
  } else if (primaryCode === 3536 && mPrevChar === 3461) {
    deleteBackward();
    appendChar(String.fromCharCode(3463));
    mPrevChar = 3463;
  } else if (primaryCode === 3537 && mPrevChar === 3461) {
    deleteBackward();
    appendChar(String.fromCharCode(3464));
    mPrevChar = 3464;
  } else if (primaryCode === 3551 && mPrevChar === 3467) {
    deleteBackward();
    appendChar(String.fromCharCode(3468));
    mPrevChar = 3468;
  } else if (primaryCode === 3544 && mPrevChar === 3469) {
    deleteBackward();
    appendChar(String.fromCharCode(3470));
    mPrevChar = 3470;
  } else if (primaryCode === 3551 && mPrevChar === 3471) {
    deleteBackward();
    appendChar(String.fromCharCode(3472));
    mPrevChar = 3472;
  } else if (primaryCode === 3530 && mPrevChar === 3473) {
    deleteBackward();
    appendChar(String.fromCharCode(3474));
    mPrevChar = 3474;
  } else if (primaryCode === 3473 && mPrevChar === 3545 && m2ndPrevChar === 8204) {
    deleteBackward();
    deleteBackward();
    appendChar(String.fromCharCode(3475));
    mPrevChar = 3475;
    m2ndPrevChar = m3rdPrevChar;
    m3rdPrevChar = 0;
  } else if (primaryCode === 3530 && mPrevChar === 3476) {
    deleteBackward();
    appendChar(String.fromCharCode(3477));
    mPrevChar = 3477;
  } else if (primaryCode === 3551 && mPrevChar === 3476) {
    deleteBackward();
    appendChar(String.fromCharCode(3478));
    mPrevChar = 3478;
  } else if (primaryCode === 3545) {
    if (mPrevChar === 3545 && m2ndPrevChar === 8204) {
      deleteBackward();
      appendChar(String.fromCharCode(3547));
      mPrevChar = 3547;
    } else {
      appendChar(String.fromCharCode(8204));
      appendChar(String.fromCharCode(3545));
      m3rdPrevChar = mPrevChar;
      m2ndPrevChar = 8204;
      mPrevChar = 3545;
    }
  } else if (
    mPrevChar === 3545 &&
    m2ndPrevChar === 8204 &&
    VYANJANA_LIST.indexOf(primaryCode) !== -1
  ) {
    deleteBackward();
    deleteBackward();
    appendChar(String.fromCharCode(primaryCode));
    appendChar(String.fromCharCode(3545));
    m2ndPrevChar = primaryCode;
    mPrevChar = 3545;
  } else if (
    mPrevChar === 3547 &&
    m2ndPrevChar === 8204 &&
    VYANJANA_LIST.indexOf(primaryCode) !== -1
  ) {
    deleteBackward();
    deleteBackward();
    appendChar(String.fromCharCode(primaryCode));
    appendChar(String.fromCharCode(3547));
    m2ndPrevChar = primaryCode;
    mPrevChar = 3547;
  } else if (primaryCode === 3530 && mPrevChar === 3545) {
    deleteBackward();
    appendChar(String.fromCharCode(3546));
    mPrevChar = 3546;
  } else if (primaryCode === 3535 && mPrevChar === 3545) {
    deleteBackward();
    appendChar(String.fromCharCode(3548));
    mPrevChar = 3548;
  } else if (primaryCode === 3530 && mPrevChar === 3548) {
    deleteBackward();
    appendChar(String.fromCharCode(3549));
    mPrevChar = 3549;
  } else if (primaryCode === 3551 && mPrevChar === 3545) {
    deleteBackward();
    appendChar(String.fromCharCode(3550));
    mPrevChar = 3550;
  } else if (primaryCode === 3544 && mPrevChar === 3544) {
    deleteBackward();
    appendChar(String.fromCharCode(3570));
    mPrevChar = 3570;
  } else if (primaryCode === 3694) {
    // Yansaya
    var prefix = 0;
    if (mPrevChar !== 3530) {
      if (mPrevChar === 3545 || mPrevChar === 3547) {
        prefix = mPrevChar;
        deleteBackward();
      }
      appendChar(String.fromCharCode(3530));
      appendChar(String.fromCharCode(8205));
      appendChar(String.fromCharCode(3514));
    } else {
      appendChar(String.fromCharCode(8205));
      appendChar(String.fromCharCode(3514));
    }
    if (prefix > 0) {
      appendChar(String.fromCharCode(prefix));
      m3rdPrevChar = 8205;
      m2ndPrevChar = 3514;
      mPrevChar = prefix;
    } else {
      m3rdPrevChar = 3530;
      m2ndPrevChar = 8205;
      mPrevChar = 3514;
    }
  } else if (primaryCode === 3696) {
    // Rakaransaya
    var prefix = 0;
    if (mPrevChar !== 3530) {
      if (mPrevChar === 3545 || mPrevChar === 3547) {
        prefix = mPrevChar;
        deleteBackward();
      }
      appendChar(String.fromCharCode(3530));
      appendChar(String.fromCharCode(8205));
      appendChar(String.fromCharCode(3515));
    } else {
      appendChar(String.fromCharCode(8205));
      appendChar(String.fromCharCode(3515));
    }
    if (prefix > 0) {
      appendChar(String.fromCharCode(prefix));
      m3rdPrevChar = 8205;
      m2ndPrevChar = 3515;
      mPrevChar = prefix;
    } else {
      m3rdPrevChar = 3530;
      m2ndPrevChar = 8205;
      mPrevChar = 3515;
    }
  } else if (primaryCode === 3697) {
    // Rephaya (~)
    var prefix = 0;
    if (mPrevChar === 3545 || mPrevChar === 3547) {
      if (VYANJANA_LIST.indexOf(m2ndPrevChar) !== -1) {
        prefix = mPrevChar;
        deleteBackward();
      }
    }
    if (VYANJANA_LIST.indexOf(mPrevChar) !== -1) {
      var prev = mPrevChar;
      deleteBackward();
      appendChar(String.fromCharCode(3515));
      appendChar(String.fromCharCode(3530));
      appendChar(String.fromCharCode(8205));
      appendChar(String.fromCharCode(prev));
      if (prefix > 0) {
        appendChar(String.fromCharCode(prefix));
        m3rdPrevChar = 8205;
        m2ndPrevChar = prev;
        mPrevChar = prefix;
      } else {
        m3rdPrevChar = 3530;
        m2ndPrevChar = 8205;
        mPrevChar = prev;
      }
    }
  } else if (primaryCode === 3695) {
    // Lu (ළු)
    appendChar(String.fromCharCode(3525));
    appendChar(String.fromCharCode(3540));
    m3rdPrevChar = mPrevChar;
    m2ndPrevChar = 3525;
    mPrevChar = 3540;
  } else if (primaryCode === 8205) {
    var prefix = 0;
    if (mPrevChar !== 3530) {
      if (mPrevChar === 3545 || mPrevChar === 3547) {
        prefix = mPrevChar;
        deleteBackward();
      }
      appendChar(String.fromCharCode(3530));
    }
    appendChar(String.fromCharCode(8205));
    if (prefix > 0) {
      appendChar(String.fromCharCode(prefix));
      m3rdPrevChar = 3530;
      m2ndPrevChar = 8205;
      mPrevChar = prefix;
    } else {
      m3rdPrevChar = m2ndPrevChar;
      m2ndPrevChar = 3530;
      mPrevChar = 8205;
    }
  } else {
    appendChar(String.fromCharCode(primaryCode));
    m3rdPrevChar = m2ndPrevChar;
    m2ndPrevChar = mPrevChar;
    mPrevChar = primaryCode;
  }
}

// ==========================================================================
// Interactive Key Map Data & Renderer
// ==========================================================================

const PHONETIC_GUIDE = {
  vowels: [
    { si: 'අ', key: 'a', insert: 'අ' },
    { si: 'ආ', key: 'aa', insert: 'ආ' },
    { si: 'ඇ', key: 'A', insert: 'ඇ' },
    { si: 'ඈ', key: 'Aa / AA', insert: 'ඈ' },
    { si: 'ඉ', key: 'i', insert: 'ඉ' },
    { si: 'ඊ', key: 'ii / I', insert: 'ඊ' },
    { si: 'උ', key: 'u', insert: 'උ' },
    { si: 'ඌ', key: 'uu', insert: 'ඌ' },
    { si: 'ඍ', key: 'R', insert: 'ඍ' },
    { si: 'ඎ', key: 'Ru', insert: 'ඎ' },
    { si: 'එ', key: 'e', insert: 'එ' },
    { si: 'ඒ', key: 'ee', insert: 'ඒ' },
    { si: 'ඓ', key: 'ai / E', insert: 'ඓ' },
    { si: 'ඔ', key: 'o', insert: 'ඔ' },
    { si: 'ඕ', key: 'oo', insert: 'ඕ' },
    { si: 'ඖ', key: 'au / ou', insert: 'ඖ' },
    { si: 'ං', key: 'x / zn', insert: 'ං' },
    { si: 'ඃ', key: 'H', insert: 'ඃ' }
  ],
  consonants: [
    { si: 'ක', key: 'ka', insert: 'ක' },
    { si: 'ඛ', key: 'kha', insert: 'ඛ' },
    { si: 'ග', key: 'ga', insert: 'ග' },
    { si: 'ඝ', key: 'gha / Ga', insert: 'ඝ' },
    { si: 'ඞ', key: 'Xa', insert: 'ඞ' },
    { si: 'ච', key: 'cha', insert: 'ච' },
    { si: 'ඡ', key: 'chha', insert: 'ඡ' },
    { si: 'ජ', key: 'ja', insert: 'ජ' },
    { si: 'ඣ', key: 'jha / Ja', insert: 'ඣ' },
    { si: 'ඤ', key: 'zka', insert: 'ඤ' },
    { si: 'ඥ', key: 'zha', insert: 'ඥ' },
    { si: 'ට', key: 'ta', insert: 'ට' },
    { si: 'ඨ', key: 'Ta', insert: 'ඨ' },
    { si: 'ඩ', key: 'da', insert: 'ඩ' },
    { si: 'ඪ', key: 'Da', insert: 'ඪ' },
    { si: 'ණ', key: 'Na', insert: 'ණ' },
    { si: 'ත', key: 'tha', insert: 'ත' },
    { si: 'ථ', key: 'Tha / thha', insert: 'ථ' },
    { si: 'ද', key: 'dha / qa', insert: 'ද' },
    { si: 'ධ', key: 'dhha / qha', insert: 'ධ' },
    { si: 'න', key: 'na', insert: 'න' },
    { si: 'ප', key: 'pa', insert: 'ප' },
    { si: 'ඵ', key: 'pha / Pa', insert: 'ඵ' },
    { si: 'බ', key: 'ba', insert: 'බ' },
    { si: 'භ', key: 'bha', insert: 'භ' },
    { si: 'ම', key: 'ma', insert: 'ම' },
    { si: 'ඹ', key: 'Ba', insert: 'ඹ' },
    { si: 'ය', key: 'ya', insert: 'ය' },
    { si: 'ර', key: 'ra', insert: 'ර' },
    { si: 'ල', key: 'la', insert: 'ල' },
    { si: 'ව', key: 'wa / va', insert: 'ව' },
    { si: 'ශ', key: 'sha', insert: 'ශ' },
    { si: 'ෂ', key: 'Sa', insert: 'ෂ' },
    { si: 'ස', key: 'sa', insert: 'ස' },
    { si: 'හ', key: 'ha', insert: 'හ' },
    { si: 'ළ', key: 'La', insert: 'ළ' },
    { si: 'ෆ', key: 'fa', insert: 'ෆ' }
  ],
  special: [
    { si: 'ඟ', key: 'zga', insert: 'ඟ' },
    { si: 'ඦ', key: 'zja', insert: 'ඦ' },
    { si: 'ඬ', key: 'zda', insert: 'ඬ' },
    { si: 'ඳ', key: 'zdha / zqa', insert: 'ඳ' },
    { si: 'ක්‍ර', key: 'kra', insert: 'ක්‍ර' },
    { si: 'ක්‍ය', key: 'kya', insert: 'ක්‍ය' },
    { si: 'කෘ', key: 'kR / kru', insert: 'කෘ' },
    { si: 'කෲ', key: 'kRR / kruu', insert: 'කෲ' },
    { si: 'කැ', key: 'kA', insert: 'කැ' },
    { si: 'කෑ', key: 'kAa / kAA', insert: 'කෑ' },
    { si: 'කෛ', key: 'kai / kE', insert: 'කෛ' },
    { si: 'කෞ', key: 'kau / kou', insert: 'කෞ' },
    { si: 'ළු', key: 'Lu', insert: 'ළු' },
    { si: 'ළූ', key: 'Luu', insert: 'ළූ' },
    { si: 'ශ්‍රී', key: 'shrii', insert: 'ශ්‍රී' }
  ]
};

const WIJESEKARA_GUIDE = {
  vowels: [
    { si: 'අ', key: 'w', insert: 'අ' },
    { si: 'ආ', key: 'wd', insert: 'ආ' },
    { si: 'ඇ', key: 'we', insert: 'ඇ' },
    { si: 'ඈ', key: 'wE', insert: 'ඈ' },
    { si: 'ඉ', key: 'b', insert: 'ඉ' },
    { si: 'ඊ', key: 'B', insert: 'ඊ' },
    { si: 'උ', key: 'W', insert: 'උ' },
    { si: 'ඌ', key: 'WA', insert: 'ඌ' },
    { si: 'ඍ', key: 'R', insert: 'ඍ' },
    { si: 'එ', key: 't', insert: 'එ' },
    { si: 'ඒ', key: 'ta', insert: 'ඒ' },
    { si: 'ඓ', key: 'ft', insert: 'ඓ' },
    { si: 'ඔ', key: 'T', insert: 'ඔ' },
    { si: 'ඕ', key: 'Ta', insert: 'ඕ' },
    { si: 'ඖ', key: 'TA', insert: 'ඖ' },
    { si: 'ං', key: 'x', insert: 'ං' }
  ],
  consonants: [
    { si: 'ක', key: 'l', insert: 'ක' },
    { si: 'ඛ', key: 'L', insert: 'ඛ' },
    { si: 'ග', key: '.', insert: 'ග' },
    { si: 'ඝ', key: '>', insert: 'ඝ' },
    { si: 'ඞ', key: 'X', insert: 'ඞ' },
    { si: 'ච', key: 'p', insert: 'ච' },
    { si: 'ඡ', key: 'P', insert: 'ඡ' },
    { si: 'ජ', key: 'c', insert: 'ජ' },
    { si: 'ඣ', key: 'C', insert: 'ඣ' },
    { si: 'ඤ', key: '[', insert: 'ඤ' },
    { si: 'ඥ', key: '{', insert: 'ඥ' },
    { si: 'ට', key: 'g', insert: 'ට' },
    { si: 'ඨ', key: 'G', insert: 'ඨ' },
    { si: 'ඩ', key: 'o', insert: 'ඩ' },
    { si: 'ඪ', key: 'O', insert: 'ඪ' },
    { si: 'ණ', key: 'K', insert: 'ණ' },
    { si: 'ත', key: ';', insert: 'ත' },
    { si: 'ථ', key: ':', insert: 'ථ' },
    { si: 'ද', key: 'v', insert: 'ද' },
    { si: 'ධ', key: 'V', insert: 'ධ' },
    { si: 'න', key: 'k', insert: 'න' },
    { si: 'ප', key: 'm', insert: 'ප' },
    { si: 'ඵ', key: 'M', insert: 'ඵ' },
    { si: 'බ', key: 'n', insert: 'බ' },
    { si: 'භ', key: 'N', insert: 'භ' },
    { si: 'ම', key: 'u', insert: 'ම' },
    { si: 'ඹ', key: 'U', insert: 'ඹ' },
    { si: 'ය', key: 'h', insert: 'ය' },
    { si: 'ර', key: 'r', insert: 'ර' },
    { si: 'ල', key: ',', insert: 'ල' },
    { si: 'ව', key: 'j', insert: 'ව' },
    { si: 'ශ', key: 'Y', insert: 'ශ' },
    { si: 'ෂ', key: 'I', insert: 'ෂ' },
    { si: 'ස', key: 'i', insert: 'ස' },
    { si: 'හ', key: 'y', insert: 'හ' },
    { si: 'ළ', key: '<', insert: 'ළ' },
    { si: 'ෆ', key: 'F', insert: 'ෆ' }
  ],
  special: [
    { si: '්', key: 'a', insert: '්' },
    { si: 'ා', key: 'd', insert: 'ා' },
    { si: 'ැ', key: 'e', insert: 'ැ' },
    { si: 'ෑ', key: 'E', insert: 'ෑ' },
    { si: 'ි', key: 's', insert: 'ි' },
    { si: 'ී', key: 'S', insert: 'ී' },
    { si: 'ු', key: 'q', insert: 'ු' },
    { si: 'ූ', key: 'Q', insert: 'ූ' },
    { si: 'ෘ', key: 'D', insert: 'ෘ' },
    { si: 'ෙ', key: 'f', insert: 'ෙ' },
    { si: '්‍ය', key: 'H', insert: '්‍\u200Dය' },
    { si: '්‍ර', key: '`', insert: '්‍\u200Dර' },
    { si: 'ළු', key: 'J', insert: 'ළු' },
    { si: 'ඟ', key: 'Alt+.', insert: 'ඟ' },
    { si: 'ඳ', key: 'Alt+v', insert: 'ඳ' },
    { si: 'ඬ', key: 'Alt+o', insert: 'ඬ' }
  ]
};

let activeGuideCategory = 'all';
const guideGridEl = document.getElementById('guide-grid');
const guideSearchEl = document.getElementById('guide-search');
const guideModeTitleEl = document.getElementById('guide-mode-title');
const guideTipsEl = document.getElementById('guide-tips');

function renderKeyGuide() {
  if (!guideGridEl) return;

  const isWijesekara = type === 'wijesekara';
  const dataset = isWijesekara ? WIJESEKARA_GUIDE : PHONETIC_GUIDE;
  const query = (guideSearchEl ? guideSearchEl.value : '').trim().toLowerCase();

  guideModeTitleEl.textContent = isWijesekara ? 'Wijesekara Key Map' : 'Phonetic (Singlish) Key Map';

  if (guideTipsEl) {
    if (isWijesekara) {
      guideTipsEl.innerHTML = `
        <div class="tip-row">
          <span class="tip-badge">l → ක</span>
          <span class="tip-badge">la → ක්</span>
          <span class="tip-badge">ld → කා</span>
          <span class="tip-badge">fl → කෙ</span>
          <span class="tip-badge">lH → ක්‍ය</span>
          <span class="tip-badge">l\` → ක්‍ර</span>
          <span class="tip-badge">Alt+v → ඳ</span>
        </div>
      `;
    } else {
      guideTipsEl.innerHTML = `
        <div class="tip-row">
          <span class="tip-badge">k → ක්</span>
          <span class="tip-badge">ka → ක</span>
          <span class="tip-badge">kaa → කා</span>
          <span class="tip-badge">kA → කැ</span>
          <span class="tip-badge">kr → ක්‍ර</span>
          <span class="tip-badge">ky → ක්‍ය</span>
          <span class="tip-badge">zg → ඟ</span>
          <span class="tip-badge">zdh → ඳ</span>
        </div>
      `;
    }
  }

  const sections = [
    { id: 'vowels', label: 'ස්වර · Vowels', items: dataset.vowels },
    { id: 'consonants', label: 'ව්‍යංජන · Consonants', items: dataset.consonants },
    { id: 'special', label: 'බැඳි සහ පිලි · Special & Modifiers', items: dataset.special }
  ];

  guideGridEl.innerHTML = '';
  let totalRendered = 0;

  sections.forEach((sec) => {
    if (activeGuideCategory !== 'all' && activeGuideCategory !== sec.id) return;

    const filtered = sec.items.filter((item) => {
      if (!query) return true;
      return item.si.includes(query) || item.key.toLowerCase().includes(query);
    });

    if (filtered.length === 0) return;
    totalRendered += filtered.length;

    const sectionWrap = document.createElement('div');
    if (activeGuideCategory === 'all') {
      const title = document.createElement('h3');
      title.className = 'guide-section-title';
      title.textContent = sec.label;
      sectionWrap.appendChild(title);
    }

    const grid = document.createElement('div');
    grid.className = 'key-grid';

    filtered.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key-chip';
      btn.title = `Click to insert ${item.si} (${item.key})`;
      btn.innerHTML = `
        <span class="key-sinhala">${escapeHtml(item.si)}</span>
        <span class="key-roman">${escapeHtml(item.key)}</span>
      `;
      btn.addEventListener('click', () => {
        cleanDanglingZ();
        inputElement.focus();
        appendChar(item.insert);
        syncContextFromCursor();
        updateLiveFeedback(item.key);
      });
      grid.appendChild(btn);
    });

    sectionWrap.appendChild(grid);
    guideGridEl.appendChild(sectionWrap);
  });

  if (totalRendered === 0) {
    guideGridEl.innerHTML = `<div class="guide-empty">No matching keys found for "${escapeHtml(query)}"</div>`;
  }
}

document.querySelectorAll('.guide-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.guide-tab').forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    activeGuideCategory = tab.dataset.category || 'all';
    renderKeyGuide();
  });
});

if (guideSearchEl) {
  guideSearchEl.addEventListener('input', renderKeyGuide);
}

// Toggle Key Guide Drawer (Off / collapsed by default)
const toggleGuideBtn = document.getElementById('toggle-guide-btn');
const workspaceEl = document.getElementById('workspace');

if (toggleGuideBtn && workspaceEl) {
  const savedGuideOpen = localStorage.getItem('helakuru_guide_open_v2') === 'true';
  workspaceEl.classList.toggle('guide-collapsed', !savedGuideOpen);
  toggleGuideBtn.classList.toggle('active', savedGuideOpen);
  toggleGuideBtn.setAttribute('aria-expanded', String(savedGuideOpen));

  toggleGuideBtn.addEventListener('click', () => {
    const isCollapsed = workspaceEl.classList.toggle('guide-collapsed');
    toggleGuideBtn.classList.toggle('active', !isCollapsed);
    toggleGuideBtn.setAttribute('aria-expanded', String(!isCollapsed));
    localStorage.setItem('helakuru_guide_open_v2', String(!isCollapsed));
  });
}

// ==========================================================================
// Theme Persistence, Font Scaling, Word Counter & Actions
// ==========================================================================

const themeBtn = document.getElementById('theme-btn');
const metaThemeColor = document.getElementById('meta-theme-color');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#131210');
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#F6F4EF');
  }
  localStorage.setItem('helakuru_theme_v2', theme);
}

const savedTheme = localStorage.getItem('helakuru_theme_v2') || 'dark';
applyTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(isDark ? 'light' : 'dark');
  });
}

// Font size adjuster
let currentFontSize = parseInt(localStorage.getItem('helakuru_font_size') || '20', 10);
if (isNaN(currentFontSize) || currentFontSize < 14 || currentFontSize > 36) {
  currentFontSize = 20;
}
document.documentElement.style.setProperty('--editor-font-size', currentFontSize + 'px');

document.getElementById('font-dec')?.addEventListener('click', () => {
  currentFontSize = Math.max(14, currentFontSize - 2);
  document.documentElement.style.setProperty('--editor-font-size', currentFontSize + 'px');
  localStorage.setItem('helakuru_font_size', String(currentFontSize));
});

document.getElementById('font-inc')?.addEventListener('click', () => {
  currentFontSize = Math.min(36, currentFontSize + 2);
  document.documentElement.style.setProperty('--editor-font-size', currentFontSize + 'px');
  localStorage.setItem('helakuru_font_size', String(currentFontSize));
});

// Word & Grapheme Cluster Counter + Draft Persistence
const graphemeSegmenter =
  typeof Intl !== 'undefined' && Intl.Segmenter
    ? new Intl.Segmenter('si', { granularity: 'grapheme' })
    : null;

function countGraphemes(str) {
  if (!str) return 0;
  if (graphemeSegmenter) {
    let count = 0;
    for (const _ of graphemeSegmenter.segment(str)) {
      count++;
    }
    return count;
  }
  return Array.from(str).length;
}

function onEditorContentChange() {
  const val = inputElement.value;
  const trimmed = val.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = countGraphemes(val);

  if (wordCountEl) wordCountEl.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
  if (charCountEl) charCountEl.textContent = `${chars} ${chars === 1 ? 'char' : 'chars'}`;

  try {
    localStorage.setItem('helakuru_draft', val);
    if (draftStatusEl) {
      draftStatusEl.textContent = val.length > 0 ? 'Draft saved' : 'Ready';
    }
  } catch (_) {
    // Ignore storage quota errors
  }
}

inputElement.addEventListener('input', onEditorContentChange);

// Restore saved draft on startup
const savedDraft = localStorage.getItem('helakuru_draft');
if (savedDraft) {
  inputElement.value = savedDraft;
}

// Initialize mode & counters
setActiveMode(type, false);
onEditorContentChange();

// Action Buttons: Clear, Copy, Download
const clearButton = document.querySelector('[data-action="clear"]');
const copyButton = document.querySelector('[data-action="copy"]');
const downloadButton = document.querySelector('[data-action="download"]');

clearButton?.addEventListener('click', () => {
  if (!inputElement.value) {
    inputElement.focus();
    return;
  }
  inputElement.value = '';
  mPrevChar = 0;
  m2ndPrevChar = 0;
  m3rdPrevChar = 0;
  onEditorContentChange();
  liveFeedbackEl.textContent = 'Cleared editor';
  inputElement.focus();
});

let copyResetTimer = null;
copyButton?.addEventListener('click', () => {
  cleanDanglingZ();
  const textToCopy = inputElement.value;
  if (!textToCopy) {
    inputElement.focus();
    return;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    const labelSpan = copyButton.querySelector('.btn-label');
    const defaultIcon = copyButton.querySelector('.icon-copy-default');
    const checkIcon = copyButton.querySelector('.icon-copy-check');

    copyButton.classList.add('copied');
    if (labelSpan) labelSpan.textContent = 'Copied';
    if (defaultIcon) defaultIcon.style.display = 'none';
    if (checkIcon) checkIcon.style.display = 'block';

    if (copyResetTimer) clearTimeout(copyResetTimer);
    copyResetTimer = setTimeout(() => {
      copyButton.classList.remove('copied');
      if (labelSpan) labelSpan.textContent = 'Copy';
      if (defaultIcon) defaultIcon.style.display = 'block';
      if (checkIcon) checkIcon.style.display = 'none';
    }, 1800);
  }).catch((err) => {
    console.error('Error copying text: ', err);
  });
});

downloadButton?.addEventListener('click', () => {
  cleanDanglingZ();
  const textToDownload = inputElement.value;
  if (!textToDownload) {
    inputElement.focus();
    return;
  }

  const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'sinhala-document.txt';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
});
