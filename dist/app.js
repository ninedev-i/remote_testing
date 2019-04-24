(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var getJSON = require("./questions.js").getJSON;

var User = _interopRequire(require("./user.js"));

var ProgressBar = _interopRequire(require("./progressbar.js"));

var Test = (function () {
   function Test() {
      var _this = this;

      _classCallCheck(this, Test);

      getJSON(function (data) {
         _this.data = data;
         var issues = _this.data.issues;
         var titleContainer = document.querySelector(".testTitle");
         _this.progressBar = new ProgressBar(issues.length);
         titleContainer.innerText = _this.data.title;
         for (var i = 0; i < issues.length; i++) {
            _this.renderQuestions(i, issues[i].question, issues[i].answers);
         }
      });
      this.user = new User();

      document.addEventListener("change", this.selectAnswer.bind(this), false);
      document.addEventListener("click", this.goToNextQuestion.bind(this), false);
   }

   _createClass(Test, {
      selectAnswer: {

         /**
          * Выбор ответа
          */

         value: function selectAnswer(e) {
            if (this.hasClass(e.target, "answerInput")) {
               var number = e.target.id.split("_")[1];
               document.querySelector(".thisQuestion" + number).className += " activeButton";
            }
         }
      },
      goToNextQuestion: {

         /**
          * Нажатие на кнопку «Следующий вопрос»
          */

         value: function goToNextQuestion(e) {
            if (this.hasClass(e.target, "activeButton")) {
               var answer = e.target.parentNode.querySelectorAll("input:checked")[0].id.slice(7).split("_");
               this.answerQuestion(e.target.className.split(" ")[1].slice(12));
               this.user.addAnswer(answer[0], answer[1]);
            }
         }
      },
      answerQuestion: {

         /**
          * Применим ответ
          */

         value: function answerQuestion(currentNumber) {
            document.querySelector(".question" + +currentNumber).className += " hidden";
            if (this.data.issues.length != +currentNumber + 1) {
               var curQuestion = document.querySelector(".question" + (+currentNumber + 1));
               curQuestion.className = curQuestion.className.replace(" hidden", "");
            } else {
               this.progressBar.addShining();
               this.user.showResult(this.data.issues);
            }
            this.progressBar.increaseCounter();
         }
      },
      renderQuestions: {

         /**
          * Нарисуем вопросы
          */

         value: function renderQuestions(number, question, answers) {
            var allQuestions = document.querySelector(".questions");
            var questionContainer = document.createElement("div");
            var acceptAnswer = document.createElement("div");
            var ol = document.createElement("ol");
            var questionTitleContainer = document.createElement("h3");

            allQuestions.appendChild(questionContainer);
            questionContainer.className += "question question" + number;
            if (number !== 0) {
               questionContainer.className += " hidden";
            }
            questionTitleContainer.innerHTML = question;
            questionContainer.appendChild(questionTitleContainer);
            questionContainer.appendChild(ol);
            acceptAnswer.className += "nextQuestion thisQuestion" + number;
            acceptAnswer.innerText = "Следующий вопрос";

            questionTitleContainer.innerText = "" + (number + 1) + ". " + question;

            for (var i = 0; i < answers.length; i++) {
               var theQuestion = document.createElement("li");
               var label = document.createElement("label");
               var input = document.createElement("input");

               input.id = "answer_" + number + "_" + i;
               input.className = "answerInput";
               input.type = "radio";
               input.setAttribute("name", "answer_" + number);
               label.innerHTML = answers[i];
               label.className = "checkboxlabel";
               label.setAttribute("for", "answer_" + number + "_" + i);
               theQuestion.appendChild(input);
               theQuestion.appendChild(label);
               theQuestion.className = "answer";
               ol.appendChild(theQuestion);

               if (i == answers.length - 1) {
                  questionContainer.appendChild(acceptAnswer);
               }
            }
         }
      },
      hasClass: {
         value: function hasClass(elem, name) {
            return elem.className.split(" ").indexOf(name) > -1;
         }
      }
   });

   return Test;
})();

new Test();

},{"./progressbar.js":2,"./questions.js":3,"./user.js":4}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ProgressBar = (function () {
   function ProgressBar(testLength) {
      _classCallCheck(this, ProgressBar);

      this.testLength = testLength;
      this.progressText = document.querySelector(".progressText"), this.progressText.innerText = "0 из " + testLength;
   }

   _createClass(ProgressBar, {
      increaseCounter: {

         /**
          * Увеличим счетчик на 1
          */

         value: function increaseCounter() {
            var checkbox = document.querySelectorAll("input");
            var currentProgress = document.querySelector(".currentProgress");
            var countAnswers = Object.keys(checkbox).reduce(function (total, i) {
               return checkbox[i].checked ? total + 1 : total;
            }, 0);

            currentProgress.style.width = countAnswers / this.testLength * 100 + "%";
            this.progressText.innerText = "" + countAnswers + " из " + this.testLength;
         }
      },
      addShining: {

         /**
          * Добавим сияние
          */

         value: function addShining() {
            document.querySelector(".progressBar").className += " withShining";
         }
      }
   });

   return ProgressBar;
})();

module.exports = ProgressBar;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
   value: true
});
"use strict";

/**
 * Перемешаем вопросы
 */
var mixQuestions = function (data) {
   var testNumber = window.location.search ? window.location.search.slice(4) : 1;
   var compareRandom = function (a, b) {
      return Math.random() - 0.5;
   };
   var newOrderArray = {
      title: data[testNumber].title,
      issues: data[testNumber].issues.sort(compareRandom)
   };

   return newOrderArray;
};

/**
 * Запросим данные из json
 */
var getJSON = function (callback) {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "./questions_short.json", true);
   xhr.responseType = "json";
   xhr.onload = function () {
      callback(mixQuestions(xhr.response));
   };
   xhr.send();
};

exports.getJSON = getJSON;

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var User = (function () {
   function User() {
      _classCallCheck(this, User);

      this.answers = {};
   }

   _createClass(User, {
      addAnswer: {

         /**
          * Добавим ответ
          */

         value: function addAnswer(question, answer) {
            this.answers[question] = answer;
         }
      },
      showResult: {

         /**
          * Отобразим результаты после последнего вопроса
          */

         value: function showResult(data) {
            var allAnswerVariants = document.querySelectorAll(".answerInput");
            var allQuestions = document.querySelectorAll(".question");

            for (var i = 0; i < allAnswerVariants.length; i++) {
               allAnswerVariants[i].setAttribute("disabled", "disabled");
            }
            for (var j = 0; j < data.length; j++) {
               if (+data[j].rightChoice !== +this.answers[j] + 1) {
                  var currentQuestion = document.querySelector(".question" + j);
                  currentQuestion.className = currentQuestion.className.replace("hidden", "wrongAnswer");
               }
            }
         }
      }
   });

   return User;
})();

module.exports = User;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkY6L1dlYi9yZW1vdGVfdGVzdGluZy9zcmMvYXBwLmpzIiwiRjovV2ViL3JlbW90ZV90ZXN0aW5nL3NyYy9wcm9ncmVzc2Jhci5qcyIsIkY6L1dlYi9yZW1vdGVfdGVzdGluZy9zcmMvcXVlc3Rpb25zLmpzIiwiRjovV2ViL3JlbW90ZV90ZXN0aW5nL3NyYy91c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDOzs7Ozs7OztJQUVMLE9BQU8sV0FBTyxnQkFBZ0IsRUFBOUIsT0FBTzs7SUFDUixJQUFJLDJCQUFNLFdBQVc7O0lBQ3JCLFdBQVcsMkJBQU0sa0JBQWtCOztJQUVwQyxJQUFJO0FBQ0ksWUFEUixJQUFJLEdBQ087Ozs0QkFEWCxJQUFJOztBQUVKLGFBQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNmLGVBQUssSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixhQUFJLE1BQU0sR0FBRyxNQUFLLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDOUIsYUFBSSxjQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxRCxlQUFLLFdBQVcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEQsdUJBQWMsQ0FBQyxTQUFTLEdBQUcsTUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzNDLGNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLGtCQUFLLGVBQWUsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7VUFDakU7T0FDSCxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7O0FBRXZCLGNBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDekUsY0FBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlFOztnQkFoQkUsSUFBSTtBQXFCUCxrQkFBWTs7Ozs7O2dCQUFBLHNCQUFDLENBQUMsRUFBRTtBQUNiLGdCQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsRUFBRTtBQUN6QyxtQkFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLHVCQUFRLENBQUMsYUFBYSxtQkFBaUIsTUFBTSxDQUFHLENBQUMsU0FBUyxJQUFJLGVBQWUsQ0FBQzthQUNoRjtVQUNIOztBQUtELHNCQUFnQjs7Ozs7O2dCQUFBLDBCQUFDLENBQUMsRUFBRTtBQUNqQixnQkFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLEVBQUU7QUFDMUMsbUJBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdGLG1CQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRSxtQkFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1VBQ0g7O0FBS0Qsb0JBQWM7Ozs7OztnQkFBQSx3QkFBQyxhQUFhLEVBQUU7QUFDM0Isb0JBQVEsQ0FBQyxhQUFhLGVBQWEsQ0FBQyxhQUFhLENBQUcsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO0FBQzVFLGdCQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLEFBQUMsRUFBRTtBQUNsRCxtQkFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsZ0JBQWEsQ0FBQyxhQUFhLEdBQUMsQ0FBQyxDQUFBLENBQUcsQ0FBQztBQUN6RSwwQkFBVyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDdkUsTUFBTTtBQUNKLG1CQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzlCLG1CQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3pDO0FBQ0QsZ0JBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7VUFDckM7O0FBS0QscUJBQWU7Ozs7OztnQkFBQSx5QkFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUN4QyxnQkFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN4RCxnQkFBSSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RELGdCQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pELGdCQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDLGdCQUFJLHNCQUFzQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFELHdCQUFZLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDNUMsNkJBQWlCLENBQUMsU0FBUywwQkFBd0IsTUFBTSxBQUFFLENBQUM7QUFDNUQsZ0JBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNmLGdDQUFpQixDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUM7YUFDM0M7QUFDRCxrQ0FBc0IsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQzVDLDZCQUFpQixDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3RELDZCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNsQyx3QkFBWSxDQUFDLFNBQVMsa0NBQWdDLE1BQU0sQUFBRSxDQUFDO0FBQy9ELHdCQUFZLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDOztBQUU1QyxrQ0FBc0IsQ0FBQyxTQUFTLFNBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQSxVQUFLLFFBQVEsQUFBRSxDQUFDOztBQUVoRSxpQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEMsbUJBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0MsbUJBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUMsbUJBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTVDLG9CQUFLLENBQUMsRUFBRSxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4QyxvQkFBSyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7QUFDaEMsb0JBQUssQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0FBQ3JCLG9CQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUM7QUFDL0Msb0JBQUssQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLG9CQUFLLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQztBQUNsQyxvQkFBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsU0FBUyxHQUFHLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsMEJBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsMEJBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsMEJBQVcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ2pDLGlCQUFFLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU1QixtQkFBSSxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDMUIsbUNBQWlCLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM5QzthQUNIO1VBQ0g7O0FBRUQsY0FBUTtnQkFBQSxrQkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ2xCLG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztVQUN0RDs7OztVQXRHRSxJQUFJOzs7QUF5R1YsSUFBSSxJQUFJLEVBQUUsQ0FBQzs7O0FDL0dYLFlBQVksQ0FBQzs7Ozs7O0lBRVEsV0FBVztBQUNsQixZQURPLFdBQVcsQ0FDakIsVUFBVSxFQUFFOzRCQUROLFdBQVc7O0FBRTFCLFVBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsRUFDM0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLGFBQVcsVUFBVSxBQUFFLENBQUM7SUFDckQ7O2dCQUxpQixXQUFXO0FBVTdCLHFCQUFlOzs7Ozs7Z0JBQUEsMkJBQUc7QUFDZixnQkFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELGdCQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDakUsZ0JBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUMsRUFBSztBQUMzRCxzQkFBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRU4sMkJBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFlBQVksR0FBQyxJQUFJLENBQUMsVUFBVSxHQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDckUsZ0JBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxRQUFNLFlBQVksWUFBTyxJQUFJLENBQUMsVUFBVSxBQUFFLENBQUM7VUFDeEU7O0FBS0QsZ0JBQVU7Ozs7OztnQkFBQSxzQkFBRztBQUNWLG9CQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUM7VUFDckU7Ozs7VUExQmlCLFdBQVc7OztpQkFBWCxXQUFXOzs7Ozs7OztBQ0ZoQyxZQUFZLENBQUM7Ozs7O0FBS2IsSUFBSSxZQUFZLEdBQUcsVUFBQyxJQUFJLEVBQUs7QUFDMUIsT0FBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5RSxPQUFJLGFBQWEsR0FBRyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDM0IsYUFBTyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQzdCLENBQUM7QUFDRixPQUFJLGFBQWEsR0FBRztBQUNqQixXQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUs7QUFDN0IsWUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUNyRCxDQUFDOztBQUVGLFVBQU8sYUFBYSxDQUFDO0NBQ3ZCLENBQUE7Ozs7O0FBS0QsSUFBSSxPQUFPLEdBQUcsVUFBQyxRQUFRLEVBQUs7QUFDekIsT0FBSSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztBQUMvQixNQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoRCxNQUFHLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUMxQixNQUFHLENBQUMsTUFBTSxHQUFHLFlBQU07QUFDaEIsY0FBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDO0FBQ0YsTUFBRyxDQUFDLElBQUksRUFBRSxDQUFDO0NBQ2IsQ0FBQzs7UUFFTSxPQUFPLEdBQVAsT0FBTzs7O0FDL0JmLFlBQVksQ0FBQzs7Ozs7O0lBRVEsSUFBSTtBQUNYLFlBRE8sSUFBSSxHQUNSOzRCQURJLElBQUk7O0FBRW5CLFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ3BCOztnQkFIaUIsSUFBSTtBQVF0QixlQUFTOzs7Ozs7Z0JBQUEsbUJBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUN6QixnQkFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7VUFDbEM7O0FBS0QsZ0JBQVU7Ozs7OztnQkFBQSxvQkFBQyxJQUFJLEVBQUU7QUFDZCxnQkFBSSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbEUsZ0JBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFMUQsaUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDaEQsZ0NBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUM1RDtBQUNELGlCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuQyxtQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNoRCxzQkFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsZUFBYSxDQUFDLENBQUcsQ0FBQztBQUM5RCxpQ0FBZSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQ3pGO2FBQ0g7VUFDSDs7OztVQTVCaUIsSUFBSTs7O2lCQUFKLElBQUkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IHtnZXRKU09OfSBmcm9tICcuL3F1ZXN0aW9ucy5qcyc7XHJcbmltcG9ydCBVc2VyIGZyb20gJy4vdXNlci5qcyc7XHJcbmltcG9ydCBQcm9ncmVzc0JhciBmcm9tICcuL3Byb2dyZXNzYmFyLmpzJztcclxuXHJcbmNsYXNzIFRlc3Qge1xyXG4gICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgZ2V0SlNPTigoZGF0YSkgPT4ge1xyXG4gICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICBsZXQgaXNzdWVzID0gdGhpcy5kYXRhLmlzc3VlcztcclxuICAgICAgICAgbGV0IHRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlc3RUaXRsZScpO1xyXG4gICAgICAgICB0aGlzLnByb2dyZXNzQmFyID0gbmV3IFByb2dyZXNzQmFyKGlzc3Vlcy5sZW5ndGgpO1xyXG4gICAgICAgICB0aXRsZUNvbnRhaW5lci5pbm5lclRleHQgPSB0aGlzLmRhdGEudGl0bGU7XHJcbiAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUXVlc3Rpb25zKGksIGlzc3Vlc1tpXS5xdWVzdGlvbiwgaXNzdWVzW2ldLmFuc3dlcnMpO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIHRoaXMudXNlciA9IG5ldyBVc2VyKCk7XHJcblxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLnNlbGVjdEFuc3dlci5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5nb1RvTmV4dFF1ZXN0aW9uLmJpbmQodGhpcyksIGZhbHNlKTtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqINCS0YvQsdC+0YAg0L7RgtCy0LXRgtCwXHJcbiAgICAqL1xyXG4gICBzZWxlY3RBbnN3ZXIoZSkge1xyXG4gICAgICBpZiAodGhpcy5oYXNDbGFzcyhlLnRhcmdldCwgJ2Fuc3dlcklucHV0JykpIHtcclxuICAgICAgICAgbGV0IG51bWJlciA9IGUudGFyZ2V0LmlkLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC50aGlzUXVlc3Rpb24ke251bWJlcn1gKS5jbGFzc05hbWUgKz0gJyBhY3RpdmVCdXR0b24nO1xyXG4gICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIC8qKlxyXG4gICAgKiDQndCw0LbQsNGC0LjQtSDQvdCwINC60L3QvtC/0LrRgyDCq9Ch0LvQtdC00YPRjtGJ0LjQuSDQstC+0L/RgNC+0YHCu1xyXG4gICAgKi9cclxuICAgZ29Ub05leHRRdWVzdGlvbihlKSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc0NsYXNzKGUudGFyZ2V0LCAnYWN0aXZlQnV0dG9uJykpIHtcclxuICAgICAgICAgbGV0IGFuc3dlciA9IGUudGFyZ2V0LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpWzBdLmlkLnNsaWNlKDcpLnNwbGl0KCdfJyk7XHJcbiAgICAgICAgIHRoaXMuYW5zd2VyUXVlc3Rpb24oZS50YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJylbMV0uc2xpY2UoMTIpKTtcclxuICAgICAgICAgdGhpcy51c2VyLmFkZEFuc3dlcihhbnN3ZXJbMF0sIGFuc3dlclsxXSk7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqINCf0YDQuNC80LXQvdC40Lwg0L7RgtCy0LXRglxyXG4gICAgKi9cclxuICAgYW5zd2VyUXVlc3Rpb24oY3VycmVudE51bWJlcikge1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucXVlc3Rpb24keytjdXJyZW50TnVtYmVyfWApLmNsYXNzTmFtZSArPSAnIGhpZGRlbic7XHJcbiAgICAgIGlmICh0aGlzLmRhdGEuaXNzdWVzLmxlbmd0aCAhPSAoK2N1cnJlbnROdW1iZXIgKyAxKSkge1xyXG4gICAgICAgICBsZXQgY3VyUXVlc3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucXVlc3Rpb24keytjdXJyZW50TnVtYmVyKzF9YCk7XHJcbiAgICAgICAgIGN1clF1ZXN0aW9uLmNsYXNzTmFtZSA9IGN1clF1ZXN0aW9uLmNsYXNzTmFtZS5yZXBsYWNlKCcgaGlkZGVuJywgJycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICB0aGlzLnByb2dyZXNzQmFyLmFkZFNoaW5pbmcoKTtcclxuICAgICAgICAgdGhpcy51c2VyLnNob3dSZXN1bHQodGhpcy5kYXRhLmlzc3Vlcyk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5wcm9ncmVzc0Jhci5pbmNyZWFzZUNvdW50ZXIoKTtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqINCd0LDRgNC40YHRg9C10Lwg0LLQvtC/0YDQvtGB0YtcclxuICAgICovXHJcbiAgIHJlbmRlclF1ZXN0aW9ucyhudW1iZXIsIHF1ZXN0aW9uLCBhbnN3ZXJzKSB7XHJcbiAgICAgIGxldCBhbGxRdWVzdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucXVlc3Rpb25zJyk7XHJcbiAgICAgIGxldCBxdWVzdGlvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICBsZXQgYWNjZXB0QW5zd2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgIGxldCBvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29sJyk7XHJcbiAgICAgIGxldCBxdWVzdGlvblRpdGxlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcclxuXHJcbiAgICAgIGFsbFF1ZXN0aW9ucy5hcHBlbmRDaGlsZChxdWVzdGlvbkNvbnRhaW5lcik7XHJcbiAgICAgIHF1ZXN0aW9uQ29udGFpbmVyLmNsYXNzTmFtZSArPSBgcXVlc3Rpb24gcXVlc3Rpb24ke251bWJlcn1gO1xyXG4gICAgICBpZiAobnVtYmVyICE9PSAwKSB7XHJcbiAgICAgICAgIHF1ZXN0aW9uQ29udGFpbmVyLmNsYXNzTmFtZSArPSAnIGhpZGRlbic7XHJcbiAgICAgIH1cclxuICAgICAgcXVlc3Rpb25UaXRsZUNvbnRhaW5lci5pbm5lckhUTUwgPSBxdWVzdGlvbjtcclxuICAgICAgcXVlc3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQocXVlc3Rpb25UaXRsZUNvbnRhaW5lcik7XHJcbiAgICAgIHF1ZXN0aW9uQ29udGFpbmVyLmFwcGVuZENoaWxkKG9sKTtcclxuICAgICAgYWNjZXB0QW5zd2VyLmNsYXNzTmFtZSArPSBgbmV4dFF1ZXN0aW9uIHRoaXNRdWVzdGlvbiR7bnVtYmVyfWA7XHJcbiAgICAgIGFjY2VwdEFuc3dlci5pbm5lclRleHQgPSAn0KHQu9C10LTRg9GO0YnQuNC5INCy0L7Qv9GA0L7RgSc7XHJcblxyXG4gICAgICBxdWVzdGlvblRpdGxlQ29udGFpbmVyLmlubmVyVGV4dCA9IGAke251bWJlciArIDF9LiAke3F1ZXN0aW9ufWA7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgbGV0IHRoZVF1ZXN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcclxuICAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuXHJcbiAgICAgICAgIGlucHV0LmlkID0gJ2Fuc3dlcl8nICsgbnVtYmVyICsgJ18nICsgaTtcclxuICAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gJ2Fuc3dlcklucHV0JztcclxuICAgICAgICAgaW5wdXQudHlwZSA9ICdyYWRpbyc7XHJcbiAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsICdhbnN3ZXJfJyArIG51bWJlcik7XHJcbiAgICAgICAgIGxhYmVsLmlubmVySFRNTCA9IGFuc3dlcnNbaV07XHJcbiAgICAgICAgIGxhYmVsLmNsYXNzTmFtZSA9ICdjaGVja2JveGxhYmVsJztcclxuICAgICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCAnYW5zd2VyXycgKyBudW1iZXIgKyAnXycgKyBpKTtcclxuICAgICAgICAgdGhlUXVlc3Rpb24uYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgICB0aGVRdWVzdGlvbi5hcHBlbmRDaGlsZChsYWJlbCk7XHJcbiAgICAgICAgIHRoZVF1ZXN0aW9uLmNsYXNzTmFtZSA9ICdhbnN3ZXInO1xyXG4gICAgICAgICBvbC5hcHBlbmRDaGlsZCh0aGVRdWVzdGlvbik7XHJcblxyXG4gICAgICAgICBpZiAoaSA9PSBhbnN3ZXJzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgcXVlc3Rpb25Db250YWluZXIuYXBwZW5kQ2hpbGQoYWNjZXB0QW5zd2VyKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIGhhc0NsYXNzKGVsZW0sIG5hbWUpIHtcclxuICAgICAgcmV0dXJuIGVsZW0uY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZihuYW1lKSA+IC0xO1xyXG4gICB9XHJcbn1cclxuXHJcbm5ldyBUZXN0KCk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2dyZXNzQmFyIHtcclxuICAgY29uc3RydWN0b3IodGVzdExlbmd0aCkge1xyXG4gICAgICB0aGlzLnRlc3RMZW5ndGggPSB0ZXN0TGVuZ3RoO1xyXG4gICAgICB0aGlzLnByb2dyZXNzVGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9ncmVzc1RleHQnKSxcclxuICAgICAgdGhpcy5wcm9ncmVzc1RleHQuaW5uZXJUZXh0ID0gYDAg0LjQtyAke3Rlc3RMZW5ndGh9YDtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqINCj0LLQtdC70LjRh9C40Lwg0YHRh9C10YLRh9C40Log0L3QsCAxXHJcbiAgICAqL1xyXG4gICBpbmNyZWFzZUNvdW50ZXIoKSB7XHJcbiAgICAgIGxldCBjaGVja2JveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcbiAgICAgIGxldCBjdXJyZW50UHJvZ3Jlc3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3VycmVudFByb2dyZXNzJyk7XHJcbiAgICAgIGxldCBjb3VudEFuc3dlcnMgPSBPYmplY3Qua2V5cyhjaGVja2JveCkucmVkdWNlKCh0b3RhbCwgaSkgPT4ge1xyXG4gICAgICAgICByZXR1cm4gY2hlY2tib3hbaV0uY2hlY2tlZCA/IHRvdGFsICsgMSA6IHRvdGFsO1xyXG4gICAgICB9LCAwKTtcclxuXHJcbiAgICAgIGN1cnJlbnRQcm9ncmVzcy5zdHlsZS53aWR0aCA9IGNvdW50QW5zd2Vycy90aGlzLnRlc3RMZW5ndGgqMTAwICsgJyUnO1xyXG4gICAgICB0aGlzLnByb2dyZXNzVGV4dC5pbm5lclRleHQgPSBgJHtjb3VudEFuc3dlcnN9INC40LcgJHt0aGlzLnRlc3RMZW5ndGh9YDtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqINCU0L7QsdCw0LLQuNC8INGB0LjRj9C90LjQtVxyXG4gICAgKi9cclxuICAgYWRkU2hpbmluZygpIHtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2dyZXNzQmFyJykuY2xhc3NOYW1lICs9ICcgd2l0aFNoaW5pbmcnO1xyXG4gICB9XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLyoqXHJcbiAqINCf0LXRgNC10LzQtdGI0LDQtdC8INCy0L7Qv9GA0L7RgdGLXHJcbiAqL1xyXG5sZXQgbWl4UXVlc3Rpb25zID0gKGRhdGEpID0+IHtcclxuICAgbGV0IHRlc3ROdW1iZXIgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoID8gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zbGljZSg0KSA6IDE7XHJcbiAgIGxldCBjb21wYXJlUmFuZG9tID0gKGEsIGIpID0+IHtcclxuICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgLSAwLjU7XHJcbiAgIH07XHJcbiAgIGxldCBuZXdPcmRlckFycmF5ID0ge1xyXG4gICAgICB0aXRsZTogZGF0YVt0ZXN0TnVtYmVyXS50aXRsZSxcclxuICAgICAgaXNzdWVzOiBkYXRhW3Rlc3ROdW1iZXJdLmlzc3Vlcy5zb3J0KGNvbXBhcmVSYW5kb20pXHJcbiAgIH07XHJcblxyXG4gICByZXR1cm4gbmV3T3JkZXJBcnJheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCX0LDQv9GA0L7RgdC40Lwg0LTQsNC90L3Ri9C1INC40LcganNvblxyXG4gKi9cclxubGV0IGdldEpTT04gPSAoY2FsbGJhY2spID0+IHtcclxuICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICB4aHIub3BlbignR0VUJywgJy4vcXVlc3Rpb25zX3Nob3J0Lmpzb24nLCB0cnVlKTtcclxuICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgY2FsbGJhY2sobWl4UXVlc3Rpb25zKHhoci5yZXNwb25zZSkpO1xyXG4gICB9O1xyXG4gICB4aHIuc2VuZCgpO1xyXG59O1xyXG5cclxuZXhwb3J0IHtnZXRKU09OfTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXNlciB7XHJcbiAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICB0aGlzLmFuc3dlcnMgPSB7fTtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqINCU0L7QsdCw0LLQuNC8INC+0YLQstC10YJcclxuICAgICovXHJcbiAgIGFkZEFuc3dlcihxdWVzdGlvbiwgYW5zd2VyKSB7XHJcbiAgICAgIHRoaXMuYW5zd2Vyc1txdWVzdGlvbl0gPSBhbnN3ZXI7XHJcbiAgIH1cclxuXHJcbiAgIC8qKlxyXG4gICAgKiDQntGC0L7QsdGA0LDQt9C40Lwg0YDQtdC30YPQu9GM0YLQsNGC0Ysg0L/QvtGB0LvQtSDQv9C+0YHQu9C10LTQvdC10LPQviDQstC+0L/RgNC+0YHQsFxyXG4gICAgKi9cclxuICAgc2hvd1Jlc3VsdChkYXRhKSB7XHJcbiAgICAgIGxldCBhbGxBbnN3ZXJWYXJpYW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hbnN3ZXJJbnB1dCcpO1xyXG4gICAgICBsZXQgYWxsUXVlc3Rpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnF1ZXN0aW9uJyk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbEFuc3dlclZhcmlhbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgIGFsbEFuc3dlclZhcmlhbnRzW2ldLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRhdGEubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgaWYgKCtkYXRhW2pdLnJpZ2h0Q2hvaWNlICE9PSArdGhpcy5hbnN3ZXJzW2pdICsgMSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudFF1ZXN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnF1ZXN0aW9uJHtqfWApO1xyXG4gICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24uY2xhc3NOYW1lID0gY3VycmVudFF1ZXN0aW9uLmNsYXNzTmFtZS5yZXBsYWNlKCdoaWRkZW4nLCAnd3JvbmdBbnN3ZXInKTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgIH1cclxufVxyXG4iXX0=
