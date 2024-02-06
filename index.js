"use strict";

// DOM selectors

const factsBox = document.getElementById("show-facts");
const sendAnswerBox = document.getElementById("answer");
const submitBtn = document.getElementById("send-btn");
const chatBox = document.querySelector(".chat");
const chatLog = document.querySelector(".chat-log");
let answers = [];
let correctAnswers = [];

////////////////////////////////

// Functions

const checkAnswers = function () {
  let lastAnswer = answers.find((mov) => mov.length - 1);
  let lastCorrectAnswer = correctAnswers.find((mov) => mov.length - 1);
  let loweredAnswer = lastAnswer.toLowerCase().split(" ").join("");
  let loweredCorrectAnswer = lastCorrectAnswer
    .toLowerCase()
    .split(" ")
    .join("");

  if (loweredAnswer === loweredCorrectAnswer) {
    console.log("Correct Answer");
    let newMessage = document.createElement("ul");
    newMessage.className = "correct-answer-ul";
    newMessage.textContent = "Correct Answer!";
    chatLog.appendChild(newMessage);
  }
};

const clearInput = function () {
  sendAnswerBox.value = "";
};

const sendMessage = function () {
  let newMessage = document.createElement("ul");
  newMessage.className = "answer-ul";
  newMessage.textContent = sendAnswerBox.value;
  chatLog.appendChild(newMessage);

  answers.push(newMessage.textContent);
  if (answers.length === 0) {
    answers.push(newMessage.textContent);
  } else if (answers.length > 0) {
    answers.splice(0, 1);
    answers.push(newMessage.textContent);
  }
  console.log(answers);

  chatBox.scrollTop = chatBox.scrollHeight;
  return sendAnswerBox.value;
};

const postQuestion = function (data) {
  let newQuestion = document.createElement("ul");
  newQuestion.className = "question-ul";
  newQuestion.textContent = data;
  chatLog.appendChild(newQuestion);
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

async function fetchQuestions() {
  try {
    const response = await fetch("https://the-trivia-api.com/v2/questions");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (correctAnswers.length === 0) {
      console.log(data[0].correctAnswer);
      correctAnswers.push(data[0].correctAnswer);
      console.log(correctAnswers);
    } else if (correctAnswers.length > 0) {
      correctAnswers.splice(0);
      correctAnswers.push(data[0].correctAnswer);
      console.log(correctAnswers);
    }

    const questionText = data[0].question.text;
    postQuestion(questionText);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

/////////////////////////////////////////////////////////////
fetchQuestions();

// setInterval(fetchQuestions, 8000);

sendAnswerBox.addEventListener("click", function () {
  if (sendAnswerBox.value === "Type your answer here") {
    clearInput();
  }
});

submitBtn.addEventListener("click", function () {
  sendMessage();
  clearInput();
});

sendAnswerBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
    clearInput();
    checkAnswers();
  }
});
