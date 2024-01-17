import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { logIn } from '../../models/users';
import { checkAuthentication } from '../../utils/auths';
import { showError, showSuccess } from '../../utils/customAlerts';
import Navbar from '../Navbar/Navbar';

let isRememberMeChecked = false;

function renderLoginForm() {
  const main = document.querySelector('main');
  main.innerHTML = `
  <div id="containerAuthentification" class="container-xxl d-flex justify-content-center align-items-center pt-5">
    <div id="squareLogin" class="w-75">
      <div class="card shadow-lg ">
        <div class="card-body p-5">
          <h2 class="fs-4 card-title fw-bold mb-4 text-center">Connexion</h2>
          <form>
            <div class="mb-3">
              <label class="mb-2 text-muted" for="email">Pseudo</label>
              <input id="username" type="text" class="form-control" name="email" value="" required autofocus placeholder="baron12"/>
            </div>

            <div class="mb-3">
              <div class="mb-2 w-100">
                <label class="text-muted" for="password">Mot de passe</label>
              </div>
              <div class="input-group">
                <button class="btn btn-outline-secondary" type="button" id="hidePassword">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                    <path
                      d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z" />
                    <path
                      d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                    <path
                      d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708" />
                  </svg>
                </button>
                <input id="password" type="password" class="form-control" name="password" required placeholder="••••••••" />
              </div>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe">
              <label class="form-check-label" for="rememberMe">Se souvenir de moi</label>
            </div>
            <div class="mb-3">
              <input id="login" type="button" class="btn btn-authentification mn-3  w-100" value="Se connecter" />
            </div>
            <div class="mb-3">
              <input id="register" type="button" class="btn btn-outline-secondary mn-3  w-100" value="Nouveau sur QUIZWIZ ? Créer un compte">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>`;

  const btnRegister = document.getElementById('register');
  btnRegister.addEventListener('click', handleRegisterClick);

  const btnLogin = document.getElementById('login');
  btnLogin.addEventListener('click', handleLoginClick);

  const souvenir = document.getElementById('rememberMe');
  souvenir.addEventListener('change', remember);

  const passswordInput = document.querySelector('#password');
  const passwordBtn = document.querySelector('#hidePassword');

  passwordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const passwordVisibility = passswordInput.getAttribute('type');
    if (passwordVisibility === 'password') {
      passswordInput.setAttribute('type', 'text');
      passwordBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>';
    } else {
      passswordInput.setAttribute('type', 'password');
      passwordBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708"/>g</svg>';
    }
  });
}

function remember() {
  isRememberMeChecked = document.getElementById('rememberMe').checked;
}

function handleRegisterClick() {
  Navigate('/register');
}

async function handleLoginClick(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    showError('Tous les champs du formulaire sont obligatoires');
    return;
  }

  try {
    const response = await logIn(username, password);

    if (!response.ok) {
      showError('Le pseudo ou le mot de passe est incorrect');
      return;
    }

    const responseData = await response.json();

    if (responseData && responseData.token) {
      if (isRememberMeChecked) {
        localStorage.setItem('token', responseData.token);
      } else {
        sessionStorage.setItem('token', responseData.token);
      }
    } else {
      showError('Une erreurs est survenue');
      return;
    }
    Navbar();
    showSuccess('Vous êtes connecté');
    Navigate('/categories');
  } catch (err) {
    showError('Une erreur est survenue lors de la connexion');
  }
}

const LoginPage = async () => {
  const isConnected = await checkAuthentication();

  if (isConnected) {
    showSuccess('Vous êtes déjà connecté');
    Navigate('/userSpace');
    return;
  }
  clearPage();
  renderLoginForm();
};

export default LoginPage;
