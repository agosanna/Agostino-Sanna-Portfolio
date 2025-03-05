document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".container-w-gallery").forEach((slideContainer, galleryIndex) => {
        const slides = [
            [
            { src: "../public/mediaprojects/threadsofsilk/THE MAP.jpg", text: "We began with extensive research, combining desk research and museum visits to identify strengths, weaknesses, and opportunities for enhancing the visitor experience." },
            { src: "../public/mediaprojects/threadsofsilk/heritage-map.jpg", text: "We analyzed and categorized all kinds of heritage in the museum to identify any gaps." },
            { src: "../public/mediaprojects/threadsofsilk/Ecosystem.jpg", text: "We mapped every component of the museum ecosystem" },
            { src: "../public/mediaprojects/threadsofsilk/photo.jpg", text: "We visited the museum three times to grasp every detail and to talk with the staff" },
            ],
            [
            { src: "../public/mediaprojects/threadsofsilk/storyboard1.jpg"},
            { src: "../public/mediaprojects/threadsofsilk/storyboard2.jpg"},
            { src: "../public/mediaprojects/threadsofsilk/storyboard3.jpg"},
            { src: "../public/mediaprojects/threadsofsilk/wireframes.jpg", text: "We created wireframes to visualize the structure and designed low-fidelity UIs that were used to test the system through user tests and heuristic evaluation" },
            ]
        ];
        
        const prevArrow = slideContainer.querySelector(".arrow:first-of-type");
        const nextArrow = slideContainer.querySelector(".arrow:last-of-type");
        const dots = slideContainer.querySelectorAll(".dot");
        const gallery = slideContainer.querySelector(".gallery");
        const textContainer = gallery.querySelector("p");
        let currentIndex = 0;
  
        function updateGallery(index) {
            const slideImage = slideContainer.querySelector(".slide img");
            const newImageSrc = slides[galleryIndex][index].src;
            let newText;
            if (slides[galleryIndex][index].text) {
                newText = slides[galleryIndex][index].text;
            }
            

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