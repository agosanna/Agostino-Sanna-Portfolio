document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".container-w-gallery").forEach((slideContainer, galleryIndex) => {
        const slides = [
            [
            { src: "../public/mediaprojects/jo/our system.jpg", text: "Defining and sketching the system was a crucial starting point to understand what needed to be tested and what did not." },
            { src: "../public/mediaprojects/jo/storyboard.jpg", text: "We outlined the interaction flow through a simple yet comprehensive storyboard." },
            { src: "../public/mediaprojects/jo/jo_midfidelity.jpg", text: "After multiple iterations, we designed a mid-fidelity UI with three touchpoints: the central display for ADAS and level switching, the cockpit for Jo's requests, and the steering wheel lever for accepting them." },
            { src: "../public/mediaprojects/jo/test-setup.jpg", text: "At this stage, we were ready for extensive testing, requiring an immersive setup to accurately evaluate our design in a realistic context." },
            ],
        ];
        
        const prevArrow = slideContainer.querySelector(".arrow:first-of-type");
        const nextArrow = slideContainer.querySelector(".arrow:last-of-type");
        const dots = slideContainer.querySelectorAll(".dot");
        const gallery = slideContainer.querySelector(".gallery");
        const textContainer = gallery.querySelector("p:last-of-type");
        let currentIndex = 0;
  
        function updateGallery(index) {
            const slideImage = slideContainer.querySelector(".slide img");
            const newImageSrc = slides[galleryIndex][index].src;
            const newText = slides[galleryIndex][index].text;

            // Add transition class for fade out
            slideImage.classList.add("fade-out");
            textContainer.classList.add("fade-out");

            // Wait for the transition to complete before updating the content
            setTimeout(() => {
            slideImage.src = newImageSrc;
            textContainer.innerHTML = newText;

            // Remove the transition class to fade in
            slideImage.classList.remove("fade-out");
            textContainer.classList.remove("fade-out");

            // Add transition class for fade in
            slideImage.classList.add("fade-in");
            textContainer.classList.add("fade-in");

            // Remove the fade-in class after the transition
            setTimeout(() => {
                slideImage.classList.remove("fade-in");
                textContainer.classList.remove("fade-in");
            }, 100); 
            }, 100); 

            dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
            });
        }
  
        prevArrow.addEventListener("click", function () {
            currentIndex = (currentIndex - 1 + slides[galleryIndex].length) % slides[galleryIndex].length;
            updateGallery(currentIndex);
        });
  
        nextArrow.addEventListener("click", function () {
            currentIndex = (currentIndex + 1) % slides[galleryIndex].length;
            updateGallery(currentIndex);
        });
  
        dots.forEach((dot, i) => {
            dot.addEventListener("click", function () {
                currentIndex = i;
                updateGallery(currentIndex);
            });
        });
  
        updateGallery(currentIndex);
    });

    const buttons = document.querySelectorAll("#tab-nav .btn");
    const firstTab = document.querySelectorAll(".level");
    const secondTab = document.querySelectorAll(".overtake");
    const thirdTab = document.querySelectorAll(".interaction");

    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            // Remove 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // Hide all elements
            [firstTab, secondTab, thirdTab].forEach(group => {
            group.forEach(el => el.style.display = "none");
            });

            // Show the relevant elements
            if (index === 0) {
            firstTab.forEach(el => el.style.display = "block");
            } else if (index === 1) {
            secondTab.forEach(el => el.style.display = "block");
            
            } else if (index === 2) {
            thirdTab.forEach(el => el.style.display = "block");
            }
        });
    });
  });