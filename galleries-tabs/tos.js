document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".container-w-gallery").forEach((slideContainer, galleryIndex) => {
        const slides = [
            [
                { src: "/public/mediaprojects/threadsofsilk/THE MAP.webp", text: "We began with extensive research, combining desk research and museum visits to identify strengths, weaknesses, and opportunities for enhancing the visitor experience." },
                { src: "/public/mediaprojects/threadsofsilk/Cover.webp", text: "We analyzed case studies of successful exhibitions and interactive experiences to gain insights." },
                { src: "/public/mediaprojects/threadsofsilk/THIRD IMAGE.webp", text: "We conducted interviews with museum staff and visitors to understand different perspectives." },
                { src: "/public/mediaprojects/threadsofsilk/FOURTH IMAGE.webp", text: "Data synthesis led to identifying key pain points in the visitor experience." },
            ],
            [
                { src: "/public/mediaprojects/threadsofsilk/storyboard1.jpg", text: "Gallery 2 - First slide description." },
                { src: "/public/mediaprojects/threadsofsilk/storyboard1.jpg", text: "Gallery 2 - Second slide description." },
                { src: "/public/mediaprojects/threadsofsilk/storyboard1.jpg", text: "Gallery 2 - Third slide description." }
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
    const firstTab = document.querySelectorAll(".explore");
    const secondTab = document.querySelectorAll(".submit");
    const thirdTab = document.querySelectorAll(".organize");

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
            console.log("submit");
            
            } else if (index === 2) {
            thirdTab.forEach(el => el.style.display = "block");
            }
        });
    });
  });