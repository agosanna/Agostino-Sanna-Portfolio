const links = document.querySelectorAll(".hover-link");
const imageContainer = document.getElementById("image-container");

if (window.innerWidth > 768) {
    document.querySelectorAll(".vynil").forEach(vynil => {
        vynil.addEventListener("click", function (e) {
            e.preventDefault(); // Blocks the click but allows hover effects
        });
    });
}

const imageSets = {
"l-1": [
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
],
"l-2": [
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
],
"l-3": [
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
    "/public/mediaprojects/about/walkin.jpg",
]
};

links.forEach(link => {
    link.addEventListener("mouseenter", (event) => {
        imageContainer.innerHTML = ""; // Clear previous images
        
        const linkId = event.target.id;
        console.log(linkId);
        const images = imageSets[linkId];

        // Position the image container below the link
        const aboutRect = document.getElementById("about").getBoundingClientRect();
        const centerY = (aboutRect.bottom - aboutRect.top) / 2 + window.scrollY;        

        imageContainer.style.top = `${centerY}px`;

        images.forEach((src) => {
            let img = document.createElement("img");
            img.src = src;
            img.style.marginLeft = `${Math.random() * 6 - 3}vw`;
            img.style.marginRight = `${Math.random() * 6 - 3}vw`;
            img.style.marginTop = `${Math.random() * 20 - 10}vh`;
            img.style.marginBottom = `${Math.random() * 20 - 10}vh`;
            imageContainer.appendChild(img);
        });

    });

    link.addEventListener("mouseleave", () => {
        setTimeout(() => {
            imageContainer.innerHTML = "";
        }, 200);
    });
});