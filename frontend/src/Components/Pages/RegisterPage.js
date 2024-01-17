import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';
import { logIn, register } from '../../models/users';
import { checkAuthentication } from '../../utils/auths';
import { createBalloons, animateBalloons } from '../../utils/animation';
import { showError, showSuccess } from '../../utils/customAlerts';

function renderRegister() {
  const main = document.querySelector('main');

  main.innerHTML = `
    <div id="containerAuthentification" class="container-xxl d-flex justify-content-center align-items-center pt-5">
    <div id="squareRegister" class="w-75">
        <div class="card shadow-lg ">
            <div class="card-body p-5">
                <h2 class="fs-4 card-title fw-bold mb-4 text-center">Inscription</h2>
                <form>
                    <div class="mb-3">
                        <label class="mb-2 text-muted" for="email">Pseudo</label>
                        <input id="username" type="text" class="form-control" name="email" value="" required
                            autofocus placeholder="baron12" />
                    </div>

                    <div class="mb-3">
                        <div class="mb-2 w-100">
                            <label class="text-muted" for="password">Mot de passe</label>
                        </div>
                        <input id="password" type="password" class="form-control" name="password" required
                            placeholder="••••••••" />
                    </div>

                    <div class="mb-3">
                        <div class="mb-2 w-100">
                            <label class="text-muted" for="password">Confirmation du mot de passe</label>
                        </div>
                        <input id="conf-password" type="password" class="form-control" name="password" required
                            placeholder="••••••••" />
                    </div>

                    <div class="mb-3 text-center">
                          <div class="accept">
                          <input type="checkbox" id="rgpd" class="form-check-input mt-2">
                            J'accepte les <a href="https://www.privacypolicies.com/live/57c23a50-18c6-4d2b-9bc6-79fda5cc263d" target="_blank">termes & conditions</a>
                          </div>
                        </div
                    <div class="mb-3">
                        <input id="register" type="button" class="btn btn-authentification mn-3  w-100"
                            value="S'inscrire" disabled/>
                    </div>
                    <span id="errorMessage"></span>
                </form>
            </div>
        </div>
    </div>
    <div class="balloon-container">
          <!-- Balloons will be added here -->
    </div>
</div>`;

  const btnRegister = document.getElementById('register');
  btnRegister.addEventListener('click', handleRegisterClick);

  const msgError = document.getElementById('errorMessage');
  const acceptCheckbox = document.getElementById('rgpd');

  acceptCheckbox.addEventListener('change', () => {
    if (acceptCheckbox.checked) {
      btnRegister.removeAttribute('disabled');
      msgError.innerHTML = ``;
    } else if (!acceptCheckbox.checked) {
      btnRegister.setAttribute('disabled', 'true');
      msgError.innerHTML = `*Afin de continuer, veuillez accepter les termes et conditions.`;
    }
  });
}

async function handleRegisterClick() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const verifPassword = document.getElementById('conf-password').value.trim();

  if (!username || !password || !verifPassword) {
    showError('Tous les champs du formulaire sont obligatoires');
    return;
  }
  if (password !== verifPassword) {
    showError('Les mots de passe ne correspondent pas');
    return;
  }
  try {
    const response = await register(username, password);

    if (!response.ok) {
      showError('Le pseudo existe deja');
      return;
    }
    const responseLogin = await logIn(username, password);

    const responseData = await responseLogin.json();

    if (responseData && responseData.token) {
      sessionStorage.setItem('token', responseData.token);
    } else {
      showError('Une erreurs est survenue');
      return;
    }
    createBalloons();
    animateBalloons();
  } catch (err) {
    showError("Une erreur est survenue lors de l'inscription");
  }
}

const RegisterPage = async () => {
  const isConnected = await checkAuthentication();

  if (isConnected) {
    showSuccess('Vous êtes déjà connecté');
    Navigate('/categories');
    return;
  }
  clearPage();
  renderRegister();
};

export default RegisterPage;
