'use strict';

export default class User {
   constructor() {
      this.answers = {};
   }

   /**
    * Добавим ответ
    */
   addAnswer(question, answer) {
      this.answers[question] = answer;
   }

   /**
    * Отобразим результаты после последнего вопроса
    */
   showResult(data) {
      let allAnswerVariants = document.querySelectorAll('.answerInput');
      let allQuestions = document.querySelectorAll('.question');

      for (let i = 0; i < allAnswerVariants.length; i++) {
         allAnswerVariants[i].setAttribute('disabled', 'disabled');
      }
      for (let j = 0; j < data.length; j++) {
         if (+data[j].rightChoice !== +this.answers[j] + 1) {
            let currentQuestion = document.querySelector(`.question${j}`);
            currentQuestion.className = currentQuestion.className.replace('hidden', 'wrongAnswer');
         }
      }
   }
}
