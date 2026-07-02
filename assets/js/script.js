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

  if (email === "" || password === "") {
    msg.className = "message error";
    msg.innerText = "Email dan password wajib diisi!";
    return;
  }

  const user = users.find(function(u) {
    return u.email === email && u.password === password;
  });

  if (user) {
    msg.className = "message success";
    msg.innerText = "Login sukses! Mengalihkan...";

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    setTimeout(function() {
      window.location.href = "dashboard.html";
    }, 1500);
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

// MENGUBAH LOGIN MENJADI LOG OUT 
function handleAuthMenu() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const sidebarLinks = document.querySelectorAll(".sidebar .menu");
  
  sidebarLinks.forEach(function(link) {
    if (link.getAttribute("href") === "login.html") {
      
      if (isLoggedIn === "true") {
        link.innerHTML = "Log Out";
        link.setAttribute("href", "#"); 
        link.classList.remove("active"); 
        link.onclick = function(e) {
          e.preventDefault();
          
          const konfirmasi = confirm("Apakah kamu yakin ingin keluar?");
          if (konfirmasi) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUser");
            
            alert("Kamu berhasil log out!");
            window.location.href = "index.html"; 
          }
        };
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", handleAuthMenu);




// ================= DASHBOARD =================

if (document.body.classList.contains("dashboard-page")) {

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const teksSapaan = document.getElementById("teksSapaan");
  if (currentUser && currentUser.name && teksSapaan) {
      teksSapaan.innerText = `Selamat Datang, ${currentUser.name} 👋`;
  }

  let buku = JSON.parse(localStorage.getItem("buku")) || [];
  let dataTerhapus = null;

  const tbody = document.getElementById("data-buku");

  function tampilkanBuku(data = buku) {

    tbody.innerHTML = "";

    if (data.length === 0) {

      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;">
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

    <td>
        ${item.episode}
    </td>

    <td>
        ${item.genre}
    </td>

    <td>
        ${item.platform}
    </td>

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

    window.detailBuku = detailBuku;

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

const episodeInput =
  document.getElementById("episode");

const genreInput =
  document.getElementById("genre");

const platformInput =
  document.getElementById("platform");

const statusInput =
  document.getElementById("status");

const progressInput =
  document.getElementById("progress");


// =========================
// TAMBAH DATA
// =========================

function tambahData() {

  const judulInput = document.getElementById("judul");
  const episodeInput = document.getElementById("episode");
  const genreInput = document.getElementById("genre");
  const platformInput = document.getElementById("platform");
  const statusInput = document.getElementById("status");
  const progressInput = document.getElementById("progress");

  let buku = JSON.parse(localStorage.getItem("buku")) || [];

  // Validasi input
  if (
    judulInput.value.trim() === "" ||
    episodeInput.value.trim() === "" ||
    genreInput.value.trim() === "" ||
    platformInput.value.trim() === "" ||
    statusInput.value.trim() === "" ||
    progressInput.value.trim() === ""
  ) {
    alert("Semua input wajib diisi!");
    return;
  }

  // Validasi episode
  if (Number(episodeInput.value) < 0) {
    alert("Episode tidak boleh kurang dari 0!");
    return;
  }

  // Validasi progress
  if (
    Number(progressInput.value) < 0 ||
    Number(progressInput.value) > 100
  ) {
    alert("Progress harus berada di antara 0% hingga 100%!");
    return;
  }

  // Data baru
  const dataBaru = {
    judul: judulInput.value,
    episode: episodeInput.value,
    genre: genreInput.value,
    platform: platformInput.value,
    status: statusInput.value,
    progress: Number(progressInput.value)
  };

  // Simpan ke localStorage
  buku.push(dataBaru);
  localStorage.setItem("buku", JSON.stringify(buku));

  alert("Buku berhasil ditambahkan!");

  // Kosongkan form
  judulInput.value = "";
  episodeInput.value = "";
  genreInput.value = "";
  platformInput.value = "";
  statusInput.value = "";
  progressInput.value = "";

  // Pindah ke dashboard
  window.location.href = "dashboard.html";
}

// GLOBAL
window.tambahData = tambahData;



// =========================
// DETAIL BOOK
// =========================

const buku =
  JSON.parse(localStorage.getItem("buku")) || [];

const urlParams = new URLSearchParams(window.location.search);
const detailIndex = urlParams.get("id");

const detailJudul = document.getElementById("detailJudul");
const detailEpisode = document.getElementById("detailEpisode");
const detailGenre = document.getElementById("detailGenre");
const detailPlatform = document.getElementById("detailPlatform");
const detailStatus = document.getElementById("detailStatus");
const detailProgress = document.getElementById("detailProgress");

if (
    detailIndex !== null &&
    detailJudul &&
    detailEpisode
) {

    const data = buku[detailIndex];

    if (data) {

        detailJudul.innerText = data.judul;
        detailEpisode.innerText = data.episode;
        detailGenre.innerText = data.genre;
        detailPlatform.innerText = data.platform;
        detailStatus.innerText = data.status;
        detailProgress.innerText = data.progress;

    } else {

        detailJudul.innerText = "Data tidak ditemukan";
        detailEpisode.innerText = "-";
        detailGenre.innerText = "-";
        detailPlatform.innerText = "-";
        detailStatus.innerText = "-";
        detailProgress.innerText = "-";

    }

}

// =========================
// EDIT DETAIL BOOK
// =========================
function editProgressDetail() {

  if (detailIndex === null) return;

  const data = buku[detailIndex];

  const judulBaru = prompt("Edit Judul", data.judul);
  if (judulBaru === null) return;

  const episodeBaru = prompt("Edit Episode", data.episode);
  if (episodeBaru === null) return;

  const genreBaru = prompt("Edit Genre", data.genre);
  if (genreBaru === null) return;

  const platformBaru = prompt("Edit Platform", data.platform);
  if (platformBaru === null) return;

  const statusBaru = prompt(
    "Edit Status (Sedang Dibaca / Selesai / Wishlist)",
    data.status
  );
  if (statusBaru === null) return;

  const progressBaru = prompt(
    "Edit Progress (0 - 100)",
    data.progress
  );
  if (progressBaru === null) return;

  if (progressBaru < 0 || progressBaru > 100) {
    alert("Progress harus 0 - 100%");
    return;
  }

  // Simpan perubahan
  buku[detailIndex].judul = judulBaru;
  buku[detailIndex].episode = episodeBaru;
  buku[detailIndex].genre = genreBaru;
  buku[detailIndex].platform = platformBaru;
  buku[detailIndex].status = statusBaru;
  buku[detailIndex].progress = Number(progressBaru);

  localStorage.setItem("buku", JSON.stringify(buku));

  // Update tampilan
  detailJudul.innerText = judulBaru;
  detailEpisode.innerText = episodeBaru;
  detailGenre.innerText = genreBaru;
  detailPlatform.innerText = platformBaru;
  detailStatus.innerText = statusBaru;
  detailProgress.innerText = progressBaru + "%";

  alert("Data berhasil diperbarui!");
}

window.editProgressDetail = editProgressDetail;


// ================= HAPUS DETAIL BOOK ====================//
function hapusProgressDetail() {

  if (detailIndex === null) return;

  const yakin = confirm("Yakin ingin menghapus buku ini?");

  if (!yakin) return;

  buku.splice(detailIndex, 1);

  localStorage.setItem("buku", JSON.stringify(buku));

  alert("Data berhasil dihapus!");

  window.location.href = "dashboard.html";
}

window.hapusProgressDetail = hapusProgressDetail;




// ================= DARK MODE =================
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const btn = document.querySelector(".dark-btn");

  if (document.body.classList.contains("dark-mode")) {
    if (btn) btn.innerHTML = "☀️ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    if (btn) btn.innerHTML = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const btn = document.querySelector(".dark-btn");

  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    if (btn) btn.innerHTML = "☀️ Light Mode";
  }
});