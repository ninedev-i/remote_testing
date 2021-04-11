'use strict';

/**
 * Перемешаем вопросы
 */
let mixQuestions = (data) => {
   const testNumber = window.location.search ? window.location.search.slice(4) : 1;
   const compareRandom = () => {
      return Math.random() - 0.5;
   };
   return {
      title: data[testNumber].title,
      issues: data[testNumber].issues.sort(compareRandom)
   };
}

/**
 * Запросим данные из json
 */
let getJSON = (callback) => {
   const xhr = new XMLHttpRequest();
   xhr.open('GET', './questions.json', true);
   xhr.responseType = 'json';
   xhr.onload = () => {
      callback(mixQuestions(xhr.response));
   };
   xhr.send();
};

export {getJSON};
