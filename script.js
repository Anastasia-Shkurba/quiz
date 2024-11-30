const form = document.querySelector('form');
const questionLegend = form.querySelector('legend');
const choices = document.querySelectorAll('.choice');
const result = document.getElementById('result');
const title = document.getElementById('title');
const description = document.getElementById('description');

const quizData = await getQuizData();
const categories = Object.keys(quizData.results);
const results = [];
const submitDelay = 1000;
let currentQuestionIndex = 0;
let timerId = null;

form.onchange = submitChoice;
form.onsubmit = handleSubmit;

showQuestion(currentQuestionIndex);

async function getQuizData() {
  const response = await fetch('quiz.json');

  return response.json();
}

function showQuestion(index) {
  const question = quizData.questions[index];
  const cats = categories.toSorted(() => Math.random() - 0.5);

  questionLegend.textContent = question.question;

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    const [radio, label] = choice.children;

    radio.value = cats[i];
    label.textContent = question.options[cats[i]];
  }

  const radio = form.querySelector(':checked');

  if (radio) radio.checked = false;
}

function submitChoice(e) {
  clearTimeout(timerId);
  
  timerId = setTimeout(() => {
    form.requestSubmit();
  }, submitDelay);
}

function handleSubmit(e) {
  e.preventDefault();

  const selectedCategory = form.option.value;

  results.push(selectedCategory);

  if (currentQuestionIndex < quizData.questions.length - 1) {
    showQuestion(++currentQuestionIndex);
  } else {
    showResult();
  }
}

function showResult() {
  const category = getMode(results);

  title.textContent = quizData.results[category].title;
  description.textContent = quizData.results[category].description;
  result.showModal();
}

function getMode(arr) {
  const counts = {};

  for (let i = 0; i < arr.length; i++) {
    counts[arr[i]] = (counts[arr[i]] || 0) + 1;
  }

  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}
