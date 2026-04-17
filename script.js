function hideAll() {
    document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
}
function showSignIn() { hideAll(); document.getElementById('signin').classList.add('active'); }
function toggle(f) { hideAll(); document.getElementById(f).classList.add('active'); }
function register() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let email = regEmail.value;
    let pass = regPass.value;
    let name = regName.value;
    let msg = document.getElementById('registerMsg');

    if (!email || !pass || !name) {
        msg.className = 'message error';
        msg.innerText = 'Semua field wajib diisi!';
        return;
    }

    if (users.find(u => u.email === email)) {
        msg.className = 'message error';
        msg.innerText = 'Email sudah terdaftar!';
        return;
    }

    users.push({ email, pass, name });
    localStorage.setItem('users', JSON.stringify(users));

    msg.className = 'message success';
    msg.innerText = 'Register berhasil! Silakan login.';
}

function login() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let email = loginEmail.value;
    let pass = loginPassword.value;
    let msg = document.getElementById('loginMsg');

    let user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        msg.className = 'message success';
        msg.innerText = 'Login berhasil! Selamat datang ' + user.name;
    } else {
        msg.className = 'message error';
        msg.innerText = 'Email atau password salah!';
    }
}