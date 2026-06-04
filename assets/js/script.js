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

//  Hide Password
function togglePassword(inputId, element) {
  const passwordInput = document.getElementById(inputId);
  
  if (passwordInput) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      element.innerText = "🙈"; 
    } else {
      passwordInput.type = "password";
      element.innerText = "👁"; // 
    }
  }
}
window.togglePassword = togglePassword;


// ================= DASHBOARD =================

if (document.body.classList.contains("dashboard-page")) {

  let buku = JSON.parse(localStorage.getItem("buku")) || [];

  let dataTerhapus = null;

  const tbody = document.getElementById("data-buku");

  function tampilkanBuku(data = buku) {

    tbody.innerHTML = "";

    if (data.length === 0) {

      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">
            Belum ada buku ditambahkan
          </td>
        </tr>
      `;

      return;
    }

    data.forEach((item, index) => {

      tbody.innerHTML += `
      
      <tr>

        <td>
          <strong>${item.judul}</strong>
        </td>

        <td>${item.penulis}</td>

        <td>
          <span class="badge reading">
            ${item.status}
          </span>
        </td>

        <td>

          <div class="progress-wrap">

            ${item.progress}%

            <div class="progress-bar">

              <div 
                class="progress"
                style="width:${item.progress}%">
              </div>

            </div>

          </div>

        </td>

<td class="actions">
          <button
            class="btn-detail"
            onclick="detailBuku(${item.originalIndex !== undefined ? item.originalIndex : index})">
            Detail
          </button>

          <button
            class="btn-delete"
            onclick="hapusBuku(${item.originalIndex !== undefined ? item.originalIndex : index})">
            Delete
          </button>
        </td>

      </tr>

      `;
    });

    updateCard();
    renderChart();
  }

  // ================= UPDATE CARD =================

  function updateCard() {

    document.getElementById("totalBuku").innerText =
      buku.length;

    const selesai =
      buku.filter(item => item.status === "Selesai").length;

    const dibaca =
      buku.filter(item => item.status === "Sedang Dibaca").length;

    const wishlist =
      buku.filter(item => item.status === "Wishlist").length;

    document.getElementById("selesaiBuku").innerText =
      selesai;

    document.getElementById("dibacaBuku").innerText =
      dibaca;

    document.getElementById("wishlistBuku").innerText =
      wishlist;
  }

  // ================= HAPUS =================

  function hapusBuku(index) {

    const yakin = confirm(
      "Yakin ingin menghapus buku?"
    );

    if (yakin) {

      dataTerhapus = {
        data: buku[index],
        index: index
      };

      buku.splice(index, 1);

      localStorage.setItem(
        "buku",
        JSON.stringify(buku)
      );

      renderChart();
      updateCard();

      tampilkanUndo();

      tampilkanBuku();
    }
  }

  window.hapusBuku = hapusBuku;

  function tampilkanUndo() {

  const undoBox =
    document.getElementById("undoBox");

  undoBox.innerHTML = `

    <div class="undo-alert">

      Buku berhasil dihapus

      <button onclick="undoHapus()">
        Undo
      </button>

    </div>

  `;
}

function undoHapus() {

  if (dataTerhapus !== null) {

    buku.splice(
      dataTerhapus.index,
      0,
      dataTerhapus.data
    );

    localStorage.setItem(
      "buku",
      JSON.stringify(buku)
    );

    renderChart();
    updateCard();

    document.getElementById(
      "undoBox"
    ).innerHTML = "";

    dataTerhapus = null;

    tampilkanBuku();

    renderChart();
    updateCard();
  }
}

window.undoHapus = undoHapus;

  function detailBuku(index) {

  window.location.href =
    `detail-book.html?id=${index}`;
}

window.detailBuku = detailBuku;

  // ================= SEARCH =================

  function searchBuku() {

    const keyword =
      document.getElementById("searchInput")
      .value
      .toLowerCase();

const hasil = buku
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter(item => item.judul.toLowerCase().includes(keyword));

    tampilkanBuku(hasil);
  }

  window.searchBuku = searchBuku;

  
  // ================= CHART =================

let genreChartInstance;
let progressChartInstance;

function renderChart() {

  const selesai =
    buku.filter(item => item.status === "Selesai").length;

  const dibaca =
    buku.filter(item => item.status === "Sedang Dibaca").length;

  const wishlist =
    buku.filter(item => item.status === "Wishlist").length;

  // HAPUS CHART LAMA
  if (genreChartInstance) {
    genreChartInstance.destroy();
  }

  if (progressChartInstance) {
    progressChartInstance.destroy();
  }

  // DOUGHNUT CHART
  genreChartInstance = new Chart(
    document.getElementById("genreChart"),
    {

      type: "doughnut",

      data: {

        labels: [
          "Selesai",
          "Sedang Dibaca",
          "Wishlist"
        ],

        datasets: [{
          data: [
            selesai,
            dibaca,
            wishlist
          ],

          backgroundColor: [
            "#4b5563",
            "#6b7280",
            "#9ca3af"
          ]
        }]
      }
    }
  );

  // BAR CHART
  progressChartInstance = new Chart(
    document.getElementById("progressChart"),
    {

      type: "bar",

      data: {

        labels: buku.map(item => item.judul),

        datasets: [{

          label: "Progress",

          data: buku.map(item => item.progress),

          backgroundColor: "#6b7280",

          borderRadius: 10
        }]
      }
    }
  );
}
  tampilkanBuku();
}



// =========================
// ADD BOOK
// =========================

const judulInput =
  document.getElementById("judul");

const penulisInput =
  document.getElementById("penulis");

const episodeInput =
  document.getElementById("episode");

const genreInput =
  document.getElementById("genre");

const kategoriInput =
  document.getElementById("kategori");

const progressInput =
  document.getElementById("progress");

// =========================
// TAMBAH DATA
// =========================

function tambahData() {

  const buku =
    JSON.parse(localStorage.getItem("buku")) || [];

  if (

    judulInput.value.trim() === "" ||
    penulisInput.value.trim() === "" ||
    episodeInput.value.trim() === "" ||
    genreInput.value.trim() === "" ||
    kategoriInput.value.trim() === "" ||
    progressInput.value.trim() === ""

  ) {

    alert("Semua input wajib diisi!");

    return;
  }
if (Number(episodeInput.value) < 0)
{
  alert("Episode tidak boleh kurang dari 0!");
  return;
}
const dataBaru = {

  judul:
    judulInput.value,

  penulis:
    penulisInput.value,

  episode:
    episodeInput.value,

  genre:
    genreInput.value,

  status:
    kategoriInput.value,

  progress:
    Number(progressInput.value)
};
  buku.push(dataBaru);

  localStorage.setItem(
    "buku",
    JSON.stringify(buku)
  );

  alert("Buku berhasil ditambahkan!");

  window.location.href =
    "dashboard.html";
}

// GLOBAL
window.tambahData = tambahData;

const buku =
  JSON.parse(localStorage.getItem("buku")) || [];


// ========= DETAIL BOOK =========

const urlParams = new URLSearchParams(window.location.search);
const detailIndex = urlParams.get('id');

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
    detailEpisode.innerText = dataAktif.episode;
    detailPenulis.innerText = dataAktif.penulis;
    detailKategori.innerText = dataAktif.status;
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

 buku[detailIndex].judul = judulBaru;
buku[detailIndex].episode = episodeBaru;
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
   localStorage.setItem("buku", JSON.stringify(buku));
    localStorage.removeItem("detailBukuIndex"); // hapus tracker index aktif
    
    alert("Data berhasil dihapus!");
    window.location.href = "dashboard.html"; // Redirect ke dashboard setelah hapus
  }
}
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  // simpan pilihan user
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
});   
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const btn = document.querySelector(".dark-btn");

  if (document.body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
}