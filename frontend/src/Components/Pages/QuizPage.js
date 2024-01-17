import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import Navigate from '../Router/Navigate';

import { clearPage } from '../../utils/render';
import { readOneQuizById } from '../../models/quizzes';
import { getConnectedUserDetails } from '../../utils/auths';
import { updateUserPoint } from '../../models/users';
import { addOneBadgeToUser, readAllBadgesByUser } from '../../models/badges';
import imageTest from '../../img/checklist_8186431.png';
import { showError } from '../../utils/customAlerts';

let score = 0;
let userID;
let allQuestionsAnswers = [];
let currentQuestion = 0;
let nbQuestion;
let newPoint;
let startTime;
let intervalId;
let timerActivated = false;

function redirect() {
  showError(`Le quiz n'existe pas`);
  Navigate('/categories');
}

const quizPage = async () => {
  clearPage();
  const url = new URLSearchParams(window.location.search);
  const quizId = url.get('id');
  // Retrieve all questions and answers for the specified quiz
  allQuestionsAnswers = await readOneQuizById(quizId);
  if (allQuestionsAnswers === undefined) {
    return redirect();
  }
  randomTab(allQuestionsAnswers);
  nbQuestion = allQuestionsAnswers.length;
  renderQuizModal();
  const modal = document.getElementById('quizModal');
  const displayQuizModal = new Modal(modal);
  displayQuizModal.show();
  return null;
};

// Displays the quiz start modal on the page
function renderQuizModal() {
  clearPage();
  const main = document.querySelector('main');
  main.innerHTML = `
<div class = "modal fade" id="quizModal" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
          <img src=${imageTest}>
          <h4 class="modal-title fs-5" id="staticBackdropLabel">Prêt à tester vos connaissances ?</h4>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <p>Nombre de questions : ${nbQuestion} </p>
        <div class="input-group">
          <p>Souhaites-tu utiliser un chronométre ? </p>
          <div class="form-check form-switch form-check-reverse ">
            <input class="form-check-input" type="checkbox" id="btnChecked">
          </div>
        </div>
        <div id="empty">
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-style btnStart">Commencer</button>
      </div>
    
    </div>
  </div>
</div>
  `;

  const checkboxSwitch = document.getElementById('btnChecked');
  const btnStart = document.querySelector('.btnStart');

  const btnClose = document.querySelector('.btn-close');
  btnClose.addEventListener('click', () => {
    Navigate('/categories');
  });

  // Event listener for checkbox to toggle timer configuration
  checkboxSwitch.addEventListener('change', () => {
    const inputTimer = document.getElementById('empty');
    if (checkboxSwitch.checked === true) {
      timerActivated = true;
      inputTimer.innerHTML += `<div>
      <div class="input-group">
        <input id="timer"
          type="text"
          class="form-control"
          placeholder="Entre le temps en secondes"
          aria-label=""
        />
        <span class="input-group-text" id="basic-addon2">secondes</span>
      </div>
              <span id="errorMessage"></span>
      </div>
`;
    } else {
      timerActivated = false;
      inputTimer.innerHTML = '';
    }
  });

  // Event listener for start button to validate timer configuration if checked and render quiz page
  btnStart.addEventListener('click', () => {
    const errMsg = document.getElementById('errorMessage');
    if (checkboxSwitch.checked) {
      timerActivated = true;
      const timerValue = document.getElementById('timer').value;
      const timerNumber = parseInt(timerValue, 10);
      // Check input value
      if (timerNumber <= 0 || Number.isNaN(timerNumber)) {
        errMsg.innerHTML = '*Veuillez entrer une valeur pour configurer le chronométre';
        return;
      }
      errMsg.innerHTML = '';
      // startTime is equal to the value entered by the user
      startTime = timerNumber;
    }
    renderQuizPage();
  });
}

// Displays the modal showing the user's score
async function renderScore() {
  currentQuestion = 0;
  const main = document.querySelector('main');

  main.innerHTML = `
<div class = "modal fade" id="quizModal2" data-bs-backdrop="false" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title fs-5" id="staticBackdropLabel">Ton score</h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body color-modal-score">
        <h2 class="fs-4 mt-1 card-title text-center"> ${score}/${nbQuestion}</h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-style btnRestart">Recommencer</button>
      </div>
    </div>
  </div>
</div>`;

  // Get the current user details
  const currentUser = await getConnectedUserDetails();

  // If the user is logged in, update points and handle badges
  if (currentUser) {
    userID = currentUser.userID;

    // Update user points based on the score and retrieve the new point value
    newPoint = await updateUserPoint(score);

    // Get all badges earned by the current user
    const userBadges = await readAllBadgesByUser(userID);

    // Check and award badges based on the points of the user
    if (userBadges.length < 4) {
      if (
        newPoint >= 200 &&
        newPoint < 400 &&
        !userBadges.some((badge) => badge.label === 'Médaille de bronze')
      ) {
        winABadge('Médaille de bronze');
      } else if (
        newPoint >= 400 &&
        newPoint < 600 &&
        !userBadges.some((badge) => badge.label === "Médaille d'argent")
      ) {
        winABadge("Médaille d'argent");
      } else if (
        newPoint >= 600 &&
        newPoint < 800 &&
        !userBadges.some((badge) => badge.label === "Médaille d'or")
      ) {
        winABadge("Médaille d'or");
      } else if (
        newPoint >= 800 &&
        newPoint < 1000 &&
        !userBadges.some((badge) => badge.label === 'Médaille de platine')
      ) {
        winABadge('Médaille de platine');
      }
    }
  }
  const restartButton = document.querySelector('.btnRestart');
  score = 0;

  // Event listener for restart button to reset quiz
  restartButton.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = undefined;
    score = 0;
    currentQuestion = 0;
    startTime = undefined;
    timerActivated = false;
    quizPage();
  });
  const btnClose = document.querySelector('.btn-close');
  btnClose.addEventListener('click', () => {
    Navigate('/categories');
  });
  const modal = document.getElementById('quizModal2');
  const displayQuizModal = new Modal(modal);
  displayQuizModal.show();
}

// Adds the specified badge to the user
async function winABadge(label) {
  await addOneBadgeToUser(userID, label);
  Swal.fire({
    title: `🎉 Bravo ! Tu vient de remporter le badge : ${label} ! 🏅 Va vite le découvrire dans ton espace`,
    width: 600,
    padding: '3em',
    color: '#716add',
    background: '#fff url(/images/trees.png)',
    backdrop: `
      rgba(0,0,123,0.4)
      left top
      no-repeat
    `,
  });
}
// Randomly shuffles the elements in the given table
function randomTab(tab) {
  const array = tab;
  for (let i = tab.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [tab[j], tab[i]];
  }
}

// Renders the quiz page
async function renderQuizPage() {
  clearPage();
  const main = document.querySelector('main');
  const minutes = Math.floor(startTime / 60);
  const seconds = startTime % 60;
  let renderTime = '';
  if (timerActivated) {
    renderTime = `<div class = "container-timer">
                   <div class="display-timer"> ${minutes} ${seconds} </div>
                 </div>`;
  }
  // If all questions have been answered, render score
  if (currentQuestion === nbQuestion) {
    renderScore();
  } else {
    const currentQuestionAnswers = allQuestionsAnswers[currentQuestion];
    const answers = currentQuestionAnswers.bad_answers;
    const { question } = currentQuestionAnswers;
    const goodAnswer = currentQuestionAnswers.correct_answer;
    answers.push(goodAnswer);
    randomTab(answers);
    let mainQuiz = `
        <section>
        <div class="container-xxl d-flex justify-content-center align-items-center pt-5 ">
        <div class="w-75">
            <div class="card shadow-lg">
                <div class="card-body p-5">
                ${renderTime}
                    <div class="alert  text-center">
                        <h2 class="fs-4 mt-1 card-title question">${question}</h2>
                    </div>
                    <div id= "emptyDiv">
                    </div>
                    <form>
                    `;
    answers.forEach((answer) => {
      mainQuiz += `     
  <div class="row mb-3">
  <div class="col">
      <input type="text" class="form-control answer" value="${answer}" readonly >
  </div>
  </div>`;
    });
    mainQuiz += `
                 <div  class="text-center">
                  <p class="text-danger" id="errorMessage"></p>
                  </div>
                        <div class="mb-3 text-center">
                            <button type="button" class="btn btn-primary " id="btnValidate"> Valider </button>
                        </div>
                    </form>
                    <p class="quiz-progress text-end">${currentQuestion + 1}/${nbQuestion}</p>
                </div>
            </div>
        </div>
    </div>
        </section>
        `;

    main.innerHTML = mainQuiz;

    if (timerActivated === true) {
      printTime();
      startTimer();
    }

    let isValidate = false;
    let selectedAnswer = null;
    const errorMessage = document.querySelector('#errorMessage');
    let allAnswers = document.querySelectorAll('.answer');

    allAnswers.forEach((answer) => {
      const a = answer;
      answer.addEventListener('click', () => {
        errorMessage.innerText = '';
        if (!isValidate) {
          // Reset background color for all answers
          allAnswers.forEach((otherAnswer) => {
            const other = otherAnswer;
            other.style.backgroundColor = 'white';
          });
          // Set background color for the selected answer
          a.style.backgroundColor = 'rgba(200, 200, 200, 0.7)';
          selectedAnswer = answer.value;
        }
      });
    });

    // Create a button "Continuer"
    const continueButton = document.createElement('button');
    continueButton.type = 'button';
    continueButton.className = 'btn btn-primary';
    continueButton.id = 'btnContinue';
    continueButton.innerText = 'Continuer';
    const validate = document.getElementById('btnValidate');
    if (startTime === 0) {
      return;
    }
    validate.addEventListener('click', () => {
      isValidate = true;
      let selectedAnswerIsFalse = false;
      // Check if no answer is selected
      if (selectedAnswer === null) {
        errorMessage.innerText = 'Merci de sélectionner une réponse';
        isValidate = false;
      } else {
        errorMessage.innerText = '';
        // Check if the selected answer is correct
        if (selectedAnswer === goodAnswer) {
          selectedAnswerIsFalse = false;
          score += 1;
        } else {
          selectedAnswerIsFalse = true;
        }
        // Apply styles to the answers based on correction
        allAnswers = document.querySelectorAll('.answer');
        allAnswers.forEach((currentAnswer) => {
          const answer = currentAnswer;
          if (selectedAnswerIsFalse && currentAnswer.value === selectedAnswer) {
            answer.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
          } else if (currentAnswer.value === goodAnswer) {
            answer.style.backgroundColor = 'rgba(144, 238, 144, 0.7)';
          } else {
            answer.style.backgroundColor = 'white';
          }
        });
        // Replace the "Valider" button with the "Continuer" button
        validate.replaceWith(continueButton);
      }
    });

    continueButton.addEventListener('click', () => {
      currentQuestion += 1;
      renderQuizPage();
    });
  }
}

function startTimer() {
  // If the timer is running we clear it 
  if (intervalId) {
    clearInterval(intervalId);
  }
  // starts a new interval that calls the printTime function every 1000 milliseconds
  intervalId = setInterval(printTime, 1000); 
}

function printTime() {
  const displaychrono = document.querySelector('.display-timer');
  const containerTimer = document.querySelector('.container-timer');
  if (!displaychrono) {
    clearInterval(intervalId);
    intervalId = undefined;
    return;
  }
  // If the time is > than 60 secondes, converts in minutes 
  if (startTime >= 60) {
    const minutesTimer = Math.floor(startTime / 60);
    const secondsTimer = startTime % 60;
    displaychrono.innerHTML = `Temps restant : ${minutesTimer} min : ${secondsTimer} sec`;
  } else {
    displaychrono.innerHTML = `Temps restants : 00 min : ${startTime} sec`;
  }
  // If the time is less than 10 secondes, reset background color
  if (startTime <= 10) {
    containerTimer.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
  }

  startTime -= 1;
  // If timer equals 0 and we haven't finished the quiz
  if (startTime === 0 && currentQuestion !== nbQuestion) {
    Swal.fire({
      icon: 'warning',
      title: '',
      text: 'Le temps est écoulé',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        content: 'swal-custom-content',
        confirmButton: 'swal-custom-confirm-button',
      },
      showCancelButton: false,
      confirmButtonText: 'OK',
    });
    renderScore();
    clearInterval(intervalId);
    intervalId = undefined;
  }
}

export default quizPage;
