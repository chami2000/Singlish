// --- Typing Mode Selection ---
const typingModeLabels = document.querySelectorAll('.typing-mode label');
const phoneticLabel = document.getElementById('label-phonetic');
const wijesekaraLabel = document.getElementById('label-wijesekara');

function setActiveMode(mode) {
    if (mode === 'wijesekara') {
        wijesekaraLabel.classList.add('active');
        phoneticLabel.classList.remove('active');
        document.getElementById('wijesekara').checked = true;
    } else {
        phoneticLabel.classList.add('active');
        wijesekaraLabel.classList.remove('active');
        document.getElementById('phonetic').checked = true;
    }
}

const savedType = localStorage.getItem('type') || 'phonetic';
setActiveMode(savedType);

typingModeLabels.forEach(label => {
    label.addEventListener('click', () => {
        const selectedType = label.htmlFor;
        localStorage.setItem('type', selectedType);
        setActiveMode(selectedType);
        window.location.reload(); 
    });
});

// --- Core Conversion Logic (from content.js) ---
var mPrevChar = 0;
var m2ndPrevChar = 0;
var m3rdPrevChar = 0;
var state = "enable";
var type = localStorage.getItem('type') || 'phonetic';
var defprev = false;

const inputElement = document.getElementById('converter');

inputElement.addEventListener("keydown", function(ev){
    if(ev.keyCode === 8 && state == "enable") {
        mPrevChar = m2ndPrevChar;
        m2ndPrevChar = m3rdPrevChar;
        m3rdPrevChar = 0;
    }
});

inputElement.addEventListener("keypress", EventHandler, true);

function EventHandler(evt) {
    if (document.activeElement.id !== "converter") return;

    var charStr = String.fromCharCode(evt.which);
    var preventDflt = false;
    
    // The check "&& inputElement.value.length > 0" has been REMOVED to make the
    // behavior consistent for the first character and all subsequent characters.
    if (state=="enable" && ((type=='phonetic' && ENGLISH_TO_SINHALA[charStr]) || (type=='wijesekara' && ENGLISH_TO_SINHALA_WIJESEKARA[charStr]))) {
        evt.preventDefault();
        preventDflt = true;
    }
    else {
        preventDflt = false;
    }
    
    if (evt.defaultPrevented == true && preventDflt == false) {
        defprev = true;
    }
    
    var charStr = String.fromCharCode(evt.which);
    
    if(state=="enable") {         
        if(type=='phonetic') {
            if (ENGLISH_TO_SINHALA[charStr]){
                if (!evt.defaultPrevented) deleteDefault();
                handlePhonetic(charStr);
                return false;
            }
            else {
                m3rdPrevChar = m2ndPrevChar;
                m2ndPrevChar = mPrevChar;
                mPrevChar = evt.which;
                return false;
            }
        }
        else if(type=='wijesekara') {
            if (VYANJANA_SANYAKA_LIST.indexOf(ENGLISH_TO_SINHALA_WIJESEKARA[charStr]) != '-1' && evt.altKey) {
                var primaryCode = ENGLISH_TO_SINHALA_WIJESEKARA[charStr];
                appendChar(VYANJANA_SANYAKA_MAP[primaryCode]);
                m3rdPrevChar = m2ndPrevChar;
                m2ndPrevChar = mPrevChar;
                mPrevChar = primaryCode;
                return false;
            }
            else if (ENGLISH_TO_SINHALA_WIJESEKARA[charStr]) {
                if (!evt.defaultPrevented || !preventDflt) deleteDefault();
                handleWijesekara(charStr);
                return false;
            }
            else {
                m3rdPrevChar = m2ndPrevChar;
                m2ndPrevChar = mPrevChar;
                mPrevChar = evt.which;
                return false;
            }
        }
        else {
            if (evt.defaultPrevented) appendChar(charStr);
            m3rdPrevChar = m2ndPrevChar;
            m2ndPrevChar = mPrevChar;
            mPrevChar = evt.which;
            return false;
        }
    }
    else {
        if (evt.defaultPrevented) appendChar(charStr);
        m3rdPrevChar = m2ndPrevChar;
        m2ndPrevChar = mPrevChar;
        mPrevChar = evt.which;
        return false;
    }
}

var SWARA_EXCEPT_AYANNA = [3463, 3465, 3467, 3469, 3471, 3473, 3476];
var VYANJANA_LIST = [3482, 3483, 3484, 3485, 3487, 3488, 3489, 3490, 3491, 3492, 3493, 3494, 3495, 3496, 3497, 3498, 3499, 3500, 3501, 3502, 3503, 3504, 3505, 3507, 3508, 3509, 3510, 3511, 3512, 3513, 3514, 3515, 3517, 3520, 3521, 3522, 3523, 3524, 3525, 3526];
var PILI_EXCEPT_ALAPILLA = [3536, 3538, 3540, 3544, 3551, 3545, 3548];
var SWARA_PILI = [3536, 3538, 3540, 3544, 3545, 3548, 3551];
var VYANJANA_H_LIST = [3495, 3500, 3501, 3496, 3497, 3503, 3523, 3522, 3488, 3482, 3510, 3484, 3508, 3687, 3688];
var VYANJANA_SANYAKA_LIST = [3497, 3503, 3484, 3490, 3505, 3524, 3482];
var SWARA_DIRGA_SWARA_MAP = [];
SWARA_DIRGA_SWARA_MAP[3463] = 3464;SWARA_DIRGA_SWARA_MAP[3465] = 3466;SWARA_DIRGA_SWARA_MAP[3467] = 3468;SWARA_DIRGA_SWARA_MAP[3469] = 3470;SWARA_DIRGA_SWARA_MAP[3471] = 3472;SWARA_DIRGA_SWARA_MAP[3473] = 3474;SWARA_DIRGA_SWARA_MAP[3476] = 3477;
var SHIFTED_KEYS = [];
SHIFTED_KEYS[3461] = 3463;SHIFTED_KEYS[3473] = 3475;SHIFTED_KEYS[3505] = 3499;SHIFTED_KEYS[3517] = 3525;SHIFTED_KEYS[3484] = 3485;SHIFTED_KEYS[3495] = 3496;SHIFTED_KEYS[3497] = 3498;SHIFTED_KEYS[3508] = 3509;SHIFTED_KEYS[3510] = 3513;SHIFTED_KEYS[3523] = 3522;SHIFTED_KEYS[3488] = 3489;SHIFTED_KEYS[3465] = 3466;SHIFTED_KEYS[3458] = 3486;SHIFTED_KEYS[3524] = 3459;SHIFTED_KEYS[3490] = 3491;SHIFTED_KEYS[3515] = 3469;
var SWARA_PILI_MAP = [];
SWARA_PILI_MAP[3463] = 3536;SWARA_PILI_MAP[3465] = 3538;SWARA_PILI_MAP[3467] = 3540;SWARA_PILI_MAP[3469] = 3544;SWARA_PILI_MAP[3471] = 3551;SWARA_PILI_MAP[3473] = 3545;SWARA_PILI_MAP[3476] = 3548;
var SWARA_DIRGA_PILI_MAP = [];
SWARA_DIRGA_PILI_MAP[3463] = 3537;SWARA_DIRGA_PILI_MAP[3465] = 3539;SWARA_DIRGA_PILI_MAP[3467] = 3542;SWARA_DIRGA_PILI_MAP[3469] = 3560;SWARA_DIRGA_PILI_MAP[3471] = 3561;SWARA_DIRGA_PILI_MAP[3473] = 3546;SWARA_DIRGA_PILI_MAP[3476] = 3549;
var VYANJANA_H_MAP = [];
VYANJANA_H_MAP[3495] = 3501;VYANJANA_H_MAP[3501] = 3502;VYANJANA_H_MAP[3496] = 3502;VYANJANA_H_MAP[3497] = 3503;VYANJANA_H_MAP[3503] = 3504;VYANJANA_H_MAP[3523] = 3521;VYANJANA_H_MAP[3522] = 3522;VYANJANA_H_MAP[3488] = 3489;VYANJANA_H_MAP[3482] = 3483;VYANJANA_H_MAP[3510] = 3511;VYANJANA_H_MAP[3484] = 3485;VYANJANA_H_MAP[3508] = 3509;VYANJANA_H_MAP[3500] = 3507;VYANJANA_H_MAP[3687] = 3488;VYANJANA_H_MAP[3688] = 3489;
var VYANJANA_SANYAKA_MAP = [];
VYANJANA_SANYAKA_MAP[3497] = 3500;VYANJANA_SANYAKA_MAP[3503] = 3507;VYANJANA_SANYAKA_MAP[3484] = 3487;VYANJANA_SANYAKA_MAP[3490] = 3494;VYANJANA_SANYAKA_MAP[3505] = 3458;VYANJANA_SANYAKA_MAP[3524] = 3493;VYANJANA_SANYAKA_MAP[3482] = 3492;
var ENGLISH_TO_SINHALA = [];
ENGLISH_TO_SINHALA["q"] = 3503;ENGLISH_TO_SINHALA["w"] = 3520;ENGLISH_TO_SINHALA["e"] = 3473;ENGLISH_TO_SINHALA["r"] = 3515;ENGLISH_TO_SINHALA["t"] = 3495;ENGLISH_TO_SINHALA["y"] = 3514;ENGLISH_TO_SINHALA["u"] = 3467;ENGLISH_TO_SINHALA["i"] = 3465;ENGLISH_TO_SINHALA["o"] = 3476;ENGLISH_TO_SINHALA["p"] = 3508;ENGLISH_TO_SINHALA["a"] = 3461;ENGLISH_TO_SINHALA["s"] = 3523;ENGLISH_TO_SINHALA["d"] = 3497;ENGLISH_TO_SINHALA["f"] = 3526;ENGLISH_TO_SINHALA["g"] = 3484;ENGLISH_TO_SINHALA["h"] = 3524;ENGLISH_TO_SINHALA["j"] = 3490;ENGLISH_TO_SINHALA["k"] = 3482;ENGLISH_TO_SINHALA["l"] = 3517;ENGLISH_TO_SINHALA["z"] = 3962;ENGLISH_TO_SINHALA["x"] = 3458;ENGLISH_TO_SINHALA["c"] = 3687;ENGLISH_TO_SINHALA["v"] = 3520;ENGLISH_TO_SINHALA["b"] = 3510;ENGLISH_TO_SINHALA["n"] = 3505;ENGLISH_TO_SINHALA["m"] = 3512;
ENGLISH_TO_SINHALA["Q"] = 3503;ENGLISH_TO_SINHALA["W"] = 3520;ENGLISH_TO_SINHALA["E"] = 3475;ENGLISH_TO_SINHALA["R"] = 3469;ENGLISH_TO_SINHALA["T"] = 3496;ENGLISH_TO_SINHALA["Y"] = 3514;ENGLISH_TO_SINHALA["U"] = 3467;ENGLISH_TO_SINHALA["I"] = 3466;ENGLISH_TO_SINHALA["O"] = 3476;ENGLISH_TO_SINHALA["P"] = 3509;ENGLISH_TO_SINHALA["A"] = 3463;ENGLISH_TO_SINHALA["S"] = 3522;ENGLISH_TO_SINHALA["D"] = 3498;ENGLISH_TO_SINHALA["F"] = 3526;ENGLISH_TO_SINHALA["G"] = 3485;ENGLISH_TO_SINHALA["H"] = 3459;ENGLISH_TO_SINHALA["J"] = 3491;ENGLISH_TO_SINHALA["K"] = 3482;ENGLISH_TO_SINHALA["L"] = 3525;ENGLISH_TO_SINHALA["Z"] = 3962;ENGLISH_TO_SINHALA["X"] = 3486;ENGLISH_TO_SINHALA["C"] = 3687;ENGLISH_TO_SINHALA["V"] = 3520;ENGLISH_TO_SINHALA["B"] = 3513;ENGLISH_TO_SINHALA["N"] = 3499;ENGLISH_TO_SINHALA["M"] = 3512;
var ENGLISH_TO_SINHALA_WIJESEKARA = [];
ENGLISH_TO_SINHALA_WIJESEKARA["q"]=3540;ENGLISH_TO_SINHALA_WIJESEKARA["w"]=3461;ENGLISH_TO_SINHALA_WIJESEKARA["e"]=3536;ENGLISH_TO_SINHALA_WIJESEKARA["r"]=3515;ENGLISH_TO_SINHALA_WIJESEKARA["t"]=3473;ENGLISH_TO_SINHALA_WIJESEKARA["y"]=3524;ENGLISH_TO_SINHALA_WIJESEKARA["u"]=3512;ENGLISH_TO_SINHALA_WIJESEKARA["i"]=3523;ENGLISH_TO_SINHALA_WIJESEKARA["o"]=3503;ENGLISH_TO_SINHALA_WIJESEKARA["p"]=3488;ENGLISH_TO_SINHALA_WIJESEKARA["["]=3492;ENGLISH_TO_SINHALA_WIJESEKARA["]"]=59;ENGLISH_TO_SINHALA_WIJESEKARA["\\"]=8205;ENGLISH_TO_SINHALA_WIJESEKARA["a"]=3530;ENGLISH_TO_SINHALA_WIJESEKARA["s"]=3538;ENGLISH_TO_SINHALA_WIJESEKARA["d"]=3535;ENGLISH_TO_SINHALA_WIJESEKARA["f"]=3545;ENGLISH_TO_SINHALA_WIJESEKARA["g"]=3495;ENGLISH_TO_SINHALA_WIJESEKARA["h"]=3514;ENGLISH_TO_SINHALA_WIJESEKARA["j"]=3520;ENGLISH_TO_SINHALA_WIJESEKARA["k"]=3505;ENGLISH_TO_SINHALA_WIJESEKARA["l"]=3482;ENGLISH_TO_SINHALA_WIJESEKARA[";"]=3501;ENGLISH_TO_SINHALA_WIJESEKARA["'"]=46;ENGLISH_TO_SINHALA_WIJESEKARA["z"]=39;ENGLISH_TO_SINHALA_WIJESEKARA["x"]=3458;ENGLISH_TO_SINHALA_WIJESEKARA["c"]=3490;ENGLISH_TO_SINHALA_WIJESEKARA["v"]=3497;ENGLISH_TO_SINHALA_WIJESEKARA["b"]=3465;ENGLISH_TO_SINHALA_WIJESEKARA["n"]=3510;ENGLISH_TO_SINHALA_WIJESEKARA["m"]=3508;ENGLISH_TO_SINHALA_WIJESEKARA[","]=3517;ENGLISH_TO_SINHALA_WIJESEKARA["."]=3484;ENGLISH_TO_SINHALA_WIJESEKARA["/"]=47;ENGLISH_TO_SINHALA_WIJESEKARA["`"]=3696;
ENGLISH_TO_SINHALA_WIJESEKARA["Q"]=3542;ENGLISH_TO_SINHALA_WIJESEKARA["W"]=3467;ENGLISH_TO_SINHALA_WIJESEKARA["E"]=3537;ENGLISH_TO_SINHALA_WIJESEKARA["R"]=3469;ENGLISH_TO_SINHALA_WIJESEKARA["T"]=3476;ENGLISH_TO_SINHALA_WIJESEKARA["Y"]=3521;ENGLISH_TO_SINHALA_WIJESEKARA["U"]=3513;ENGLISH_TO_SINHALA_WIJESEKARA["I"]=3522;ENGLISH_TO_SINHALA_WIJESEKARA["O"]=3504;ENGLISH_TO_SINHALA_WIJESEKARA["P"]=3489;ENGLISH_TO_SINHALA_WIJESEKARA["{"]=3493;ENGLISH_TO_SINHALA_WIJESEKARA["}"]=58;ENGLISH_TO_SINHALA_WIJESEKARA["A"]=3551;ENGLISH_TO_SINHALA_WIJESEKARA["S"]=3539;ENGLISH_TO_SINHALA_WIJESEKARA["D"]=3544;ENGLISH_TO_SINHALA_WIJESEKARA["F"]=3526;ENGLISH_TO_SINHALA_WIJESEKARA["G"]=3496;ENGLISH_TO_SINHALA_WIJESEKARA["H"]=3694;ENGLISH_TO_SINHALA_WIJESEKARA["J"]=3695;ENGLISH_TO_SINHALA_WIJESEKARA["K"]=3499;ENGLISH_TO_SINHALA_WIJESEKARA["L"]=3483;ENGLISH_TO_SINHALA_WIJESEKARA[":"]=3502;ENGLISH_TO_SINHALA_WIJESEKARA["\""]=44;ENGLISH_TO_SINHALA_WIJESEKARA["Z"]=34;ENGLISH_TO_SINHALA_WIJESEKARA["X"]=3486;ENGLISH_TO_SINHALA_WIJESEKARA["C"]=3491;ENGLISH_TO_SINHALA_WIJESEKARA["V"]=3498;ENGLISH_TO_SINHALA_WIJESEKARA["B"]=3466;ENGLISH_TO_SINHALA_WIJESEKARA["N"]=3511;ENGLISH_TO_SINHALA_WIJESEKARA["M"]=3509;ENGLISH_TO_SINHALA_WIJESEKARA["<"]=3525;ENGLISH_TO_SINHALA_WIJESEKARA[">"]=3485;ENGLISH_TO_SINHALA_WIJESEKARA["?"]=63;ENGLISH_TO_SINHALA_WIJESEKARA["~"]=3697;ENGLISH_TO_SINHALA_WIJESEKARA["√"]=3500;ENGLISH_TO_SINHALA_WIJESEKARA["ø"]=3507;ENGLISH_TO_SINHALA_WIJESEKARA["≥"]=3487;ENGLISH_TO_SINHALA_WIJESEKARA["ç"]=3494;ENGLISH_TO_SINHALA_WIJESEKARA["¥"]=3493;ENGLISH_TO_SINHALA_WIJESEKARA["¬"]=3492;ENGLISH_TO_SINHALA_WIJESEKARA["æ"]=3572;

function appendChar(newText){
    document.execCommand('insertText', false, newText);
}

function deleteBackward(){
    document.execCommand("delete", false, null);
    if (mPrevChar) primaryCode = mPrevChar;
    if (m2ndPrevChar) mPrevChar = m2ndPrevChar;
    if (m3rdPrevChar) m2ndPrevChar = m3rdPrevChar;
    m3rdPrevChar = 0;
}

function deleteDefault(){
    document.execCommand("delete", false, null);
}

function handlePhonetic(charKey) {
    var primaryCode = ENGLISH_TO_SINHALA[charKey];
    if (mPrevChar == 3962) {
        if (VYANJANA_SANYAKA_LIST.indexOf(primaryCode) != '-1') {
            deleteBackward();
            primaryCode = VYANJANA_SANYaka_MAP[primaryCode];
            mPrevChar = primaryCode;
        } else {
            deleteBackward();
        }
    }
    if (primaryCode == 3461) {
        if (mPrevChar == 3530) {
            deleteBackward();
        } else {
            if (mPrevChar == 3461) {
                deleteBackward();
                primaryCode = 3462
            } else if (mPrevChar == 3463) {
                deleteBackward();
                primaryCode = 3464
            } else if (mPrevChar == 3536) {
                deleteBackward();
                primaryCode = 3537;
            } else if (VYANJANA_LIST.indexOf(mPrevChar) != '-1') {
                primaryCode = 3535;
            }
            mPrevChar = primaryCode;
            appendChar(String.fromCharCode(primaryCode));
        }
    } else if (primaryCode == 3463) {
        if (mPrevChar == 3530) {
            deleteBackward();
            primaryCode = 3536
        } else if (mPrevChar == 3536) {
            deleteBackward();
            primaryCode = 3537
        } else if (mPrevChar == 3461) {
            deleteBackward();
            primaryCode = 3463
        } else if (mPrevChar == 3463) {
            deleteBackward();
            primaryCode = 3464
        }
        appendChar(String.fromCharCode(primaryCode));
        mPrevChar = primaryCode;
    } else if (primaryCode == 3467) {
        if (mPrevChar == 3530) {
            if (m2ndPrevChar == 3515 && m3rdPrevChar == 8205) {
                deleteBackward();
                deleteBackward();
                deleteBackward();
                primaryCode = 3544;
            } else {
                deleteBackward();
                primaryCode = 3540;
            }
        } else if (mPrevChar == 3467) {
            deleteBackward();
            primaryCode = 3468;
        } else if (mPrevChar == 3540) {
            deleteBackward();
            primaryCode = 3542;
        } else if (mPrevChar == 3469) {
            deleteBackward();
            primaryCode = 3470;
        } else if (mPrevChar == 3544) {
            deleteBackward();
            primaryCode = 3570;
        } else if (mPrevChar == 3476 || mPrevChar == 3461) {
            deleteBackward();
            primaryCode = 3478;
        } else if (VYANJANA_LIST.indexOf(mPrevChar) != '-1') {
            primaryCode = 3550;
        }
        appendChar(String.fromCharCode(primaryCode));
        mPrevChar = primaryCode;
    } else if (SWARA_EXCEPT_AYANNA.indexOf(primaryCode) != '-1') {
        if (mPrevChar == 3530) {
            deleteBackward();
            primaryCode = SWARA_PILI_MAP[primaryCode];
        } else if (SWARA_PILI.indexOf(mPrevChar) != '-1' && mPrevChar == SWARA_PILI_MAP[primaryCode]) {
            deleteBackward();
            primaryCode = SWARA_DIRGA_PILI_MAP[primaryCode];
        } else if (primaryCode == 3465 && mPrevChar == 3461) {
            deleteBackward();
            primaryCode = 3475;
        } else if (primaryCode == 3465 && VYANJANA_LIST.indexOf(mPrevChar) != '-1') {
            primaryCode = 3547;
        } else if (primaryCode == 3467 && mPrevChar == 3461) {
            deleteBackward();
            primaryCode = 3478;
        } else if (primaryCode == 3467 && VYANJANA_LIST.indexOf(mPrevChar) != '-1') {
            primaryCode = 3550;
        } else if (primaryCode == mPrevChar) {
            deleteBackward();
            primaryCode = SWARA_DIRGA_SWARA_MAP[primaryCode];
        }
        appendChar(String.fromCharCode(primaryCode));
        mPrevChar = primaryCode;
    } else if (VYANJANA_LIST.indexOf(primaryCode) != '-1') {
        if (primaryCode == 3524 && mPrevChar == 3530 && VYANJANA_H_LIST.indexOf(m2ndPrevChar) != '-1') {
            primaryCode = VYANJANA_H_MAP[m2ndPrevChar];
            deleteBackward();
            deleteBackward();
            appendChar(String.fromCharCode(primaryCode));
        }
        else if (primaryCode == 3515 && mPrevChar == 3530) {
            appendChar(String.fromCharCode(8205));
            m2ndPrevChar = primaryCode
            mPrevChar = 8205
            appendChar(String.fromCharCode(primaryCode));
        }
        else if (primaryCode == 3514 && mPrevChar == 3530) {
            appendChar(String.fromCharCode(8205));
            m2ndPrevChar = primaryCode
            mPrevChar = 8205
            appendChar(String.fromCharCode(primaryCode));
        }
        else {
            appendChar(String.fromCharCode(primaryCode));
        }
        appendChar(String.fromCharCode(3530));
        m3rdPrevChar = mPrevChar;
        m2ndPrevChar = primaryCode;
        mPrevChar = 3530;
    } else if (primaryCode == 3687 || primaryCode == 3688) {
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
    if(primaryCode == 3535 && mPrevChar == 3461){
        deleteBackward();
        appendChar(String.fromCharCode(3462));
        mPrevChar = 3462;
    }else if (primaryCode == 3536 && mPrevChar == 3461) {
        deleteBackward();
        appendChar(String.fromCharCode(3463));
        mPrevChar = 3463;
    }else if (primaryCode == 3537 && mPrevChar == 3461) {
        deleteBackward();
        appendChar(String.fromCharCode(3464));
        mPrevChar = 3464;
    }else if (primaryCode == 3551 && mPrevChar == 3467) {
        deleteBackward();
        appendChar(String.fromCharCode(3468));
        mPrevChar = 3468;
    }else if (primaryCode == 3544 && mPrevChar == 3469) {
        deleteBackward();
        appendChar(String.fromCharCode(3470));
        mPrevChar = 3470;
    }else if (primaryCode == 3551 && mPrevChar == 3471) {
        deleteBackward();
        appendChar(String.fromCharCode(3472));
        mPrevChar = 3472;
    }else if (primaryCode == 3530 && mPrevChar == 3473) {
        deleteBackward();
        appendChar(String.fromCharCode(3474));
        mPrevChar = 3474;
    }else if (primaryCode == 3473 && mPrevChar == 3545
        && m2ndPrevChar == 8204) {
        deleteBackward();
        deleteBackward();
        appendChar(String.fromCharCode(3475));
        mPrevChar = 3475;
        m2ndPrevChar = m3rdPrevChar;
        m3rdPrevChar = 0
    }else if (primaryCode == 3530 && mPrevChar == 3476) {
        deleteBackward();
        appendChar(String.fromCharCode(3477));
        mPrevChar = 3477
    }else if (primaryCode == 3551 && mPrevChar == 3476) {
        deleteBackward();
        appendChar(String.fromCharCode(3478));
        mPrevChar = 3478;
    }else if (primaryCode == 3545) {
        if (mPrevChar == 3545 && m2ndPrevChar == 8204) {
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
    }else if (mPrevChar == 3545 && m2ndPrevChar == 8204
        &&  VYANJANA_LIST.indexOf(primaryCode) != '-1') {
        deleteBackward();
        deleteBackward();
        appendChar(String.fromCharCode(primaryCode));
        appendChar(String.fromCharCode(3545));
        m2ndPrevChar = primaryCode
        mPrevChar = 3545;
    }else if (mPrevChar == 3547 && m2ndPrevChar == 8204
        && VYANJANA_LIST.indexOf(primaryCode) != '-1') {
        deleteBackward();
        deleteBackward();
        appendChar(String.fromCharCode(primaryCode));
        appendChar(String.fromCharCode(3547));
        m2ndPrevChar = primaryCode;
        mPrevChar = 3547;
    }else if (primaryCode == 3530 && mPrevChar == 3545) {
        deleteBackward();
        appendChar(String.fromCharCode(3546));
        mPrevChar = 3546;
    }else if (primaryCode == 3535 && mPrevChar == 3545) {
        deleteBackward();
        appendChar(String.fromCharCode(3548));
        mPrevChar = 3548;
    }else if (primaryCode == 3530 && mPrevChar == 3548) {
        deleteBackward();
        appendChar(String.fromCharCode(3549));
        mPrevChar = 3549;
    }else if (primaryCode == 3551 && mPrevChar == 3545) {
        deleteBackward();
        appendChar(String.fromCharCode(3550));
        mPrevChar = 3550;
    }else if (primaryCode == 3544 && mPrevChar == 3544) {
        deleteBackward();
        appendChar(String.fromCharCode(3570));
        mPrevChar = 3570;
    }else if (primaryCode == 3694) {
        var prefix = 0;
        if (mPrevChar != 3530) {
            if (mPrevChar == 3545 || mPrevChar == 3547) {
                prefix = mPrevChar;
                deleteBackward();
            }
            appendChar(String.fromCharCode(3530));
            appendChar(String.fromCharCode(8205));
            appendChar(String.fromCharCode(3514));
        }
        else {
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
    } else if (primaryCode == 3696) {
        var prefix = 0;
        if (mPrevChar != 3530) {
            if (mPrevChar == 3545 || mPrevChar == 3547) {
                prefix = mPrevChar;
                deleteBackward();
            }
            appendChar(String.fromCharCode(3530));
            appendChar(String.fromCharCode(8205));
            appendChar(String.fromCharCode(3515));
        }
        else {
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
    }else if (primaryCode == 3697) {
        var prefix = 0;
        if (mPrevChar == 3545 || mPrevChar == 3547) {
            if (VYANJANA_LIST.indexOf(m2ndPrevChar) != '-1') {
                prefix = mPrevChar;
                deleteBackward();
                mPrevChar = m2ndPrevChar;
                m2ndPrevChar = m3rdPrevChar;
            }
        }
        if (VYANJANA_LIST.indexOf(mPrevChar) != '-1') {
            var prev = mPrevChar;
            deleteBackward();
            appendChar(String.fromCharCode(3515));
            appendChar(String.fromCharCode(3530));
            appendChar(String.fromCharCode(8205));
            appendChar(String.fromCharCode(prev));
            if (prefix > 0) {
                appendChar(String.fromCharCode(prefix));
                m3rdPrevChar = 8205;
                m2ndPrevChar = mPrevChar;
                mPrevChar = prefix;
            } else {
                m3rdPrevChar = 3530;
                m2ndPrevChar = 8205;
            }
        }
    } else if (primaryCode == 3695) {
        appendChar(String.fromCharCode(3525));
        appendChar(String.fromCharCode(3540));
        m3rdPrevChar = mPrevChar;
        m2ndPrevChar = 3525;
        mPrevChar = 3540;
    }else if (primaryCode == 8205) {
        var prefix = 0;
        if (mPrevChar != 3530) {
            if (mPrevChar == 3545 || mPrevChar == 3547) {
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
    }else {
        appendChar(String.fromCharCode(primaryCode));
        m3rdPrevChar = m2ndPrevChar;
        m2ndPrevChar = mPrevChar;
        mPrevChar = primaryCode;
    }
}


// Get references to the buttons and the textarea
const clearButton = document.querySelector('[data-action="clear"]');
const copyButton = document.querySelector('[data-action="copy"]');
const downloadButton = document.querySelector('[data-action="download"]');
const converterTextarea = document.getElementById('converter');

// 1. Event Listener for the Clear Button
clearButton.addEventListener('click', () => {
  converterTextarea.value = ''; // Set the textarea value to empty
  converterTextarea.focus(); // Focus the textarea for immediate typing
});

// 2. Event Listener for the Copy Button
copyButton.addEventListener('click', () => {
  const textToCopy = converterTextarea.value;
  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Provide user feedback on successful copy
      const originalContent = copyButton.innerHTML;
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.innerHTML = originalContent;
      }, 2000); // Revert back after 2 seconds
    }).catch(err => {
      console.error('Error copying text: ', err); // Log error if copying fails
    });
  }
});

// 3. Event Listener for the Download Button
downloadButton.addEventListener('click', () => {
  const textToDownload = converterTextarea.value;
  if (textToDownload) {
    // Create a Blob (a file-like object) from the textarea content
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sinhala-text.txt'; // Set the filename for the download

    // Programmatically click the link to start the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up by removing the temporary link
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
});