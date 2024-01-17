import Swal from 'sweetalert2';

import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { readAllCategories, addOneQuiz } from '../../models/quizzes';
import { checkAuthentication } from '../../utils/auths';
import { showInfo, showError } from '../../utils/customAlerts';

let questions = [];
let questionCount = 0;
let currentCount = 0;
let numberOfQuestions = 0;
const numberBadAnswer = 3;
const maxQuestionsPerQuiz  = 70;
let title;
let category;
let quizToBeCreated;
const main = document.querySelector('main');

const CreateQuizPage = async () => {
  // Checking if the user is authenticated
  const isConnected = await checkAuthentication();
  if (!isConnected) {
    showError('Veuillez vous connecter');
    Navigate('/login');
    return;
  }

  clearPage();
  questions = [];
  numberOfQuestions = 0;
  questionCount = 0;
  currentCount = 0;
  await renderFormInfoQuiz();
  attachEventListenersFromInfoQuiz();
};

async function renderFormInfoQuiz() {
  clearPage();
  const allCategories = await readAllCategories();
  let MainFormInfoQuiz = ` 
  <section >
	<div class="container-xxl d-flex justify-content-center align-items-center pt-5 ">
		<div class="w-75">
			<div class="card shadow-lg">
				<div class="card-body p-5">
					<div class="alert  text-center">
						<h2 class="fs-4 mt-1 card-title">Créer ton quiz</h2>
					</div>
					<form>
						<div class="row mb-3">
							<div class="col">
								<label class="mb-2 text-muted" for="titleQuiz">Titre</label>
								<input type="text" class="form-control" id="titleQuiz" name="titleQuiz" required autofocus >
							</div>
						</div>
						<div class="row mb-3">
							<div class="col">
								<label class="mb-2 text-muted" for="category">Catégorie</label>
								<select class="form-select" id="category" name="category" required autofocus>
                <option value="" disabled selected>Veuillez sélectionner une catégorie</option>`;
  // Adding options for each category
  allCategories.forEach((c) => {
    MainFormInfoQuiz += ` <option value="${c.label}">${c.label}</option>`;
  });

  MainFormInfoQuiz += `
								</select>
							</div>
						</div>
						<div class="row mb-3">
							<label class=" form-label mb-2 text-muted" for="numberQuestion">Nombre de questions</label>
							<div class="col-5 d-flex align-items-center input-group">
								<input type="number" class="form-control" id="numberQuestion" name="numberQuestion" required autofocus >
								<button id="btnInfo" class="btn btn-outline-secondary" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Information">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
										<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
										<path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
									</svg>
								</button>
							</div>
						</div>
						<div class="mb-3 text-center">
							<button type="submit" class="btn btn-primary " id="btnSubmitFormInfo">Continuer</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>`;
  main.innerHTML = MainFormInfoQuiz;
  questionCount += 1;
  currentCount += 1;
}

function attachEventListenersFromInfoQuiz() {
  const btnSubmitFormInfo = document.querySelector('#btnSubmitFormInfo');
  const btnInfo = document.querySelector('#btnInfo');
  title = document.querySelector('#titleQuiz');
  category = document.querySelector('#category');

  // Event listener for information on number of questions allowed
  btnInfo.addEventListener('click', (e) => {
    e.preventDefault();
    showInfo('Le nombre maximum de question autorisé est de 70');
  });

  btnSubmitFormInfo.addEventListener('click', (e) => {
    e.preventDefault();
    numberOfQuestions = parseInt(document.querySelector('#numberQuestion').value, 10);
    // Checking the inputs
    if(numberOfQuestions > maxQuestionsPerQuiz){
      showError('Vous avez dépassé la limite de questions possibles');

    }else if (!Number.isNaN(numberOfQuestions) && numberOfQuestions > 0 && title.value && category.value)
      renderQuizQuestions();
    else showError('Tous les champs du formulaire sont obligatoires');
  });
}

function renderQuizQuestions() {
  clearPage();
  let quizHTML = `
  <section id="MainQuiz">
    <div class="container-xxl justify-content-center pt-5">
      <div class="card shadow-lg">
        <div class="card-body p-5">
        <h2 class="fs-4 card-title text-center mb-4">Question ${questionCount}</h2>         
          <form>
            <div class="row mb-3">
              <div class="col">
                <label class="mb-2 text-muted" for="question">Question</label>
                <input type="text" class="form-control" id="question" name="question" value="${
                  questions[questionCount - 1] !== undefined ? questions[questionCount - 1][0] : ''
                }" required autofocus>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col">
                <label class="mb-2 text-muted" for="goodAnswer">Bonne réponse</label>
                <input type="text" class="form-control" id="goodAnswer" name="goodAnswer" value="${
                  questions[questionCount - 1] !== undefined ? questions[questionCount - 1][1] : ''
                }" required autofocus>
              </div>
            </div>`;
  let j = 2;
  // For each bad answer, if the answer at the current index exists in the array, set the input value
  for (let index = 0; index < numberBadAnswer; index += 1) {
    quizHTML += `
    <div class="row mb-3">
      <div class="col">
        <label class="mb-2 text-muted" for="badAnswer">Mauvaise réponse</label>
        <input type="text" class="form-control badAnswers" name="badAnswer" value="${
          questions[questionCount - 1] !== undefined ? questions[questionCount - 1][j] : ''
        }" required autofocus>
      </div>
    </div>`;
    j += 1;
  }
  if (questionCount === 1) {
    // Button for the first question
    quizHTML += `
    <div class="mb-3 d-flex justify-content-end">
    <button type="submit" class="btn btn-primary " id="previousQuestion" style="display: none;">Précédent</button>
      <button type="submit" class="btn btn-outline-primary " id="nextQuestion">Suivant</button>
    </div>
  </form>
</div>
</div>
</div>
</div>
</section>
`;
  } else {
    // Buttons for questions other than the first one

    quizHTML += `
    <div class="mb-3 d-flex justify-content-between">
      <button type="submit" class="btn btn-outline-info" id="previousQuestion">Précédent</button>
     `;

    if (questionCount === numberOfQuestions) {
      quizHTML += `<button type="submit" class="btn btn-primary  " id="nextQuestion">Terminer</button>`;
    } else {
      quizHTML += `<button type="submit" class="btn btn-outline-primary  " id="nextQuestion">Suivant</button>`;
    }

    quizHTML += `
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
`;
  }

  main.innerHTML = quizHTML;
  attachEventListenersQuizQuestions();
}

// Event listeners for buttons in the quiz creation form
function attachEventListenersQuizQuestions() {
  const previousQuestion = document.querySelector('#previousQuestion');
  const nextQuestion = document.querySelector('#nextQuestion');

  // Event listener for the "Previous" button
  previousQuestion.addEventListener('click', (e) => {
    e.preventDefault();
    if (questionCount > 1) {
      questionCount -= 1;
      renderQuizQuestions();
    }
  });

  // Event listener for the "Next" or "Finish" button
  nextQuestion.addEventListener('click', async (e) => {
    e.preventDefault();
    if (questionCount <= numberOfQuestions) {
      const question = document.querySelector('#question');
      const badAnswers = document.querySelectorAll('.badAnswers');
      const goodAnswer = document.querySelector('#goodAnswer');

      if (!question.value || !goodAnswer.value || [...badAnswers].some((answer) => !answer.value)) {
        showError('Tous les champs du formulaire sont obligatoires');
        return renderQuizQuestions;
      }

      let answersBad = [];
      // Extracts and stores the bad answers in the answersBad array
      answersBad = Array.from(badAnswers).map((answer) => answer.value);

      // Combine the question, good answer, and bad answers into an array for the current question
      const questAnsw = [question.value, goodAnswer.value, ...answersBad];

      // Update or push the current question data to the questions array
      if (questionCount === currentCount) {
        questions.push(questAnsw);
        questionCount += 1;
        currentCount += 1;
      } else {
        questions[questionCount - 1] = questAnsw;
        questionCount += 1;
      }

      if (questionCount <= numberOfQuestions) {
        renderQuizQuestions();
      } else {
        const result = await Swal.fire({
          title: 'Êtes-tu sûr de vouloir créer ce quiz?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Oui, créer le quiz!',
          cancelButtonText: 'Annuler',
        });
        if (result.isConfirmed) {
          // Create the quiz
          quizToBeCreated = {
            title: title.value,
            category: category.value,
            questions,
          };
          await addOneQuiz(quizToBeCreated);
          Navigate('/userSpace');
        } else {
          return CreateQuizPage();
        }
      }
    }
    return null;
  });
}

export default CreateQuizPage;
