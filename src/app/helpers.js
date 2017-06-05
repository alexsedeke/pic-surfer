/**
 * Validate Password strength
 * @function
 * @param {String} password
 * @param {Number} minScore
 * @param {Number} minLength
 * @return {{isValid:Boolean, score:Number}}
 */
function passwordScore(password, minScore, minLength) {
    let charPassword = (password || '').split(''),
        minPasswordLength = minLength || 8,
        calc = {
            num: {
                Excess: 0,
                Upper: 0,
                Numbers: 0,
                Symbols: 0
            },
            bonus: {
                Excess: 3,
                Upper: 4,
                Numbers: 5,
                Symbols: 5,
                Combo: 0,
                FlatLower: 0,
                FlatNumber: 0
            }
        },
        baseScore = 0,
        validScore = minScore || 74,
        score = 0;

    function analyzeString(password, charPassword, calc, minPasswordLength) {
        for (let i = 0; i < (charPassword.length); i++) {
            if (charPassword[i].match(/[A-Z]/g)) {
                calc.num.Upper++;
            }
            if (charPassword[i].match(/[0-9]/g)) {
                calc.num.Numbers++;
            }
            if (charPassword[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                calc.num.Symbols++;
            }
        }

        calc.num.Excess = charPassword.length - minPasswordLength;

        if (calc.num.Upper && calc.num.Numbers && calc.num.Symbols) {
            calc.bonus.Combo = 25;
        } else if ((calc.num.Upper && calc.num.Numbers) || (calc.num.Upper && calc.num.Symbols) || (calc.num.Numbers && calc.num.Symbols)) {
            calc.bonus.Combo = 15;
        }

        if (password.match(/^[\sa-z]+$/)) {
            calc.bonus.FlatLower = -15;
        }

        if (password.match(/^[\s0-9]+$/)) {
            calc.bonus.FlatNumber = -35;
        }

        return calc;
    }

    function calcComplexity(calc, baseScore) {
        return baseScore + (calc.num.Excess * calc.bonus.Excess) + (calc.num.Upper * calc.bonus.Upper) + (calc.num.Numbers * calc.bonus.Numbers) + (calc.num.Symbols * calc.bonus.Symbols) + calc.bonus.Combo + calc.bonus.FlatLower + calc.bonus.FlatNumber;
    }

    // if missing password return strength -1
    if (typeof password === 'undefined' || password === '') {
        return {isValid: false, score: -1};
    }

    if (charPassword.length >= minPasswordLength) {
        baseScore = 50;
        calc = analyzeString(password, charPassword, calc, minPasswordLength);
        score = calcComplexity(calc, baseScore);
    }

    return {isValid: (score > validScore), score: score};
}

module.exports = {
    passwordScore: passwordScore
}
