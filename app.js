        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
        import { getFirestore, collection, addDoc, getDocs, query, where, limit, orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
        
        const firebaseConfig = {
            apiKey: "AIzaSyCFKSgYfeR_Gql7qZdP5_EYVw-BO5VkNCE",
            authDomain: "succinct-comboard.firebaseapp.com",
            projectId: "succinct-comboard",
            storageBucket: "succinct-comboard.appspot.com",
            messagingSenderId: "853910523370",
            appId: "1:853910523370:web:f0b2e11ba95067bc35f693"
        };
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const artCollection = collection(db, "arts");

        document.addEventListener('DOMContentLoaded', function() {
            const welcomeScreen = document.getElementById('welcome-screen');
            const mainApp = document.getElementById('main-app');
            const music = document.getElementById('background-music');

            if (welcomeScreen) {
                welcomeScreen.addEventListener('click', () => {
                    if (music) {
                        music.volume = 0.3;
                        music.play().catch(e => console.error("Audio play failed:", e));
                    }
                    welcomeScreen.style.opacity = '0';
                    setTimeout(() => welcomeScreen.style.display = 'none', 500);
                    mainApp.classList.remove('hidden');
                }, { once: true });
            }

            const chatNotifications = [
                { name: "Yinger UwU", photo: "assets/images/yinger.png", message: "Dont forget succinct rockstars!" },
                { name: "Addyyeah", photo: "assets/images/addy.jpg", message: "Mainnet soon yeahh" },
                { name: "Zaharon bruhh", photo: "assets/images/zaharon.jpg", message: "Log in bruhh, lets play together" },
                { name: "Duskieee", photo: "assets/images/duskie.jpg", message: "Thanks for joining!" }
            ];

            function showRandomNotifications() {
                const list = document.getElementById("notification-list");
                const badge = document.querySelector(".notification-badge");
                if (!list || !badge) return;
                list.innerHTML = "";
                const selected = chatNotifications[Math.floor(Math.random() * chatNotifications.length)];
                list.innerHTML = `
                    <li class="notification-item">
                        <img src="${selected.photo}" alt="${selected.name}">
                        <div class="notification-content">
                            <p>${selected.name}</p><span>${selected.message}</span>
                        </div>
                    </li>`;
                badge.style.display = 'block';
            }

            function updateDateTime() {
                const now = new Date();
                const clock = document.getElementById("clock");
                const date = document.getElementById("date-widget");
                if (clock) clock.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
                if (date) date.textContent = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
            }

            showRandomNotifications();
            updateDateTime();
            setInterval(updateDateTime, 1000);

            function setupModal(triggerId, modalId, closeBtnId, onOpen) {
                const trigger = document.getElementById(triggerId);
                const modal = document.getElementById(modalId);
                const closeBtn = document.getElementById(closeBtnId);
                if (trigger && modal && closeBtn) {
                    const openModal = () => {
                        modal.classList.remove("hidden");
                        modal.classList.add("visible");
                        if (onOpen) onOpen();
                    };
                    const closeModal = () => {
                        modal.classList.remove("visible");
                        setTimeout(() => modal.classList.add("hidden"), 300);
                    };
                    trigger.addEventListener("click", openModal);
                    closeBtn.addEventListener("click", closeModal);
                    modal.querySelector(".modal-overlay").addEventListener("click", closeModal);
                }
            }

            const eduConsole = document.getElementById("sp1-educational-console");
            async function runEducationalAnimation() {
                if (!eduConsole) return;
                eduConsole.innerHTML = '';
                const delay = ms => new Promise(res => setTimeout(res, ms));

                const steps = [
                    { title: 'Initializing ZKVM...', desc: 'Preparing the Zero-Knowledge Virtual Machine to run our program.', visual: () => `<div class="diagram-box">ZKVM Ready</div>` },
                    { title: 'Compiling program...', desc: 'Translating Rust code into verifiable instructions.', visual: () => `<div class="diagram-box">Rust Code</div><div class="diagram-arrow">→</div><div class="diagram-box">Bytecode</div>` },
                    { title: 'Generating proof...', desc: 'Creating a compact cryptographic proof.', visual: () => `<div class="diagram-box" style="padding: 30px 15px;">Execution Trace</div><div class="diagram-arrow">→</div><div class="diagram-box small">ZK Proof</div>` },
                    { title: '✅ Execution Verified.', desc: 'The proof is valid!', visual: () => `<div class="diagram-box small">Final Proof</div>` }
                ];

                for (const step of steps) {
                    await delay(1200);
                    const stepDiv = document.createElement('div');
                    stepDiv.className = 'step';
                    stepDiv.innerHTML = `<div class="step-title">> ${step.title}</div>${step.visual ? `<div class="step-diagram">${step.visual()}</div>` : ""}<div class="step-desc">${step.desc}</div>`;
                    eduConsole.appendChild(stepDiv);
                    requestAnimationFrame(() => stepDiv.classList.add('visible'));
                    eduConsole.scrollTop = eduConsole.scrollHeight;
                }

                await delay(1000);
                const analogy = document.createElement('div');
                analogy.className = 'final-analogy step';
                analogy.innerHTML = "<strong>Analogy:</strong> Instead of showing your entire math homework, you show a 'magic checkmark' proving you did it right.";
                eduConsole.appendChild(analogy);
                requestAnimationFrame(() => analogy.classList.add('visible'));
                eduConsole.scrollTop = eduConsole.scrollHeight;
            }

            setupModal("open-sp1-verifier", "sp1-verifier-modal", "close-sp1-modal", runEducationalAnimation);

            const galleryView = document.getElementById("gallery-view"),
                  usernameView = document.getElementById("username-view"),
                  drawingView = document.getElementById("drawing-view"),
                  addArtBtn = document.getElementById("add-your-art-btn"),
                  backToGalleryBtn1 = document.getElementById("back-to-gallery-btn-from-username"),
                  backToUsernameBtn = document.getElementById("back-to-username-btn"),
                  galleryContainer = document.getElementById("art-gallery-container"),
                  usernameInput = document.getElementById("username-input"),
                  continueBtn = document.getElementById("continue-to-draw-btn"),
                  usernameDisplay = document.getElementById("username-display"),
                  canvas = document.getElementById("drawing-canvas"),
                  colorPicker = document.getElementById("colorPicker"),
                  brushSize = document.getElementById("brushSize"),
                  eraserBtn = document.getElementById("eraserBtn"),
                  clearBtn = document.getElementById("clearBtn"),
                  submitArtBtn = document.getElementById("submitArtBtn");

            let currentUsername = "", ctx = canvas.getContext("2d"), isDrawing = false, isEraser = false;

            function showView(view) {
                [galleryView, usernameView, drawingView].forEach(v => v.classList.add("hidden"));
                view.classList.remove("hidden");
            }

            function setupCanvas() {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = 400;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
                canvas.style.pointerEvents = "auto";
                submitArtBtn.disabled = false;
                submitArtBtn.textContent = "Lock In Your Art";
            }

            if (continueBtn && usernameInput && usernameDisplay && canvas) {
                continueBtn.addEventListener("click", async () => {
                    const entered = usernameInput.value.trim();
                    if (!entered) return alert("Please enter a username.");
                    try {
                        const q = query(artCollection, where("username", "==", entered.toLowerCase()), limit(1));
                        const snapshot = await getDocs(q);
                        if (!snapshot.empty) return alert(`Username @${entered} has already submitted art.`);
                        currentUsername = entered;
                        usernameDisplay.textContent = `@${currentUsername}`;
                        showView(drawingView);
                        setupCanvas();
                    } catch (err) {
                        alert("Failed to check username.");
                    }
                });
            }

            addArtBtn.addEventListener("click", () => showView(usernameView));
            backToGalleryBtn1.addEventListener("click", () => showView(galleryView));
            backToUsernameBtn.addEventListener("click", () => showView(usernameView));

            if (canvas) {
                function draw(e) {
                    if (!isDrawing) return;
                    e.preventDefault();
                    const rect = canvas.getBoundingClientRect();
                    const x = (e.clientX || e.touches[0].clientX) - rect.left;
                    const y = (e.clientY || e.touches[0].clientY) - rect.top;
                    ctx.lineWidth = brushSize.value;
                    ctx.strokeStyle = isEraser ? "white" : colorPicker.value;
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                }

                canvas.addEventListener("pointerdown", () => { isDrawing = true; });
                canvas.addEventListener("pointerup", () => { isDrawing = false; ctx.beginPath(); });
                canvas.addEventListener("pointerout", () => { isDrawing = false; ctx.beginPath(); });
                canvas.addEventListener("pointermove", draw);

                clearBtn.addEventListener("click", () => {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                });

                eraserBtn.addEventListener("click", () => {
                    isEraser = !isEraser;
                    eraserBtn.classList.toggle("active", isEraser);
                });

                submitArtBtn.addEventListener("click", async () => {
                    if (!currentUsername) return alert("Please re-enter your username.");
                    try {
                        const dataUrl = canvas.toDataURL("image/png");
                        submitArtBtn.disabled = true;
                        submitArtBtn.textContent = "Saving...";
                        await addDoc(artCollection, {
                            username: currentUsername.toLowerCase(),
                            imageData: dataUrl,
                            createdAt: new Date()
                        });
                        alert("Your art has been saved!");
                        showView(galleryView);
                        loadAllArt();
                    } catch (err) {
                        alert("Failed to save art.");
                        submitArtBtn.disabled = false;
                        submitArtBtn.textContent = "Lock In Your Art";
                    }
                });
            }

            async function loadAllArt() {
                galleryContainer.innerHTML = '<p class="loading-text">Loading memorial wall...</p>';
                try {
                    const snapshot = await getDocs(query(artCollection, orderBy("createdAt", "desc")));
                    galleryContainer.innerHTML = "";
                    if (snapshot.empty) {
                        galleryContainer.innerHTML = '<p class="loading-text">No art yet. Be the first!</p>';
                        return;
                    }
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const piece = document.createElement("div");
                        piece.className = "art-piece";
                        const img = new Image();
                        img.src = data.imageData;
                        const name = document.createElement("span");
                        name.className = "art-username";
                        name.textContent = `@${data.username}`;
                        piece.appendChild(img);
                        piece.appendChild(name);
                        galleryContainer.appendChild(piece);
                    });
                } catch (err) {
                    galleryContainer.innerHTML = '<p class="loading-text">Failed to load art wall.</p>';
                }
            }

            setupModal("open-community-board", "community-board-modal", "close-community-modal", () => {
                showView(galleryView);
                loadAllArt();
            });
        });
