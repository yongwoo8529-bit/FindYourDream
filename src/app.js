// questions.js (Internal Question Data)
const questions = [
    // Part 1
    { part: 1, text: "나는 새로운 기계나 앱이 나오면 누구보다 먼저 사용법을 알아내고 싶다.", title: "탐구의 은하 (보라색)" },
    { part: 1, text: "영화나 드라마를 볼 때 줄거리보다 '저건 어떻게 촬영했을까?' 같은 원리가 더 궁금하다.", title: "탐구의 은하 (보라색)" },
    { part: 1, text: "궁금한 것이 생기면 밥 먹는 것도 잊고 끝까지 검색해서 찾아내는 편이다.", title: "탐구의 은하 (보라색)" },
    { part: 1, text: "나는 눈에 보이는 사실보다, 보이지 않는 우주나 미래의 이야기에 더 가슴이 뛴다.", title: "탐구의 은하 (보라색)" },
    // Part 2
    { part: 2, text: "내 물건들이 정해진 자리에 깔끔하게 놓여 있을 때 마음이 아주 편안하다.", title: "질서의 은하 (청색)" },
    { part: 2, text: "어려운 수학 문제를 풀거나 복잡한 퍼즐을 맞출 때 기분 좋은 긴장감을 느낀다.", title: "질서의 은하 (청색)" },
    { part: 2, text: "계획 없이 갑자기 결정된 약속보다는, 미리 짜여진 일정대로 움직이는 것이 좋다.", title: "질서의 은하 (청색)" },
    { part: 2, text: "나는 여러 가지 일을 동시에 하는 것보다, 한 가지를 순서대로 끝내는 것을 잘한다.", title: "질서의 은하 (청색)" },
    // Part 3
    { part: 3, text: "친구가 슬픈 이야기를 하면 나도 모르게 눈물이 나거나 그 마음이 깊게 느껴진다.", title: "온기의 은하 (주황색)" },
    { part: 3, text: "나는 혼자서 뛰어난 성과를 내는 것보다, 사람들과 화합하며 돕는 것이 더 가치 있다고 생각한다.", title: "온기의 은하 (주황색)" },
    { part: 3, text: "길가에 핀 작은 꽃이나 버려진 물건을 봐도 나만의 의미를 부여하곤 한다.", title: "온기의 은하 (주황색)" },
    { part: 3, text: " '너는 정말 똑똑해'라는 말보다 '너 덕분에 마음이 놓여'라는 말이 더 듣기 좋다.", title: "온기의 은하 (주황색)" },
    // Part 4
    { part: 4, text: "내 생각이나 감정을 글, 그림, 혹은 영상으로 만들어 사람들에게 보여주고 싶다.", title: "울림의 은하 (금색)" },
    { part: 4, text: "나는 무대 뒤에서 지원하기보다, 내 목소리를 직접 내어 사람들을 이끌고 싶다.", title: "울림의 은하 (금색)" },
    { part: 4, text: "평범하고 남들과 똑같은 것보다, 나만의 독특한 스타일을 만드는 것이 즐겁다.", title: "울림의 은하 (금색)" },
    { part: 4, text: "내가 만든 결과물을 보고 사람들이 '우와!' 하고 반응할 때 가장 큰 에너지를 얻는다.", title: "울림의 은하 (금색)" },
    // Part 5
    { part: 5, text: "나는 내가 주인공이 되지 않더라도 우리 팀이 이기는 것이 더 중요하다.", title: "울타리의 은하 (녹색)" },
    { part: 5, text: "새로운 길을 개척하는 도전보다는, 이미 있는 것을 더 좋게 가꾸고 지키는 일이 보람차다.", title: "울타리의 은하 (녹색)" },
    { part: 5, text: "갈등이 생기면 내 주장을 펼치기보다 모두가 만족할 만한 중간 지점을 찾으려 노력한다.", title: "울타리의 은하 (녹색)" },
    { part: 5, text: "누군가 나를 믿고 일을 맡기면, 아무리 힘들어도 끝까지 책임지고 해내고 싶다.", title: "울타리의 은하 (녹색)" }
];

let scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
let currentQuestionIndex = 0;
let answerHistory = []; // Track scores given for each question

/* Visual Globals */
let scene, camera, renderer, starSystems = [];
let centralPolaris;
let isPolarisClicked = false;
let starsCanvas, starsCtx;
let controls;
let selectableGalaxies = []; // For raycasting

function startSurvey() {
    const landing = document.getElementById("landing");
    const survey = document.getElementById("survey");
    
    gsap.to(landing, { opacity: 0, duration: 0.5, onComplete: () => {
        landing.style.display = "none";
        landing.classList.remove("active");
        
        survey.style.display = "flex";
        survey.classList.add("active");
        gsap.fromTo(survey, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        renderQuestion();
    }});
}
window.startSurvey = startSurvey;

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById("part-label").innerText = `PART ${q.part}: ${q.title}`;
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("question-text").innerText = q.text;
    document.querySelectorAll(".rating-btn").forEach(btn => btn.classList.remove("active"));
    
    // Manage Go Back button visibility
    const prevBtn = document.getElementById("prev-btn");
    if (currentQuestionIndex > 0) {
        prevBtn.style.visibility = "visible";
        prevBtn.style.opacity = "1";
    } else {
        prevBtn.style.visibility = "hidden";
        prevBtn.style.opacity = "0";
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        const lastAnswer = answerHistory.pop();
        const q = questions[currentQuestionIndex];
        scores[q.part] -= lastAnswer;

        gsap.to("#question-container", { x: 20, opacity: 0, duration: 0.2, onComplete: () => {
            renderQuestion();
            gsap.fromTo("#question-container", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.2 });
        }});
    }
}
window.prevQuestion = prevQuestion;

document.querySelectorAll(".rating-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const val = parseInt(btn.dataset.value);
        const q = questions[currentQuestionIndex];
        scores[q.part] += val;
        answerHistory.push(val);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            gsap.to("#question-container", { x: -20, opacity: 0, duration: 0.2, onComplete: () => {
                renderQuestion();
                gsap.fromTo("#question-container", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.2 });
            }});
        } else {
            showResult();
        }
    });
});

async function showResult() {
    document.getElementById("prev-btn").style.display = "none";
    
    // Check for special cases
    const allFives = answerHistory.every(val => val === 5);
    const allOnes = answerHistory.every(val => val === 1);
    
    let specialType = null;
    let finalColor = 0xffffff;
    let maxPart = 1;

    if (allFives) {
        specialType = 'prism';
        finalColor = 0xffffff; // White core for prism
        maxPart = 6;
    } else if (allOnes) {
        specialType = 'silence';
        finalColor = 0x2c3e50; // Deep navy for silence
        maxPart = 7;
    } else {
        let maxScore = scores[1];
        for (let i = 2; i <= 5; i++) {
            if (scores[i] > maxScore) { maxScore = scores[i]; maxPart = i; }
        }
        const galaxyColors = { 1: 0xa55eea, 2: 0x45aaf2, 3: 0xfd9644, 4: 0xfed330, 5: 0x26de81 };
        finalColor = galaxyColors[maxPart];
    }

    const overlay = document.getElementById("creation-overlay");
    overlay.classList.add("active");

    setTimeout(() => {
        document.getElementById("survey").classList.remove("active");
        document.getElementById("result").classList.add("active");
        initThreeJS(finalColor, specialType);
        setTimeout(() => {
            overlay.style.opacity = "0";
            setTimeout(() => {
                overlay.classList.remove("active");
                // INITIAL UI PHASE
                document.getElementById("result-title").innerText = "당신만의 북극성이 만들어졌습니다!";
                document.getElementById("result-desc").innerText = "북극성을 클릭해 터트리세요";
                document.getElementById("result-ui").classList.add("visible");
            }, 2000);
        }, 1000);
    }, 2000);
}

function initThreeJS(polarisColor, specialType) {
    const container = document.getElementById("canvas-container");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(specialType === 'silence' ? 0.25 : 0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: polarisColor, transparent: true, opacity: 0.9 });
    centralPolaris = new THREE.Mesh(geometry, material);
    scene.add(centralPolaris);

    // Add a small white core for silence to make it visible
    if (specialType === 'silence') {
        const innerCore = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        centralPolaris.add(innerCore);
    }

    const spriteMaterial = new THREE.SpriteMaterial({
        map: generateGlowTexture(specialType === 'silence' ? 0x5d6d7e : polarisColor),
        color: specialType === 'silence' ? 0xffffff : polarisColor, 
        transparent: true, 
        blending: THREE.AdditiveBlending, 
        opacity: specialType === 'silence' ? 0.7 : 0.8
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(specialType === 'silence' ? 5 : 6, specialType === 'silence' ? 5 : 6, 1);
    centralPolaris.add(sprite);

    // Save special type to polaris for later
    centralPolaris.userData.specialType = specialType;

    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(255,255,255,0.1)'); grad.addColorStop(0.5, 'rgba(0,0,0,0.1)'); grad.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 256);
    for(let i=0; i<1000; i++){
        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.3})`;
        ctx.fillRect(Math.random()*512, Math.random()*256, 1, 1);
    }
    centralPolaris.material.map = new THREE.CanvasTexture(canvas);

    if (specialType === 'silence') {
        gsap.to(sprite.material, { opacity: 0.2, duration: 1.5, repeat: -1, yoyo: true, ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false})" });
    } else {
        gsap.to(sprite.scale, { x: 8, y: 8, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    camera.position.z = 15;
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 0.5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerStartPos = { x: 0, y: 0 };
    let pointerStartTime = 0;

    window.addEventListener('pointerdown', (e) => {
        pointerStartPos = { x: e.clientX, y: e.clientY };
        pointerStartTime = Date.now();
    });

    window.addEventListener('pointerup', (e) => {
        if (Math.hypot(e.clientX - pointerStartPos.x, e.clientY - pointerStartPos.y) > 10 || (Date.now() - pointerStartTime) > 400) return;
        if (document.getElementById("galaxy-modal").classList.contains('active')) return;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        if (!isPolarisClicked) {
            if (raycaster.intersectObject(centralPolaris).length > 0) explodeToGalaxies(specialType);
        } else {
            const intersects = raycaster.intersectObjects(selectableGalaxies);
            if (intersects.length > 0) showGalaxyDetails(intersects[0].object.userData.partId);
        }
    });

    animate();
}

function explodeToGalaxies(specialType) {
    isPolarisClicked = true;
    gsap.to(document.getElementById("result-ui"), { opacity: 0, duration: 0.5 });
    createShatteredImplosion(centralPolaris.position, centralPolaris.material.color, specialType);
    gsap.to(centralPolaris.scale, { x: 0, y: 0, z: 0, duration: 0.8, ease: "power4.in" });
    gsap.to(centralPolaris.material, { opacity: 0, duration: 0.8 });

    let maxPart = 1;
    let score = 20;

    if (specialType === 'prism') {
        maxPart = 6;
        score = 20;
    } else if (specialType === 'silence') {
        maxPart = 7;
        score = 4;
    } else {
        let maxScore = scores[1];
        for (let j = 2; j <= 5; j++) { if (scores[j] > maxScore) { maxScore = scores[j]; maxPart = j; } }
        score = scores[maxPart];
    }

    const galaxyColors = [0xa55eea, 0x45aaf2, 0xfd9644, 0xfed330, 0x26de81, 0xffffff, 0x2c3e50];
    const colorInt = galaxyColors[maxPart - 1];
    const normalizedScore = (score - 4) / 16;

    // EVEN LARGER SIZE FOR SILENCE: from 1.2 to 2.5
    const finalPlanetGeom = new THREE.SphereGeometry(specialType === 'silence' ? 2.5 : (1.5 + normalizedScore * 1.5), 64, 64);
    const finalPlanetMat = new THREE.MeshBasicMaterial({ color: colorInt, transparent: true, opacity: 0, map: centralPolaris.material.map });
    const finalPlanet = new THREE.Mesh(finalPlanetGeom, finalPlanetMat);
    scene.add(finalPlanet);

    // ADD INNER WHITE CORE FOR SILENCE
    if (specialType === 'silence') {
        const coreGeom = new THREE.SphereGeometry(0.6, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        finalPlanet.add(coreMesh);
        
        const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
            map: generateGlowTexture(0xffffff), color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending
        }));
        coreGlow.scale.set(6, 6, 1);
        coreMesh.add(coreGlow);

        gsap.to(coreMat, { opacity: 1, duration: 2, delay: 0.5 });
        gsap.to(coreGlow.material, { opacity: 0.8, duration: 2, delay: 0.5 });
        gsap.to(coreGlow.scale, { x: 8, y: 8, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    const glow1 = new THREE.Sprite(new THREE.SpriteMaterial({
        map: generateGlowTexture(colorInt), color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending
    }));
    glow1.scale.set(specialType === 'silence' ? 12 : 15, specialType === 'silence' ? 12 : 15, 1);
    finalPlanet.add(glow1);

    const mainGalaxy = createGalaxy(colorInt, score, specialType);
    scene.add(mainGalaxy);
    starSystems.push(mainGalaxy);

    const radiusScale = 1.5 + normalizedScore * 8;
    const hitbox = new THREE.Mesh(new THREE.SphereGeometry(specialType === 'silence' ? 2 : radiusScale * 0.7, 8, 8), new THREE.MeshBasicMaterial({ visible: false }));
    hitbox.userData = { partId: maxPart };
    scene.add(hitbox);
    selectableGalaxies.push(hitbox);

    setTimeout(() => {
        gsap.to(finalPlanetMat, { opacity: specialType === 'silence' ? 0.3 : 0.9, duration: 2 });
        gsap.to(glow1.material, { opacity: specialType === 'silence' ? 0.3 : 0.7, duration: 3 });
        gsap.to(finalPlanet.scale, { x: 1, y: 1, z: 1, duration: 3, ease: "back.out(1.2)" });
        gsap.to(mainGalaxy.scale, { x: 1, y: 1, z: 1, duration: 5, ease: "power2.out" });
        gsap.fromTo(mainGalaxy.rotation, { y: 0 }, { y: Math.PI * 4, duration: 15, ease: "power3.out" });

        document.getElementById("result-title").innerText = specialType === 'prism' ? "🌈 당신은 모든 빛을 품은 프리즘입니다!" : (specialType === 'silence' ? "🌑 당신의 우주는 지금 깊은 정적 속에 있습니다." : "당신만의 북극성이 나타났습니다!");
        
        const introText = `
            <span style="font-size: 0.85em; opacity: 0.8; line-height: 1.6; display: block; margin-top: 1rem; text-align: left; background: rgba(255,255,255,0.05); padding: 1.2rem; border-radius: 10px;">
                제가 이 앱을 만든 이유는 많은 청소년 어린이들이 자신들이 하고 싶은 것을 모르거나 알지만 공부라는 벽에 의해 하지 못하는 것을 봐왔기 때문입니다.<br>
                북극성은 자신만의 길을 개척해 홀로 빛납니다. 여러분들도 공부 스트레스 받지 말고 꼭 하고 싶은 걸 하셨으면 좋겠습니다.
            </span>
        `;

        let descHtml = "";
        if (specialType === 'prism') {
            descHtml = `
                북극성은 모든 방향에서 빛나며 새로운 우주를 창조합니다.<br>
                당신은 모든 가능성을 가진 축복받은 존재입니다.<br>
                ${introText}
                <div style="margin-top: 1.5rem; font-size: 0.85em; color: #f9ca24; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                    ✨ 북극성을 클릭해 당신의 눈부신 재능을 확인하세요!
                </div>
            `;
        } else if (specialType === 'silence') {
            descHtml = `
                가장 어두운 밤이 지나야 가장 밝은 새벽이 옵니다.<br>
                지금의 고요함은 당신이 더 멀리 도약하기 위한 준비 단계일 뿐입니다.<br>
                ${introText}
                <div style="margin-top: 1.5rem; font-size: 0.85em; color: #7f8c8d; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                    ✨ 작은 빛을 클릭해 당신의 내면의 목소리를 들어보세요.
                </div>
            `;
        } else {
            descHtml = `
                북극성은 사람마다 크기가 다릅니다.<br>
                그 사람이 이 일에 얼마나 원하는지에 따라 크기가 결정됩니다.<br>
                북극성처럼 다른 것에 눈치 보지 말고 나만이 하고 싶은 길을 개척해나가세요!<br><br>
                <span style="font-size: 0.85em; opacity: 0.8; line-height: 1.6; display: block; margin-top: 1rem;">
                    제가 이 앱을 만든 이유는 많은 청소년 어린이들이 자신들이 하고 싶은 것을 모르거나 알지만 공부라는 벽에 의해 하지 못하는 것을 봐왔기 때문입니다.<br>
                    북극성은 자신만의 길을 개척해 홀로 빛납니다. 여러분들도 공부 스트레스 받지 말고 꼭 하고 싶은 걸 하셨으면 좋겠습니다.
                </span>
                <div style="margin-top: 1.5rem; font-size: 0.85em; color: #4cd137; font-weight: bold; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                    ✨ 북극성을 클릭해 당신의 숨겨진 재능을 찾으세요!<br>
                    ✨ 360도로 화면을 돌리며 자신이 만든 자신만의 북극성을 관찰하세요.
                </div>
            `;
        }
        
        document.getElementById("result-desc").innerHTML = descHtml;
        document.getElementById("restart-btn").style.display = "inline-block";
        gsap.to(document.getElementById("result-ui"), { opacity: 1, duration: 1, delay: 1 });
    }, 2800);
}

function createShatteredImplosion(pos, color, specialType) {
    const group = new THREE.Group(); scene.add(group);
    const particleCount = specialType === 'silence' ? 20 : 100;
    for(let i=0; i<particleCount; i++) {
        const chunk = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*0.15+0.05, 8, 8), new THREE.MeshBasicMaterial({ color: color, transparent: true }));
        chunk.position.copy(pos); group.add(chunk);
        const theta = Math.random()*Math.PI*2, phi = Math.acos(Math.random()*2-1), dist = 5+Math.random()*12;
        const target = new THREE.Vector3(pos.x+Math.sin(phi)*Math.cos(theta)*dist, pos.y+Math.sin(phi)*Math.sin(theta)*dist, pos.z+Math.cos(phi)*dist);
        gsap.to(chunk.position, { x: target.x, y: target.y, z: target.z, duration: 1.2, ease: "expo.out" });
        gsap.to(chunk.position, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power4.in", delay: 1.3 });
        gsap.to(chunk.scale, { x: 0, y: 0, z: 0, duration: 1, delay: 2.3 });
    }
    const sparkCount = specialType === 'silence' ? 500 : 8000, sparkCoords = new Float32Array(sparkCount*3), sparkData = [];
    for(let i=0; i<sparkCount; i++) {
        sparkCoords[i*3]=pos.x; sparkCoords[i*3+1]=pos.y; sparkCoords[i*3+2]=pos.z;
        sparkData.push({ angle: Math.random()*Math.PI*2, dist: 0, targetDist: 5+Math.random()*20, yVel: (Math.random()-0.5)*8, swirl: 0.15 });
    }
    const sparkGeom = new THREE.BufferGeometry(); sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkCoords, 3));
    const sparks = new THREE.Points(sparkGeom, new THREE.PointsMaterial({ size: 0.08, color: specialType === 'prism' ? 0xffffff : color, transparent: true, blending: THREE.AdditiveBlending, map: generateParticleTexture() }));
    group.add(sparks);
    gsap.to(sparkData, { dist: 1, duration: 1.2, ease: "expo.out", onUpdate: () => updateSparkBuffer(sparks, sparkData, sparkCount) });
    gsap.to(sparkData, { dist: 0, swirl: 0.8, duration: 1.5, ease: "power4.in", delay: 1.3, onUpdate: () => updateSparkBuffer(sparks, sparkData, sparkCount), onComplete: () => { scene.remove(group); createFlashBurst(0, 0, 0, color, specialType); } });
}

function updateSparkBuffer(sparks, sparkData, sparkCount) {
    const attr = sparks.geometry.attributes.position;
    for(let i=0; i<sparkCount; i++) {
        const d = sparkData[i], currentDist = d.dist*d.targetDist, currentAngle = d.angle + (1-d.dist)*d.swirl*10;
        attr.array[i*3] = Math.cos(currentAngle)*currentDist;
        attr.array[i*3+1] = d.yVel*d.dist;
        attr.array[i*3+2] = Math.sin(currentAngle)*currentDist;
    }
    attr.needsUpdate = true;
}

function createFlashBurst(x, y, z, color, specialType) {
    const flash = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending }));
    scene.add(flash);
    gsap.to(flash.scale, { x: specialType === 'silence' ? 10 : 40, y: specialType === 'silence' ? 10 : 40, z: specialType === 'silence' ? 10 : 40, duration: 1.5, ease: "expo.out" });
    gsap.to(flash.material, { opacity: 0, duration: 1.5, onComplete: () => scene.remove(flash) });
}

function generateGlowTexture(color) {
    const canvas = document.createElement('canvas'); canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d'), gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, `rgba(${ (color >> 16) & 255 }, ${ (color >> 8) & 255 }, ${ color & 255 }, 0.8)`);
    gradient.addColorStop(0.5, `rgba(${ (color >> 16) & 255 }, ${ (color >> 8) & 255 }, ${ color & 255 }, 0.2)`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function generateParticleTexture() {
    const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d'), gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)'); gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)'); gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
}

function createGalaxy(color, score, specialType) {
    const normalizedScore = (score - 4) / 16;
    let count = 500 + Math.pow(normalizedScore, 1.5) * 4500;
    if (specialType === 'silence') count = 800;
    
    const positions = new Float32Array(count * 3), colors = new Float32Array(count * 3);
    const radiusScale = specialType === 'silence' ? 4 : (1.5 + normalizedScore * 8), branches = specialType === 'silence' ? 2 : 3;
    
    // Rainbow colors for prism
    const rainbowColors = [0xff0000, 0xffa500, 0xffff00, 0x008000, 0x0000ff, 0x4b0082, 0xee82ee];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3, radius = Math.random() * radiusScale, branchAngle = (i % branches) / branches * Math.PI * 2, spin = radius * (specialType === 'silence' ? 0.5 : 1.5);
        positions[i3] = Math.cos(branchAngle + spin) * radius + (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3) * radius;
        positions[i3 + 1] = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.2) * radius;
        positions[i3 + 2] = Math.sin(branchAngle + spin) * radius + (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3) * radius;
        
        let particleColor = new THREE.Color(color);
        if (specialType === 'prism') {
            particleColor = new THREE.Color(rainbowColors[Math.floor(Math.random() * rainbowColors.length)]);
        } else if (specialType === 'silence') {
            const grey = 0.2 + Math.random() * 0.3;
            particleColor = new THREE.Color(grey, grey, grey + 0.1);
        }
        
        const mixedColor = new THREE.Color(particleColor); 
        mixedColor.lerp(new THREE.Color(0xffffff), Math.random() * 0.3);
        colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({ size: specialType === 'silence' ? 0.05 : 0.15, map: generateParticleTexture(), transparent: true, alphaTest: 0.001, depthWrite: false, sizeAttenuation: true, blending: THREE.AdditiveBlending, vertexColors: true }));
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (centralPolaris) centralPolaris.rotation.y += 0.005;
    starSystems.forEach((system, index) => { system.rotation.y += 0.001 * (index + 1); system.rotation.z += 0.0005; });
    renderer.render(scene, camera);
}

const galaxyDetails = {
    1: { name: "🟪 탐구의 은하 (Inquiry)", tagline: "밤하늘 너머 숨겨진 진실을 찾아내는 지혜의 빛", core: "세상은 당신에게 거대한 수수께끼 상자와 같습니다. '왜?' 라는 질문은 당신을 움직이는 강력한 연료이며, 끝까지 파헤치는 집요함은 진리를 찾는 열쇠가 됩니다.", moment: "새벽까지 궁금한 것을 검색하며 마침내 정답을 찾아냈을 때, 아무도 모르는 원리를 이해했을 때 당신의 우주는 깊은 보랏빛으로 물듭니다." },
    2: { name: "🟦 질서의 은하 (Order)", tagline: "복잡한 세상 속에 나만의 길을 만드는 설계자의 빛", core: "무질서 속에서 규칙을 찾아내고 엉킨 실타래를 풀어내는 특별한 힘이 있습니다. 보이지 않는 기초를 탄탄하게 다지는 성격입니다.", moment: "책상이 당신만의 방식대로 정리되어 있을 때, 복잡한 문제를 완벽한 순서로 해결할 때 당신의 북극성은 가장 푸르게 빛납니다." },
    3: { name: "🟧 온기의 은하 (Empathy)", tagline: "얼어붙은 마음을 사르르 녹이는 치유자의 빛", core: "남들이 지나치는 작은 감정들을 알아채는 섬세한 안테나를 가졌습니다. 사람들의 마음속 온도를 읽는 귀한 재능이 있습니다.", moment: "친구의 짧은 한숨에 먼저 말을 건넬 때, 버려진 것들에 마음을 써줄 때 당신의 은하는 따뜻한 주황빛으로 일렁입니다." },
    4: { name: "🟨 울림의 은하 (Expression)", tagline: "무채색 도화지에 무지개를 그려 넣는 시작의 빛", core: "당신만의 독특한 필터로 세상을 봅니다. 남들과 다른 방식으로 느끼고 그것을 창의적으로 표현해 사람들을 깜짝 놀라게 하는 힘이 있습니다.", moment: "당신의 생각이나 아이디어에 누군가 감동할 때, 금빛 별들이 폭발하듯 당신만의 독특한 파동이 세상에 퍼집니다." },
    5: { name: "🟩 울타리의 은하 (Support)", tagline: "모두가 안심하고 쉴 수 있게 자리를 지키는 수호자의 빛", core: "화려한 주인공이 아니더라도 팀 전체가 빛날 수 있게 묵묵히 기둥이 되어주는 사람입니다. 당신이 있기에 사람들은 안심하고 도전할 수 있습니다.", moment: "갈등을 조용히 중재하거나 맡은 일을 끝까지 책임지고 해낼 때, 당신의 우주는 싱그러운 녹색으로 반짝입니다." },
    6: { 
        name: "🌈 프리즘의 은하 (The Galaxy of Prism)", 
        tagline: "모든 빛을 품어 눈부시게 빛나는 시작의 별무리", 
        core: "너의 우주는 어느 한곳으로 치우치지 않고 모든 가능성으로 가득 차 있구나! 너는 세상의 모든 슬픔에 공감하면서도(온기), 동시에 날카로운 이성으로 문제를 풀고 싶어 하고(질서), 새로운 것을 탐구하려는(탐구) 뜨거운 열정을 동시에 가졌어.", 
        moment: "지금은 모든 것이 다 좋고 하고 싶은 게 너무 많아서 고민일 수 있어. 하지만 이건 네가 그만큼 커다란 '그릇'을 가진 사람이라는 증거야. 모든 색이 섞이면 눈부신 하얀색이 되듯, 너의 다양한 재능들이 하나로 모이는 날 너는 누구보다 밝은 빛을 내는 사람이 될 거야. 서두르지 말고 네 마음이 가장 오래 머무는 별을 천천히 찾아보자." 
    },
    7: { 
        name: "🌑 정적의 은하 (The Galaxy of Silence)", 
        tagline: "새로운 폭발을 기다리는 깊고 신비로운 성운", 
        core: "지금 너의 밤하늘은 아주 깊은 고요함 속에 잠겨 있네. 혹시 '나에게 어울리는 게 정말 있을까?'라고 고민하고 있니? 아니면 세상이 정해놓은 뻔한 질문들이 너의 진짜 모습을 담지 못하고 있는 걸지도 몰라.", 
        moment: "별은 가장 어두운 밤에 더 잘 보이는 법이야. 지금 모든 질문에 '아니요'라고 답한 건, 네가 남들이 좋다는 길을 무작정 따라가지 않는 단단한 주관을 가졌기 때문일 거야. 아직 네 북극성이 구름에 가려져 보이지 않을 뿐, 너만의 우주는 네 안에서 조용히 태어날 준비를 하고 있어. 조급해하지 마. 침묵 끝에 찾아올 너만의 진짜 목소리를 기다려줄게." 
    }
};

function showGalaxyDetails(partId) {
    const data = galaxyDetails[partId]; if (!data) return;
    document.getElementById("modal-galaxy-name").innerText = data.name;
    document.getElementById("modal-tagline").innerText = `"${data.tagline}"`;
    document.getElementById("modal-core").innerText = data.core;
    document.getElementById("modal-moment").innerText = data.moment;
    document.getElementById("galaxy-modal").classList.add("active");
}

function closeModal() { document.getElementById("galaxy-modal").classList.remove("active"); }
window.closeModal = closeModal;

function initStars() {
    starsCanvas = document.getElementById("stars-bg"); if (!starsCanvas) return;
    starsCtx = starsCanvas.getContext("2d"); starsCanvas.width = window.innerWidth; starsCanvas.height = window.innerHeight;
    const stars = [];
    for (let i = 0; i < 400; i++) stars.push({ x: Math.random()*starsCanvas.width, y: Math.random()*starsCanvas.height, size: Math.random()*1.5, opacity: Math.random() });
    function drawStars() {
        starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height); starsCtx.fillStyle = "#fff";
        stars.forEach(s => { starsCtx.globalAlpha = s.opacity; starsCtx.beginPath(); starsCtx.arc(s.x, s.y, s.size, 0, Math.PI*2); starsCtx.fill(); s.opacity += (Math.random()-0.5)*0.02; if (s.opacity < 0) s.opacity = 0; if (s.opacity > 1) s.opacity = 1; });
        requestAnimationFrame(drawStars);
    }
    drawStars();
}

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    const startBtn = document.querySelector(".btn-start"); if (startBtn) startBtn.addEventListener("click", startSurvey);
    const modal = document.getElementById("galaxy-modal"), modalContent = document.querySelector(".modal-content");
    if (modal) modal.addEventListener("click", () => closeModal());
    if (modalContent) modalContent.addEventListener("click", (e) => e.stopPropagation());
});

window.addEventListener('resize', () => {
    if (starsCanvas) { starsCanvas.width = window.innerWidth; starsCanvas.height = window.innerHeight; }
    if (camera) { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); }
});
