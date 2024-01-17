import { clearPage } from '../../utils/render';
import { readAllUsers } from '../../models/users';

let allUsers = [];
let ranking;
const RankingPage = async () => {
  // Get all users from the database
  allUsers = await readAllUsers();
  ranking = 1;
  renderRankingTable();
};

function renderRankingTable() {
  clearPage();
  const main = document.querySelector('main');
  let mainRanking = `
  <section>
<div class="container-xxl mt-5">
      <table class="table table-striped table-hover mt-4">
        <thead>
            <tr>
                <th>Classement</th>
                <th>Pseudo</th>
                <th>Point totale</th>
            </tr>
        </thead>
        <tbody> 
    `;
  allUsers.forEach((user) => {
    if (user.total_point > 0) {
      mainRanking += `
      <tr>
      <td> ${ranking} </td>
      <td>  ${user.pseudo} </td>
      <td> ${user.total_point} </td>
    </tr>`;
      // Increment the ranking for the next user
      ranking += 1;
    }
  });
  mainRanking += `    
  </tbody>
</table>
</div>
</section>`;

  main.innerHTML = mainRanking;
}

export default RankingPage;
