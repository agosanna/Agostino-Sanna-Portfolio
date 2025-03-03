document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".container-w-gallery").forEach((slideContainer, galleryIndex) => {
        const slides = [
            [
                { src: "./public/mediaprojects/solanum/sketching.jpg"},
                { src: "./public/mediaprojects/solanum/image.jpg"},
                { src: "./public/mediaprojects/solanum/image.jpg"},
                { src: "./public/mediaprojects/solanum/image.jpg"},
            ],
            [
                { src: "./public/mediaprojects/solanum/esploso.jpg"},
                { src: "./public/mediaprojects/solanum/image.jpg"},
                { src: "./public/mediaprojects/solanum/image.jpg"}
            ],
            [
                { src: "./public/mediaprojects/solanum/esploso.jpg"},
                { src: "./public/mediaprojects/solanum/image.jpg"},
                { src: "./public/mediaprojects/solanum/image.jpg"},
            ]
        ];
        
        const prevArrow = slideContainer.querySelector(".arrow:first-of-type");
        const nextArrow = slideContainer.querySelector(".arrow:last-of-type");
        const dots = slideContainer.querySelectorAll(".dot");
        let currentIndex = 0;
  
        function updateGallery(index) {
            const slideImage = slideContainer.querySelector(".slide img");
            const newImageSrc = slides[galleryIndex][index].src;

            // Add transition class for fade out
            slideImage.classList.add("fade-out");

            // Wait for the transition to complete before updating the content
            setTimeout(() => {
            slideImage.src = newImageSrc;

            // Remove the transition class to fade in
            slideImage.classList.remove("fade-out");

            // Add transition class for fade in
            slideImage.classList.add("fade-in");

            // Remove the fade-in class after the transition
            setTimeout(() => {
                slideImage.classList.remove("fade-in");
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
    const firstTab = document.querySelectorAll(".device");
    const secondTab = document.querySelectorAll(".app");

    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            // Remove 'active' class from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // Hide all elements
            [firstTab, secondTab].forEach(group => {
            group.forEach(el => el.style.display = "none");
            });

            // Show the relevant elements
            if (index === 0) {
            firstTab.forEach(el => el.style.display = "block");
            } else if (index === 1) {
            secondTab.forEach(el => el.style.display = "block");
            console.log("submit");
            }
        });
    });
  });