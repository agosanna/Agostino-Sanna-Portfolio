const textContainer = document.getElementById('splash-page');

let shaderScaleFactor;
function updateShaderScaleFactor() {
    let screenWidth = window.innerWidth;

    if (screenWidth < 768) {
        shaderScaleFactor = 0.9; // Mobile
        planeMesh.material.uniforms.u_pixelSize.value = 3.0; 
    } else if (screenWidth < 1024) {
        shaderScaleFactor = 0.7; // Tablet
        planeMesh.material.uniforms.u_pixelSize.value = 7.0;
    } else {
        shaderScaleFactor = 0.6; // Desktop
        planeMesh.material.uniforms.u_pixelSize.value = 10.0;
    }
}

window.addEventListener("resize", () => { 
    updateShaderScaleFactor();
    onWindowResize();
});

window.addEventListener("load", () => { 
    updateShaderScaleFactor();  // Assicura il valore giusto
    reloadTexture();            // Rigenera la texture correttamente
    onWindowResize();           // Forza il ridimensionamento
});

let easeFactor = 0.02;
let scene, camera, renderer, planeMesh;
let mousePosition = { x: 0.5, y: 0.5 };
let targetMousePosition = { x: 0.5, y: 0.5 };
let prevPosition = { x: 0.5, y: 0.5 };

const vertexShader = 
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
;

const fragmentShader = 
    varying vec2 vUv;
    uniform sampler2D u_texture;
    uniform vec2 u_mouse;
    uniform vec2 u_prevMouse;
    uniform vec2 u_resolution;
    uniform float u_pixelSize;

    void main() {
        vec2 gridUV = floor(vUv * u_pixelSize) / u_pixelSize;
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
;

function createTextTexture(text, font, size, color, fontWeight = "300") {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = window.innerWidth * dpr;
    const canvasHeight = window.innerHeight * dpr;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = color || 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const fontSize = size || Math.min(canvasWidth, canvasHeight) * 0.1 * shaderScaleFactor;
    ctx.fillStyle = "white";
    ctx.font = ${fontWeight} ${fontSize}px "${font || "DM Sans"}";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

    return new THREE.CanvasTexture(canvas);
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
        u_pixelSize: { type: "f", value: 40.0 },
    };

    planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ uniforms: shaderUniforms, vertexShader, fragmentShader })
    );

    scene.add(planeMesh);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    textContainer.appendChild(renderer.domElement);
    updateShaderScaleFactor();
}

function reloadTexture() {
    const newTexture = createTextTexture("Interaction Designer based in Milan.", "DM Sans", null, "black", "300");
    planeMesh.material.uniforms.u_texture.value = newTexture;
    planeMesh.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
}

initializeScene(createTextTexture("Interaction Designer based in Milan.", "DM Sans", null, "black", "300"));

function animateScene() {
    requestAnimationFrame(animateScene);
    mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
    mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;
    planeMesh.material.uniforms.u_mouse.value.set(mousePosition.x, 1.0 - mousePosition.y);
    planeMesh.material.uniforms.u_prevMouse.value.set(prevPosition.x, 1.0 - prevPosition.y);
    renderer.render(scene, camera);
}
animateScene();

textContainer.addEventListener('mousemove', handleMouseMove);
textContainer.addEventListener('mouseenter', handleMouseEnter);
textContainer.addEventListener('mouseleave', handleMouseLeave);

function handleMouseMove(event) {
    easeFactor = 0.04;
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
    easeFactor = 0.02;
    targetMousePosition = { ...prevPosition };
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    planeMesh.material.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    reloadTexture();
});
