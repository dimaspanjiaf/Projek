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

// ========= DARK MODE =========

// ========= DARK MODE =========

function toggleDarkMode() {

  const body = document.body;

  body.classList.toggle("dark-mode");

  // simpan status
  if (body.classList.contains("dark-mode")) {

    localStorage.setItem(
      "darkMode",
      "enabled"
    );

  } else {

    localStorage.setItem(
      "darkMode",
      "disabled"
    );
  }
}


// ========= LOAD DARK MODE =========

window.addEventListener("DOMContentLoaded", function () {

  const darkMode =
    localStorage.getItem("darkMode");

  if (darkMode === "enabled") {

    document.body.classList.add("dark-mode");
  }
});

window.addEventListener("load", function() {

  if (
    localStorage.getItem("darkMode")
    === "enabled"
  ) {

    document.body.classList.add("dark-mode");
  }
});


// ========= SEARCH BUKU =========

function searchBuku() {

  const input =
    document.getElementById("searchInput");

  const filter =
    input.value.toLowerCase();

  const rows =
    document.querySelectorAll("#data-buku tr");

  rows.forEach(function(row) {

    const text =
      row.innerText.toLowerCase();

    if (text.includes(filter)) {

      row.style.display = "";

    } else {

      row.style.display = "none";
    }
  });
}


// ========= SHOW PASSWORD =========

function togglePassword(id, element) {

  const input =
    document.getElementById(id);

  if (input.type === "password") {

    input.type = "text";

    element.innerText = "🙈";

  } else {

    input.type = "password";

    element.innerText = "👁";
  }
}
// ========= add-book.html =========

// ambil data progress
let progressBuku =
  JSON.parse(localStorage.getItem("progressBuku")) || [];

// cek apakah elemen add-book ada
const judulInput =
  document.getElementById("judul");

const episodeInput =
  document.getElementById("episode");

const list =
  document.getElementById("list");


// tampilkan data saat halaman dibuka
if (list) {
  tampilkanProgress();
}


// ========= TAMBAH DATA =========

function tambahData() {

  const judul =
    judulInput.value;

  const episode =
    episodeInput.value;

  // validasi
  if (judul === "" || episode === "") {

    alert("Semua data wajib diisi!");

    return;
  }

  // simpan data
  progressBuku.push({
    judul: judul,
    episode: episode
  });

  // simpan localStorage
  localStorage.setItem(
    "progressBuku",
    JSON.stringify(progressBuku)
  );

  // reset input
  judulInput.value = "";
  episodeInput.value = "";

  // refresh tampilan
  tampilkanProgress();
}


// ========= TAMPILKAN DATA =========

function tampilkanProgress() {

  if (!list) return;

  list.innerHTML = "";

  if (progressBuku.length === 0) {

    list.innerHTML = `
      <div class="item">
        <p>Belum ada progress.</p>
      </div>
    `;

    return;
  }

  progressBuku.forEach(function(item, index) {

    list.innerHTML += `

      <div class="item">

        <h3>${item.judul}</h3>

        <p>
          Progress Episode:
          <strong>${item.episode}</strong>
        </p>

        <div class="aksi">

          <button
            class="btn-edit"
            onclick="editProgress(${index})">

            Edit

          </button>

          <button
            class="btn-hapus"
            onclick="hapusProgress(${index})">

            Hapus

          </button>

        </div>

      </div>

    `;
  });
}


// ========= HAPUS =========

function hapusProgress(index) {

  const yakin =
    confirm("Yakin ingin menghapus?");

  if (yakin) {

    progressBuku.splice(index, 1);

    localStorage.setItem(
      "progressBuku",
      JSON.stringify(progressBuku)
    );

    tampilkanProgress();
  }
}


// ========= EDIT =========

function editProgress(index) {

  const data =
    progressBuku[index];

  const judulBaru =
    prompt("Edit Judul", data.judul);

  const episodeBaru =
    prompt("Edit Progress", data.episode);

  if (
    judulBaru === null ||
    episodeBaru === null
  ) {
    return;
  }

  progressBuku[index] = {
    judul: judulBaru,
    episode: episodeBaru
  };

  localStorage.setItem(
    "progressBuku",
    JSON.stringify(progressBuku)
  );

  tampilkanProgress();
}