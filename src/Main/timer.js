let timerPaused = false;

        function startTimer() {
            timerPaused = false;
            let minutes = document.getElementById('timer').value;
            let time = minutes * 60;
            localStorage.setItem('timer', time);
            localStorage.setItem('timerStarted', Date.now());
            localStorage.removeItem('pausedTime');
            document.getElementById('pause-btn').innerText = 'Pause';
            checkTimer();
        }
        
        function pauseTimer() {
            timerPaused = !timerPaused;
            let pauseBtn = document.getElementById('pause-btn');
            if (!timerPaused) {
                localStorage.setItem('timerStarted', Date.now() - (localStorage.getItem('pausedTime') || 0));
                pauseBtn.innerText = 'Pause';
                checkTimer();
            } else {
                localStorage.setItem('pausedTime', Date.now() - localStorage.getItem('timerStarted'));
                pauseBtn.innerText = 'Play';
            }
        }

        function checkTimer() {
            if (timerPaused) return;

            let storedTime = localStorage.getItem('timer');
            let startTime = localStorage.getItem('timerStarted');
            if (storedTime && startTime) {
                let timePassed = Math.floor((Date.now() - startTime) / 1000);
                let timeLeft = storedTime - timePassed;
                if (timeLeft <= 0) {
                    alert('Время истекло!');
                    localStorage.removeItem('timer');
                    localStorage.removeItem('timerStarted');
                    localStorage.removeItem('pausedTime');
                } else {
                    let timerDisplay = document.getElementById('time-left');
                    if (timerDisplay) {
                        timerDisplay.innerText = `${Math.floor(timeLeft / 60)} : ${timeLeft % 60}`;
                    }
                    setTimeout(checkTimer, 1000);
                }
            }
        }
        checkTimer();