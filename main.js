const scrollCta = document.querySelector("#scroll-cta");
const worksContainer = document.querySelector("#works-container");
const menuItems = document.querySelectorAll(".menu-item");
const preview = document.querySelector("#preview");
let works = false;


function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      works = true;
      console.log("Elemento visibile");
      scrollCta.style.flexDirection = "column-reverse";
      scrollCta.querySelector("p").innerHTML = `BACK`;
      scrollCta.querySelector("img").style.transform = "scaleY(-1)";
    } else {
      works = false;
      console.log("Elemento non visibile");
      scrollCta.style.flexDirection = "column";
      scrollCta.querySelector("p").innerHTML = `WORKS`;
      scrollCta.querySelector("img").style.transform = "scaleY(1)";
    }
    console.log("works:", works);
  });
}

const observer = new IntersectionObserver(handleIntersection, {
  root: null,
  threshold: 0.3
});

observer.observe(worksContainer);

scrollCta.addEventListener("click", function() {
  console.log(works);
  this.scrollIntoView({
    behavior: 'smooth',
    block: works ? 'end' : 'start'
  });
});

menuItems.forEach((item, index) => {
  item.addEventListener("mouseover", () => {
    preview.style.backgroundImage = `url('/public/Mockup_${index + 1}.png')`;

    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    preview.style.transform = `translateY(${centerY - preview.offsetHeight / 2}px)`;
    preview.style.opacity = "1";
  });

  item.addEventListener("mouseout", () => {
    preview.style.opacity = "0";
  });
});


