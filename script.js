

// Tab Management
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active state from all tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('border-blue-500', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            // Show selected tab
            document.getElementById(tabName + '-tab').classList.remove('hidden');
            
            // Add active state to selected tab button
            const activeBtn = document.getElementById('tab-' + tabName);
            activeBtn.classList.remove('border-transparent', 'text-gray-500');
            activeBtn.classList.add('border-blue-500', 'text-blue-600');
        }

        // Notes Management
        let currentNoteElement = null;

        function addNote(event) {
            event.preventDefault();
            const subject = document.getElementById('subject').value;
            const title = document.getElementById('noteTitle').value;
            const content = document.getElementById('noteContent').value;
            const needReview = document.getElementById('needReview').checked;
            
            const notesList = document.getElementById('notesList');
            const noteDiv = document.createElement('div');
            noteDiv.className = 'p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow';
            
            // Store note data as data attributes
            noteDiv.setAttribute('data-subject', subject);
            noteDiv.setAttribute('data-title', title);
            noteDiv.setAttribute('data-content', content);
            noteDiv.setAttribute('data-need-review', needReview);
            
            noteDiv.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-800 text-sm">${subject} - ${title}</h3>
                        <p class="text-xs text-gray-500 mt-1">${content.length > 80 ? content.substring(0, 80) + '...' : content}</p>
                        <span class="inline-block mt-2 px-2 py-1 ${needReview ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'} text-xs rounded">
                            ${needReview ? 'Perlu Review' : 'Sudah Dipahami'}
                        </span>
                    </div>
                    <div class="flex items-center space-x-2 ml-3">
                        <button onclick="readNote(this)" class="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Baca catatan">
                            👁️
                        </button>
                        <button onclick="reviewNote(this)" class="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                            Review
                        </button>
                    </div>
                </div>
            `;
            
            notesList.insertBefore(noteDiv, notesList.firstChild);
            
            // Reset form
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
            document.getElementById('needReview').checked = false;
            
            alert('✅ Catatan berhasil disimpan!');
        }

        function readNote(button) {
            const noteDiv = button.closest('.p-3');
            currentNoteElement = noteDiv;
            
            // Get note data from data attributes or parse from existing content
            let subject, title, content, needReview;
            
            if (noteDiv.hasAttribute('data-subject')) {
                subject = noteDiv.getAttribute('data-subject');
                title = noteDiv.getAttribute('data-title');
                content = noteDiv.getAttribute('data-content');
                needReview = noteDiv.getAttribute('data-need-review') === 'true';
            } else {
                // Parse from existing sample notes
                const titleElement = noteDiv.querySelector('h3');
                const contentElement = noteDiv.querySelector('p');
                const statusElement = noteDiv.querySelector('span');
                
                const fullTitle = titleElement.textContent;
                const parts = fullTitle.split(' - ');
                subject = parts[0];
                title = parts[1] || 'Catatan';
                content = contentElement.textContent;
                needReview = statusElement.textContent.includes('Perlu Review');
            }
            
            // Populate modal
            document.getElementById('note-modal-title').textContent = title;
            document.getElementById('note-modal-subject').textContent = subject;
            document.getElementById('note-modal-content').textContent = content;
            
            const statusElement = document.getElementById('note-modal-status');
            if (needReview) {
                statusElement.className = 'px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full';
                statusElement.textContent = '🔄 Perlu Review';
            } else {
                statusElement.className = 'px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full';
                statusElement.textContent = '✅ Sudah Dipahami';
            }
            
            // Show modal
            document.getElementById('note-modal').classList.remove('hidden');
            document.getElementById('note-modal').classList.add('flex');
        }

        function closeNoteModal() {
            document.getElementById('note-modal').classList.add('hidden');
            document.getElementById('note-modal').classList.remove('flex');
            currentNoteElement = null;
        }

        function markAsReview() {
            if (currentNoteElement) {
                updateNoteStatus(currentNoteElement, true);
                document.getElementById('note-modal-status').className = 'px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full';
                document.getElementById('note-modal-status').textContent = '🔄 Perlu Review';
                alert('📚 Catatan ditandai perlu review!');
            }
        }

        function markAsUnderstood() {
            if (currentNoteElement) {
                updateNoteStatus(currentNoteElement, false);
                document.getElementById('note-modal-status').className = 'px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full';
                document.getElementById('note-modal-status').textContent = '✅ Sudah Dipahami';
                alert('✅ Catatan ditandai sudah dipahami!');
            }
        }

        function updateNoteStatus(noteDiv, needReview) {
            const statusSpan = noteDiv.querySelector('span');
            
            if (needReview) {
                statusSpan.className = 'inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded';
                statusSpan.textContent = 'Perlu Review';
                noteDiv.setAttribute('data-need-review', 'true');
            } else {
                statusSpan.className = 'inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded';
                statusSpan.textContent = 'Sudah Dipahami';
                noteDiv.setAttribute('data-need-review', 'false');
            }
        }

        function reviewNote(button) {
            const noteDiv = button.closest('.p-3');
            const statusSpan = noteDiv.querySelector('span');
            
            if (statusSpan.textContent.includes('Perlu Review')) {
                statusSpan.className = 'inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded';
                statusSpan.textContent = 'Sudah Dipahami';
                noteDiv.setAttribute('data-need-review', 'false');
                alert('✅ Materi sudah dipahami!');
            } else {
                alert('📚 Materi ini sudah Anda pahami dengan baik!');
            }
        }

        // Calendar Generation
        function generateCalendar() {
            const calendarGrid = document.getElementById('calendar-grid');
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            
            // Get first day of month and number of days
            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            
            // Clear existing calendar
            calendarGrid.innerHTML = '';
            
            // Add empty cells for days before month starts
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'p-2';
                calendarGrid.appendChild(emptyDay);
            }
            
            // Add days of month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'p-2 text-center border rounded-lg cursor-pointer hover:bg-blue-50';
                dayDiv.textContent = day;
                
                // Highlight today
                if (day === today.getDate()) {
                    dayDiv.className += ' bg-blue-500 text-white';
                }
                
                // Add study sessions for some days
                if ([5, 12, 18, 25].includes(day)) {
                    dayDiv.className += ' bg-green-100 border-green-300';
                    dayDiv.innerHTML += '<div class="text-xs text-green-600 mt-1">📚</div>';
                }
                
                calendarGrid.appendChild(dayDiv);
            }
        }

        // Timer Management
        let timerInterval;
        let timeLeft = 25 * 60; // 25 minutes in seconds
        let isRunning = false;
        let originalTimeLeft = 25 * 60; // Store original time for restart

        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer-display').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateTimerDisplay();
                    
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        isRunning = false;
                        showTimerNotification();
                    }
                }, 1000);
            }
        }

        function pauseTimer() {
            if (isRunning) {
                clearInterval(timerInterval);
                isRunning = false;
            }
        }

        function resetTimer() {
            clearInterval(timerInterval);
            isRunning = false;
            timeLeft = originalTimeLeft;
            updateTimerDisplay();
        }

        function setTimer(minutes) {
            clearInterval(timerInterval);
            isRunning = false;
            timeLeft = minutes * 60;
            originalTimeLeft = minutes * 60;
            updateTimerDisplay();
        }

        function setCustomTimer() {
            const customMinutes = parseInt(document.getElementById('customMinutes').value) || 0;
            const customSeconds = parseInt(document.getElementById('customSeconds').value) || 0;
            
            // Validation
            if (customMinutes < 0 || customMinutes > 180) {
                alert('⚠️ Menit harus antara 0-180!');
                return;
            }
            
            if (customSeconds < 0 || customSeconds > 59) {
                alert('⚠️ Detik harus antara 0-59!');
                return;
            }
            
            if (customMinutes === 0 && customSeconds === 0) {
                alert('⚠️ Masukkan minimal 1 detik!');
                return;
            }
            
            clearInterval(timerInterval);
            isRunning = false;
            timeLeft = (customMinutes * 60) + customSeconds;
            originalTimeLeft = (customMinutes * 60) + customSeconds;
            updateTimerDisplay();
            
            // Clear inputs
            document.getElementById('customMinutes').value = '';
            document.getElementById('customSeconds').value = '';
            
            // Create display message
            let timeMessage = '';
            if (customMinutes > 0 && customSeconds > 0) {
                timeMessage = `${customMinutes} menit ${customSeconds} detik`;
            } else if (customMinutes > 0) {
                timeMessage = `${customMinutes} menit`;
            } else {
                timeMessage = `${customSeconds} detik`;
            }
            
            alert(`⏰ Timer diatur ke ${timeMessage}!`);
        }

        function showTimerNotification() {
            // Play notification sound (if supported)
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                audio.play().catch(() => {});
            } catch (e) {}
            
            document.getElementById('timer-notification').classList.remove('hidden');
            document.getElementById('timer-notification').classList.add('flex');
        }

        function closeTimerNotification() {
            document.getElementById('timer-notification').classList.add('hidden');
            document.getElementById('timer-notification').classList.remove('flex');
            timeLeft = originalTimeLeft;
            updateTimerDisplay();
        }

        function restartTimer() {
            document.getElementById('timer-notification').classList.add('hidden');
            document.getElementById('timer-notification').classList.remove('flex');
            timeLeft = originalTimeLeft;
            updateTimerDisplay();
            startTimer();
        }

        // Technique Detail Modal Functions
        function showTechniqueDetail(techniqueType) {
            const techniques = {
                'pomodoro': {
                    title: '🍅 Teknik Pomodoro',
                    content: `
                        <h3 class="text-lg font-semibold mb-3">Apa itu Teknik Pomodoro?</h3>
                        <p class="mb-4">Teknik Pomodoro adalah metode manajemen waktu yang dikembangkan oleh Francesco Cirillo pada akhir 1980-an. Teknik ini menggunakan timer untuk membagi pekerjaan menjadi interval-interval, biasanya 25 menit, yang dipisahkan oleh jeda singkat.</p>
                        
                        <h4 class="font-semibold mb-2">Cara Kerja:</h4>
                        <ol class="list-decimal list-inside mb-4 space-y-1">
                            <li>Pilih tugas yang akan dikerjakan</li>
                            <li>Set timer selama 25 menit</li>
                            <li>Kerjakan tugas hingga timer berbunyi</li>
                            <li>Istirahat singkat 5 menit</li>
                            <li>Setelah 4 pomodoro, istirahat panjang 15-30 menit</li>
                        </ol>
                        
                        <h4 class="font-semibold mb-2">Manfaat:</h4>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Meningkatkan fokus dan konsentrasi</li>
                            <li>Mengurangi kelelahan mental</li>
                            <li>Membantu mengatasi prokrastinasi</li>
                            <li>Memberikan rasa pencapaian</li>
                        </ul>
                    `
                },
                'active-recall': {
                    title: '📚 Active Recall',
                    content: `
                        <h3 class="text-lg font-semibold mb-3">Apa itu Active Recall?</h3>
                        <p class="mb-4">Active Recall adalah teknik belajar yang melibatkan upaya aktif untuk mengingat informasi dari memori, bukan hanya membaca ulang materi. Ini adalah salah satu metode belajar paling efektif berdasarkan penelitian ilmiah.</p>
                        
                        <h4 class="font-semibold mb-2">Cara Melakukan:</h4>
                        <ol class="list-decimal list-inside mb-4 space-y-1">
                            <li>Baca materi dengan seksama</li>
                            <li>Tutup buku atau catatan</li>
                            <li>Coba ingat dan tulis apa yang baru dipelajari</li>
                            <li>Buka kembali materi untuk mengecek kebenaran</li>
                            <li>Ulangi untuk bagian yang masih salah</li>
                        </ol>
                        
                        <h4 class="font-semibold mb-2">Teknik Active Recall:</h4>
                        <ul class="list-disc list-inside mb-4 space-y-1">
                            <li>Membuat flashcard</li>
                            <li>Mengajar orang lain</li>
                            <li>Membuat pertanyaan sendiri</li>
                            <li>Merangkum tanpa melihat catatan</li>
                        </ul>
                        
                        <h4 class="font-semibold mb-2">Mengapa Efektif:</h4>
                        <p>Active recall memaksa otak untuk "menggali" informasi dari memori, yang memperkuat jalur neural dan membuat informasi lebih mudah diingat di masa depan.</p>
                    `
                },
                'spaced-repetition': {
                    title: '🔄 Spaced Repetition',
                    content: `
                        <h3 class="text-lg font-semibold mb-3">Apa itu Spaced Repetition?</h3>
                        <p class="mb-4">Spaced Repetition adalah teknik belajar yang melibatkan peninjauan materi dalam interval waktu yang semakin panjang. Teknik ini berdasarkan "forgetting curve" yang menunjukkan bagaimana kita melupakan informasi seiring waktu.</p>
                        
                        <h4 class="font-semibold mb-2">Jadwal Ideal:</h4>
                        <ol class="list-decimal list-inside mb-4 space-y-1">
                            <li>Review pertama: 1 hari setelah belajar</li>
                            <li>Review kedua: 3 hari setelah review pertama</li>
                            <li>Review ketiga: 1 minggu setelah review kedua</li>
                            <li>Review keempat: 2 minggu setelah review ketiga</li>
                            <li>Review kelima: 1 bulan setelah review keempat</li>
                        </ol>
                        
                        <h4 class="font-semibold mb-2">Cara Implementasi:</h4>
                        <ul class="list-disc list-inside mb-4 space-y-1">
                            <li>Buat sistem kartu atau catatan</li>
                            <li>Tandai tanggal review berikutnya</li>
                            <li>Fokus pada materi yang sulit diingat</li>
                            <li>Gunakan aplikasi spaced repetition</li>
                        </ul>
                        
                        <h4 class="font-semibold mb-2">Keuntungan:</h4>
                        <ul class="list-disc list-inside space-y-1">
                            <li>Informasi tersimpan dalam memori jangka panjang</li>
                            <li>Lebih efisien daripada belajar intensif</li>
                            <li>Mengurangi waktu review di masa depan</li>
                            <li>Meningkatkan retensi hingga 90%</li>
                        </ul>
                    `
                }
            };
            
            const technique = techniques[techniqueType];
            if (technique) {
                document.getElementById('technique-modal-title').textContent = technique.title;
                document.getElementById('technique-modal-content').innerHTML = technique.content;
                document.getElementById('technique-modal').classList.remove('hidden');
                document.getElementById('technique-modal').classList.add('flex');
            }
        }
        
        function closeTechniqueModal() {
            document.getElementById('technique-modal').classList.add('hidden');
            document.getElementById('technique-modal').classList.remove('flex');
        }

        // Task Management
        let tasks = [];
        let taskIdCounter = 1;

        function addTask(event) {
            event.preventDefault();
            
            const title = document.getElementById('taskTitle').value.trim();
            const priority = document.getElementById('taskPriority').value;
            const deadline = document.getElementById('taskDeadline').value;
            
            if (!title) return;
            
            const task = {
                id: taskIdCounter++,
                title: title,
                priority: priority,
                deadline: deadline,
                completed: false,
                createdAt: new Date().toLocaleDateString('id-ID')
            };
            
            tasks.push(task);
            renderTasks();
            updateProgress();
            
            // Reset form
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskPriority').value = 'rendah';
            document.getElementById('taskDeadline').value = '';
            
            alert('✅ Tugas berhasil ditambahkan!');
        }

        function renderTasks() {
            const taskList = document.getElementById('task-list');
            const emptyState = document.getElementById('empty-state');
            
            // Clear existing tasks (except empty state)
            const existingTasks = taskList.querySelectorAll('.task-item');
            existingTasks.forEach(task => task.remove());
            
            if (tasks.length === 0) {
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            // Sort tasks by priority and completion status
            const sortedTasks = [...tasks].sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1; // Completed tasks go to bottom
                }
                
                const priorityOrder = { 'tinggi': 0, 'sedang': 1, 'rendah': 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            
            sortedTasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.className = `task-item flex items-center space-x-3 p-3 rounded-lg border-l-4 ${getTaskStyles(task)}`;
                
                const priorityIcon = getPriorityIcon(task.priority);
                const deadlineText = task.deadline ? `📅 ${new Date(task.deadline).toLocaleDateString('id-ID')}` : '';
                
                taskDiv.innerHTML = `
                    <input type="checkbox" ${task.completed ? 'checked disabled' : ''} onchange="toggleTask(${task.id})" class="rounded text-blue-600">
                    <div class="flex-1">
                        <div class="text-sm font-medium text-gray-800 ${task.completed ? 'line-through opacity-60' : ''}">${priorityIcon} ${task.title}</div>
                        <div class="text-xs text-gray-500">
                            ${task.completed ? `✅ Selesai - ${task.createdAt}` : `📝 Dibuat - ${task.createdAt}`}
                            ${deadlineText ? `<br>${deadlineText}` : ''}
                        </div>
                    </div>
                    ${!task.completed ? `<button onclick="deleteTask(${task.id})" class="text-red-500 hover:text-red-700 text-sm">🗑️</button>` : ''}
                `;
                
                taskList.appendChild(taskDiv);
            });
        }

        function getTaskStyles(task) {
            if (task.completed) {
                return 'bg-green-50 border-green-400';
            }
            
            switch (task.priority) {
                case 'tinggi': return 'bg-red-50 border-red-400';
                case 'sedang': return 'bg-yellow-50 border-yellow-400';
                case 'rendah': return 'bg-blue-50 border-blue-400';
                default: return 'bg-gray-50 border-gray-400';
            }
        }

        function getPriorityIcon(priority) {
            switch (priority) {
                case 'tinggi': return '🔴';
                case 'sedang': return '🟡';
                case 'rendah': return '🟢';
                default: return '⚪';
            }
        }

        function toggleTask(taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task && !task.completed) {
                task.completed = true;
                renderTasks();
                updateProgress();
                
                alert('🎉 Tugas selesai! Anda mendapat poin progress!');
                
                // Unlock reward box
                setTimeout(() => {
                    unlockNextRewardBox();
                }, 1000);
            }
        }

        function deleteTask(taskId) {
            if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
                tasks = tasks.filter(t => t.id !== taskId);
                renderTasks();
                updateProgress();
                alert('🗑️ Tugas berhasil dihapus!');
            }
        }

        function updateProgress() {
            const completedTasks = tasks.filter(t => t.completed).length;
            const totalTasks = tasks.length;
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            document.getElementById('completed-count').textContent = completedTasks;
            document.getElementById('completion-rate').textContent = completionRate + '%';
        }

        function unlockNextRewardBox() {
            const lockedBoxes = document.querySelectorAll('#reward-boxes .bg-gray-200');
            if (lockedBoxes.length > 0) {
                const nextBox = lockedBoxes[0];
                const boxNumber = 5 - lockedBoxes.length; // Box 1, 2, 3, or 4
                
                nextBox.className = 'progress-box p-4 rounded-lg text-center cursor-pointer';
                nextBox.onclick = () => openRewardBox(boxNumber);
                nextBox.innerHTML = `<div class="text-2xl mb-2">🎁</div><div class="text-xs text-white font-medium">Box ${boxNumber}</div>`;
                
                alert('🔓 Reward box baru terbuka!');
            }
        }

        // Progress Tracker
        function openRewardBox(boxNumber) {
            const funFacts = {
                1: {
                    title: "🌍 Fun Fact Alam",
                    content: "Tahukah kamu? Satu kilat mengandung energi listrik sekitar 5 miliar joule - cukup untuk menyalakan lampu 100 watt selama 3 bulan! Suhu kilat bisa mencapai 30.000°C, 5 kali lebih panas dari permukaan matahari!"
                },
                2: {
                    title: "🔢 Fun Fact Matematika", 
                    content: "Angka 0 (nol) baru ditemukan sekitar abad ke-5 di India! Sebelumnya, orang kesulitan melakukan perhitungan. Tanpa angka 0, kita tidak akan punya sistem desimal dan komputer modern tidak akan ada!"
                },
                3: {
                    title: "🧬 Fun Fact Biologi",
                    content: "DNA manusia 99.9% sama dengan manusia lainnya, tapi yang unik adalah 0.1% sisanya! Menariknya, DNA kita juga 60% sama dengan pisang dan 90% sama dengan kucing. Kita semua terhubung!"
                },
                4: {
                    title: "🌌 Fun Fact Fisika",
                    content: "Jika kamu bisa melipat selembar kertas 42 kali, ketebalannya akan mencapai jarak dari Bumi ke Bulan! Ini karena setiap lipatan menggandakan ketebalan secara eksponensial. Sayangnya, secara fisik hanya bisa dilipat maksimal 7-8 kali."
                }
            };
            
            const fact = funFacts[boxNumber];
            if (fact) {
                // Update modal title and content for fun facts
                document.querySelector('#reward-modal h2').textContent = fact.title;
                document.getElementById('reward-content').textContent = fact.content;
                document.getElementById('reward-modal').classList.remove('hidden');
                document.getElementById('reward-modal').classList.add('flex');
            }
        }

        function closeRewardModal() {
            document.getElementById('reward-modal').classList.add('hidden');
            document.getElementById('reward-modal').classList.remove('flex');
        }



        // Scroll to element function for navigation
        function scrollToElement(elementId) {
            setTimeout(() => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    // Add highlight effect
                    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
                    setTimeout(() => {
                        element.style.boxShadow = '';
                    }, 2000);
                }
            }, 100);
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            generateCalendar();
            updateTimerDisplay();
        });

