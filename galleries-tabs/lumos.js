document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".container-w-gallery").forEach((slideContainer, galleryIndex) => {
        const slides = [
            [
                { src: "../public/mediaprojects/lumos/userflow.jpg", text: "We began by analyzing the user journey and flow of delivery riders to pinpoint challenges and design opportunities for a seamless navigation experience." },
                { src: "../public/mediaprojects/lumos/interviews.jpg", text: "We interviewed Porsche E-Bikes, Cyclaer (Porsche Digital), and a former Bosch E-Bikes intern to explore bike safety and navigation technologies." },
                { src: "../public/mediaprojects/lumos/shadowing.webp", text: "We conducted self-shadowing to test the experience of riding with a phone holder, assessing screen visibility and stability on uneven roads." },
                { src: "../public/mediaprojects/lumos/interaction-mapping.jpg", text: " Finally we conducted a detailed interaction mapping to break down the delivery process, examining each step to better understand rider interactions and identify opportunities for improvement." },
            ],
            [
                { src: "../public/mediaprojects/lumos/Prototype1.jpg", text: "We integrated an Arduino Uno with Protopie Connect to test the bike's interface, including buttons and LED animations. " },
                { src: "../public/mediaprojects/lumos/Buttons.jpg", text: "Using clay, we shaped multiple button prototypes to refine tactile design, while initial wireframes emphasized clear font sizes and navigation views tailored for bike and hand modes." },
                { src: "../public/mediaprojects/lumos/Wireframes.jpg", text: "We designed initial app wireframes featuring a hand view for bike data and earnings and a bike view for navigation and rear camera, prioritizing legibility and optimal placement of navigation details." }
            ]
        ];
        
        const prevArrow = slideContainer.querySelector(".arrow:first-of-type");
        const nextArrow = slideContainer.querySelector(".arrow:last-of-type");
        const dots = slideContainer.querySelectorAll(".dot");
        const textContainer = slideContainer.querySelector("p");
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
            textContainer.textContent = newText;

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
    const firstTab = document.querySelectorAll(".bike");
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