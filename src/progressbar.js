'use strict';

export default class ProgressBar {
   constructor(testLength) {
      this.testLength = testLength;
      this.progressText = document.querySelector('.progressText'),
      this.progressText.innerText = `0 из ${testLength}`;
   }

   /**
    * Увеличим счетчик на 1
    */
   increaseCounter() {
      let checkbox = document.querySelectorAll('input');
      let currentProgress = document.querySelector('.currentProgress');
      let countAnswers = Object.keys(checkbox).reduce((total, i) => {
         return checkbox[i].checked ? total + 1 : total;
      }, 0);

      currentProgress.style.width = countAnswers/this.testLength*100 + '%';
      this.progressText.innerText = `${countAnswers} из ${this.testLength}`;
   }

   /**
    * Добавим сияние
    */
   addShining() {
      document.querySelector('.progressBar').className += ' withShining';
   }
}
