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


// ========= dashboard.html =========

let dataTerhapus = null;
let buku = JSON.parse(localStorage.getItem("buku")) || [
    { judul: "Laskar Pelangi", penulis: "Andrea Hirata", tahun: 2005, kategori: "Novel" },
    { judul: "Bumi", penulis: "Tere Liye", tahun: 2014, kategori: "Fiksi" },
    { judul: "Atomic Habits", penulis: "James Clear", tahun: 2018, kategori: "Self Improvement" }
];

const tbody = document.getElementById("data-buku");


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


// ========= add-book.html =========

let progressBuku = JSON.parse(localStorage.getItem("progressBuku")) || [];

const judulInput = document.getElementById("judul");
const episodeInput = document.getElementById("episode");


// ========= TAMBAH DATA =========

function tambahData() {
  const judul = judulInput.value;
  const episode = episodeInput.value;

  if (judul === "" || episode === "") {
    alert("Semua data wajib diisi!");
    return;
  }

  const dataBaru = {
    judul: judul,
    episode: episode
  };

  progressBuku.push(dataBaru);
  localStorage.setItem("progressBuku", JSON.stringify(progressBuku));

  // Simpan index data yang baru saja ditambahkan untuk dipakai di halaman detail
  const indexBaru = progressBuku.length - 1;
  localStorage.setItem("detailBukuIndex", indexBaru);

  window.location.href = "detail-book.html";
}


// ========= DETAIL BOOK =========

const detailIndex = localStorage.getItem("detailBukuIndex");
const detailJudul = document.getElementById("detailJudul");
const detailEpisode = document.getElementById("detailEpisode");

// Render data detail saat halaman detail dibuka
if (detailIndex !== null && detailJudul && detailEpisode) {
  const dataAktif = progressBuku[detailIndex];
  
  if (dataAktif) {
    detailJudul.innerText = dataAktif.judul;
    detailEpisode.innerText = dataAktif.episode;
  } else {
    detailJudul.innerText = "Data tidak ditemukan";
    detailEpisode.innerText = "-";
  }
}

// Fungsi Edit khusus untuk Halaman Detail
function editProgressDetail() {
  if (detailIndex === null) return;

  const data = progressBuku[detailIndex];
  const judulBaru = prompt("Edit Judul", data.judul);
  const episodeBaru = prompt("Edit Progress", data.episode);

  if (judulBaru === null || episodeBaru === null || judulBaru === "" || episodeBaru === "") {
    return;
  }

  progressBuku[detailIndex] = {
    judul: judulBaru,
    episode: episodeBaru
  };

  localStorage.setItem("progressBuku", JSON.stringify(progressBuku));
  
  // Update tampilan langsung di web luar tanpa reload penuh
  detailJudul.innerText = judulBaru;
  detailEpisode.innerText = episodeBaru;
}

// Fungsi Hapus khusus untuk Halaman Detail
function hapusProgressDetail() {
  if (detailIndex === null) return;

  const yakin = confirm("Yakin ingin menghapus progress ini?");
  if (yakin) {
    progressBuku.splice(detailIndex, 1);
    localStorage.setItem("progressBuku", JSON.stringify(progressBuku));
    localStorage.removeItem("detailBukuIndex"); // hapus tracker index aktif
    
    alert("Data berhasil dihapus!");
    window.location.href = "dashboard.html"; // Redirect ke dashboard setelah hapus
  }
}