import { clearPage } from '../../utils/render';
import quizLinkEventListeners from '../../utils/quiz';
import { readAllQuizzesByCategory } from '../../models/quizzes';
import Navigate from '../Router/Navigate';
import { showError } from '../../utils/customAlerts';

let categoryName;

const QuizListPage = async () => {
  clearPage();
  // Recover the label from the url
  const url = new URLSearchParams(window.location.search);
  categoryName = url.get('label');
  renderQuizListInCategory();
};

async function renderQuizListInCategory() {
  // Get all the quizzes for the category specified
  const quizzesInCategory = await readAllQuizzesByCategory(categoryName);
  if (quizzesInCategory === null) {
    showError(`La catégorie specifiée n'existe pas`);
    Navigate('/categories');
    return;
  }
  const main = document.querySelector('main');
  let QuizList = '';
  const cardsInRow = 3;
  let counter = 0;
  const numberOfQuiz = quizzesInCategory.length;

  QuizList = `
    <section>
        <div class="headerLabel">
            <h2>${categoryName}</h2>
        </div>
    </section>

    <section>
    <div class="container ">
    <div class="row mt-3 lowPart">
  `;
  if (numberOfQuiz === 0) {
    QuizList += `   
    <div class="alert alert-light text-center alertQuizListPage" role="alert">
      <p>Aucun quiz n'a été créé pour cette catégorie.
        <a id = "createQuiz" class="alert-link" style="cursor: pointer">Sois le premier à en créer un !</a>
      </p>
    </div>
 `;
  } else {
    quizzesInCategory.forEach((q) => {
      if (counter === cardsInRow) {
        QuizList += `
      </div><div class="row mt-3 lowPart">
    `;
        counter = 0;
      }
      // Display the cards with title and pseudo
      QuizList += `
    <div class="col-12 col-lg-3 mt-3">
      <a id_quiz = "${q.quiz_id}" class= "quiz text-decoration-none">
        <div class="card cardQuizzes">
            <div class="card-body">
               <h5 class="card-title">${q.title}</h5>
                <p class="card-text"> ${q.pseudo}</p>
            </div>
        </div>
      </a>
    </div>
  `;
      counter += 1;
    });
  }
  QuizList += `

</div>
</div>
</section>
`;
  main.innerHTML = QuizList;
  // If the category don't have quizzes yet, redirect the user to /create
  if (numberOfQuiz === 0) {
    const btnCreateQuiz = document.getElementById('createQuiz');
    btnCreateQuiz.addEventListener('click', renderCreateQuiz);
  }
  quizLinkEventListeners();
}

function renderCreateQuiz() {
  Navigate('/create');
}

export default QuizListPage;
