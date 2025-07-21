// Sample word data
const words = ["APPLE", "BANANA", "CHERRY", "DATES", "GRAPE"];

// DOM elements
const letterButtonsContainer = document.getElementById("letter-buttons");
const answerButtonsContainer = document.getElementById("answer-buttons");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const counter = document.getElementById("counter");
const audioBtn = document.getElementById("audio-btn");
const kebabBtn = document.getElementById("kebab-btn");
const kebabDropdown = document.getElementById("kebab-dropdown");
const resetBtn = document.getElementById("reset-btn");

let currentIndex = 0;
let selectedLetters = [];
let correctAnswer = "";

// Initialize the app
function init() {
  updateCard();
  generateLetterButtons();
}

// Update card with current word
function updateCard() {
  correctAnswer = words[currentIndex];
  counter.textContent = `${currentIndex + 1}/${words.length}`;

  // Update button states
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === words.length - 1;

  // Clear previous selections
  selectedLetters = [];
  answerButtonsContainer.innerHTML = "";

  // Regenerate letter buttons
  generateLetterButtons();
}

// Generate letter buttons
function generateLetterButtons() {
  letterButtonsContainer.innerHTML = "";

  // Get all letters from current word and some random letters
  const letters = correctAnswer.split("");
  const randomLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("")
    .filter((l) => !letters.includes(l));

  // Shuffle and take enough random letters to make 12 total
  const shuffledRandom = [...randomLetters].sort(() => 0.5 - Math.random());
  const allLetters = [
    ...letters,
    ...shuffledRandom.slice(0, 12 - letters.length),
  ];

  // Shuffle all letters
  const shuffledLetters = [...allLetters].sort(() => 0.5 - Math.random());

  // Create buttons for each letter
  shuffledLetters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.className = "letter-btn";
    btn.textContent = letter;
    btn.onclick = () => selectLetter(btn, letter);
    letterButtonsContainer.appendChild(btn);
  });
}

// Select a letter
function selectLetter(button, letter) {
  button.remove();
  selectedLetters.push(letter);

  const answerBtn = document.createElement("button");
  answerBtn.className = "answer-btn";
  answerBtn.textContent = letter;
  answerBtn.onclick = () => returnLetter(button, answerBtn, letter);
  answerButtonsContainer.appendChild(answerBtn);

  // Check if answer is complete
  checkAnswer();
}

// Return a letter to the letter row
function returnLetter(originalButton, answerButton, letter) {
  answerButton.remove();
  const index = selectedLetters.indexOf(letter);
  if (index > -1) {
    selectedLetters.splice(index, 1);
  }

  originalButton.onclick = () => selectLetter(originalButton, letter);
  letterButtonsContainer.appendChild(originalButton);

  // Reset answer styling
  answerButtonsContainer.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.classList.remove("correct", "incorrect");
  });
}

// Check if the current answer is correct
function checkAnswer() {
  const currentAnswer = selectedLetters.join("");
  const answerButtons = answerButtonsContainer.querySelectorAll(".answer-btn");

  if (currentAnswer.length === correctAnswer.length) {
    if (currentAnswer === correctAnswer) {
      // Correct answer
      answerButtons.forEach((btn) => {
        btn.classList.add("correct");
      });
    } else {
      // Incorrect answer
      answerButtons.forEach((btn) => {
        btn.classList.add("incorrect");
      });
    }
  }
}

// Reset current word
function resetCurrentWord() {
  // Move all letters back to letter buttons
  const answerButtons = [
    ...answerButtonsContainer.querySelectorAll(".answer-btn"),
  ];
  answerButtons.forEach((btn) => {
    const letter = btn.textContent;
    const originalBtn = document.createElement("button");
    originalBtn.className = "letter-btn";
    originalBtn.textContent = letter;
    originalBtn.onclick = () => selectLetter(originalBtn, letter);
    letterButtonsContainer.appendChild(originalBtn);
  });

  // Clear answer area
  answerButtonsContainer.innerHTML = "";
  selectedLetters = [];
}

// Event listeners
nextBtn.addEventListener("click", () => {
  if (currentIndex < words.length - 1) {
    currentIndex++;
    updateCard();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCard();
  }
});

audioBtn.addEventListener("click", () => {
  // In a real app, this would play the audio for the current word
  alert(`Playing audio for: ${words[currentIndex]}`);
});

// Kebab menu functionality
kebabBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  kebabDropdown.classList.toggle("show");
});

// Close dropdown when clicking elsewhere
document.addEventListener("click", (e) => {
  if (!kebabDropdown.contains(e.target) && e.target !== kebabBtn) {
    kebabDropdown.classList.remove("show");
  }
});

// Reset button
resetBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  resetCurrentWord();
  kebabDropdown.classList.remove("show");
});

// Initialize the app
init();
