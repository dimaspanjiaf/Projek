// ========= SEMUA HALAMAN & MANAJEMEN DATA =========

// Inisialisasi BroadcastChannel untuk Sinkronisasi Antar Tab (Realtime Client-Side)
const syncChannel = new BroadcastChannel("library_sync");

function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  
  // Jika data buku yang berubah, kirim sinyal realtime ke tab lain
  if (key === "buku") {
    syncChannel.postMessage({ type: "DATA_UPDATED" });
  }
}

// Mendengarkan sinyal dari tab lain secara Realtime
syncChannel.onmessage = (event) => {
  if (event.data.type === "DATA_UPDATED") {
    console.log("Menerima sinyal realtime: Data di tab lain berubah. Memperbarui UI...");
    
    // Ambil data buku terbaru dari localStorage untuk tab ini
    if (document.body.classList.contains("dashboard-page")) {
      buku = getData("buku"); 
      if (typeof tampilkanBuku === "function") {
        tampilkanBuku(); // Update tabel dan counter secara realtime
      }
    }
    
    // Update counter statistik global di halaman About jika ada
    if (document.getElementById("totalUser")) {
      updateGlobalStats();
    }
  }
};

// ================= PROTEKSI HALAMAN RAHASIA (ROUTE GUARD) =================
function proteksiHalaman() {
  // Daftar halaman yang WAJIB login terlebih dahulu sebelum masuk
  const halamanRahasia = ["dashboard.html", "add-book.html", "detail-book.html"];
  
  // Ambil nama file HTML yang sedang dibuka saat ini
  const halamanSekarang = window.location.pathname.split("/").pop();

  // Jika halaman masuk dalam daftar rahasia, cek status loginnya
  if (halamanRahasia.includes(halamanSekarang)) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Jika belum login, tendang balik ke login.html
    if (isLoggedIn !== "true") {
      alert("Akses ditolak! Kamu harus login terlebih dahulu untuk mengakses halaman ini.");
      window.location.href = "login.html";
    }
  }
}
// Jalankan fungsi proteksi langsung saat halaman dimuat browser
document.addEventListener("DOMContentLoaded", proteksiHalaman);


// ========= login.html LOGIC =========

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
    localStorage.setItem("lastLogin", new Date().toLocaleString("id-ID"));

    setTimeout(function() {
      window.location.href = "dashboard.html";
    }, 1500);
  } else {
    msg.className = "message error";
    msg.innerText = "Email atau password salah!";
  }
}

// Hide / Show Password
function togglePassword(inputId, element) {
  const passwordInput = document.getElementById(inputId);
  
  if (passwordInput) {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      element.innerText = "🙈"; 
    } else {
      passwordInput.type = "password";
      element.innerText = "👁"; 
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


// ================= DASHBOARD PAGE LOGIC =================
let buku = getData("buku");
let dataTerhapus = null;

if (document.body.classList.contains("dashboard-page")) {

  const reminderBox = document.getElementById("reminderBox");
  if (reminderBox) {
    const terakhir = localStorage.getItem("lastRead");
    if (terakhir) {
      const selisihHari = Math.floor((Date.now() - Number(terakhir)) / (1000 * 60 * 60 * 24));
      if (selisihHari >= 3) {
        reminderBox.innerHTML = `🔔 Sudah ${selisihHari} hari sejak terakhir menambahkan bacaan. Yuk lanjut membaca!`;
      } else {
        reminderBox.innerHTML = "📖 Selamat! Kamu masih aktif mencatat bacaan.";
      }
    } else {
      reminderBox.innerHTML = `
    <a href="add-book.html" class="first-book-link">
        📚 Tambahkan buku pertamamu
    </a>
`;
    }
  }

  const teksSapaan = document.getElementById("teksSapaan");
  if (teksSapaan) {
    const jam = new Date().getHours();
    let salam = "";

    if (jam >= 4 && jam < 11) salam = "🌞 Selamat Pagi";
    else if (jam >= 11 && jam < 15) salam = "☀️ Selamat Siang";
    else if (jam >= 15 && jam < 18) salam = "🌇 Selamat Sore";
    else salam = "🌙 Selamat Malam";

    const lastLogin = localStorage.getItem("lastLogin");
    const lastLoginElement = document.getElementById("lastLogin");
    if (lastLoginElement) {
      lastLoginElement.innerText = lastLogin || "Belum pernah login";
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.name) {
      teksSapaan.innerText = `${salam}, ${currentUser.name} 👋`;
    } else {
      teksSapaan.innerText = `${salam} 👋`;
    }
  }

  // RENDER UTAMA TABEL DASHBOARD (Ditingkatkan dengan input realtime)
  const tbody = document.getElementById("data-buku");

  function tampilkanBuku(data = buku) {
    if (!tbody) return;
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;">Belum ada buku ditambahkan</td>
        </tr>
      `;
      updateCard();
      renderChart();
      return;
    }

    data.forEach((item, index) => {
      const actualIndex = item.originalIndex !== undefined ? item.originalIndex : index;
      
      tbody.innerHTML += `
        <tr>
          <td><strong>${item.judul}</strong></td>
          <td>${item.episode}</td>
          <td>${item.genre}</td>
          <td><span class="badge-platform">${item.platform || "-"}</span></td>
          <td>
            <select onchange="updateStatusRealtime(${actualIndex}, this.value)" class="status-select">
              <option value="Sedang Dibaca" ${item.status === "Sedang Dibaca" ? "selected" : ""}>Sedang Dibaca</option>
              <option value="Selesai" ${item.status === "Selesai" ? "selected" : ""}>Selesai</option>
              <option value="Wishlist" ${item.status === "Wishlist" ? "selected" : ""}>Wishlist</option>
            </select>
          </td>
          <td>
            <div class="progress-wrap" style="gap: 5px; display: flex; flex-direction: column;">
              <div style="display:flex; align-items:center; gap:3px;">
                <input type="number" value="${item.progress}" min="0" max="100" 
                  onchange="updateProgressRealtime(${actualIndex}, this.value)" class="progress-inline-input">%
              </div>
              <div class="progress-bar">
                <div class="progress" style="width:${item.progress}%"></div>
              </div>
            </div>
          </td>
          <td class="actions">
            <button class="btn-detail" onclick="detailBuku(${actualIndex})">Detail</button>
            <button class="btn-delete" onclick="hapusBuku(${actualIndex})">Delete</button>
          </td>
        </tr>
      `;
    });

    updateCard();
    renderChart();
  }
  window.tampilkanBuku = tampilkanBuku;

  // ================= UPDATE STATS CARD =================
  function updateCard() {
    if(!document.getElementById("totalBuku")) return;

    document.getElementById("totalBuku").innerText = buku.length;
    const selesai = buku.filter(item => item.status === "Selesai").length;
    const dibaca = buku.filter(item => item.status === "Sedang Dibaca").length;
    const wishlist = buku.filter(item => item.status === "Wishlist").length;

    document.getElementById("selesaiBuku").innerText = selesai;
    document.getElementById("dibacaBuku").innerText = dibaca;
    document.getElementById("wishlistBuku").innerText = wishlist;

   const rata = document.getElementById("averageProgress");
const canvas = document.getElementById("averageProgressChart");

let average = 0;

if (buku.length > 0) {
    const total = buku.reduce(function(total, item) {
        return total + Number(item.progress);
    }, 0);

    average = Math.round(total / buku.length);
}

if (rata) {
    rata.innerHTML = average + "%";
}

if (canvas) {

    if (averageProgressChartInstance) {
        averageProgressChartInstance.destroy();
    }

    averageProgressChartInstance = new Chart(canvas, {

        type: "doughnut",

        data: {
            datasets: [{
                data: [average, 100 - average],
                backgroundColor: [
                    "#18243d",
                    "#e5e7eb"
                ],
                borderWidth: 0
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: "78%",

            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }

    });

}
  }
  

  // ================= REALTIME INLINE UPDATE SYSTEM =================
  window.updateStatusRealtime = function(index, statusBaru) {
    buku[index].status = statusBaru;
    if (statusBaru === "Selesai") {
      buku[index].progress = 100;
    }
    saveData("buku", buku);
    tampilkanBuku();
  };

  window.updateProgressRealtime = function(index, progressBaru) {
    let progValue = Math.min(100, Math.max(0, parseInt(progressBaru) || 0));
    buku[index].progress = progValue;
    if (progValue === 100) {
      buku[index].status = "Selesai";
    } else if (progValue < 100 && buku[index].status === "Selesai") {
      buku[index].status = "Sedang Dibaca";
    }
    saveData("buku", buku);
    tampilkanBuku();
  };

  // ================= ACTION HAPUS & UNDO =================
  function hapusBuku(index) {
    if (confirm("Yakin ingin menghapus buku?")) {
      dataTerhapus = {
        data: buku[index],
        index: index
      };

      buku.splice(index, 1);
      saveData("buku", buku);

      tampilkanUndo();
      tampilkanBuku();
    }
  }
  window.hapusBuku = hapusBuku;

  function tampilkanUndo() {
    const undoBox = document.getElementById("undoBox");
    if (!undoBox) return;
    undoBox.innerHTML = `
      <div class="undo-alert">
        Buku berhasil dihapus
        <button onclick="undoHapus()">Undo</button>
      </div>
    `;
  }

  function undoHapus() {
    if (dataTerhapus !== null) {
      buku.splice(dataTerhapus.index, 0, dataTerhapus.data);
      saveData("buku", buku);

      const undoBox = document.getElementById("undoBox");
      if (undoBox) undoBox.innerHTML = "";

      dataTerhapus = null;
      tampilkanBuku();
    }
  }
  window.undoHapus = undoHapus;

  function detailBuku(index) {
    window.location.href = `detail-book.html?id=${index}`;
  }
  window.detailBuku = detailBuku;

  // ================= SEARCH BUKU =================
  function searchBuku() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const hasil = buku
      .map((item, index) => ({ ...item, originalIndex: index }))
      .filter(item => item.judul.toLowerCase().includes(keyword));
    tampilkanBuku(hasil);
  }
  window.searchBuku = searchBuku;

  // ================= CHART LOGIC =================
  let genreChartInstance;
  let progressChartInstance;
  let platformChartInstance;
  let averageProgressChartInstance;

  function renderChart() {
    const canvasGenre = document.getElementById("genreChart");
    const canvasProgress = document.getElementById("progressChart");
    if (!canvasGenre || !canvasProgress) return;

    const selesai = buku.filter(item => item.status === "Selesai").length;
    const dibaca = buku.filter(item => item.status === "Sedang Dibaca").length;
    const wishlist = buku.filter(item => item.status === "Wishlist").length;

    if (genreChartInstance) genreChartInstance.destroy();
    if (progressChartInstance) progressChartInstance.destroy();

    genreChartInstance = new Chart(canvasGenre, {
      type: "doughnut",
      data: {
        labels: ["Selesai", "Sedang Dibaca", "Wishlist"],
        datasets: [{
          data: [selesai, dibaca, wishlist],
          backgroundColor: ["#4b5563", "#6b7280", "#9ca3af"]
        }]
      }
    });

    progressChartInstance = new Chart(canvasProgress, {
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
    });

    if(platformChartInstance){
    platformChartInstance.destroy();
    }
    const platformData={};

    buku.forEach(function(item){

    if(platformData[item.platform]){
    platformData[item.platform]++;
    }else{
    platformData[item.platform]=1;
    }

    });

    platformChartInstance=new Chart(

    document.getElementById("platformChart"),

    {

    type:"pie",

    data:{

    labels:Object.keys(platformData),

    datasets:[{

    data:Object.values(platformData)

    }]

    }

    }

    );
  }

  // Trigger render awal saat DOM siap
  document.addEventListener("DOMContentLoaded", () => tampilkanBuku());
}


// ================= TAMBAH DATA (add-book.html) =================
function tambahData() {
  const judulInput = document.getElementById("judul");
  const episodeInput = document.getElementById("episode");
  const genreInput = document.getElementById("genre");
  const platformInput = document.getElementById("platform");
  const statusInput = document.getElementById("status");
  const progressInput = document.getElementById("progress");

  if (!judulInput) return; // Mencegah error jika dipanggil di luar halaman add-book

  let daftarBuku = getData("buku");

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

  if (Number(episodeInput.value) < 0) {
    alert("Episode tidak boleh kurang dari 0!");
    return;
  }

  if (Number(progressInput.value) < 0 || Number(progressInput.value) > 100) {
    alert("Progress harus berada di antara 0% hingga 100%!");
    return;
  }

  // Konfirmasi sebelum menyimpan
  const konfirmasi = confirm(
    "Apakah data buku ini sudah benar dan ingin disimpan?"
  );

  if (!konfirmasi) {
    return;
  }

  const dataBaru = {
    judul: judulInput.value,
    episode: episodeInput.value,
    genre: genreInput.value,
    platform: platformInput.value,
    status: statusInput.value,
    progress: Number(progressInput.value)
  };

  daftarBuku.push(dataBaru);
  saveData("buku", daftarBuku);
  localStorage.setItem("lastRead", Date.now());

  alert("Buku berhasil ditambahkan!");
  window.location.href = "dashboard.html";
}
window.tambahData = tambahData;

function resetForm() {

    if(confirm("Yakin ingin mengosongkan semua isian?")){

        document.getElementById("judul").value="";
        document.getElementById("episode").value="";
        document.getElementById("genre").value="";
        document.getElementById("platform").value="";
        document.getElementById("status").value="";
        document.getElementById("progress").value="";

    }

}

window.resetForm = resetForm;


// ================= DETAIL & EDIT BUKU (detail-book.html) =================
const urlParams = new URLSearchParams(window.location.search);
const detailIndex = urlParams.get("id");
const detailJudul = document.getElementById("detailJudul");
const detailEpisode = document.getElementById("detailEpisode");
const detailGenre = document.getElementById("detailGenre");
const detailPlatform = document.getElementById("detailPlatform");
const detailStatus = document.getElementById("detailStatus");
const detailProgress = document.getElementById("detailProgress");

let daftarBukuDetail = getData("buku");
if (detailIndex !== null && detailJudul && detailEpisode) {
  const data = daftarBukuDetail[detailIndex];
  if (data) {
    detailJudul.value = data.judul;
    detailEpisode.value = data.episode;
    detailGenre.value = data.genre;
    detailPlatform.value = data.platform;
    detailStatus.value = data.status;
    detailProgress.value = data.progress;
  }
}

let dataSebelumEdit = null;

function editProgressDetail() {
  if (detailIndex === null) return;
  
  dataSebelumEdit = {
    judul: detailJudul.value,
    episode: detailEpisode.value,
    genre: detailGenre.value,
    platform: detailPlatform.value,
    status: detailStatus.value,
    progress: detailProgress.value
  };

  detailJudul.readOnly = false;
  detailEpisode.readOnly = false;
  detailGenre.readOnly = false;
  detailPlatform.readOnly = false;
  detailProgress.readOnly = false;
  detailStatus.disabled = false;

  document.querySelectorAll(".detail-input").forEach((el) => {
    el.classList.remove("view");
    el.classList.add("edit");
  });

  const btnEdit = document.querySelector(".btn-edit");
  const btnHapus = document.querySelector(".btn-hapus");
  if(btnEdit) { btnEdit.innerHTML = "Simpan"; btnEdit.onclick = simpanEdit; }
  if(btnHapus) { btnHapus.innerHTML = "Batal"; btnHapus.onclick = batalEdit; }
}

function batalEdit() {
  if (dataSebelumEdit === null) return;
  detailJudul.value = dataSebelumEdit.judul;
  detailEpisode.value = dataSebelumEdit.episode;
  detailGenre.value = dataSebelumEdit.genre;
  detailPlatform.value = dataSebelumEdit.platform;
  detailStatus.value = dataSebelumEdit.status;
  detailProgress.value = dataSebelumEdit.progress;

  kunciFormDetail();
}

function simpanEdit(){
  if(detailProgress.value < 0 || detailProgress.value > 100){
    alert("Progress harus 0-100%");
    return;
  }

  let localBuku = getData("buku");
  localBuku[detailIndex].judul = detailJudul.value;
  localBuku[detailIndex].episode = detailEpisode.value;
  localBuku[detailIndex].genre = detailGenre.value;
  localBuku[detailIndex].platform = detailPlatform.value;
  localBuku[detailIndex].status = detailStatus.value;
  localBuku[detailIndex].progress = Number(detailProgress.value);

  saveData("buku", localBuku);
  kunciFormDetail();
  alert("Data berhasil diperbarui!");
  window.location.href = "dashboard.html";
}

function kunciFormDetail() {
  detailJudul.readOnly = true;
  detailEpisode.readOnly = true;
  detailGenre.readOnly = true;
  detailPlatform.readOnly = true;
  detailProgress.readOnly = true;
  detailStatus.disabled = true;

  document.querySelectorAll(".detail-input").forEach((el) => {
    el.classList.remove("edit");
    el.classList.add("view");
  });

  const btnEdit = document.querySelector(".btn-edit");
  const btnHapus = document.querySelector(".btn-hapus");
  if(btnEdit) { btnEdit.innerHTML = "Edit"; btnEdit.onclick = editProgressDetail; }
  if(btnHapus) { btnHapus.innerHTML = "Hapus"; btnHapus.onclick = hapusProgressDetail; }
  dataSebelumEdit = null;
}

function hapusProgressDetail() {
  if (detailIndex === null) return;
  if (!confirm("Yakin ingin menghapus buku ini?")) return;

  let localBuku = getData("buku");
  localBuku.splice(detailIndex, 1);
  saveData("buku", localBuku);

  alert("Data berhasil dihapus!");
  window.location.href = "dashboard.html";
}

window.editProgressDetail = editProgressDetail;
window.simpanEdit = simpanEdit;
window.batalEdit = batalEdit;
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
window.toggleDarkMode = toggleDarkMode;

document.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const btn = document.querySelector(".dark-btn");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    if (btn) btn.innerHTML = "☀️ Light Mode";
  }
});


// ================= CLOCK =================
function updateClock() {
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  if (!clock || !date) return;

  const now = new Date();

  // Jam
  clock.textContent = now.toLocaleTimeString("id-ID");

  // Tanggal
  date.textContent = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

setInterval(updateClock, 1000);
document.addEventListener("DOMContentLoaded", updateClock);

// ================= PASSWORD STRENGTH =================
function cekPassword(){
  const password = document.getElementById("regPass");
  const hasil = document.getElementById("passwordStrength");
  if(!password || !hasil) return;

  const value = password.value;
  if(value.length == 0){
    hasil.innerHTML = "";
    return;
  }

  if(value.length < 6){
    hasil.innerHTML = "Password Lemah";
    hasil.style.color = "red";
  } else if(value.length < 8){
    hasil.innerHTML = "Password Sedang";
    hasil.style.color = "orange";
  } else {
    hasil.innerHTML = "Password Kuat";
    hasil.style.color = "green";
  }
}
window.cekPassword = cekPassword;


// ================= CAPS LOCK WARNING =================
function cekCaps(e){
  const warning = document.getElementById("capsWarning");
  if(!warning) return;

  if(e.getModifierState("CapsLock")){
    warning.innerHTML = "⚠ Caps Lock aktif";
  } else {
    warning.innerHTML = "";
  }
}
window.cekCaps = cekCaps;


// ================= GLOBAL STATS COUNTER (ABOUT PAGE) =================
function updateGlobalStats() {
  const totalUser = document.getElementById("totalUser");
  const totalBook = document.getElementById("totalBook");
  const totalPlatform = document.getElementById("totalPlatform");

  if (totalUser) {
    const users = getData("users");
    const localBuku = getData("buku");
    const platform = [...new Set(localBuku.map(item => item.platform).filter(Boolean))];

    totalUser.innerHTML = users.length;
    totalBook.innerHTML = localBuku.length;
    totalPlatform.innerHTML = platform.length;
  }
}
document.addEventListener("DOMContentLoaded", updateGlobalStats);


// ================= JUDUL INPUT COUNTER (add-book.html) =================
function updateCounter(){

    const input=document.getElementById("judul");
    const counter=document.getElementById("judulCounter");

    if(input && counter){

        counter.innerHTML=
        input.value.length+" / 100 karakter";

    }

}

window.updateCounter=updateCounter;


// ================= CTRL + S HOTKEY (add-book.html) =================
document.addEventListener("keydown",function(e){
if(e.ctrlKey && e.key==="s"){
const tombol=document.querySelector(".add-book-page button");
if(tombol){
e.preventDefault();
tambahData();
}
}
});


// ================= WELCOME POPUP =================
window.addEventListener("load",function(){

const pernah=
localStorage.getItem("welcomePopup");

if(!pernah){
alert(
"Selamat datang di MyLibrary 📚\n\nSemoga aktivitas membaca Anda menjadi lebih teratur."
);

localStorage.setItem(
"welcomePopup",
"true"
);

}

});


// ================= JUDUL CAPITALIZE =================
function capitalizeJudul(){
const input=document.getElementById("judul");

if(!input) return;

input.value=input.value
.toLowerCase()
.replace(/\b\w/g,function(huruf){

return huruf.toUpperCase();

});

}

window.capitalizeJudul=capitalizeJudul;

function filterWishlist(){

    const search = document.getElementById("searchInput");

    search.value = "wishlist";

    searchBuku();

    document.getElementById("tableBuku")
        .scrollIntoView({
            behavior:"smooth"
        });

}


/* ======================================================
   PROFILE PAGE
====================================================== */

const fotoProfile = document.getElementById("fotoProfile");
const previewFoto = document.getElementById("previewFoto");

if (fotoProfile && previewFoto) {

    const fotoTersimpan = localStorage.getItem("fotoProfile");

    if (fotoTersimpan) {
        previewFoto.src = fotoTersimpan;
    }

    fotoProfile.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            previewFoto.src = e.target.result;

            localStorage.setItem(
                "fotoProfile",
                e.target.result
            );

        };

        reader.readAsDataURL(file);

    });

}

//================= SAVE PROFILE DATA =================
const saveProfile = document.getElementById("saveProfile");

if (saveProfile) {

    saveProfile.addEventListener("click", function () {

        const profile = {

            nama: document.getElementById("nama").value,

            email: document.getElementById("email").value,

            bio: document.getElementById("bio").value,

            target: document.getElementById("targetBuku").value,

            genre: document.getElementById("genre").value,

            platform: document.getElementById("platform").value

        };

        localStorage.setItem(
            "profileUser",
            JSON.stringify(profile)
        );

        alert("Profile berhasil disimpan.");

    });

}


//================= LOAD PROFILE DATA =================
const dataProfile = localStorage.getItem("profileUser");

if (dataProfile) {

    const profile = JSON.parse(dataProfile);

    if(document.getElementById("nama"))
        document.getElementById("nama").value = profile.nama || "";

    if(document.getElementById("email"))
        document.getElementById("email").value = profile.email || "";

    if(document.getElementById("bio"))
        document.getElementById("bio").value = profile.bio || "";

    if(document.getElementById("targetBuku"))
        document.getElementById("targetBuku").value = profile.target || "";

    if(document.getElementById("genre"))
        document.getElementById("genre").value = profile.genre || "";

    if(document.getElementById("platform"))
        document.getElementById("platform").value = profile.platform || "";

}


//================= RESET PROFILE DATA =================
const resetProfile = document.getElementById("resetProfile");

if (resetProfile) {

    resetProfile.addEventListener("click", function () {

        if (!confirm("Reset semua data profile?"))
            return;

        localStorage.removeItem("profileUser");
        localStorage.removeItem("fotoProfile");

        location.reload();

    });

}


//================= GLOBAL STATS COUNTER (ABOUT PAGE) =================
const totalBook = document.getElementById("totalBook");

if (totalBook) {

    const buku = JSON.parse(localStorage.getItem("buku")) || [];

    document.getElementById("totalBook").innerText = buku.length;

    let selesai = 0;
    let proses = 0;
    let wishlist = 0;

    buku.forEach(function(item){

        const status = (item.status || "").toLowerCase();

        if(status === "selesai")
            selesai++;

        else if(status === "sedang dibaca")
            proses++;

        else if(status === "wishlist")
            wishlist++;

    });

    document.getElementById("selesaiBook").innerText = selesai;

    document.getElementById("prosesBook").innerText = proses;

    document.getElementById("wishlistBook").innerText = wishlist;

}