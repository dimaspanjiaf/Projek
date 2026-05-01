let data = JSON.parse(localStorage.getItem("progress")) || [];

function tampilkanData() {
    let list = document.getElementById("list");
    list.innerHTML = "";

    data.forEach((item, index) => {
        list.innerHTML += `
            <div class="item">
                <strong>${item.judul}</strong><br>
                Episode: ${item.episode}
                <button class="delete" onclick="hapusData(${index})">Hapus</button>
            </div>
        `;
    });
}

function tambahData() {
    let judul = document.getElementById("judul").value;
    let episode = document.getElementById("episode").value;

    if (judul === "" || episode === "") {
        alert("Isi semua data!");
        return;
    }

    data.push({ judul, episode });
    localStorage.setItem("progress", JSON.stringify(data));

    tampilkanData();

    document.getElementById("judul").value = "";
    document.getElementById("episode").value = "";
}

function hapusData(index) {
    data.splice(index, 1);
    localStorage.setItem("progress", JSON.stringify(data));
    tampilkanData();
}

// tampilkan saat pertama kali dibuka
tampilkanData();