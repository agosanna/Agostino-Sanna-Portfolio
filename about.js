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
"Ago": [
    "./public/mediaprojects/about/ago_1.jpg",
    "./public/mediaprojects/about/ago_2.jpg",
],
"websites": [
    "./public/mediaprojects/about/website_1.png",
    "./public/mediaprojects/about/website_2.jpg",
    "./public/mediaprojects/about/website_3.jpg",
],
"erasmus": [
    "./public/mediaprojects/about/erasmus_1.jpg",
    "./public/mediaprojects/about/erasmus_2.jpg",
    "./public/mediaprojects/about/erasmus_3.jpg",
    "./public/mediaprojects/about/erasmus_4.jpg",
    "./public/mediaprojects/about/erasmus_5.jpg",
],

"hfg": [
    "./public/mediaprojects/about/hfg_1.jpg",
    "./public/mediaprojects/about/hfg_2.jpg",
    "./public/mediaprojects/about/hfg_3.jpg",
    "./public/mediaprojects/about/hfg_4.jpg",
],

"climbing": [
    "./public/mediaprojects/about/climbing_1.jpg",
    "./public/mediaprojects/about/climbing_2.jpg",
    "./public/mediaprojects/about/climbing_3.jpg",
],

"analog": [
    "./public/mediaprojects/about/analog_1.jpg",
    "./public/mediaprojects/about/analog_2.jpg",
    "./public/mediaprojects/about/analog_3.jpg",
    "./public/mediaprojects/about/analog_4.jpg",
],

"communication": [
    "./public/mediaprojects/about/c_1.jpeg",
    "./public/mediaprojects/about/c_2.jpg",
    "./public/mediaprojects/about/c_3.jpg",
],

"did" : [
    "./public/mediaprojects/about/did_1.jpg",
    "./public/mediaprojects/about/did_2.jpg",
    "./public/mediaprojects/about/did_3.jpg",
],
};

let visibleImg;

links.forEach(link => {
    if (window.innerWidth > 768) {
        link.addEventListener("mouseenter", (event) => {
            imageContainer.innerHTML = ""; // Clear previous images
            
            const linkId = event.target.id;
            console.log(linkId);
            const images = imageSets[linkId];

            // Position the image container below the link
            const aboutRect = document.getElementById("about").getBoundingClientRect();
            const centerY = (aboutRect.bottom - aboutRect.top) / 2 + window.scrollY / 2;        

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
    } else {
        link.addEventListener("click", (event) => {
            imageContainer.innerHTML = ""; // Clear previous images
            visibleImg = true;
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
                imageContainer.appendChild(img);
                img.style.marginLeft = `${Math.random() * 20}vw`;
                img.style.marginTop = `${Math.random() * 5 }vh`;
                img.style.marginBottom = `${Math.random() * 5 }vh`;
            });
            if (visibleImg == true) {
                document.addEventListener("click", (event) => {
                    const aboutContainer = document.getElementById("about");
                    if (!aboutContainer.contains(event.target) && !imageContainer.contains(event.target)) {
                        imageContainer.innerHTML = "";
                    }
                    visibleImg = false;
                });
            }
        });
    }
});
