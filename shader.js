const textContainer = document.getElementById('splash-page');
let circleScale = 1;
let growing = true;

let observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!renderer) {
                console.log("Recreating shader...");
                initializeScene(createTextTexture("Interaction Designer based in Milan.", "DM Sans", null, "black", "300"));
                animateScene();
                onWindowResize();
            }
        } else {
            if (renderer) {
                console.log("Destroying shader...");
                destroyShader();
            }
        }
    });
}, { threshold: 0.1 });

observer.observe(textContainer);

function destroyShader() {
    if (planeMesh) {
        planeMesh.geometry.dispose();
        if (planeMesh.material) {
            if (planeMesh.material.uniforms.u_texture.value) {
                planeMesh.material.uniforms.u_texture.value.dispose();
            }
            planeMesh.material.dispose();
        }
        scene.remove(planeMesh);
    }

    if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
        renderer = null;
    }

    planeMesh = null;
    scene = null;
    camera = null;
}


let shaderScaleFactor;
function updateShaderScaleFactor() {
    let screenWidth = window.innerWidth;

    if (screenWidth < 768) {
        shaderScaleFactor = 3.3; // Mobile
        planeMesh.material.uniforms.u_pixelSize.value = 20.0; 
    } else if (screenWidth < 1024) {
        shaderScaleFactor = 0.7; // Tablet
        planeMesh.material.uniforms.u_pixelSize.value = 60.0;
    } else {
        shaderScaleFactor = 0.6; // Desktop
        planeMesh.material.uniforms.u_pixelSize.value = 70.0;
    }
}

window.addEventListener("resize", () => { 
    updateShaderScaleFactor();
    onWindowResize();
});

window.addEventListener("load", () => { 
    updateShaderScaleFactor();  
    reloadTexture();
    onWindowResize();
    
    // Simula un movimento iniziale del mouse per animazione senza interazione
    let startTime = Date.now();
    function initialAnimation() {
        let elapsed = (Date.now() - startTime) / 1000; // Tempo trascorso in secondi
        let progress = Math.min(elapsed / 1.5, 1); // Normalizza tra 0 e 1 in 1.5s
        let movementAmount = 0.05 * Math.sin(progress * Math.PI); // Movimento sinusoidale

        targetMousePosition.x = 0.5 + movementAmount * 20;
        targetMousePosition.y = - movementAmount;

        if (progress < 1) {
            requestAnimationFrame(initialAnimation);
        }
    }
    initialAnimation();
});


let easeFactor = 0.02;
let scene, camera, renderer, planeMesh;
let mousePosition = { x: 0.5, y: 0.5 };
let targetMousePosition = { x: 0.5, y: 0.5 };
let prevPosition = { x: 0.5, y: 0.5 };

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform vec2 u_resolution;
    uniform float u_pixelSize;
    uniform vec2 u_offset;

    void main() {
        vec2 gridUV = floor((vUv + u_offset) * u_pixelSize) / u_pixelSize;
        vec2 centerOfPixel = gridUV + vec2(1.0 / u_pixelSize);
        vec2 mouseDirection = u_mouse - u_prevMouse;
        vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
        float pixelDistanceToMouse = length(pixelToMouseDirection);
        float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);
        vec2 uvOffset = strength * mouseDirection * 0.3;
        vec2 uv = vUv - uvOffset;
        vec4 color = texture2D(u_texture, uv);
        gl_FragColor = color;
    }
`;


function getColorFromMousePosition(x, y) {
    if (isNaN(x) || isNaN(y)) return "rgb(255, 0, 0)"; // Default rosso acceso

    let hue = (x * 360) % 360;  // Mappa la posizione X su una ruota dei colori (0-360°)
    let brightness = 0.5;       // 0.5 per evitare il bianco
    let saturation = 1;         // Mantiene la saturazione al massimo

    function hslToRgb(h, s, l) {
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
        let r, g, b;
        
        if (h < 60) { r = c; g = x; b = 0; } 
        else if (h < 120) { r = x; g = c; b = 0; } 
        else if (h < 180) { r = 0; g = c; b = x; } 
        else if (h < 240) { r = 0; g = x; b = c; } 
        else if (h < 300) { r = x; g = 0; b = c; } 
        else { r = c; g = 0; b = x; }

        return `rgb(${Math.floor((r + m) * 255)}, ${Math.floor((g + m) * 255)}, ${Math.floor((b + m) * 255)})`;
    }

    return hslToRgb(hue, saturation, brightness);
}



function createTextTexture(text, font, size, color, fontWeight = "300") {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Dimensione del canvas basata sullo schermo
    const dimension = Math.max(window.innerWidth, window.innerHeight) * dpr;
    canvas.width = dimension;
    canvas.height = dimension;

    ctx.fillStyle = color || 'black';
    ctx.fillRect(0, 0, dimension, dimension);

    let isMobile = window.innerWidth < 768;
    let textLines = isMobile ? ["Interaction", "Designer", "based in", "Milan."] : [text];

    // Configura font
    const fontSize = size || dimension * 0.05 * shaderScaleFactor;
    ctx.fillStyle = "white";
    ctx.font = `${fontWeight} ${fontSize}px "${font || "DM Sans"}"`;
    ctx.textBaseline = 'middle';

    if (isMobile) {
        ctx.textAlign = 'left';  // Allinea a sinistra
        let xPos = dimension * 0.1; // Posizione a sinistra con margine
        let yStart = dimension * 0.1; // Punto di partenza verticale
        let lineSpacing = fontSize * 0.85; // Spaziatura tra le righe

        textLines.forEach((line, index) => {
            ctx.fillText(line, xPos, yStart + index * lineSpacing);
        });

        // Disegna il cerchio dopo l'ultima riga di testo
        let lastLineWidth = ctx.measureText(textLines[textLines.length - 1]).width;
        let circleX = xPos + lastLineWidth + fontSize / 2;
        let circleY = yStart + (textLines.length - 1) * lineSpacing;
        ctx.fillStyle = getColorFromMousePosition(mousePosition.x, mousePosition.y);
        ctx.beginPath();
        let circleRadius = (fontSize / 1.3) * circleScale; // Modifica il raggio in base all'animazione
        ctx.arc(circleX, circleY, circleRadius / 5, 0, 2 * Math.PI);
        ctx.fill();

    } else {
        ctx.textAlign = 'center';  // Mantiene il testo centrato su desktop

        // Calcola la larghezza totale del testo e del cerchio
        let textWidth = ctx.measureText(text).width;
        let totalWidth = textWidth + fontSize; // Aggiungi la larghezza del cerchio

        // Calcola la posizione di partenza per centrare il testo e il cerchio
        let xPos = (dimension - totalWidth) / 2;
        let yPos = dimension / 2;

        // Disegna il testo
        ctx.fillText(text, xPos + textWidth / 2, yPos);

        // Disegna il cerchio dopo il testo
        let circleX = xPos + textWidth + fontSize / 2;
        ctx.fillStyle = getColorFromMousePosition(mousePosition.x, mousePosition.y);
        let circleRadius = (fontSize / 5) * circleScale; // Modifica il raggio in base all'animazione
        ctx.beginPath();
        ctx.arc(circleX, yPos, circleRadius, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Crea e restituisce la texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
}

function animateCircle() {
    if (growing) {
        circleScale += 0.005;
        if (circleScale >= 1.3) growing = false;
    } else {
        circleScale -= 0.005;
        if (circleScale <= 1) growing = true;
    }

    reloadTexture(); // Rigenera la texture con il nuovo valore di circleScale
    requestAnimationFrame(animateCircle);
}


function reloadTexture() {
    const newTexture = createTextTexture("Interaction Designer based in Milan.", "DM Sans", null, "black", "300");
    planeMesh.material.uniforms.u_texture.value = newTexture;
    planeMesh.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    if (window.innerWidth < 768) {
        planeMesh.material.uniforms.u_offset.value.set(0.0, -0.35); // Regola la Y in base alla traslazione del testo
    }
}
function initializeScene(texture) {
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.z = 1;

    let shaderUniforms = {
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        u_prevMouse: { type: "v2", value: new THREE.Vector2() },
        u_texture: { type: "t", value: texture },
        u_resolution: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        u_pixelSize: { type: "f", value: null },
        u_offset: { type: "v2", value: new THREE.Vector2(null, null) },
    };

    planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ uniforms: shaderUniforms, vertexShader, fragmentShader })
    );

    updateShaderScaleFactor();

    scene.add(planeMesh);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    textContainer.appendChild(renderer.domElement);
    renderer.domElement.style.zIndex = 0;
    updateShaderScaleFactor();
}

initializeScene(createTextTexture("Interaction Designer based in Milan.", "DM Sans", null, "black", "300"));
animateCircle();

function animateScene() {
    requestAnimationFrame(animateScene);
    mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;
    planeMesh.material.uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
    planeMesh.material.uniforms.u_prevMouse.value.set(prevPosition.x, 1.0 - prevPosition.y);
    renderer.render(scene, camera);
}
animateScene();

// Mouse events
textContainer.addEventListener('mousemove', handleMouseMove);
textContainer.addEventListener('mouseenter', handleMouseEnter);
textContainer.addEventListener('mouseleave', handleMouseLeave);

// Touch events
textContainer.addEventListener('touchstart', handleTouchStart);
textContainer.addEventListener('touchmove', handleTouchMove);
textContainer.addEventListener('touchend', handleTouchEnd);

function handleMouseMove(event) {
    easeFactor = 0.02;
    let rect = textContainer.getBoundingClientRect();
    prevPosition = { ...targetMousePosition };
    targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    targetMousePosition.y = (event.clientY - rect.top) / rect.height;
}

function handleMouseEnter(event) {
    easeFactor = 0.02;
    let rect = textContainer.getBoundingClientRect();
    mousePosition.x = targetMousePosition.x = (event.clientX - rect.left) / rect.width;
    mousePosition.y = targetMousePosition.y = (event.clientY - rect.top) / rect.height;
}

function handleMouseLeave() {
    easeFactor = 0.01;
}

function handleTouchStart(event) {
    event.preventDefault();
    easeFactor = 0.02;
    let rect = textContainer.getBoundingClientRect();
    const touch = event.touches[0];
    mousePosition.x = targetMousePosition.x = (touch.clientX - rect.left) / rect.width;
    mousePosition.y = targetMousePosition.y = (touch.clientY - rect.top) / rect.height;
    prevPosition = { ...targetMousePosition };
}

function handleTouchMove(event) {
    event.preventDefault();
    easeFactor = 0.06;
    let rect = textContainer.getBoundingClientRect();
    const touch = event.touches[0];
    prevPosition = { ...targetMousePosition };
    targetMousePosition.x = (touch.clientX - rect.left) / rect.width;
    targetMousePosition.y = (touch.clientY - rect.top) / rect.height;
}

function handleTouchEnd() {
    easeFactor = 0.04;
}

function onWindowResize() {
    // Adjust camera to maintain aspect ratio
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera.left = -1;
    camera.right = 1;
    camera.top = 1 / aspectRatio;
    camera.bottom = -1 / aspectRatio;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    planeMesh.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);

    // Regenerate texture with proper aspect ratio
    reloadTexture();
}