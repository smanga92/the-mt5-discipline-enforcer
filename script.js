class MT5DisciplineTracker {
    constructor() {
        this.adminPin = '1234'; // Default PIN
        this.tradingRules = [];
        this.delayMinutes = 5;
        this.enableReflection = true;
        this.enableCooldown = true;
        this.currentScreen = 'welcome';
        this.sessionHistory = [];
        this.reflectionHistory = [];
        this.sessionCount = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.isFirstTimeUser = true;
        this.hasCompletedToday = false;
        
        this.initializeApp();
        this.loadData();
        this.setupEventListeners();
    }

    initializeApp() {
        // Determine if this is first time user
        if (this.isFirstTimeUser) {
            this.showScreen('welcome');
        } else if (this.enableReflection && !this.hasCompletedToday) {
            this.showScreen('reflection');
        } else {
            this.showScreen('checklist');
        }
    }

    loadData() {
        const savedData = localStorage.getItem('mt5DisciplineData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Load configuration
            this.adminPin = data.adminPin || '1234';
            this.tradingRules = data.tradingRules || this.getDefaultRules();
            this.delayMinutes = data.delayMinutes || 5;
            this.enableReflection = data.enableReflection !== undefined ? data.enableReflection : true;
            this.enableCooldown = data.enableCooldown !== undefined ? data.enableCooldown : true;
            
            // Load session data
            this.sessionHistory = data.sessionHistory || [];
            this.reflectionHistory = data.reflectionHistory || [];
            this.sessionCount = data.sessionCount || 0;
            this.currentStreak = data.currentStreak || 0;
            this.bestStreak = data.bestStreak || 0;
            this.isFirstTimeUser = data.isFirstTimeUser !== undefined ? data.isFirstTimeUser : true;
            this.hasCompletedToday = this.checkIfCompletedToday();
        } else {
            this.tradingRules = this.getDefaultRules();
        }
        
        this.updateUI();
    }

    getDefaultRules() {
        return [
            "I have analyzed the market and identified my trade setup",
            "I have calculated my risk and position size",
            "I have set my stop loss and take profit levels",
            "I am trading with a clear mind and proper emotional state",
            "I will not revenge trade or deviate from my plan"
        ];
    }

    checkIfCompletedToday() {
        const today = new Date().toDateString();
        return this.sessionHistory.some(session => 
            new Date(session.timestamp).toDateString() === today
        );
    }

    saveData() {
        const data = {
            adminPin: this.adminPin,
            tradingRules: this.tradingRules,
            delayMinutes: this.delayMinutes,
            enableReflection: this.enableReflection,
            enableCooldown: this.enableCooldown,
            sessionHistory: this.sessionHistory,
            reflectionHistory: this.reflectionHistory,
            sessionCount: this.sessionCount,
            currentStreak: this.currentStreak,
            bestStreak: this.bestStreak,
            isFirstTimeUser: this.isFirstTimeUser,
        };
        
        localStorage.setItem('mt5DisciplineData', JSON.stringify(data));
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('nav-trade').addEventListener('click', () => this.startTradingFlow());
        document.getElementById('nav-progress').addEventListener('click', () => this.showScreen('progress'));

        // Admin access
        document.getElementById('admin-access').addEventListener('click', () => this.showScreen('pin'));
        document.getElementById('verify-pin').addEventListener('click', () => this.verifyPin());
        document.getElementById('cancel-pin').addEventListener('click', () => this.showPreviousScreen());
        
        // Admin screen
        document.getElementById('add-admin-checklist-item').addEventListener('click', () => this.addAdminChecklistItem());
        document.getElementById('save-admin-config').addEventListener('click', () => this.saveAdminConfig());
        document.getElementById('update-pin').addEventListener('click', () => this.updatePin());
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        document.getElementById('clear-all-data').addEventListener('click', () => this.clearAllData());
        document.getElementById('exit-admin').addEventListener('click', () => this.exitAdmin());
        
        // Welcome screen
        document.getElementById('start-first-session').addEventListener('click', () => this.startFirstSession());
        
        // Reflection screen
        document.getElementById('discipline-rating').addEventListener('input', (e) => {
            document.getElementById('discipline-value').textContent = e.target.value;
        });
        document.getElementById('submit-reflection').addEventListener('click', () => this.submitReflection());
        
        // Checklist screen
        document.getElementById('complete-checklist').addEventListener('click', () => this.completeChecklist());
        
        // Access screen
        document.getElementById('open-mt5').addEventListener('click', () => this.openMT5());
        document.getElementById('back-to-reflection').addEventListener('click', () => this.showPreviousScreen());
        
        // Progress screen
        document.getElementById('back-from-progress').addEventListener('click', () => this.showPreviousScreen());
        
        // PIN input enter key
        document.getElementById('pin-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyPin();
            }
        });
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show requested screen
        document.getElementById(`${screenName}-screen`).classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Handle screen-specific logic
        switch(screenName) {
            case 'admin':
                this.populateAdminForm();
                break;
            case 'reflection':
                document.getElementById('nav-trade').classList.add('active');
                break;
            case 'checklist':
                this.populateChecklist();
                document.getElementById('nav-trade').classList.add('active');
                break;
            case 'progress':
                this.updateProgressScreen();
                document.getElementById('nav-progress').classList.add('active');
                break;
            case 'access':
                this.populateAccessScreen();
                break;
            case 'pin':
                document.getElementById('pin-input').value = '';
                document.getElementById('pin-input').focus();
                break;
        }
        
        this.currentScreen = screenName;
    }

    showPreviousScreen() {
        if (this.isFirstTimeUser) {
            this.showScreen('welcome');
        } else if (this.enableReflection && !this.hasCompletedToday) {
            this.showScreen('reflection');
        } else {
            this.showScreen('checklist');
        }
    }

    startTradingFlow() {
        if (this.tradingRules.length === 0) {
            alert('Please configure trading rules in the admin panel first');
            return;
        }
        
        if (this.isFirstTimeUser) {
            this.showScreen('welcome');
        } else if (this.enableReflection && !this.hasCompletedToday) {
            this.showScreen('reflection');
        } else {
            this.showScreen('checklist');
        }
    }

    startFirstSession() {
        this.isFirstTimeUser = false;
        this.saveData();
        this.showScreen('checklist');
    }

    // Admin functionality
    verifyPin() {
        const enteredPin = document.getElementById('pin-input').value;
        if (enteredPin === this.adminPin) {
            this.showScreen('admin');
        } else {
            alert('Invalid PIN');
            document.getElementById('pin-input').value = '';
        }
    }

    populateAdminForm() {
        // Populate trading rules
        const builder = document.getElementById('admin-checklist-builder');
        builder.innerHTML = '';
        
        this.tradingRules.forEach(rule => {
            this.createAdminRuleItem(builder, rule);
        });
        
        if (this.tradingRules.length === 0) {
            this.createAdminRuleItem(builder, '');
        }
        
        // Populate settings
        document.getElementById('enable-reflection').checked = this.enableReflection;
        document.getElementById('enable-cooldown').checked = this.enableCooldown;
        document.getElementById('admin-delay-input').value = this.delayMinutes;
    }

    createAdminRuleItem(container, ruleText = '') {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checklist-item';
        itemDiv.innerHTML = `
            <input type="text" value="${ruleText}" placeholder="e.g., I have calculated my risk properly" class="checklist-input">
            <button class="remove-item">×</button>
        `;
        
        itemDiv.querySelector('.remove-item').addEventListener('click', () => {
            if (container.children.length > 1) {
                itemDiv.remove();
            } else {
                alert('At least one rule is required');
            }
        });
        
        container.appendChild(itemDiv);
    }

    addAdminChecklistItem() {
        const builder = document.getElementById('admin-checklist-builder');
        this.createAdminRuleItem(builder);
    }

    saveAdminConfig() {
        // Save trading rules
        const inputs = document.querySelectorAll('#admin-checklist-builder .checklist-input');
        this.tradingRules = [];
        
        inputs.forEach(input => {
            if (input.value.trim()) {
                this.tradingRules.push(input.value.trim());
            }
        });
        
        if (this.tradingRules.length === 0) {
            alert('Please add at least one trading rule');
            return;
        }
        
        // Save settings
        this.enableReflection = document.getElementById('enable-reflection').checked;
        this.enableCooldown = document.getElementById('enable-cooldown').checked;
        this.delayMinutes = parseInt(document.getElementById('admin-delay-input').value) || 5;
        
        this.saveData();
        alert('Configuration saved successfully!');
    }

    updatePin() {
        const newPin = document.getElementById('new-pin').value;
        if (newPin && newPin.length >= 4 && newPin.length <= 6 && /^\d+$/.test(newPin)) {
            this.adminPin = newPin;
            this.saveData();
            document.getElementById('new-pin').value = '';
            alert('PIN updated successfully!');
        } else {
            alert('PIN must be 4-6 digits');
        }
    }

    exportData() {
        const data = {
            sessionHistory: this.sessionHistory,
            reflectionHistory: this.reflectionHistory,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mt5-discipline-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem('mt5DisciplineData');
            location.reload();
        }
    }

    exitAdmin() {
        this.showPreviousScreen();
    }

    // Reflection functionality
    submitReflection() {
        const followedRules = document.getElementById('followed-rules').value;
        const mistakes = document.getElementById('mistakes-made').value;
        const lessons = document.getElementById('lessons-learned').value;
        const currentEmotion = document.getElementById('current-emotion').value;
        const disciplineRating = parseInt(document.getElementById('discipline-rating').value);
        
        if (!followedRules || !currentEmotion) {
            alert('Please fill in all required fields');
            return;
        }
        
        const reflection = {
            timestamp: new Date().toISOString(),
            followedRules,
            mistakes,
            lessons,
            currentEmotion,
            disciplineRating,
            type: 'reflection'
        };
        
        this.reflectionHistory.unshift(reflection);
        this.reflectionHistory = this.reflectionHistory.slice(0, 20); // Keep last 20
        
        // Update streak based on discipline rating
        if (disciplineRating >= 7) {
            this.currentStreak++;
            this.bestStreak = Math.max(this.bestStreak, this.currentStreak);
        } else {
            this.currentStreak = 0;
        }
        
        this.saveData();
        this.clearReflectionForm();
        
        alert('Reflection submitted! Now proceed to your trading rules checklist.');
        this.showScreen('checklist');
    }

    clearReflectionForm() {
        document.getElementById('followed-rules').value = '';
        document.getElementById('mistakes-made').value = '';
        document.getElementById('lessons-learned').value = '';
        document.getElementById('current-emotion').value = '';
        document.getElementById('discipline-rating').value = '5';
        document.getElementById('discipline-value').textContent = '5';
    }

    // Checklist functionality
    populateChecklist() {
        const container = document.getElementById('checklist-container');
        container.innerHTML = '';
        
        this.tradingRules.forEach((rule, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checklist-item-container';
            itemDiv.innerHTML = `
                <input type="checkbox" id="check-${index}" class="checklist-checkbox">
                <label for="check-${index}" class="checklist-label">${rule}</label>
            `;
            
            itemDiv.querySelector('input').addEventListener('change', () => {
                this.updateChecklistButton();
            });
            
            container.appendChild(itemDiv);
        });
        
        this.updateChecklistButton();
    }

    updateChecklistButton() {
        const checkboxes = document.querySelectorAll('#checklist-container input[type="checkbox"]');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        document.getElementById('complete-checklist').disabled = !allChecked;
    }

    completeChecklist() {
        const session = {
            timestamp: new Date().toISOString(),
            rulesAcknowledged: this.tradingRules.length,
            type: 'checklist'
        };
        
        this.sessionHistory.unshift(session);
        this.sessionHistory = this.sessionHistory.slice(0, 50); // Keep last 50
        this.sessionCount++;
        this.hasCompletedToday = true;
        
        this.saveData();
        
        if (this.enableCooldown) {
            this.showScreen('timer');
            this.startTimer();
        } else {
            this.showScreen('access');
        }
    }

    startTimer() {
        const timerText = document.getElementById('timer-text');
        const circle = document.getElementById('timer-circle');
        let timeLeft = this.delayMinutes * 60;
        
        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            const progress = (this.delayMinutes * 60 - timeLeft) / (this.delayMinutes * 60);
            const hue = progress * 120;
            circle.style.borderColor = `hsl(${hue}, 70%, 50%)`;
            
            if (timeLeft <= 0) {
                this.showScreen('access');
                return;
            }
            
            timeLeft--;
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    populateAccessScreen() {
        const reminderList = document.getElementById('reminder-list');
        reminderList.innerHTML = '';
        
        this.tradingRules.forEach(rule => {
            const li = document.createElement('li');
            li.textContent = rule;
            reminderList.appendChild(li);
        });
    }

    openMT5() {
       // Try to open MT5
       Intent launchIntent = getPackageManager().getLaunchIntentForPackage("net.metaquotes.metatrader5");
       if (launchIntent != null) {
           startActivity(launchIntent);
       } else {
           // MT5 not found, maybe open Play Store or show error
       }

       try {
           window.location.href = mt5Intent;
       } catch (error) {
           console.log('Could not open MT5 automatically');
       }
       
       // Log the MT5 access
       const accessLog = {
           timestamp: new Date().toISOString(),
           type: 'mt5_access'
       };
       
       this.sessionHistory.unshift(accessLog);
       this.saveData();
       
       // Show success message
       alert('MT5 should be opening now. Remember to follow your trading rules! Return here after your session for reflection.');
   }

   // Progress screen functionality
   updateProgressScreen() {
       // Update statistics
       document.getElementById('total-sessions').textContent = this.sessionCount;
       document.getElementById('current-streak-display').textContent = this.currentStreak;
       document.getElementById('best-streak').textContent = this.bestStreak;
       
       // Calculate average discipline from reflections
       const disciplineRatings = this.reflectionHistory
           .filter(r => r.disciplineRating)
           .map(r => r.disciplineRating);
       
       const avgDiscipline = disciplineRatings.length > 0 
           ? (disciplineRatings.reduce((sum, rating) => sum + rating, 0) / disciplineRatings.length).toFixed(1)
           : '0';
       
       document.getElementById('avg-discipline').textContent = avgDiscipline;
       
       // Show recent session history
       this.populateSessionHistory();
   }

   populateSessionHistory() {
       const historyContainer = document.getElementById('session-history');
       historyContainer.innerHTML = '';
       
       // Combine and sort all history entries
       const allEntries = [
           ...this.sessionHistory.map(s => ({...s, category: 'session'})),
           ...this.reflectionHistory.map(r => ({...r, category: 'reflection'}))
       ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
       
       // Show last 10 entries
       allEntries.slice(0, 10).forEach(entry => {
           const entryDiv = document.createElement('div');
           entryDiv.className = 'session-entry';
           
           const date = new Date(entry.timestamp);
           const dateStr = date.toLocaleDateString();
           const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
           
           let content = '';
           
           if (entry.category === 'reflection') {
               content = `
                   <div class="session-date">${dateStr} at ${timeStr}</div>
                   <div class="session-type">Session Reflection</div>
                   <div class="session-details">
                       Discipline: ${entry.disciplineRating}/10 | 
                       Rules followed: ${entry.followedRules} | 
                       Emotion: ${entry.currentEmotion}
                   </div>
               `;
           } else if (entry.type === 'checklist') {
               content = `
                   <div class="session-date">${dateStr} at ${timeStr}</div>
                   <div class="session-type">Checklist Completed</div>
                   <div class="session-details">
                       Acknowledged ${entry.rulesAcknowledged} trading rules
                   </div>
               `;
           } else if (entry.type === 'mt5_access') {
               content = `
                   <div class="session-date">${dateStr} at ${timeStr}</div>
                   <div class="session-type">MT5 Accessed</div>
                   <div class="session-details">Trading session started</div>
               `;
           }
           
           entryDiv.innerHTML = content;
           historyContainer.appendChild(entryDiv);
       });
       
       if (allEntries.length === 0) {
           historyContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No session history yet</p>';
       }
   }

   updateUI() {
       document.getElementById('streak').textContent = `Streak: ${this.currentStreak} days`;
       
       // Update navigation visibility based on configuration
       const bottomNav = document.querySelector('.bottom-nav');
       if (this.tradingRules.length === 0) {
           bottomNav.style.display = 'none';
       } else {
           bottomNav.style.display = 'flex';
       }
   }

   // Utility methods for data management
   getSessionStats() {
       const today = new Date();
       const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
       const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
       
       return {
           today: this.sessionHistory.filter(s => 
               new Date(s.timestamp).toDateString() === today.toDateString()
           ).length,
           thisWeek: this.sessionHistory.filter(s => 
               new Date(s.timestamp) >= thisWeek
           ).length,
           thisMonth: this.sessionHistory.filter(s => 
               new Date(s.timestamp) >= thisMonth
           ).length,
           total: this.sessionHistory.length
       };
   }

   getDisciplineInsights() {
       const recentReflections = this.reflectionHistory.slice(0, 10);
       
       if (recentReflections.length === 0) {
           return { message: "No reflection data available yet" };
       }
       
       const avgDiscipline = recentReflections.reduce((sum, r) => sum + (r.disciplineRating || 0), 0) / recentReflections.length;
       const commonMistakes = {};
       const commonEmotions = {};
       
       recentReflections.forEach(r => {
           if (r.mistakes && r.mistakes.trim()) {
               const mistakes = r.mistakes.toLowerCase();
               // Simple keyword extraction
               ['revenge', 'oversize', 'fomo', 'stop', 'profit'].forEach(keyword => {
                   if (mistakes.includes(keyword)) {
                       commonMistakes[keyword] = (commonMistakes[keyword] || 0) + 1;
                   }
               });
           }
           
           if (r.currentEmotion) {
               commonEmotions[r.currentEmotion] = (commonEmotions[r.currentEmotion] || 0) + 1;
           }
       });
       
       return {
           avgDiscipline: avgDiscipline.toFixed(1),
           commonMistakes: Object.keys(commonMistakes).sort((a, b) => commonMistakes[b] - commonMistakes[a]),
           commonEmotions: Object.keys(commonEmotions).sort((a, b) => commonEmotions[b] - commonEmotions[a]),
           trend: this.getDisciplineTrend()
       };
   }

   getDisciplineTrend() {
       const recent = this.reflectionHistory.slice(0, 5);
       const older = this.reflectionHistory.slice(5, 10);
       
       if (recent.length === 0 || older.length === 0) return 'insufficient_data';
       
       const recentAvg = recent.reduce((sum, r) => sum + (r.disciplineRating || 0), 0) / recent.length;
       const olderAvg = older.reduce((sum, r) => sum + (r.disciplineRating || 0), 0) / older.length;
       
       if (recentAvg > olderAvg + 0.5) return 'improving';
       if (recentAvg < olderAvg - 0.5) return 'declining';
       return 'stable';
   }

   // Reset daily completion status at midnight
   checkDayReset() {
       const lastCheck = localStorage.getItem('lastDayCheck');
       const today = new Date().toDateString();
       
       if (lastCheck !== today) {
           this.hasCompletedToday = false;
           localStorage.setItem('lastDayCheck', today);
           this.saveData();
       }
   }

   // Initialize periodic checks
   startPeriodicChecks() {
       // Check for day reset every 5 minutes
       setInterval(() => {
           this.checkDayReset();
       }, 5 * 60 * 1000);
   }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
   const app = new MT5DisciplineTracker();
   app.startPeriodicChecks();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
       navigator.serviceWorker.register('/sw.js')
           .then(registration => {
               console.log('SW registered: ', registration);
           })
           .catch(registrationError => {
               console.log('SW registration failed: ', registrationError);
           });
   });
}
