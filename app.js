// Step Counter Application
class StepCounter {
    constructor() {
        this.steps = 0;
        this.isRunning = false;
        this.startTime = null;
        this.elapsedTime = 0;
        this.timerInterval = null;
        
        // Motion detection variables
        this.lastY = 0;
        this.lastTimestamp = 0;
        this.threshold = 1.3; // Sensitivity threshold for step detection
        this.stepDetected = false;
        this.cooldown = false;
        
        // DOM elements
        this.stepCountElement = document.getElementById('stepCount');
        this.distanceElement = document.getElementById('distance');
        this.caloriesElement = document.getElementById('calories');
        this.timeElement = document.getElementById('time');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.stepLengthInput = document.getElementById('stepLength');
        this.weightInput = document.getElementById('weight');
        this.sensorStatus = document.getElementById('sensorStatus');
        
        this.initEventListeners();
        this.checkSensorSupport();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    async checkSensorSupport() {
        if (typeof DeviceMotionEvent !== 'undefined') {
            // For iOS 13+ devices, need to request permission
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                this.sensorStatus.innerHTML = '📱 Nhấn "Bắt đầu" để cấp quyền truy cập cảm biến';
                this.sensorStatus.style.color = '#ff9800';
            } else {
                this.sensorStatus.innerHTML = '✅ Cảm biến chuyển động sẵn sàng';
                this.sensorStatus.style.color = '#4caf50';
            }
        } else {
            this.sensorStatus.innerHTML = '❌ Thiết bị không hỗ trợ cảm biến chuyển động';
            this.sensorStatus.style.color = '#f44336';
        }
    }
    
    async start() {
        if (this.isRunning) return;
        
        // Request permission for iOS devices
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                if (permission !== 'granted') {
                    alert('Cần cấp quyền truy cập cảm biến để đếm bước chân');
                    return;
                }
            } catch (error) {
                console.error('Error requesting motion permission:', error);
                alert('Không thể truy cập cảm biến chuyển động');
                return;
            }
        }
        
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        // Start timer
        this.timerInterval = setInterval(() => this.updateTime(), 1000);
        
        // Start motion detection
        this.startMotionDetection();
        
        this.sensorStatus.innerHTML = '🏃 Đang theo dõi bước chân...';
        this.sensorStatus.style.color = '#4caf50';
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        clearInterval(this.timerInterval);
        this.stopMotionDetection();
        
        this.sensorStatus.innerHTML = '⏸️ Đã tạm dừng';
        this.sensorStatus.style.color = '#ff9800';
    }
    
    reset() {
        this.pause();
        this.steps = 0;
        this.elapsedTime = 0;
        this.updateDisplay();
        this.updateTime();
        
        this.sensorStatus.innerHTML = '🔄 Đã đặt lại';
        this.sensorStatus.style.color = '#666';
    }
    
    startMotionDetection() {
        // Add event listener for device motion
        window.addEventListener('devicemotion', this.handleMotion.bind(this));
        
        // Fallback: simulate steps with space bar for testing on desktop
        this.keyHandler = (e) => {
            if (e.code === 'Space' && this.isRunning) {
                e.preventDefault();
                this.addStep();
            }
        };
        window.addEventListener('keydown', this.keyHandler);
    }
    
    stopMotionDetection() {
        window.removeEventListener('devicemotion', this.handleMotion.bind(this));
        if (this.keyHandler) {
            window.removeEventListener('keydown', this.keyHandler);
        }
    }
    
    handleMotion(event) {
        if (!this.isRunning) return;
        
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration || !acceleration.y) return;
        
        const currentY = acceleration.y;
        const currentTime = Date.now();
        
        // Detect significant changes in Y-axis (vertical movement)
        const delta = Math.abs(currentY - this.lastY);
        
        // Time-based cooldown to prevent double counting (minimum 300ms between steps)
        if (delta > this.threshold && !this.cooldown && (currentTime - this.lastTimestamp) > 300) {
            this.addStep();
            this.cooldown = true;
            setTimeout(() => {
                this.cooldown = false;
            }, 300);
        }
        
        this.lastY = currentY;
        this.lastTimestamp = currentTime;
    }
    
    addStep() {
        this.steps++;
        this.updateDisplay();
        
        // Visual feedback
        this.stepCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.stepCountElement.style.transform = 'scale(1)';
        }, 200);
    }
    
    updateDisplay() {
        // Update step count
        this.stepCountElement.textContent = this.steps;
        
        // Calculate and update distance (km)
        const stepLength = parseFloat(this.stepLengthInput.value) || 75;
        const distance = (this.steps * stepLength) / 100000; // Convert to km
        this.distanceElement.textContent = distance.toFixed(2);
        
        // Calculate and update calories
        // Formula: calories = steps * 0.04 (rough estimate)
        const weight = parseFloat(this.weightInput.value) || 70;
        const calories = Math.round(this.steps * 0.04 * (weight / 70));
        this.caloriesElement.textContent = calories;
    }
    
    updateTime() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        this.timeElement.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const stepCounter = new StepCounter();
});
