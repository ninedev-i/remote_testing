'use strict';

/**
 * Перемешаем вопросы
 */
let mixQuestions = (data) => {
   let testNumber = window.location.search ? window.location.search.slice(4) : 1;
   let compareRandom = (a, b) => {
      return Math.random() - 0.5;
   };
   let newOrderArray = {
      title: data[testNumber].title,
      issues: data[testNumber].issues.sort(compareRandom)
   };

   return newOrderArray;
}

/**
 * Запросим данные из json
 */
let getJSON = (callback) => {
   let xhr = new XMLHttpRequest();
   xhr.open('GET', './questions_short.json', true);
   xhr.responseType = 'json';
   xhr.onload = () => {
      callback(mixQuestions(xhr.response));
   };
   xhr.send();
};

export {getJSON};
