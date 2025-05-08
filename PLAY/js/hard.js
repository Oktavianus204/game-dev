const questions = [
  { image: 'images/Money.jpg', answer: 'Money' },
  { image: 'images/Table.jpg', answer: 'Table' },
  { image: 'images/Lampu.jpg', answer: 'Lampu' },
];

let currentIndex = 0;
let score = 0;
let timerInterval;
let timeLeft;
let userAnswer = '';

// 🔊 Audio setup
const bgMusic = new Audio('audio/musik1.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

// Pastikan musik diputar setelah interaksi pengguna pertama
document.body.addEventListener(
  'click',
  () => {
    bgMusic.play().catch(() => {});
  },
  { once: true }
);

const wrongSound = new Audio('audio/salah.mp3');

function renderQuestion() {
  const q = questions[currentIndex];
  document.getElementById('question-image').src = q.image;
  document.getElementById('user-answer').textContent = '';
  document.getElementById('letter-buttons').innerHTML = '';

  userAnswer = '';
  timeLeft = 30;
  document.getElementById('countdown').textContent = `⏳ Waktu: ${timeLeft} detik`;

  shuffleAndDisplayLetters(q);

  startTimer();
}

function shuffleAndDisplayLetters(q) {
  const shuffled = [...q.answer].sort(() => Math.random() - 0.5);
  const letterButtonsContainer = document.getElementById('letter-buttons');
  letterButtonsContainer.innerHTML = '';
  document.getElementById('user-answer').textContent = '';
  userAnswer = '';

  shuffled.forEach((char) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-custom-huruf m-1';
    btn.textContent = char;
    btn.onclick = () => {
      userAnswer += char;
      document.getElementById('user-answer').textContent = userAnswer;
      btn.disabled = true;

      if (userAnswer === q.answer) {
        clearInterval(timerInterval);
        score += 10;
        document.getElementById('score').textContent = `⭐ Skor: ${score}`;
        if (currentIndex < questions.length - 1) {
          currentIndex++;
          setTimeout(renderQuestion, 1000);
        } else {
          showFinalModal();
        }
      } else if (userAnswer.length === q.answer.length && userAnswer !== q.answer) {
        bgMusic.volume = 0.1;
        wrongSound.play();
        wrongSound.onended = () => {
          bgMusic.volume = 0.5;
        };

        setTimeout(() => {
          userAnswer = '';
          document.getElementById('user-answer').textContent = '';
          const buttons = document.querySelectorAll('#letter-buttons button');
          buttons.forEach((btn) => (btn.disabled = false));
        }, 500);
      }
    };
    letterButtonsContainer.appendChild(btn);
  });
}

function shuffleCurrentLetters() {
  const q = questions[currentIndex];
  shuffleAndDisplayLetters(q);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('countdown').textContent = `⏳ Waktu: ${timeLeft} detik`;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      const timeoutModal = new bootstrap.Modal(document.getElementById('timeoutModal'));
      timeoutModal.show();

      document.getElementById('next-question-btn').onclick = () => {
        if (currentIndex < questions.length - 1) {
          currentIndex++;
          renderQuestion();
        } else {
          window.location.href = 'index.html';
        }
      };
    }
  }, 1000);
}

function showFinalModal() {
  document.getElementById('final-score').textContent = `Skor kamu: ${score}`;
  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
  resultModal.show();
}

document.getElementById('retry-btn').onclick = () => shuffleCurrentLetters();

document.getElementById('next-btn').onclick = () => {
  window.location.href = 'index.html';
};

document.getElementById('next-level-btn').onclick = () => {
  window.location.href = 'easy.html';
};

// Mulai permainan
renderQuestion();
