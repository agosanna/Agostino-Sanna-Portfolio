import projects from "./Projects.js";

const slides = document.querySelectorAll(".slide");
const slideshow = document.querySelector("#slideshow");
const frames = document.querySelectorAll(".info");
const topInfo = document.getElementById("top");
const bottomInfo = document.getElementById("bottom");
const counter = document.getElementById("counter");
const container = document.querySelector(".container");

const title = document.getElementById("title");
const year = document.getElementById("year");
const latitude = document.getElementById("lat");
const type = document.getElementById("type");
const longitude = document.getElementById("lon");


let projInfo = null;
let imgCounter = 1;


let touchStartX = 0;
let touchEndX = 0;

window.addEventListener('load', function () {
  const loadingScreen = document.getElementById('loadingScreen');

  // Hide the loading screen
  loadingScreen.style.display = 'none';
});

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchEndX = touchStartX; // Set touchEndX to the start point initially
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX; // Capture the end point on touch end

    const swipeThreshold = 50; // Threshold for swipe detection

    if (Math.abs(touchStartX - touchEndX) > swipeThreshold) {
        if (touchStartX - touchEndX > 0) {
            // Swipe left
            nextSlide();
        } else {
            // Swipe right
            prevSlide();
        }
    }
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);


//create custom cursor for project images navigation
const customCursor = document.createElement("div");
customCursor.id = "customCursor";
document.body.appendChild(customCursor);

// Function to update cursor position
function updateCursorPosition(event) {
  customCursor.style.left = event.clientX + "px";
  customCursor.style.top = event.clientY + "px";
}

// Change the cursor depending on which side of the screen you are
document.addEventListener("mousemove", (event) => {
  const windowWidth = window.innerWidth;
  const mouseX = event.clientX;

  if (mouseX < windowWidth / 2) {
    document.body.style.cursor = "url(./public/arrow--left.svg),auto";
  } else {
    document.body.style.cursor = "url(./public/arrow--right.svg),auto";
  }
});

let currentIndex = 0;

window.addEventListener("resize", () => {frames.forEach((frame) => {
  setTimeout(() => {
    frame.style.width = `${slides[currentIndex].offsetWidth + 25}px`;
    if (projInfo){
      projInfo.style.width = slides[currentIndex].offsetWidth + 25 + "px";
    }
}, 500)
});});


//navigation across slides
function showSlide() {
  slides[currentIndex].style.transition = '0.5s ease';
  const currentProject = Object.values(projects)[currentIndex];

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currentIndex)}vw)`;
  });

  frames.forEach((frame) => {
    frame.style.width = slides[currentIndex].offsetWidth + 25 + "px";
    if (window.innerWidth < 650){
      console.log("ciao");
      topInfo.style.paddingBottom = slides[currentIndex].offsetHeight/2 - 24 + "px";
      bottomInfo.style.paddingTop = slides[currentIndex].offsetHeight/2 - 24 + "px";
    }
    console.log(currentIndex);
  });

  counter.innerHTML = `${currentIndex + 1}/6`;
  year.innerHTML = currentProject.year;
  title.innerHTML = currentProject.name;
  latitude.innerHTML = `N° ${currentProject.lat}`;
  type.innerHTML = currentProject.type;
  longitude.innerHTML = `E° ${currentProject.lon}`;
}

function nextSlide() {
  imgCounter = 1;
  slides[currentIndex].src = `./public/secondaryImg/${Object.values(projects)[currentIndex].img + imgCounter}.png`;
  killInfo(currentIndex);
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

function prevSlide() {
  imgCounter = 1;
  slides[currentIndex].src = `./public/secondaryImg/${Object.values(projects)[currentIndex].img + imgCounter}.png`;
  killInfo(currentIndex);
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
  console.log(currentIndex);
}

showSlide(currentIndex);

// Set up event listeners for next and previous buttons
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextSlide();
  } else if (event.key === "ArrowLeft") {
    prevSlide();
  }
});

slides.forEach((slide) => {
  slide.addEventListener("click", updateCursorPosition);

  slide.addEventListener("click", () => {
    showInfo();
    customCursor.style.display = "block";
    slideshow.style.cursor = "none";
    document.addEventListener("mousemove", updateCursorPosition);

    slide.addEventListener("mouseenter", () => {
      if (projInfo !== null){
      customCursor.style.display = "block";
      slideshow.style.cursor = "none";
      document.addEventListener("mousemove", updateCursorPosition);
      }
    });

    slide.addEventListener("mouseleave", () => {
      if (projInfo !== null){
      customCursor.style.display = "none";
      document.removeEventListener("mousemove", updateCursorPosition);
      }
    });
  });
});
if (window.innerWidth > 650){
  console.log("ciao")
  document.addEventListener("click", (event) => {
    if (event.target.tagName === "A" || event.target.id === "escLink") {
      // Allow default action for links (Email, Instagram, ESC, etc.)
      return;
    }

    const clickedSlide =
      Array.from(slides).includes(event.target) || event.target.closest(".slide");

    if (clickedSlide) {
      // Clicked inside a slide, the slide's click event listener will handle this
      return;
    }

    // Clicked outside a slide, navigate to next or previous slide
    if (event.clientX > window.innerWidth / 2) {
      nextSlide();
    } else {
      prevSlide();
    }
  });
}

function showInfo() {
  container.style.transition = 'transform 0.3s ease', 5000;
  if (projInfo === null) {
    if(window.innerWidth > 650){
      container.style.transform = 'translateY(-7vh)';
    }
    projInfo = document.createElement("div");

    const currentProject = Object.values(projects)[currentIndex];

    const whereElement = document.getElementById("lat");
    const howElement = document.getElementById("lon");

    whereElement.innerHTML = currentProject.where;
    howElement.innerHTML = currentProject.how;
    
    if (window.innerWidth < 650){
      howElement.innerHTML = currentProject.type;
      type.innerHTML = "";
    }

    projInfo.innerHTML = `<p>${currentProject.text} <a href="${currentProject.link}" id="link" style="text-decoration: underline; cursor: pointer; font-size: 1em" target="blank">LINK</a><a id="escLink" style="text-decoration: underline; cursor: pointer; font-size: 1em">ESC</a></p>`;
    setTimeout(() => {
      const link = document.getElementById("link");
      if (link && currentProject.link === "") {
          link.style.display = 'none';
      }
    }, 0);
    

    if (window.innerWidth > 650) {
      // For larger screens, append the info to the container
      container.appendChild(projInfo);
      projInfo.style.width = slides[currentIndex].offsetWidth + 25 + "px";
      projInfo.style.marginTop = "4vh";
  } else {
      // For mobile screens, append the info to the body and position it at the bottom
      document.body.appendChild(projInfo);
      projInfo.style.width = "92%";
      projInfo.style.position = "absolute";
      projInfo.style.bottom = "10vh"; // Adjust as needed for desired spacing from the bottom
      projInfo.style.left = "50%";
      projInfo.style.transform = "translateX(-50%)"; // Center the div
  }
      
    projInfo.style.transition = "0.5s";
    projInfo.style.textAlign = "justify";
    projInfo.setAttribute('lang', 'en');

    // Add event listener to the dynamically created link
    const escLink = document.getElementById("escLink");
    escLink.addEventListener("click", killInfo);
    // Update custom cursor content
    customCursor.innerHTML = `${imgCounter} / ${currentProject.imgs}`;
    // Change the slide image and update the counter on click
    slides[currentIndex].addEventListener("click", changeslide)
   }
 }

function changeslide(){
    // Increment the image counter
    imgCounter = imgCounter >= projects[Object.keys(projects)[currentIndex]].imgs ? 1 : imgCounter + 1;

    // Set low-resolution image and apply blur
    if (window.innerWidth < 650){
      slides[currentIndex].src = `./public/secondaryImg/low_res/${Object.values(projects)[currentIndex].img+imgCounter}.png`;
      slides[currentIndex].classList.add('img-blur');
    }

     // Add class to apply blur effect
     // Add a load event listener to the image
     slides[currentIndex].addEventListener('load', () => {
       // Update the frame width based on the new image dimensions
       frames.forEach((frame) => {
         frame.style.width = `${slides[currentIndex].offsetWidth + 25}px`;
         if (window.innerWidth < 650){
          topInfo.style.paddingBottom = slides[currentIndex].offsetHeight/2 - 24 + "px";
          bottomInfo.style.paddingTop = slides[currentIndex].offsetHeight/2 - 24 + "px";
         }
       });
       console.log(slides[currentIndex].offsetWidth);
     });

     // Prepare high-resolution image
    let highResImage = new Image();
    highResImage.src = `./public/secondaryImg/${Object.values(projects)[currentIndex].img+imgCounter}.png`; // Replace with path to your high-resolution image

    highResImage.onload = () => {
        // Once high-resolution image is loaded, replace and remove blur
        slides[currentIndex].src = highResImage.src;
        slides[currentIndex].classList.remove('img-blur');
    };

    // Update custom cursor content if applicable
    customCursor.innerHTML = `${imgCounter} / ${Object.values(projects)[currentIndex].imgs}`;

     // Update the custom cursor content
     customCursor.innerHTML = `${imgCounter} / ${Object.values(projects)[currentIndex].imgs}`;
     console.log("changeslide");
}

function killInfo() {
  if (projInfo && projInfo.parentElement) {
    // If it is, remove it
    projInfo.parentElement.removeChild(projInfo);
    projInfo = null; // Reset the variable
    container.style.transition = 'none'
    container.style.transform = 'translateY(0vh)';
    slides[currentIndex].removeEventListener("click", changeslide)
    slideshow.style.cursor = "crosshair";
    customCursor.style.display = "none";
  }
}