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

// ========= add-book.html =========

function tambahData() {

  const judul = document.getElementById("judul").value;
  const platform = document.getElementById("platform").value;
  const progress = document.getElementById("progress").value;
  const status = document.getElementById("status").value;

  if (
    judul === "" ||
    platform === "" ||
    progress === ""
  ) {
    alert("Semua data wajib diisi!");
    return;
  }

  const data = getData("bacaan");

  data.push({
    judul: judul,
    platform: platform,
    progress: progress,
    status: status
  });

  saveData("bacaan", data);

  alert("Data berhasil disimpan!");

  window.location.href = "dashboard.html";
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