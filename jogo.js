let pontos = 0;
let fase = 1;
let vidaMaxCroc = 3;
let vidaAtualCroc = 3;
let velocidadeCroc = 1.0;
let jogoAtivo = false;
let posLendarioX = window.innerWidth / 2;

const crocContainer = document.getElementById('crocodilo-container');
const lendario = document.getElementById('lendario');
const pontosSpan = document.getElementById('pontos');
const faseSpan = document.getElementById('fase');
const barraVidaAtual = document.getElementById('barra-vida-atual');
const telaGameOver = document.getElementById('tela-gameover');
const telaVitoria = document.getElementById('tela-vitoria');
const telaInicio = document.getElementById('tela-inicio');

function iniciarJogo() {
    telaInicio.style.display = 'none';
    jogoAtivo = true;
    atualizarBarravida();
    animarLoop();
}

function moverEsquerda() {
    if (!jogoAtivo) return;
    posLendarioX -= 35;
    if (posLendarioX < 40) posLendarioX = 40;
    lendario.style.left = posLendarioX + 'px';
    lendario.style.transform = 'translateX(-50%) scaleX(-1)';
}

function moverDireita() {
    if (!jogoAtivo) return;
    posLendarioX += 35;
    if (posLendarioX > window.innerWidth - 40) posLendarioX = window.innerWidth - 40;
    lendario.style.left = posLendarioX + 'px';
    lendario.style.transform = 'translateX(-50%) scaleX(1)';
}

function atualizarBarravida() {
    let porcentagem = (vidaAtualCroc / vidaMaxCroc) * 100;
    barraVidaAtual.style.width = porcentagem + '%';
}

function animarLoop() {
    if (!jogoAtivo) return;

    let topoAtual = parseInt(crocContainer.style.top);
    
    // Chegou embaixo (Game Over)
    if (topoAtual > window.innerHeight - 250) {
        jogoAtivo = false;
        telaGameOver.style.display = 'flex';
        return;
    }

    crocContainer.style.top = (topoAtual + velocidadeCroc) + 'px';
    requestAnimationFrame(animarLoop);
}

function lancarBomba() {
    if (!jogoAtivo) return;

    const gameContainer = document.getElementById('game-container');
    const bomba = document.createElement('div');
    bomba.classList.add('bomba-voando');
    bomba.innerHTML = '💣';
    
    bomba.style.left = posLendarioX + 'px';
    bomba.style.bottom = '160px';
    gameContainer.appendChild(bomba);

    setTimeout(() => {
        bomba.style.bottom = (window.innerHeight - parseInt(crocContainer.style.top) - 50) + 'px';
    }, 10);

    setTimeout(() => {
        const rectCroc = crocContainer.getBoundingClientRect();
        const rectBomba = bomba.getBoundingClientRect();

        let acertou = (
            rectBomba.left < rectCroc.right &&
            rectBomba.right > rectCroc.left &&
            rectBomba.top < rectCroc.bottom
        );

        if (acertou) {
            vidaAtualCroc--;
            pontos += 10;
            pontosSpan.innerText = pontos;
            atualizarBarravida();

            // Criar Efeito de Explosão na boca
            const explosao = document.createElement('div');
            explosao.classList.add('explosao');
            explosao.innerHTML = '💥';
            explosao.style.left = (rectCroc.left + rectCroc.width/2) + 'px';
            explosao.style.top = (rectCroc.top + 40) + 'px';
            gameContainer.appendChild(explosao);
            setTimeout(() => explosao.remove(), 400);

            // Se o crocodilo ficou sem vida (Derrotado na fase)
            if (vidaAtualCroc <= 0) {
                jogoAtivo = false;
                document.getElementById('texto-vitoria').innerText = `Você destruiu o Crocodilo da Fase ${fase}!`;
                telaVitoria.style.display = 'flex';
            }
        }

        bomba.remove();
    }, 300);
}

function proximaFase() {
    fase++;
    faseSpan.innerText = fase;
    vidaMaxCroc += 2; // Aumenta a vida do crocodilo nas próximas fases
    vidaAtualCroc = vidaMaxCroc;
    velocidadeCroc += 0.3; // Fica um pouco mais rápido

    crocContainer.style.top = '20px';
    telaVitoria.style.display = 'none';
    atualizarBarravida();
    jogoAtivo = true;
    animarLoop();
}

function reiniciarJogo() {
    pontos = 0;
    fase = 1;
    vidaMaxCroc = 3;
    vidaAtualCroc = 3;
    velocidadeCroc = 1.0;
    pontosSpan.innerText = pontos;
    faseSpan.innerText = fase;
    crocContainer.style.top = '20px';
    telaGameOver.style.display = 'none';
    atualizarBarravida();
    jogoAtivo = true;
    animarLoop();
}
