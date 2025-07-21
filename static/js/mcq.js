    // Sample flashcard data with questions and options
    const flashcards = [
        {
            word: "Ephemeral",
            definition: "Lasting for a very short time. Example: 'Fashions are ephemeral; new ones regularly drive out the old.'",
            british_pronunciation: "/ɪˈfem.ɚ.əl/",
            partOfSpeech: "adjective",
            question: "What is the correct definition of the word 'Ephemeral'?",
            options: [
                { text: "Lasting for a very short time", correct: true },
                { text: "Existing everywhere at the same time", correct: false },
                { text: "Relating to heaven or the sky", correct: false },
                { text: "Capable of being shaped or bent", correct: false }
            ],
            bookmarked: false,
            userAnswer: null, // Add this to track user's answer
            isCorrect: false  // Add this to track if answer was correct
        },
        {
            word: "Benevolent",
            definition: "Well-meaning and kindly.",
            british_pronunciation: "/bəˈnev.əl.ənt/",
            partOfSpeech: "adjective",
            question: "What is the correct definition of the word 'Benevolent'?",
            options: [
                { text: "Well-meaning and kindly", correct: true },
                { text: "Having a strong desire to succeed", correct: false },
                { text: "Difficult to understand", correct: false },
                { text: "Relating to money or finances", correct: false }
            ],
            bookmarked: false,
            userAnswer: null, // Add this to track user's answer
            isCorrect: false  // Add this to track if answer was correct
        },
        // Add more flashcards as needed
    ];

    // DOM elements
    const questionCard = document.getElementById('question-card');
    const definitionCard = document.getElementById('definition-card');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const nextWordBtn = document.getElementById('next-word-btn');
    const wordDisplay = document.getElementById('word-display');
    const britishPronunciation = document.getElementById('british_pronunciation');
    const definition = document.getElementById('definition');
    const partOfSpeech = document.getElementById('part-of-speech');
    const counter = document.getElementById('counter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtnMcq = document.getElementById('next-btn-mcq');
    const card = document.getElementsByClassName('card');

    let currentIndex = 0;

    // Update card display
    function updateCard() {
        const currentCard = flashcards[currentIndex];
        
        // Update question card
        questionText.textContent = currentCard.question;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Add new options
        currentCard.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option.text;
            
            // Check if this option was previously selected by the user
            if (currentCard.userAnswer !== null && option.text === currentCard.userAnswer) {
                if (currentCard.isCorrect) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('incorrect');
                    // Also highlight the correct answer if user was wrong
                    const correctOption = currentCard.options.find(opt => opt.correct);
                    if (correctOption) {
                        // This will be handled when we recreate all options
                    }
                }
            }
            
            optionElement.onclick = () => {
                checkAnswer(optionElement, option.correct, option.text);
                showDefinition();
            }
            optionsContainer.appendChild(optionElement);
        });
        
        // If user has answered this question before, show the correct answer if they were wrong
        if (currentCard.userAnswer !== null && !currentCard.isCorrect) {
            const correctOptionText = currentCard.options.find(opt => opt.correct).text;
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                if (option.textContent === correctOptionText) {
                    option.classList.add('correct');
                }
            });
            
            // Disable all options if already answered
            options.forEach(option => {
                option.style.pointerEvents = 'none';
            });
            
            // Show definition if already answered
            showDefinition();
        }
        
        // Update definition card
        wordDisplay.textContent = currentCard.word;
        britishPronunciation.textContent = currentCard.british_pronunciation;
        definition.textContent = currentCard.definition;
        partOfSpeech.textContent = currentCard.partOfSpeech;
        
        counter.textContent = `${currentIndex + 1}/${flashcards.length}`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtnMcq.disabled = currentIndex === flashcards.length - 1;
    }

    function checkAnswer(selectedOption, isCorrect, answerText) {
        const currentCard = flashcards[currentIndex];
        
        // Store user's answer and correctness
        currentCard.userAnswer = answerText;
        currentCard.isCorrect = isCorrect;
        
        // Disable all options
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        // Mark correct/incorrect
        if (isCorrect) {
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            // Find and highlight the correct answer
            options.forEach(option => {
                if (option.textContent === flashcards[currentIndex].options.find(opt => opt.correct).text) {
                    option.classList.add('correct');
                }
            });
        }
    }

    function showDefinition() {
        // Slide question card to left
        questionCard.style.width = '55%';
        questionCard.style.height = '400px';
        questionCard.classList.add('slide-left');

        // Change card width
        definitionCard.style.width = '45%';
        // Show definition card
        definitionCard.classList.add('show-definition');
    }

    function nextQuestion() {
        // Reset cards to initial position
        questionCard.classList.remove('slide-left');
        definitionCard.classList.remove('show-definition');
        
        // Reset question card state (but keep user answers)
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.pointerEvents = 'auto';
        });
        
        // Move to next card
        if (currentIndex < flashcards.length - 1) {
            currentIndex++;
            updateCard();
        }
    }

    function prevQuestion() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCard();
            // Reset cards to initial position
            // questionCard.classList.remove('slide-left');
            // definitionCard.classList.remove('show-definition');
        }
    }

    // Event listeners
    prevBtn.addEventListener('click', prevQuestion);
    nextBtnMcq.addEventListener('click', nextQuestion);

    // Initialize first card
    updateCard();