import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import image1 from '../../img/aboutUs1Bispng.png';
import image2 from '../../img/aboutUs2.jpg';


const aboutUs = () => {
  clearPage();
  renderGoBackHomeButton();

  const main = document.querySelector('main');
  main.innerHTML = `

  <section id="SectionMain">
    <section class="banner pt-5 d-flex justify-content-center align-items-center ">
      <div class="container my-5 py-5 text-center">
        <div class="row">
          <h1 class="center-text-area"> NOTRE EQUIPE </h1>
          <div text-center d-flex align-items-center justify-content-center">
            <img class="about-us-img" src="${image1}" alt="image about us">
          </div>
          <div class="text-center d-flex align-items-center justify-content-center">
            <h3 class="textAU"> Nous sommes cinq étudiants en deuxième année en informatique
                spécialisés dans le développement d'applications 
                à la Haute Ecole Léonard de Vinci. 
            </h3>
          </div>
        </div>
      </div>
    </section>
      
      <svg style="background color:#D9EEE1;" width="100%" height="70" viewBox="0 0 100 100"' preserveAspectRatio="none"> 
        <path id="wavepath" d="M0, 0 L110, 0C35,150 35,0 0,100z" fill="#F4EEFF"></path>
      </svg>
      
      <section class="pt-5 d-flex justify-content-center align-items-center ">
        <div class="container my-5 py-5 text-center">
          <div class="row">
            <div> <h1 class="center-text-area"> NOTRE PROJET </h1></div>
            <div text-center d-flex align-items-center justify-content-center">
              <img class="about-us-img" src="${image2}" alt="image about us">
            </div>
            <div class="text-center d-flex align-items-center">
              <h3 class="textAU">Dans le cadre de notre cours, nous avons conçu et développé un jeu de quiz éducatif. 
                                 Lors cette expérience interactive, les utilisateurs peuvent choisir parmi des catégories prédéfinies ou même 
                                 créer leurs propres quiz. Qu'ils préfèrent tester leurs connaissances ou défier leurs amis, notre plateforme 
                                 offre un éventail d'options de quiz passionnants.
                                 À la fin de chaque quiz, les joueurs reçoivent un score qui reflète leur performance, 
                                 et ils ont également la possibilité de gagner une collection de badges. 
                                 Ces badges sont des récompenses que les joueurs peuvent accumuler en participant activement au jeu.
             </h3>
            </div>
          </div>
        </div>
      </section>

</section>`;
};

function renderGoBackHomeButton() {
  const main = document.querySelector('main');
  const submit = document.createElement('input');
  submit.value = 'aboutus';
  submit.className = 'btn btn-secondary mt-3';
  submit.addEventListener('click', () => {
    Navigate('/');
  });

  main.appendChild(submit);
}

export default aboutUs;
