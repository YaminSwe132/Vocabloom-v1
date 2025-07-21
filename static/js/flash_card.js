
    // Sample flashcard data
const flashcards = [
    {
        word: "Water",
        definition: "a clear liquid, without colour or taste, that falls from the sky as rain and is necessary for animal and plant life",
        american_pronunciation: "ˈwɑː.t̬ɚ",
        british_pronunciation: "ˈwɔː.tər",
        bookmarked: false
    },
    {
        word: "Benevolent",
        definition: "Well-meaning and kindly.",
        american_pronunciation: "bəˈnɛvələnt",
        british_pronunciation: "bəˈnɛvələnt",
        bookmarked: false
    },
    {
        word: "Cacophony",
        definition: "A harsh, discordant mixture of sounds.",
        american_pronunciation: "kæˈkɑfəni",
        british_pronunciation: "kæˈkɒfəni",
        bookmarked: false
    },
    {
        word: "Dichotomy",
        definition: "A division or contrast between two things that are represented as being opposed or entirely different.",
        american_pronunciation: "daɪˈkɑtəmi",
        british_pronunciation: "daɪˈkɒtəmi",
        bookmarked: false
    },
    {
        word: "Ebullient",
        definition: "Cheerful and full of energy.",
        american_pronunciation: "ɪˈbʌljənt",
        british_pronunciation: "ɪˈbʌljənt",
        bookmarked: false
    },
];

// DOM elements
const wordDisplay = document.getElementById('word-display');
const american_pronunciation = document.getElementById('american_pronunciation');
const british_pronunciation = document.getElementById('british_pronunciation');
const definition = document.getElementById('definition');
const counter = document.getElementById('counter');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const flashcardContainer = document.getElementById('flashcard-container');
const bookmarkBtn = document.getElementById('bookmark-btn');
const wordFirstBtn = document.getElementById('word');
const defFirstBtn = document.getElementById('def');
const kebabBtn = document.getElementById('kebab-btn');
const kebabDropdown = document.getElementById('kebab-dropdown');

let currentIndex = 0;
let showWordFirst = true; // Default to showing word first

// Update card display
function updateCard() {
    const currentCard = flashcards[currentIndex];
    wordDisplay.textContent = currentCard.word;
    american_pronunciation.innerHTML = `
        <img width=40 class="mb-1" src="{% static 'images/united-states.png' %}" alt="US Flag">
        <span class="pronunciation-text"><i class="fas fa-volume-up volume-icon"></i> /${currentCard.american_pronunciation}/</span>
    `;
    
    british_pronunciation.innerHTML = `
        <img class="mb-1" width=40 src="{% static 'images/united-kingdom.png' %}" alt="UK Flag">
        <span class="pronunciation-text"><i class="fas fa-volume-up volume-icon"></i> /${currentCard.british_pronunciation}/</span>
    `;

    // Add event listeners to new volume icons
    document.querySelectorAll('.volume-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            // Extract the word from the pronunciation text
            const word = icon.closest('.pronunciation-text').textContent.trim().slice(1, -1);
            // alert(`Playing pronunciation for: ${word}`);

            $.ajax({
                url: `/pronounce/${word}/`,
                method: 'GET',
                success: function(item) {
                    console.log('Pronunciation played for:', item);
                },
                error: function(xhr, status, error) {
                    console.error('Error playing pronunciation:', error);
                }
        });
    });
});    
    definition.textContent = currentCard.definition;
    counter.textContent = `${currentIndex + 1}/${flashcards.length}`;
    
    // Update bookmark state
    bookmarkBtn.classList.toggle('bookmarked', currentCard.bookmarked);
    
    // Update display based on showWordFirst preference
    if (showWordFirst) {
        definition.style.display = 'none';
        american_pronunciation.style.display = 'block';
        british_pronunciation.style.display = 'block';
        wordFirstBtn.style.display = 'none';
        defFirstBtn.style.display = 'block';
        defFirstBtn.innerHTML = '<i class="fas fa-book-open"></i> Meaning First';
    } else {
        definition.style.display = 'block';
        american_pronunciation.style.display = 'none';
        british_pronunciation.style.display = 'none';
        wordFirstBtn.style.display = 'block';
        defFirstBtn.style.display = 'none';
        wordFirstBtn.innerHTML = '<i class="fas fa-book-open"></i> Word First';
    }
    
    // Update button states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === flashcards.length - 1;
}

// Flip card animation
function flipCard() {
    flashcardContainer.classList.add('flip-animation');
    setTimeout(() => {
        showWordFirst = !showWordFirst;
        updateCard();
        flashcardContainer.classList.remove('flip-animation');
    }, 300);
}

// Toggle bookmark
function toggleBookmark() {
    flashcards[currentIndex].bookmarked = !flashcards[currentIndex].bookmarked;
    bookmarkBtn.classList.toggle('bookmarked');
}

// Event listeners
nextBtn.addEventListener('click', () => {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        updateCard();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCard();
    }
});

// Flip card when clicking anywhere on the card
flashcardContainer.addEventListener('click', flipCard);

// Bookmark button click (stop propagation to prevent flip)
bookmarkBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBookmark();
});

// Kebab menu functionality
kebabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    kebabDropdown.classList.toggle('show');
});

// Close dropdown when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!kebabDropdown.contains(e.target) && e.target !== kebabBtn) {
        kebabDropdown.classList.remove('show');
    }
});

// Word First button click
wordFirstBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showWordFirst = true;
    updateCard();
    kebabDropdown.classList.remove('show');
});

// Meaning First button click
defFirstBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showWordFirst = false;
    updateCard();
    kebabDropdown.classList.remove('show');
});

// Initialize first card
updateCard();