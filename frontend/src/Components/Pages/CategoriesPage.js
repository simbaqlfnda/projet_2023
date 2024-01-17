import { clearPage } from '../../utils/render';
import scienceImage from '../../img/science.jpg';
import historyImage from '../../img/history.jpg';
import generalCultureImage from '../../img/general_culture.jpg';
import economyImage from '../../img/economy.jpg';
import languagesImage from '../../img/languages.jpg';
import videoGamesImage from '../../img/video_games.jpg';
import mathematicsImage from '../../img/mathematics.jpg';
import cinemaImage from '../../img/cinema.jpg';
import computerScienceImage from '../../img/computer_science.jpg';
import geographyImage from '../../img/georaphy.jpg';
import sportImage from '../../img/sport.jpg';
import otherImage from '../../img/other.jpg';
import { readAllCategories } from '../../models/quizzes';
import Navigate from '../Router/Navigate';

const CategoriesPage = async () => {
  clearPage();
  await renderCategories();
};

/* Returns the categories page */
async function renderCategories() {
  const main = document.querySelector('main');
  let mainCategory = `
    <section>
      <div class="container-xxl">
        <h4>Catégories</h4>
      </div>
      <div class="container-xxl">
        <div class="row mt-3">
  `;
  let count = 0;
  const categories = await readAllCategories();
  categories.forEach((category) => {
    if (count % 4 === 0 && count !== 0) {
      mainCategory += `</div><div class="row mt-3">`;
    }
    mainCategory += `
        <div class="col-12 col-lg-3 col-md-6">
          <a category_label = "${category.label}"class="category text-center text-decoration-none">
            <div class="card highlight-card">
              <img class="custom-img img-fluid" src="${getImageForCategory(
                category.label,
              )}" alt="Image de la catégorie : ${category.label}">
              <div class="card-body">
                <p class="card-text">${category.label}</p>
              </div>
            </div>
          </a>
        </div>
      `;
    count += 1;
  });

  mainCategory += `
      </div>
    </div>
  </section>`;
  main.innerHTML = mainCategory;
  categoryEventListeners();
}

/* Event listener for category hover and click events  */
function categoryEventListeners() {
  const cards = document.querySelectorAll('.card');
  /* manages category hover events */
  cards.forEach((card) => {
    const currentCard = card;
    currentCard.addEventListener('mouseover', () => {
      currentCard.style.borderWidth = '2px';
      currentCard.classList.add('border-primary');
    });
    currentCard.addEventListener('mouseout', () => {
      currentCard.style.borderWidth = '1px';
      currentCard.classList.remove('border-primary');
    });
  });
  const btnCategory = document.querySelectorAll('.category');
  btnCategory.forEach((categoryLink) => {
    categoryLink.addEventListener('click', (e) => {
      e.preventDefault();
      const categoryName = e.currentTarget.getAttribute('category_label');
      Navigate(`/list?label=${categoryName}`);
    });
  });
}

/* Return the name of the image for a given category */
function getImageForCategory(categoryLabel) {
  if (categoryLabel === 'Mathématiques') return mathematicsImage;
  if (categoryLabel === 'Histoire') return historyImage;
  if (categoryLabel === 'Informatique') return computerScienceImage;
  if (categoryLabel === 'Langues') return languagesImage;
  if (categoryLabel === 'Sport') return sportImage;
  if (categoryLabel === 'Sciences') return scienceImage;
  if (categoryLabel === 'Géographie') return geographyImage;
  if (categoryLabel === 'Culture Générale') return generalCultureImage;
  if (categoryLabel === 'Jeux Vidéos') return videoGamesImage;
  if (categoryLabel === 'Economie') return economyImage;
  if (categoryLabel === 'Cinéma') return cinemaImage;
  if (categoryLabel === 'Autre') return otherImage;
  return undefined;
}
export default CategoriesPage;
