
(function() {
    // get elements
    const hourHand = document.getElementById('hour');
    const minuteHand = document.getElementById('minute');
    const secondHand = document.getElementById('second');
    const dHour = document.getElementById('digital-hour');
    const dMin = document.getElementById('digital-minute');
    const dSec = document.getElementById('digital-second');
    const dAmpm = document.getElementById('ampm');

    function updateClock() {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let milliseconds = now.getMilliseconds();   // for smoother continuous seconds

        // ----- analog hand rotations (with smooth second hand) -----
        // hour: 30° per hour + 0.5° per minute + tiny from seconds (subtle)
        const hRotation = 30 * hours + minutes * 0.5 + seconds * (0.5/60) + milliseconds * (0.5/60000);
        // minute: 6° per minute + 0.1° per second (smooth)
        const mRotation = 6 * minutes + seconds * 0.1 + milliseconds * 0.0001;
        // second: 6° per second – continuous (full 360° in 60 sec) 
        const sRotation = 6 * seconds + milliseconds * 0.006;   // 0.006° per ms = 6° per sec

        // apply rotations (use transform directly)
        hourHand.style.transform = `rotate(${hRotation}deg)`;
        minuteHand.style.transform = `rotate(${mRotation}deg)`;
        secondHand.style.transform = `rotate(${sRotation}deg)`;

        // ----- digital 12h format + AM/PM -----
        let ampm = hours >= 12 ? 'PM' : 'AM';
        let displayHours = hours % 12;
        if (displayHours === 0) displayHours = 12;   // 12:00 AM/PM

        // pad with leading zero
        let hourStr = displayHours < 10 ? '0' + displayHours : '' + displayHours;
        let minuteStr = minutes < 10 ? '0' + minutes : '' + minutes;
        let secondStr = seconds < 10 ? '0' + seconds : '' + seconds;

        // update DOM
        dHour.textContent = hourStr;
        dMin.textContent = minuteStr;
        dSec.textContent = secondStr;
        dAmpm.textContent = ampm;
    }

    // run every frame for butter-smooth second hand (~60fps)
    function startAnimation() {
        updateClock();                // initial call
        let lastTimestamp = null;

        function frame(timestamp) {
            // better to use requestAnimationFrame (smooth) but keep real-time.
            // Update every frame (~16ms) but avoid overloading. 
            // We can also use setInterval(..., 16) but rAF is cleaner.
            updateClock();
            requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    startAnimation();

    // fallback for older browsers (but rAF is well supported)
    // Additionally, force a update every second as backup (won't conflict)
    setInterval(() => {
        // this extra call guarantees update even if rAF stalls (rare)
        updateClock();
    }, 500);  // twice a second safety
})();
