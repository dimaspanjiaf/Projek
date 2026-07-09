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
    localStorage.setItem("lastLogin", new Date().toLocaleString("id-ID")
);

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

const reminderBox = document.getElementById("reminderBox");

if (reminderBox) {

    const terakhir = localStorage.getItem("lastRead");

    if (terakhir) {

        const selisihHari = Math.floor(
            (Date.now() - Number(terakhir)) /
            (1000 * 60 * 60 * 24)
        );

        if (selisihHari >= 3) {

            reminderBox.innerHTML =
            "🔔 Sudah " + selisihHari +
            " hari sejak terakhir menambahkan bacaan. Yuk lanjut membaca!";

        } else {

            reminderBox.innerHTML =
            "📖 Selamat! Kamu masih aktif mencatat bacaan.";

        }

    } else {

        reminderBox.innerHTML =
        "📚 Tambahkan buku pertamamu.";

    }

}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const teksSapaan = document.getElementById("teksSapaan");

if (teksSapaan) {

    const jam = new Date().getHours();
    let salam = "";

    if (jam >= 4 && jam < 11) {
        salam = "🌞 Selamat Pagi";
    } else if (jam >= 11 && jam < 15) {
        salam = "☀️ Selamat Siang";
    } else if (jam >= 15 && jam < 18) {
        salam = "🌇 Selamat Sore";
    } else {
        salam = "🌙 Selamat Malam";
    }

    const lastLogin = localStorage.getItem("lastLogin");

    const lastLoginElement = document.getElementById("lastLogin");

      if (lastLoginElement) {

      if (lastLogin) {
        lastLoginElement.innerText = lastLogin;
      } else {
        lastLoginElement.innerText = "Belum pernah login";
      }

}
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser && currentUser.name) {
        teksSapaan.innerText = `${salam}, ${currentUser.name} 👋`;
    } else {
        teksSapaan.innerText = `${salam} 👋`;
    }
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
  localStorage.setItem("lastRead", Date.now());

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
        detailJudul.value = data.judul;
        detailEpisode.value = data.episode;
        detailGenre.value = data.genre;
        detailPlatform.value = data.platform;
        detailStatus.value = data.status;
        detailProgress.value = data.progress;
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

    detailJudul.readOnly = false;
    detailEpisode.readOnly = false;
    detailGenre.readOnly = false;
    detailPlatform.readOnly = false;
    detailProgress.readOnly = false;
    detailStatus.disabled = false;

    const input = document.querySelectorAll(".detail-input");

    input.forEach((el) => {
        el.classList.remove("view");
        el.classList.add("edit");
    });

    const btnEdit = document.querySelector(".btn-edit");
    const btnHapus = document.querySelector(".btn-hapus");

    btnEdit.innerHTML = "Simpan";
    btnEdit.onclick = simpanEdit;

    btnHapus.innerHTML = "Batal";
    btnHapus.onclick = batalEdit;
}

function simpanEdit(){
    if(detailProgress.value < 0 || detailProgress.value > 100){
        alert("Progress harus 0-100%");
        return;
    }

    buku[detailIndex].judul = detailJudul.value;
    buku[detailIndex].episode = detailEpisode.value;
    buku[detailIndex].genre = detailGenre.value;
    buku[detailIndex].platform = detailPlatform.value;
    buku[detailIndex].status = detailStatus.value;
    buku[detailIndex].progress = Number(detailProgress.value);

    localStorage.setItem(
        "buku",
        JSON.stringify(buku)
    );

    detailJudul.readOnly = true;
    detailEpisode.readOnly = true;
    detailGenre.readOnly = true;
    detailPlatform.readOnly = true;
    detailProgress.readOnly = true;
    detailStatus.disabled = true;

    const btnEdit = document.querySelector(".btn-edit");
    const btnHapus = document.querySelector(".btn-hapus");

    btnEdit.innerHTML = "Edit";
    btnEdit.onclick = editProgressDetail;
    
    btnHapus.innerHTML = "Hapus";
    btnHapus.onclick = hapusProgressDetail;

    alert("Data berhasil diperbarui!");

    window.location.href = "dashboard.html";
}

window.editProgressDetail = editProgressDetail;
window.simpanEdit = simpanEdit;

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

// ================= CLOCK =================
function updateClock(){

const clock=document.getElementById("clock");

if(!clock)return;

const now=new Date();

clock.innerHTML=

now.toLocaleTimeString("id-ID")+"<br>"+

now.toLocaleDateString("id-ID",{

weekday:"long",

day:"numeric",

month:"long",

year:"numeric"

});

}

setInterval(updateClock,1000);

updateClock();


// ================= PASSWORD STRENGTH =================

function cekPassword(){

    const password =
    document.getElementById("regPass");

    const hasil =
    document.getElementById("passwordStrength");

    if(!password || !hasil) return;

    const value=password.value;

    if(value.length==0){

        hasil.innerHTML="";
        return;

    }

    if(value.length<6){

        hasil.innerHTML="🔴 Password Lemah";
        hasil.style.color="red";

    }
    else if(value.length<8){

        hasil.innerHTML="🟡 Password Sedang";
        hasil.style.color="orange";

    }
    else{

        hasil.innerHTML="🟢 Password Kuat";
        hasil.style.color="green";

    }

}


// ================= CAPS LOCK WARNING =================

function cekCaps(e){

const warning=
document.getElementById("capsWarning");

if(!warning) return;

if(e.getModifierState("CapsLock")){

warning.innerHTML="⚠ Caps Lock aktif";

}
else{

warning.innerHTML="";

}

}


// ================= DASHBOARD STATS =================
const totalUser =
document.getElementById("totalUser");

const totalBook =
document.getElementById("totalBook");

const totalPlatform =
document.getElementById("totalPlatform");

if(totalUser){

const users=
JSON.parse(localStorage.getItem("users"))||[];

const buku=
JSON.parse(localStorage.getItem("buku"))||[];

const platform=[
...new Set(
buku.map(item=>item.platform)
)
];

totalUser.innerHTML=users.length;
totalBook.innerHTML=buku.length;
totalPlatform.innerHTML=platform.length;
}