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

//================== DASHBOARD =================
let dataTerhapus = null;
let buku = JSON.parse(localStorage.getItem("buku")) || [
    {
        judul: "Laskar Pelangi",
        penulis: "Andrea Hirata",
        tahun: 2005,
        kategori: "Novel"
    },
    {
        judul: "Bumi",
        penulis: "Tere Liye",
        tahun: 2014,
        kategori: "Fiksi"
    },
    {
        judul: "Atomic Habits",
        penulis: "James Clear",
        tahun: 2018,
        kategori: "Self Improvement"
    }
];

const tbody = document.getElementById("data-buku");

//TAMPILKAN DATA
function tampilkanBuku() {

    tbody.innerHTML = "";

    buku.forEach((item, index) => {

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.judul}</td>
                <td>${item.penulis}</td>
                <td>${item.tahun}</td>
                <td>
                    <div class="aksi">

                        <a href="detail-book.html?id=${index}" class="btn-detail">
                        Detail
                        </a>

                        <button onclick="hapusBuku(${index})" class="btn-hapus">
                        Hapus
                        </button>

                    </div>
                </td>
            </tr>
        `;

        tbody.innerHTML += row;
    });

    document.getElementById("total-buku").innerText = buku.length;

    const kategoriUnik = [...new Set(buku.map(item => item.kategori))];

    document.getElementById("total-kategori").innerText = kategoriUnik.length;

    document.getElementById("total-user").innerText = 30;
}

//DETAIL BUKU
function detailBuku(index) {

    const item = buku[index];

    alert(
        "Judul: " + item.judul + "\n" +
        "Penulis: " + item.penulis + "\n" +
        "Tahun: " + item.tahun + "\n" +
        "Kategori: " + item.kategori
    );
}

//HAPUS BUKU
function hapusBuku(index) {

    let yakin = confirm("Yakin ingin menghapus buku?");

    if (yakin) {

        dataTerhapus = {
            data: buku[index],
            index: index
        };

        buku.splice(index, 1);

        localStorage.setItem("buku", JSON.stringify(buku));

        tampilkanBuku();

        tampilkanUndo();
    }
}

function undoHapus() {

    if (dataTerhapus !== null) {

        buku.splice(
            dataTerhapus.index,
            0,
            dataTerhapus.data
        );

        localStorage.setItem("buku", JSON.stringify(buku));

        tampilkanBuku();

        document.getElementById("undo-box").innerHTML = "";

        dataTerhapus = null;
    }
}

function tampilkanUndo() {

    const undoBox = document.getElementById("undo-box");

    undoBox.innerHTML = `
        <div class="undo-alert">
            Buku berhasil dihapus

            <button onclick="undoHapus()" class="btn-undo">
                Undo
            </button>
        </div>
    `;
}
tampilkanBuku();