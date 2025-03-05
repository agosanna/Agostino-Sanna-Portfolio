let isButtonVisible = false;

window.addEventListener("scroll", function () {
    let scrollPosition = window.scrollY;
    document.querySelector("#hero-image").style.transform = `translateY(${scrollPosition * 0.3}px)`;

    requestAnimationFrame(() => {
        const button = document.getElementById("back-to-top");
        const scrollThreshold = 2 * window.innerHeight; // 200vh in pixels

        if (window.scrollY > scrollThreshold) {
            if (!isButtonVisible) {
                button.classList.add("visible");
                isButtonVisible = true;
                console.log("visible");
                
            }
        } else {
            if (isButtonVisible) {
                button.classList.remove("visible");
                isButtonVisible = false;
                console.log("invisible");
            }
        }
    });
});

const bars = document.querySelectorAll(".progress");
console.log(bars);

  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute("style").match(/width: (\d+)%/)[1];
            console.log(targetWidth);
             // Extract inline width
            bar.style.animation = `progress 1.5s ease-in-out forwards`;
            bar.style.setProperty("--target-width", `${targetWidth}%`);
            observer.unobserve(bar); // Remove observer after animation
          }
        });
      },
      { threshold: 0.5 } 
    );
  
    bars.forEach(bar => observer.observe(bar));

const videos = document.querySelectorAll("video");

    const observer2 = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
                if (entry.target.classList.contains("tos-video")) {
                  entry.target.playbackRate = 2;
                }
            } else {
                entry.target.pause(); // Optional
            }
        });
    }, { threshold: 0.5 });

    videos.forEach(video => observer2.observe(video));

