const scrollCta = document.querySelectorAll(".scroll-cta");

scrollCta.forEach(button => {
  button.addEventListener('click', function() {
    this.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});