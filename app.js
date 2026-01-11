// Step Counter Application
class StepCounter {
    constructor() {
        this.steps = 0;
        this.isRunning = false;
        this.lastY = 0;
        this.lastTimestamp = 0;
        this.threshold = 1.3; // Sensitivity threshold for step detection
        this.stepDelay = 300; // Minimum time between steps (ms)
        this.history = [];
        
        // Bind the motion handler once and store the reference
        this.boundHandleMotion = this.handleMotion.bind(this);
        
        // Load saved data
        this.loadData();
        
        // Initialize UI
        this.initializeUI();
        
        // Check sensor availability
        this.checkSensorSupport();
    }
    
    initializeUI() {
        // Get DOM elements
        this.stepCountElement = document.getElementById('stepCount');
        this.distanceElement = document.getElementById('distance');
        this.caloriesElement = document.getElementById('calories');
        this.statusElement = document.getElementById('statusText');
        this.sensorInfoElement = document.getElementById('sensorInfo');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.stepDisplay = document.querySelector('.step-display');
        
        // Attach event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Update display
        this.updateDisplay();
    }
    
    checkSensorSupport() {
        if (window.DeviceMotionEvent) {
            // Check if permission is needed (iOS 13+)
            if (typeof DeviceMotionEvent.requestPermission === 'function') {
                this.sensorInfoElement.textContent = 'Cảm biến có sẵn - Cần cấp quyền khi bắt đầu';
            } else {
                this.sensorInfoElement.textContent = 'Cảm biến chuyển động đã sẵn sàng';
            }
        } else {
            this.sensorInfoElement.textContent = '⚠️ Thiết bị không hỗ trợ cảm biến chuyển động';
        }
    }
    
    async start() {
        if (this.isRunning) return;
        
        // Request permission for iOS devices
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceMotionEvent.requestPermission();
                if (permission !== 'granted') {
                    this.statusElement.textContent = 'Cần cấp quyền truy cập cảm biến để đếm bước';
                    return;
                }
            } catch (error) {
                console.error('Error requesting permission:', error);
                this.statusElement.textContent = 'Không thể truy cập cảm biến';
                return;
            }
        }
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.stepDisplay.classList.add('active');
        this.statusElement.textContent = '✓ Đang đếm bước - Hãy di chuyển!';
        
        // Start listening to device motion
        window.addEventListener('devicemotion', this.boundHandleMotion);
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stepDisplay.classList.remove('active');
        this.statusElement.textContent = 'Đã tạm dừng - Nhấn "Bắt đầu" để tiếp tục';
        
        // Stop listening to device motion
        window.removeEventListener('devicemotion', this.boundHandleMotion);
        
        // Save data
        this.saveData();
    }
    
    reset() {
        const confirmed = confirm('Bạn có chắc muốn đặt lại bộ đếm bước?');
        if (!confirmed) return;
        
        // Stop tracking if currently running
        if (this.isRunning) {
            this.pause();
        }
        
        this.steps = 0;
        this.history = [];
        this.updateDisplay();
        this.saveData();
        this.statusElement.textContent = 'Đã đặt lại - Nhấn "Bắt đầu" để bắt đầu đếm';
    }
    
    handleMotion(event) {
        if (!this.isRunning) return;
        
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;
        
        const currentY = acceleration.y || 0;
        const currentTimestamp = Date.now();
        
        // Calculate change in acceleration
        const deltaY = Math.abs(currentY - this.lastY);
        
        // Detect a step if acceleration change is above threshold
        // and enough time has passed since last step
        if (deltaY > this.threshold && 
            (currentTimestamp - this.lastTimestamp) > this.stepDelay) {
            this.addStep();
            this.lastTimestamp = currentTimestamp;
        }
        
        this.lastY = currentY;
    }
    
    addStep() {
        this.steps++;
        this.updateDisplay();
        
        // Add to history
        const now = new Date();
        this.history.push({
            time: now.toLocaleTimeString('vi-VN'),
            steps: this.steps
        });
        
        // Keep only last 10 entries
        if (this.history.length > 10) {
            this.history.shift();
        }
        
        this.updateHistory();
        
        // Auto-save every 10 steps
        if (this.steps % 10 === 0) {
            this.saveData();
        }
    }
    
    updateDisplay() {
        // Update step count
        this.stepCountElement.textContent = this.steps.toLocaleString('vi-VN');
        
        // Calculate and update distance (average stride: 0.762 meters)
        const distance = (this.steps * 0.762) / 1000; // in kilometers
        this.distanceElement.textContent = distance.toFixed(2);
        
        // Calculate and update calories (approximate: 0.04 calories per step)
        const calories = Math.round(this.steps * 0.04);
        this.caloriesElement.textContent = calories;
    }
    
    updateHistory() {
        const historyDiv = document.getElementById('todayHistory');
        
        if (this.history.length === 0) {
            historyDiv.innerHTML = '<p class="no-data">Chưa có dữ liệu</p>';
            return;
        }
        
        // Clear previous content
        historyDiv.innerHTML = '';
        
        // Show in reverse order (newest first)
        for (let i = this.history.length - 1; i >= 0; i--) {
            const entry = this.history[i];
            
            // Create elements safely
            const itemDiv = document.createElement('div');
            itemDiv.className = 'history-item';
            
            const timeSpan = document.createElement('span');
            timeSpan.textContent = entry.time;
            
            const stepsSpan = document.createElement('span');
            const strongElement = document.createElement('strong');
            strongElement.textContent = entry.steps;
            stepsSpan.appendChild(strongElement);
            stepsSpan.appendChild(document.createTextNode(' bước'));
            
            itemDiv.appendChild(timeSpan);
            itemDiv.appendChild(stepsSpan);
            historyDiv.appendChild(itemDiv);
        }
    }
    
    saveData() {
        const data = {
            steps: this.steps,
            history: this.history,
            date: new Date().toDateString()
        };
        localStorage.setItem('stepCounterData', JSON.stringify(data));
    }
    
    loadData() {
        try {
            const savedData = localStorage.getItem('stepCounterData');
            if (!savedData) return;
            
            const data = JSON.parse(savedData);
            
            // Check if data is from today
            const today = new Date().toDateString();
            if (data.date === today) {
                this.steps = data.steps || 0;
                this.history = data.history || [];
            } else {
                // Clear old data if it's a new day
                localStorage.removeItem('stepCounterData');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StepCounter();
});
