const Footer = () => {
  renderFooter();
};

function renderFooter() {
  const footer = document.querySelector('footer');
  const footerHtml = `
      <div class="text-center text-lg-start">
        <div class="text-center p-3">
          COPYRIGHT © 2023 - 2024 - TOUS DROITS RESERVES
          <a class="text-body">QuizWiz</a>
        </div>
      </div>  
  `;

  footer.innerHTML = footerHtml;
}

export default Footer;
