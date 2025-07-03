// !! GANTI DENGAN KONFIGURASI FIREBASE ANDA !!
const firebaseConfig = {
    apiKey: "AIzaSyAKuMy8U2qHAS6tzToGIELeSymzo54CJQA",
  authDomain: "zk-forge.firebaseapp.com",
  databaseURL: "https://zk-forge-default-rtdb.firebaseio.com",
  projectId: "zk-forge",
  storageBucket: "zk-forge.firebasestorage.app",
  messagingSenderId: "742831580717",
  appId: "1:742831580717:web:ec64a8eb2280945d337aa4",
  measurementId: "G-P9LG4YMFCN"

};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen DOM ---
    const enterBtn = document.getElementById('enter-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainApp = document.getElementById('main-app');
    const music = document.getElementById('background-music');

    // Fitur Notifikasi
    const notificationList = document.getElementById('notification-list');

    // Fitur Jam & Tanggal
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date-widget');
    
    // Fitur Shared Canvas
    const dockCanvasBtn = document.getElementById('dock-canvas-btn');
    const canvasModal = document.getElementById('canvas-modal');
    const closeCanvasBtn = canvasModal.querySelector('.close-btn');
    const drawingCanvas = document.getElementById('shared-drawing-canvas');
    const drawCtx = drawingCanvas.getContext('2d');
    const toolbar = document.querySelector('.canvas-toolbar');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');

    // Fitur Global Stats
    const dockStatsBtn = document.getElementById('dock-stats-btn');
    const statsModal = document.getElementById('stats-modal');
    const closeStatsBtn = statsModal.querySelector('.close-btn');
    
    // --- Logika Welcome Screen & Musik ---
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            music.volume = 0.3;
            music.play().catch(() => {});
            welcomeScreen.style.display = 'none';
            mainApp.classList.remove('hidden');
        });
    }

    // --- Logika Jam, Notifikasi, dll. ---
    function updateDateTime() { /* ... kode jam ... */ }
    function showRandomNotifications() { /* ... kode notifikasi ... */ }
    setInterval(updateDateTime, 1000);
    updateDateTime();
    showRandomNotifications();

    // --- Logika Shared Canvas ---
    let isDrawing = false, lastX = 0, lastY = 0, drawColor = 'white';
    function setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = drawingCanvas.getBoundingClientRect();
        drawingCanvas.width = rect.width * dpr;
        drawingCanvas.height = rect.height * dpr;
        drawCtx.scale(dpr, dpr);
        drawCtx.lineCap = 'round'; drawCtx.lineWidth = 4;
    }
    function drawLine(x1, y1, x2, y2, color) {
        drawCtx.strokeStyle = color; drawCtx.beginPath();
        drawCtx.moveTo(x1, y1); drawCtx.lineTo(x2, y2); drawCtx.stroke();
    }
    database.ref('canvasLines').on('child_added', (s) => { if(s.val()) drawLine(s.val().x1, s.val().y1, s.val().x2, s.val().y2, s.val().color); });
    database.ref('canvasLines').on('child_removed', () => drawCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height));
    dockCanvasBtn.addEventListener('click', () => { setupCanvas(); canvasModal.style.display = 'flex'; });
    closeCanvasBtn.addEventListener('click', () => canvasModal.style.display = 'none');
    clearCanvasBtn.addEventListener('click', () => { if (confirm('Clear canvas for everyone?')) database.ref('canvasLines').remove(); });
    toolbar.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-swatch')) {
            toolbar.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');
            drawColor = e.target.dataset.color;
        }
    });
    drawingCanvas.addEventListener('mousedown', (e) => { isDrawing = true; [lastX, lastY] = [e.offsetX, e.offsetY]; });
    drawingCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const [currentX, currentY] = [e.offsetX, e.offsetY];
        database.ref('canvasLines').push({ x1: lastX, y1: lastY, x2: currentX, y2: currentY, color: drawColor });
        [lastX, lastY] = [currentX, currentY];
    });
    drawingCanvas.addEventListener('mouseup', () => isDrawing = false);
    drawingCanvas.addEventListener('mouseleave', () => isDrawing = false);

    // --- Logika Global Stats ---
    function fetchGlobalStats() {
        const statsRef = database.ref('global_stats');
        statsRef.on('value', (snapshot) => {
            const stats = snapshot.val();
            if (stats) {
                document.getElementById('stats-total-games').textContent = stats.totalGames || 0;
                document.getElementById('stats-total-clicks').textContent = stats.totalCorrectClicks || 0;
            }
        });
    }
    dockStatsBtn.addEventListener('click', () => statsModal.style.display = 'flex');
    closeStatsBtn.addEventListener('click', () => statsModal.style.display = 'none');

    fetchGlobalStats();
});
