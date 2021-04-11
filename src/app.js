'use strict';

import {getJSON} from './questions.js';
import User from './user.js';
import ProgressBar from './progressbar.js';

class Test {
   constructor() {
      getJSON((data) => {
         this.data = data;
         const issues = this.data.issues;
         const titleContainer = document.querySelector('.testTitle');
         this.progressBar = new ProgressBar(issues.length);
         titleContainer.innerText = this.data.title;
         for (let i = 0; i < issues.length; i++) {
            this.renderQuestions(i, issues[i].question, issues[i].answers);
         }
      })
      this.user = new User();

      document.addEventListener('change', this.selectAnswer.bind(this), false);
      document.addEventListener('click', this.goToNextQuestion.bind(this), false);
   }

   /**
    * Выбор ответа
    */
   selectAnswer(e) {
      if (this.hasClass(e.target, 'answerInput')) {
         const number = e.target.id.split('_')[1];
         document.querySelector(`.thisQuestion${number}`).className += ' activeButton';
      }
   }

   /**
    * Нажатие на кнопку «Следующий вопрос»
    */
   goToNextQuestion(e) {
      if (this.hasClass(e.target, 'activeButton')) {
         const answer = e.target.parentNode.querySelectorAll('input:checked')[0].id.slice(7).split('_');
         this.answerQuestion(e.target.className.split(' ')[1].slice(12));
         this.user.addAnswer(answer[0], answer[1]);
      }
   }

   /**
    * Применим ответ
    */
   answerQuestion(currentNumber) {
      document.querySelector(`.question${+currentNumber}`).className += ' hidden';
      if (this.data.issues.length !== (+currentNumber + 1)) {
         const curQuestion = document.querySelector(`.question${+currentNumber+1}`);
         curQuestion.className = curQuestion.className.replace(' hidden', '');
      } else {
         this.progressBar.addShining();
         this.user.showResult(this.data.issues);
      }
      this.progressBar.increaseCounter();
   }

   /**
    * Нарисуем вопросы
    */
   renderQuestions(number, question, answers) {
      const allQuestions = document.querySelector('.questions');
      const questionContainer = document.createElement('div');
      const acceptAnswer = document.createElement('div');
      const ol = document.createElement('ol');
      const questionTitleContainer = document.createElement('h3');

      allQuestions.appendChild(questionContainer);
      questionContainer.className += `question question${number}`;
      if (number !== 0) {
         questionContainer.className += ' hidden';
      }
      questionTitleContainer.innerHTML = question;
      questionContainer.appendChild(questionTitleContainer);
      questionContainer.appendChild(ol);
      acceptAnswer.className += `nextQuestion thisQuestion${number}`;
      acceptAnswer.innerText = 'Следующий вопрос';

      questionTitleContainer.innerText = `${number + 1}. ${question}`;

      for (let i = 0; i < answers.length; i++) {
         const theQuestion = document.createElement('li');
         const label = document.createElement('label');
         const input = document.createElement('input');

         input.id = 'answer_' + number + '_' + i;
         input.className = 'answerInput';
         input.type = 'radio';
         input.setAttribute('name', 'answer_' + number);
         label.innerHTML = answers[i];
         label.className = 'checkboxlabel';
         label.setAttribute('for', 'answer_' + number + '_' + i);
         theQuestion.appendChild(input);
         theQuestion.appendChild(label);
         theQuestion.className = 'answer';
         ol.appendChild(theQuestion);

         if (i === answers.length - 1) {
            questionContainer.appendChild(acceptAnswer);
         }
      }
   }

   hasClass(elem, name) {
      return elem.className.split(' ').indexOf(name) > -1;
   }
}

new Test();
