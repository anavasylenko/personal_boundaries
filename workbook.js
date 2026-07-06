document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'boundary-workbook-data';
    const saveBtn = document.getElementById('save-btn');
    const toast = document.getElementById('save-toast');
    const progressBar = document.getElementById('progress-bar');

    // Load saved data
    loadData();

    // Save button
    saveBtn.addEventListener('click', () => {
        saveData();
        showToast();
    });

    // Auto-save on input change (debounced)
    let saveTimeout;
    document.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveData, 2000);
        });
        el.addEventListener('change', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveData, 500);
        });
    });

    // Progress bar
    window.addEventListener('scroll', updateProgress);
    updateProgress();

    // Textarea auto-resize
    document.querySelectorAll('.journal-input').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.max(this.scrollHeight, 80) + 'px';
        });
    });

    function saveData() {
        const data = {};

        // Save textareas
        document.querySelectorAll('textarea[id]').forEach(el => {
            data[el.id] = el.value;
        });

        // Save sliders
        document.querySelectorAll('input[type="range"]').forEach(el => {
            data[el.id] = el.value;
        });

        // Save checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
            const key = `checkbox_${el.name}_${el.value}`;
            data[key] = el.checked;
        });

        // Save radios
        document.querySelectorAll('input[type="radio"]').forEach(el => {
            if (el.checked) {
                data[`radio_${el.name}`] = el.value;
            }
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const data = JSON.parse(saved);

        // Restore textareas
        document.querySelectorAll('textarea[id]').forEach(el => {
            if (data[el.id] !== undefined) {
                el.value = data[el.id];
                // Trigger auto-resize
                el.style.height = 'auto';
                el.style.height = Math.max(el.scrollHeight, 80) + 'px';
            }
        });

        // Restore sliders
        document.querySelectorAll('input[type="range"]').forEach(el => {
            if (data[el.id] !== undefined) {
                el.value = data[el.id];
                const valueDisplay = el.nextElementSibling;
                if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
                    valueDisplay.textContent = el.value;
                }
            }
        });

        // Restore checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(el => {
            const key = `checkbox_${el.name}_${el.value}`;
            if (data[key] !== undefined) {
                el.checked = data[key];
            }
        });

        // Restore radios
        document.querySelectorAll('input[type="radio"]').forEach(el => {
            const key = `radio_${el.name}`;
            if (data[key] === el.value) {
                el.checked = true;
            }
        });
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }
});
