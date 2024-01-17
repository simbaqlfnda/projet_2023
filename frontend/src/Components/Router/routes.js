import HomePage from '../Pages/HomePage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import RankingPage from '../Pages/RankingPage';
import CreateQuizPage from '../Pages/CreateQuizPage';
import AboutusPage from '../Pages/AboutUsPage';
import CategoriesPage from '../Pages/CategoriesPage';
import UserSpacePage from '../Pages/UserSpacePage';
import quizPage from '../Pages/QuizPage';
import QuizListPage from '../Pages/QuizListPage';


const routes = {
  '/': HomePage,
  '/login':LoginPage,
  '/register':RegisterPage,
  '/ranking': RankingPage,
  '/create': CreateQuizPage,
  '/aboutUs': AboutusPage,
  '/categories': CategoriesPage,
  '/userSpace': UserSpacePage,
  '/quiz' : quizPage,
  '/list' : QuizListPage,
}
  

export default routes;
