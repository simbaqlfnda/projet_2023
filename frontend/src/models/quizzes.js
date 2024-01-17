import Swal from 'sweetalert2';


const readAllCategories = async () => {
  try {
    const response = await fetch(`http://localhost:3000/quizzes/categories`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (err) {
    console.error('readAllCategories::error: ', err);
    throw err;
  }
};

const addOneQuiz = async (quiz) => {
  const main = document.querySelector('main');
  main.innerHTML = `
  <div class="text-center" id="loadingSpinner" style="display: none;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
`;
  const loadingSpinner = document.querySelector('#loadingSpinner');
  try {
    loadingSpinner.style.display = 'block';
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const options = {
      method: 'POST',
      body: JSON.stringify(quiz),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
    const response = await fetch(`http://localhost:3000/quizzes`, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    loadingSpinner.style.display = 'none';
    const createdQuiz = await response.json();
    Swal.fire({
      title: 'Création du quiz réussie!',
      text: 'Votre quiz a été créé avec succès.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
    return createdQuiz;
  } catch (err) {
    loadingSpinner.style.display = 'none';
    Swal.fire({
      title: 'Erreur lors de la création du quiz',
      text: err.message,
      icon: 'error',
    });
    console.error('addOneQuiz::error: ', err);
    throw err;
  }
};

const readAllQuizzesByUser = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };

    const response = await fetch(`http://localhost:3000/quizzes`, options);
    if (!response.ok) {
      if (response.status === 400) {
        return [];
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const quizzes = await response.json();
    return quizzes;
  } catch (err) {
    console.error('readAllQuizzesByUser::error: ', err);
    throw err;
  }
};

const deleteOneQuiz = async (quiz) => {
  const main = document.querySelector('main');
  main.innerHTML = `
  <div class="text-center" id="loadingSpinner" style="display: none;">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
`;

  const loadingSpinner = document.querySelector('#loadingSpinner');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  try {
    loadingSpinner.style.display = 'block';
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    };
  
    const response = await fetch(`http://localhost:3000/quizzes/${quiz}`, options);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    loadingSpinner.style.display = 'none';

    return response;
  } catch (err) {
    loadingSpinner.style.display = 'none';
    console.error('deleteOneQuiz::error: ', err);
    throw err;
  }
};

const readAllQuizzesByCategory = async (categoryName) => {
  try {
    const response = await fetch(
      `http://localhost:3000/quizzes/readAllQuizzesByCategories/?label=${categoryName}`,
    );

    if (!response.ok) {
      if (response.status === 400) {
        return [];
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const quizzesInCategory = await response.json();
    if(quizzesInCategory === null){
      return null;
    }
    return quizzesInCategory;
  } catch (err) {
    console.error('readAllQuizzesByCategory::error:', err);
    throw err;
  }
};
const readOneQuizById = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/quizzes/readAllQuizzesByCategories/?quiz-id=${id}`,
    );
    if (!response.ok) {
      if (response.status === 400) {
        return undefined;
      }
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const quiz = await response.json();
    return quiz;
  } catch (err) {
    console.error('readOneQuizById::error: ', err);
    throw err;
  }
};
export {
  readAllCategories,
  addOneQuiz,
  readAllQuizzesByUser,
  deleteOneQuiz,
  readAllQuizzesByCategory,
  readOneQuizById,
};
