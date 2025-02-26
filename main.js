const scrollCta = document.querySelector("#scroll-cta");
const worksContainer = document.querySelector("#works-container");
const menuItems = document.querySelectorAll(".menu-item");
const preview = document.querySelector("#preview");
let works = false;

scrollCta.addEventListener("mouseenter", () => { 
  scrollCta.style.transform = `translateY(${works ? "-5px" : "5px"})`;
});

scrollCta.addEventListener("mouseleave", () => {
  scrollCta.style.transform = "translateY(0)";
});


function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      works = true;
      console.log("Elemento visibile");
      scrollCta.style.flexDirection = "column-reverse";
      scrollCta.querySelector("p").innerHTML = `back`;
      scrollCta.querySelector("img").style.transform = "scaleY(-1)";
    } else {
      works = false;
      console.log("Elemento non visibile");
      scrollCta.style.flexDirection = "column";
      scrollCta.querySelector("p").innerHTML = `works`;
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

let debounceTimeout;
preview.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out, background-image 0.3s ease-in-out;"

const timeline = ["09/24 - 01/25", "02/24 - 06/24", "02/24 - 07/24", "03/23 - 06/23", "09/23 - 01/24"]

menuItems.forEach((item, index) => {
  item.addEventListener("mouseover", () => {
    preview.style.backgroundImage = `url('/public/Mockup_${index + 1}.jpg')`;

    const rect = item.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2 + window.scrollY;

    preview.style.transform = `translateY(${centerY - preview.offsetHeight / 2}px)`;
    preview.style.opacity = "1";

    // Clear any existing timeout to prevent flickering
    clearTimeout(debounceTimeout);

    // Update scrollCta text immediately
    scrollCta.querySelector("p").innerHTML = timeline[index];
  });

  item.addEventListener("mouseout", () => {
    preview.style.opacity = "0";
    // Set a timeout to delay changing text to "BACK"
    debounceTimeout = setTimeout(() => {
      scrollCta.querySelector("p").innerHTML = `${works ? "back" : "works"}`;
    }, 300); // Adjust the delay (in milliseconds) as needed
  });
});



