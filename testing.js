class dataJson {
   constructor() {
      this.data = {};
      this.getJson();
   }

   getJson() {
      var self = this;
      $.getJSON('questions.json', function(json) {
         var
            compareRandom = function(a, b) {
               return Math.random() - 0.5;
            },
            newOrderArray = {
               title: json[1].title,
               issues: json[1].issues.sort(compareRandom)
            };

         new Test(newOrderArray);
         self.data = newOrderArray;
      });
      return self.data;
   }

}

var data = new dataJson();

class Test {
   constructor(data) {
      var
         titleContainer = document.querySelector('.testTitle'),
         progressText = document.querySelector('.progressText'),
         answersProgress = 3;

      this.data = data;
      this.eventListeners.call(this);

      progressText.innerText = `0 из ${this.data.issues.length}`;
      titleContainer.innerText = data.title;
      for (var i = 0; i < data.issues.length; i++) {
         this.renderQuestions(i, data.issues[i].question, data.issues[i].answers);
      }
   }

   eventListeners() {
      var self = this;

      document.addEventListener('change', function (e) {
         if (self.hasClass(e.target, 'answerInput')) {
            var number = e.target.parentNode.parentNode.parentNode.classList[1].slice(8);
            document.querySelector(`.thisQuestion${number}`).classList.add('activeButton');
         }
      }, false);

      document.addEventListener('click', function (e) {
         if (self.hasClass(e.target, 'activeButton')) {
            var answer = e.target.parentNode.querySelectorAll('input:checked')[0].id.slice(7).split('_');
            self.answerQuestion(e.target.classList[1].slice(12));
            user.addAnswer(answer[0], answer[1]);
         }
      }, false);
   }
   hasClass(elem, className) {
      return elem.className.split(' ').indexOf(className) > -1;
   }

   renderQuestions(number, question, answers) {
      var
         allQuestions = document.querySelector('.questions'),
         questionContainer = document.createElement('div'),
         acceptAnswer = document.createElement('div'),
         ol = document.createElement('ol'),
         questionTitleContainer = document.createElement('h3');

      allQuestions.appendChild(questionContainer);
      questionContainer.classList.add('question');
      questionContainer.classList.add(`question${number}`);
      if(number !== 0) questionContainer.classList.add('hidden');
      questionTitleContainer.innerHTML = question;
      questionContainer.appendChild(questionTitleContainer);
      questionContainer.appendChild(ol);
      acceptAnswer.classList.add('nextQuestion');
      acceptAnswer.classList.add(`thisQuestion${number}`);
      acceptAnswer.innerText = 'Следующий вопрос';

      questionTitleContainer.innerText = `${number + 1}. ${question}`;

      for (var i = 0; i < answers.length; i++) {
         var
            theQuestion = document.createElement('li'),
            label = document.createElement('label'),
            input = document.createElement('input');

         input.id = 'answer_' + number + '_' + i;
         input.classList.add('answerInput');
         input.type = 'radio';
         input.setAttribute('name', 'answer_' + number);
         label.innerHTML = answers[i];
         label.classList.add('checkboxlabel');
         label.setAttribute('for', 'answer_' + number + '_' + i);
         theQuestion.appendChild(input);
         theQuestion.appendChild(label);
         theQuestion.classList.add('answer');
         ol.appendChild(theQuestion);

         if (i == answers.length - 1) questionContainer.appendChild(acceptAnswer);
      }

   }

   renderCounter() {
      var
         checkbox = document.querySelectorAll('input'),
         progressText = document.querySelector('.progressText'),
         currentProgress = document.querySelector('.currentProgress'),
         countAnswers = Object.keys(checkbox).reduce(function(total, i) {
            return checkbox[i].checked ? total + 1 : total;
         }, 0);

      currentProgress.style.width = countAnswers/this.data.issues.length*100 + '%';
      progressText.innerText = `${countAnswers} из ${this.data.issues.length}`;
   }

   answerQuestion(currentNumber) {
      document.querySelector(`.question${+currentNumber}`).classList.add('hidden');
      if (this.data.issues.length != (+currentNumber + 1)) {
         document.querySelector(`.question${+currentNumber+1}`).classList.remove('hidden');
      } else {
         document.querySelector('.progressBar').classList.add('withShining');
         user.showResult(this.data.issues);
      }
      this.renderCounter();
   }
}

class User {
   constructor() {
      this.answers = {};
   }

   addAnswer(question, answer) {
      this.answers[question] = answer;
   }

   showResult(data) {
      var
         allAnswerVariants = document.querySelectorAll('.answerInput'),
         allQuestions = document.querySelectorAll('.question');

      for (var i = 0; i < allAnswerVariants.length; i++) {
         allAnswerVariants[i].setAttribute('disabled', 'disabled');
      }
      for (var j = 0; j < data.length; j++) {
         if(+data[j].rightChoice !== +this.answers[j] + 1) {
            var currentQuestion = document.querySelector(`.question${j}`);
            currentQuestion.classList.remove('hidden');
            currentQuestion.classList.add('wrongAnswer');
         }
      }
   }

}

let user = new User();
