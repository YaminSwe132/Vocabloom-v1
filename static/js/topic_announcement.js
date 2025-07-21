document.addEventListener('DOMContentLoaded', function() {
            // Current date
            let currentDate = new Date();
            
            // Sample topics data - you can replace this with your actual data
            const topics = {
                '2023-6-15': 'Present Perfect Tense',
                '2023-6-18': 'Business Vocabulary',
                '2023-6-20': 'Pronunciation Workshop',
                '2023-6-22': 'Reading Comprehension',
                '2023-6-25': 'Writing Emails',
                '2023-6-28': 'Idioms and Phrases',
                '2023-7-2': 'Past Continuous',
                '2023-7-5': 'Travel Vocabulary',
                '2023-7-8': 'Listening Practice',
                '2023-7-12': 'Speaking Exercises'
            };
            
            // Day names for mobile view
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            
            // Initialize calendar
            renderCalendar();
            
            // Event listeners for navigation
            document.getElementById('prev-month').addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
            
            document.getElementById('next-month').addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
            
            function renderCalendar() {
                const monthView = document.getElementById('month-view');
                const currentMonthElement = document.getElementById('current-month');
                
                // Update month/year display
                currentMonthElement.textContent = currentDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                });
                
                // Clear existing day cells (keep day headers)
                while (monthView.children.length > 7) {
                    monthView.removeChild(monthView.lastChild);
                }
                
                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                
                const startDay = firstDayOfMonth.getDay();
                const daysInMonth = lastDayOfMonth.getDate();
                
                const daysFromPrevMonth = startDay;
                const daysFromNextMonth = 42 - (daysInMonth + daysFromPrevMonth); // 6 weeks
                
                // Previous month days
                const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
                for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
                    const day = prevMonthLastDay - i;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
                    const dayCell = createDayCell(day, date, true);
                    monthView.appendChild(dayCell);
                }
                
                // Current month days
                const today = new Date();
                for (let day = 1; day <= daysInMonth; day++) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const isToday = isSameDay(date, today);
                    const dayCell = createDayCell(day, date, false, isToday);
                    monthView.appendChild(dayCell);
                }
                
                // Next month days
                for (let day = 1; day <= daysFromNextMonth; day++) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
                    const dayCell = createDayCell(day, date, true);
                    monthView.appendChild(dayCell);
                }
            }
            
            function createDayCell(day, date, isOtherMonth, isToday = false) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                if (isOtherMonth) dayCell.classList.add('other-month');
                if (isToday) dayCell.classList.add('today');
                
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day;
                dayNumber.dataset.dayname = dayNames[date.getDay()].substring(0, 3);
                dayCell.appendChild(dayNumber);
                
                // Add topic for this day if exists
                const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                if (topics[dateKey]) {
                    const topicElement = document.createElement('div');
                    topicElement.className = 'topic';
                    topicElement.textContent = topics[dateKey];
                    dayCell.appendChild(topicElement);
                } else if (!isOtherMonth) {
                    const emptyElement = document.createElement('div');
                    emptyElement.className = 'empty-day';
                    emptyElement.textContent = 'Transportation in united states of america';
                    dayCell.appendChild(emptyElement);
                }
                
                return dayCell;
            }
            
            function isSameDay(date1, date2) {
                return date1.getFullYear() === date2.getFullYear() &&
                       date1.getMonth() === date2.getMonth() &&
                       date1.getDate() === date2.getDate();
            }
        });