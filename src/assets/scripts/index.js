"use strict";

function splitNumberByDigits(value) {
    if (!value) {
        return '0.00000';
    }

    if (isNaN(value)) {
        return '0.00000';
    }

    return (value || 0)
        .toString()
        .split('')
        .reverse()
        .reduce((memo, x, i) => ((i + 1) % 3 === 0 && x !== '.' ? [...memo, x, ' '] : [...memo, x]), [])
        .reverse()
        .join('');
}

class СonvertingService {
    constructor() {}

    init({ formInputs, method, whereShowResult} ) {
        formInputs.forEach((inp) => {
            inp.addEventListener("input", () => {
                method(formInputs[0], formInputs[1], whereShowResult);
            });
        });
    }

    cryptoToUsd(sum, rate, sumContainer) {
        if (+sum.value && +rate.value) {
            sumContainer.textContent = `$ ${splitNumberByDigits((+sum.value * +rate.value).toFixed(5))}`;
        }
    }

    usdToCrypto(sum, rate, sumContainer) {
        if (+sum.value && +rate.value) {
            sumContainer.textContent = `${splitNumberByDigits((+sum.value / +rate.value).toFixed(5))}`;
        }
    }
}

window.onload = function() {
    const сonvertingService = new СonvertingService();

    const cryptoToForm = document.getElementById("crypto-to-form");
    сonvertingService.init({
        formInputs: cryptoToForm.querySelectorAll(".form__input"),
        method: сonvertingService.cryptoToUsd,
        whereShowResult: cryptoToForm.querySelector('#oneFormSumma')
    });

    const usdForm = document.getElementById("usd-to-form");
    сonvertingService.init({
        formInputs: usdForm.querySelectorAll(".form__input"),
        method: сonvertingService.usdToCrypto,
        whereShowResult: usdForm.querySelector('#twoFormSumma')
    });

};
