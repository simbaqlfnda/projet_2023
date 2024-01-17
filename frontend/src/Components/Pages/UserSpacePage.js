import Swal from 'sweetalert2';
import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { getConnectedUserDetails, checkAuthentication } from '../../utils/auths';
import { readAllQuizzesByUser, deleteOneQuiz } from '../../models/quizzes';
import { readAllBadgesByUser, readAllBadges } from '../../models/badges';
import quizLinkEventListeners from '../../utils/quiz';
import medalGold from '../../img/medal_gold.png';
import medalSilver from '../../img/medal_silver.png';
import medalBronze from '../../img/medal_bronze.png';
import medalPlatine from '../../img/medal.png';
import { showError } from '../../utils/customAlerts';

const main = document.querySelector('main');
let userID;
let userName;

const UserSpacePage = async () => {
  // Check if the user is authenticated
  const isConnected = await checkAuthentication();

  if (!isConnected) {
    showError('Veuillez vous connecter');
    Navigate('/login');
    return;
  }

  await getConnectedUserDetails().then((userDetails) => {
    userID = userDetails.userID;
    userName = userDetails.userName;
    renderUserQuiz();
  });
};

async function renderUserQuiz() {
  clearPage();
  const allQuizzesByUser = await readAllQuizzesByUser();
  let mainListQuiz = `
    <section>
      <div class="alert color-purple">
        <p>Bienvenue ${userName}</p>
      </div>
      <nav class="navbar navbar-expand">
      <div class="container-fluid">
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ">
              <li class="nav-item">
                <a class="nav-link styleLink styleLinkHover" id="linkListQuiz" >Mes quiz</a>
              </li>
              <li class="nav-item">
                <a class="nav-link styleLinkHover" id="linkBadge" >Mes badges</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="alert">
        <div class="container-xxl justify-content-center pt-5 "> 
     `;

  // Check if the user has created any quizzes
  if (allQuizzesByUser.length === 0) {
    mainListQuiz += `   
    <div class="alert alert-light text-center">
    <p>Vous n'avez pas encore créé de quiz !</p>
  </div>
          `;
  } else {
    allQuizzesByUser.forEach((quiz) => {
      mainListQuiz += `   
      <a id_quiz="${quiz.quiz_id}" class=" quiz text-decoration-none" style="cursor: pointer">
     <div class="row">
     <div class="card shadow cardMyQuiz">
         <div class="card-body">
          <p id="deletedReponse"></p>
             <div class="row">
                 <div class="col-md-4">
                    ${quiz.title}
                 </div>
                 <div class="col-md-4 text-center" >
                 ${new Date(quiz.date_creation).toLocaleDateString()}
                 </div>
                 <div class="col-md-4 text-end">
                  <button class="btn btn-danger delete-quiz-btn" data-id=${
                    quiz.quiz_id
                  }>Supprimer</button>
                 </div>

             </div>
         </div>
     </div>
 </div>
 </a>`;
    });
  }
  mainListQuiz += `   
      </div>
      </div>
    </section>`;

  main.innerHTML = mainListQuiz;

  const linkBadge = document.querySelector('#linkBadge');

  linkBadge.addEventListener('click', () => {
    renderUserBadges();
  });
  deleteEventListeners();
  quizLinkEventListeners();
}

function deleteEventListeners() {
  const deleteButtons = document.querySelectorAll('.delete-quiz-btn');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      // Prevent other event handlers from executing
      e.stopPropagation();
      e.preventDefault();
      const deleteQuiz = e.target.dataset.id;
      try {
        const reponse = await deleteOneQuiz(deleteQuiz);
        if (!reponse.ok) {
          Swal.fire({
            title: `Un problème est survenu lors de l'opération`,
            icon: 'error',
            timer: 1000,
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            title: 'Votre quiz a bien été supprimé',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
          });
        }

        renderUserQuiz();
      } catch (error) {
        Navigate('/userSpace');
      }
    });
  });
}

async function renderUserBadges() {
  clearPage();
  const allBadges = await readAllBadges();
  const allBadgesByUser = await readAllBadgesByUser(userID);
  let mainUserBadges = `
    <section>
    <div class="alert color-purple">
    <p>Bienvenue ${userName}</p>
  </div>
  <nav class="navbar navbar-expand">
  <div class="container-fluid">
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link styleLinkHover" id="linkListQuiz" >Mes quiz</a>
              </li>
              <li class="nav-item">
                <a class="nav-link styleLink styleLinkHover" id="linkBadge" >Mes badges</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="alert">
          <div class="container-xxl justify-content-center pt-5">
      `;

  mainUserBadges += `     
            <div class="card shadow-lg">
              <div class="card-body p-5"> 
              <div class="row mt-3">`;
  let count = 0;
  allBadges.forEach((badge) => {
    let isWinned = false;
    if (count % 4 === 0 && count !== 0) {
      mainUserBadges += ' </div>  <div class="row mt-3">';
    }

    allBadgesByUser.forEach((b) => {
      if (b.badge_id === badge.badge_id) {
        isWinned = true;
      }
    });
    if (isWinned === true) {
      mainUserBadges += ` <div class="col-12 col-lg-3 col-md-6">
        <img src="${getImageForBadge(badge.label)}"  alt="${
        badge.label
      }" class="img-fluid badge-image" data-badge="${badge.label}">
      </div>`;
    } else {
      mainUserBadges += ` <div class="col-12 col-lg-3 col-md-6">
      <img src="${getImageForBadge(badge.label)}"  alt="${
        badge.label
      }" class="img-fluid badges_disabled badge-image" data-badge="${badge.label}">
    </div>`;
    }
    count += 1;
  });
  mainUserBadges += `
        </div>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  main.innerHTML = mainUserBadges;
  const badgeImages = document.querySelectorAll('.badge-image');
  badgeImages.forEach((badgeImage) => {
    badgeImage.addEventListener('click', () => {
      const badgeLabel = badgeImage.dataset.badge;
      showBadgeInfo(badgeLabel);
    });
  });

  const linkListQuiz = document.querySelector('#linkListQuiz');
  linkListQuiz.addEventListener('click', () => {
    renderUserQuiz();
  });
}

function showBadgeInfo(badgeLabel) {
  Swal.fire({
    title: badgeLabel,
    text: `Gagne ce badge après avoir accumulé ${getPointForBadge(badgeLabel)} points`,
    imageUrl: getImageForBadge(badgeLabel),
    imageAlt: badgeLabel,
    imageWidth: 150,
    imageHeight: 150,
    confirmButtonText: 'Fermer',
  });
}

// Get points required for each badge
function getPointForBadge(badgeLabel) {
  if (badgeLabel === `Médaille d'or`) return 600;
  if (badgeLabel === `Médaille de bronze`) return 200;
  if (badgeLabel === `Médaille d'argent`) return 400;
  if (badgeLabel === `Médaille de platine`) return 800;
  return medalPlatine;
}
// Define the name of the image for each badge
function getImageForBadge(badgeLabel) {
  if (badgeLabel === `Médaille d'or`) return medalGold;
  if (badgeLabel === `Médaille de bronze`) return medalBronze;
  if (badgeLabel === `Médaille d'argent`) return medalSilver;
  if (badgeLabel === `Médaille de platine`) return medalPlatine;
  return medalPlatine;
}
export default UserSpacePage;
