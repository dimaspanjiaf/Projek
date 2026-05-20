// ========= SEMUA HALAMAN =========

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}


// ========= login.html =========

function showRegister() {
  const authContainer = document.getElementById("authContainer");
  if (authContainer) {
    authContainer.classList.add("active");
  }
}

function showLogin() {
  const authContainer = document.getElementById("authContainer");
  if (authContainer) {
    authContainer.classList.remove("active");
  }
}

function register() {
  const users = getData("users");

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPass").value;
  const msg = document.getElementById("registerMsg");

  if (name === "" || email === "" || password === "") {
    msg.className = "message error";
    msg.innerText = "Semua data wajib diisi!";
    return;
  }

  const userExist = users.find(function(user) {
    return user.email === email;
  });

  if (userExist) {
    msg.className = "message error";
    msg.innerText = "Email sudah terdaftar!";
    return;
  }

  users.push({
    name: name,
    email: email,
    password: password
  });

  saveData("users", users);

  msg.className = "message success";
  msg.innerText = "Register berhasil! Silakan login.";

  setTimeout(function() {
    showLogin();
  }, 1000);
}

function login() {
  const users = getData("users");

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMsg");

  const user = users.find(function(user) {
    return user.email === email && user.password === password;
  });

  if (user) {
    saveData("loginUser", user);

    msg.className = "message success";
    msg.innerText = "Login berhasil!";

    setTimeout(function() {
      window.location.href = "dashboard.html";
    }, 1000);
  } else {
    msg.className = "message error";
    msg.innerText = "Email atau password salah!";
  }
}

    function toggleDark() {
      document.body.classList.toggle('dark');
    }

    const genreChart = new Chart(document.getElementById('genreChart'), {
      type: 'doughnut',
      data: {
        labels: ['Programming', 'Novel', 'History', 'Self Improvement'],
        datasets: [{
          data: [35, 25, 15, 25],
          backgroundColor: ['#6b7280', '#9ca3af', '#4b5563', '#d1d5db']
        }]
      }
    });

    const progressChart = new Chart(document.getElementById('progressChart'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
        datasets: [{
          label: 'Buku Dibaca',
          data: [2, 5, 3, 6, 4, 8],
          backgroundColor: '#6b7280',
          borderRadius: 10
        }]
      },
      options: {
        responsive: true
      }
    });

// ========= dashboard.html =========
if (document.body.classList.contains("dashboard")) {

let dataTerhapus = null;
let buku = JSON.parse(localStorage.getItem("buku")) || [];

const tbody = document.getElementById("data-buku");

// ================= TAMPILKAN BUKU =================
function tampilkanBuku(data = buku) {

    tbody.innerHTML = "";

    data.forEach((item, index) => {

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

    updateDashboard();
}

// ================= UPDATE CARD =================
function updateDashboard() {

    // Total Buku
    document.getElementById("total-buku").innerText = buku.length;

    // Total Kategori
    const kategoriUnik = [
        ...new Set(buku.map(item => item.kategori))
    ];

    document.getElementById("total-kategori").innerText =
        kategoriUnik.length;

    // Total User
    document.getElementById("total-user").innerText = 30;
}

// ================= HAPUS =================
function hapusBuku(index) {

    let yakin = confirm("Yakin ingin menghapus buku?");

    if (yakin) {

        // Simpan data sementara
        dataTerhapus = {
            data: buku[index],
            index: index
        };

        // Hapus data
        buku.splice(index, 1);

        // Update localStorage
        localStorage.setItem("buku", JSON.stringify(buku));

        // Render ulang
        tampilkanBuku();

        // Tampilkan undo
        tampilkanUndo();
    }
}

// ================= UNDO =================
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

// ================= TAMPILKAN UNDO =================
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

// ========= DARK MODE =========

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
}


// ========= LOAD DARK MODE =========

window.addEventListener("DOMContentLoaded", function () {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
  }
});

window.addEventListener("load", function() {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});


// ========= SEARCH BUKU =========

function searchBuku() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toLowerCase();
  const rows = document.querySelectorAll("#data-buku tr");

  rows.forEach(function(row) {
    const text = row.innerText.toLowerCase();
    if (text.includes(filter)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}


// ========= SHOW PASSWORD =========

function togglePassword(id, element) {
  const input = document.getElementById(id);
  if (input.type === "password") {
    input.type = "text";
    element.innerText = "🙈";
  } else {
    input.type = "password";
    element.innerText = "👁";
  }
}

// ========= LOAD DATA =========
tampilkanBuku();
}


// ========= add-book.html =========

let buku = JSON.parse(localStorage.getItem("buku")) || [];

const judulInput = document.getElementById("judul");
const penulisInput = document.getElementById("penulis");
const episodeInput = document.getElementById("episode");


// ========= TAMBAH DATA =========

function tambahData() {

    if (
        judulInput.value.trim() === "" ||
        penulisInput.value.trim() === "" ||
        episodeInput.value.trim() === ""
    ) {
        alert("Semua input harus diisi!");
        return;
    }

    const dataBaru = {
        judul: judulInput.value,
        penulis: penulisInput.value,
        tahun: episodeInput.value,
        kategori: "Progress"
    };

    buku.push(dataBaru);

    localStorage.setItem("buku", JSON.stringify(buku));

    alert("Buku berhasil ditambahkan!");

    window.location.href = "dashboard.html";
}

// ========= GLOBAL FUNCTION =========
window.tambahData = tambahData;



// ========= DETAIL BOOK =========

const detailIndex = localStorage.getItem("detailBukuIndex");
const detailJudul = document.getElementById("detailJudul");
const detailEpisode = document.getElementById("detailEpisode");
const detailPenulis = document.getElementById("detailPenulis");
const detailTahun = document.getElementById("detailTahun");
const detailKategori = document.getElementById("detailKategori");

// Render data detail saat halaman detail dibuka
if (detailIndex !== null && detailJudul && detailEpisode) {
  const dataAktif = buku[detailIndex];
  
  if (dataAktif) {
    detailJudul.innerText = dataAktif.judul;
    detailEpisode.innerText = dataAktif.tahun;
    detailPenulis.innerText = dataAktif.penulis;
    detailTahun.innerText = dataAktif.tahun;
    detailKategori.innerText = dataAktif.kategori;
  } else {
    detailJudul.innerText = "Data tidak ditemukan";
    detailEpisode.innerText = "-";
  }
}

// Fungsi Edit khusus untuk Halaman Detail
function editProgressDetail() {
  if (detailIndex === null) return;

  const data = buku[detailIndex];
  const judulBaru = prompt("Edit Judul", data.judul);
  const episodeBaru = prompt("Edit Progress", data.episode);

  if (judulBaru === null || episodeBaru === null || judulBaru === "" || episodeBaru === "") {
    return;
  }

  buku[detailIndex] = {
    judul: judulBaru,
    episode: episodeBaru
  };

  localStorage.setItem("buku", JSON.stringify(buku));
  
  // Update tampilan langsung di web luar tanpa reload penuh
  detailJudul.innerText = judulBaru;
  detailEpisode.innerText = episodeBaru;
}

// Fungsi Hapus khusus untuk Halaman Detail
function hapusProgressDetail() {
  if (detailIndex === null) return;

  const yakin = confirm("Yakin ingin menghapus progress ini?");
  if (yakin) {
    buku.splice(detailIndex, 1);
    localStorage.setItem("progressBuku", JSON.stringify(progressBuku));
    localStorage.removeItem("detailBukuIndex"); // hapus tracker index aktif
    
    alert("Data berhasil dihapus!");
    window.location.href = "dashboard.html"; // Redirect ke dashboard setelah hapus
  }
}