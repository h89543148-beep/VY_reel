document.getElementById('resetBtn').addEventListener('click', async function() {
    let email = document.getElementById('forgotEmail').value.trim();
    let msgDiv = document.getElementById('resetMsg');

    // Validation
    if (!email) {
        msgDiv.textContent = '❌ कृपया अपना ईमेल डालें!';
        msgDiv.className = 'error';
        return;
    }

    // Email format check (simple)
    if (!email.includes('@') || !email.includes('.')) {
        msgDiv.textContent = '❌ कृपया सही ईमेल डालें!';
        msgDiv.className = 'error';
        return;
    }

    // Loading state
    msgDiv.textContent = '⏳ रीसेट लिंक भेज रहे हैं...';
    msgDiv.className = 'info';

    // Simulate sending (बाद में Supabase से बदलेंगे)
    setTimeout(function() {
        msgDiv.textContent = '✅ रीसेट लिंक भेज दिया गया! कृपया अपना ईमेल चेक करें।';
        msgDiv.className = 'success';
        
        // 3 सेकंड बाद Login Page पर ले जाओ
        setTimeout(function() {
            window.location.href = '../login/login.html';
        }, 3000);
    }, 1500);
});