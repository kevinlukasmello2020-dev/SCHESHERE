const API_ANTICHEAT = '/.netlify/functions/anti-cheat';

const PROTECTION_CONFIG = {
    blockOnCopy: true,
    blockOnPaste: true,
    blockOnCut: true,
    blockOnContextMenu: true,
    blockOnTabChange: true,
    blockOnWindowBlur: true,
};

let isBlocked = false;
let countdownInterval;

function getUserId() {
    return localStorage.getItem('candidateDiscordId');
}

// 1. VERIFICAR BLOQUEIO (Chamado ao carregar a página e ao tentar iniciar o teste)
window.checkExistingBlock = async function() {
    const userId = getUserId();
    if (!userId) return false;

    try {
        const res = await fetch(API_ANTICHEAT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'check', userId })
        });
        const data = await res.json();

        if (data.blocked) {
            showBlockScreen(data.reason, data.remainingSeconds);
            return true; // Está bloqueado
        }
    } catch (e) {
        console.error('Erro ao verificar bloqueio', e);
    }
    return false; // Não está bloqueado
}

// Executar ao abrir o site caso já tenha logado antes
checkExistingBlock();

// 2. SISTEMA CENTRAL DE VIOLAÇÕES
async function handleViolation(type, details) {
    if (isBlocked) return;
    const userId = getUserId();
    
    // Só pune se estiver logado prestando o teste
    if (!userId) return;

    isBlocked = true;

    try {
        const res = await fetch(API_ANTICHEAT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'violation', userId, type, details })
        });
        const data = await res.json();
        
        if (data.success) {
            showBlockScreen(details, data.remainingSeconds);
        }
    } catch (e) {
        console.error('Falha ao registrar punição', e);
    }
}

// 3. DETECTORES DE TENTATIVAS (Anti-Cheat)
document.addEventListener('contextmenu', (e) => {
    if (PROTECTION_CONFIG.blockOnContextMenu && getUserId() && !isBlocked) {
        e.preventDefault();
        handleViolation('CONTEXT_MENU', 'Tentativa de inspecionar a página ou abrir menu (Botão Direito).');
    }
});

document.addEventListener('keydown', (e) => {
    if (!getUserId() || isBlocked) return;

    const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
    const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';
    const isCut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x';
    const isInsert = e.key === 'Insert';

    if (isCopy && PROTECTION_CONFIG.blockOnCopy) {
        e.preventDefault();
        handleViolation('COPY', 'Tentativa de copiar o conteúdo do teste (Ctrl+C).');
    }
    if (isPaste && PROTECTION_CONFIG.blockOnPaste) {
        e.preventDefault();
        handleViolation('PASTE', 'Tentativa de colar conteúdo externo (Ctrl+V).');
    }
    if (isCut && PROTECTION_CONFIG.blockOnCut) {
        e.preventDefault();
        handleViolation('CUT', 'Tentativa de recortar o conteúdo (Ctrl+X).');
    }
    if (isInsert && PROTECTION_CONFIG.blockOnCopy) {
        e.preventDefault();
        handleViolation('COPY', 'Uso proibido da tecla Insert detectado.');
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden && PROTECTION_CONFIG.blockOnTabChange && getUserId() && !isBlocked) {
        handleViolation('TAB_CHANGE', 'Tentativa de abandonar a página (Troca de aba ou minimização).');
    }
});

window.addEventListener('blur', () => {
    if (PROTECTION_CONFIG.blockOnWindowBlur && getUserId() && !isBlocked) {
        handleViolation('WINDOW_BLUR', 'Perda de foco na página (Provável uso de Alt+Tab ou clique fora da tela).');
    }
});

// 4. TELA DE BLOQUEIO E CONTADOR (Interface)
function showBlockScreen(reason, remainingSeconds) {
    isBlocked = true;
    
    const existing = document.getElementById('antiCheatOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'antiCheatOverlay';
    overlay.innerHTML = `
        <style>
            #antiCheatOverlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: #0a0c10; color: #e2e8f0; z-index: 999999;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                font-family: 'Rajdhani', sans-serif; text-align: center;
            }
            .ac-box { background: #151821; border: 1px solid rgba(239, 68, 68, 0.3); padding: 3rem; border-radius: 12px; max-width: 600px; box-shadow: 0 0 40px rgba(239, 68, 68, 0.3); }
            .ac-icon { font-size: 4rem; color: #ef4444; margin-bottom: 1rem; filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5)); }
            .ac-title { font-size: 2.5rem; color: #ef4444; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; }
            .ac-message { font-size: 1.2rem; margin-bottom: 1rem; font-family: 'Roboto', sans-serif;}
            .ac-sub { font-size: 1.1rem; color: #94a3b8; margin-bottom: 2rem; font-style: italic; font-family: 'Roboto', sans-serif;}
            .ac-reason { background: rgba(239,68,68,0.1); padding: 15px; border-radius: 8px; color: #ffb3b3; margin-bottom: 2rem; font-weight: 500; font-family: 'Roboto', sans-serif; border: 1px solid rgba(239,68,68,0.4); }
            .ac-timer-box { display: flex; flex-direction: column; align-items: center; }
            .ac-timer-label { font-size: 1rem; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; }
            .ac-timer { font-size: 3.5rem; font-weight: bold; font-family: monospace; color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
        </style>
        <div class="ac-box">
            <div class="ac-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div class="ac-title">Ação Não Permitida</div>
            <div class="ac-message">Você tentou realizar uma ação não permitida nesta página.</div>
            <div class="ac-sub">"Se for fazer isso, faça com seus próprios conhecimentos."</div>
            <div class="ac-reason"><strong>Ação detectada:</strong> ${reason}</div>
            <div class="ac-message" style="color: #ef4444; font-weight: bold;">Seu acesso foi bloqueado por 24 horas.</div>
            <div class="ac-timer-box">
                <div class="ac-timer-label">TEMPO RESTANTE</div>
                <div class="ac-timer" id="acCountdown">Carregando...</div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; 

    let timeLeft = remainingSeconds;
    const timerElement = document.getElementById('acCountdown');

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            localStorage.removeItem('candidateDiscordId'); // Libera o jogador localmente
            window.location.reload(); 
            return;
        }

        const h = Math.floor(timeLeft / 3600);
        const m = Math.floor((timeLeft % 3600) / 60);
        const s = timeLeft % 60;
        
        timerElement.textContent = 
            `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        
        timeLeft--;
    }, 1000);
}
