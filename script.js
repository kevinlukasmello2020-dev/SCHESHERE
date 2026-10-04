document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const screenHome = document.getElementById('screen-home');
    const screenTest = document.getElementById('screen-test');
    const screenLoading = document.getElementById('screen-loading');
    const screenResult = document.getElementById('screen-result');
    
    const candidateNameInput = document.getElementById('candidateName');
    const discordIdInput = document.getElementById('discordId');
    const btnStart = document.getElementById('btnStart');
    
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const currentQuestionNum = document.getElementById('currentQuestionNum');
    const totalQuestionsNum = document.getElementById('totalQuestionsNum');
    const progressBar = document.getElementById('progressBar');
    const btnNext = document.getElementById('btnNext');

    // State
    let questions = [];
    let currentQuestionIndex = 0;
    let answers = {};
    let candidateData = {};
    let timerInterval;
    let timeLeft = 300; // 5 minutos
    const timerDisplay = document.getElementById('timerDisplay');

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            if (timeLeft <= 60) {
                timerDisplay.classList.add('danger');
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Tempo esgotado! Suas respostas serão enviadas automaticamente.");
                submitTest();
            }
        }, 1000);
    }

    // Base URL para API (Netlify Functions)
    const API_URL = '/.netlify/functions';

    // Navegação entre telas
    function showScreen(screenElement) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            setTimeout(() => {
                if(!s.classList.contains('active')) s.style.display = 'none';
            }, 400); // tempo da transição css
        });

        setTimeout(() => {
            screenElement.style.display = 'block';
            // Reflow
            void screenElement.offsetWidth;
            screenElement.classList.add('active');
        }, 400);
    }

    // Iniciar teste
    btnStart.addEventListener('click', async () => {
        const name = candidateNameInput.value.trim();
        const discordId = discordIdInput.value.trim();

        if (!name || !discordId) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        candidateData = { name, discordId };

        // Botão visualmente carregando
        const originalText = btnStart.innerHTML;
        btnStart.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
        btnStart.disabled = true;

        try {
            const res = await fetch(`${API_URL}/questions`);
            if (!res.ok) throw new Error('Falha ao carregar as questões');
            questions = await res.json();
            
            totalQuestionsNum.textContent = questions.length;
            
            showScreen(screenTest);
            loadQuestion();
            startTimer();
        } catch (error) {
            console.error(error);
            alert('Erro ao carregar o teste. O servidor pode estar offline.');
        } finally {
            btnStart.innerHTML = originalText;
            btnStart.disabled = false;
        }
    });

    // Carregar questão
    function loadQuestion() {
        const q = questions[currentQuestionIndex];
        currentQuestionNum.textContent = currentQuestionIndex + 1;
        
        // Progresso
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;

        questionText.textContent = q.question;
        optionsContainer.innerHTML = '';
        btnNext.disabled = true;

        q.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = optText;
            
            // Se já respondeu antes (caso houvesse botão de voltar, não tem aqui, mas boa prática)
            if (answers[q.id] === index) {
                btn.classList.add('selected');
                btnNext.disabled = false;
            }

            btn.onclick = () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                answers[q.id] = index;
                btnNext.disabled = false;
            };

            optionsContainer.appendChild(btn);
        });

        if (currentQuestionIndex === questions.length - 1) {
            btnNext.innerHTML = 'FINALIZAR TESTE <i class="fa-solid fa-check"></i>';
            btnNext.classList.remove('secondary-btn');
            btnNext.classList.add('primary-btn'); // Destaque pro final
        } else {
            btnNext.innerHTML = 'PRÓXIMA <i class="fa-solid fa-angle-right"></i>';
        }
    }

    // Próxima / Finalizar
    btnNext.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            submitTest();
        }
    });

    // Enviar respostas pro backend
    async function submitTest() {
        clearInterval(timerInterval);
        showScreen(screenLoading);

        try {
            const payload = {
                name: candidateData.name,
                discordId: candidateData.discordId,
                answers: answers
            };

            const res = await fetch(`${API_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Erro ao enviar teste');
            
            const resultData = await res.json();
            renderResult(resultData);

        } catch (error) {
            console.error(error);
            alert('Houve um erro ao processar seu teste. Tente novamente ou contate um administrador.');
            showScreen(screenTest); // Volta pro teste pra nao perder respostas
        }
    }

    function renderResult(data) {
        // 100% de progresso
        progressBar.style.width = '100%';

        showScreen(screenResult);
    }
});
