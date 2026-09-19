console.log("Halo, Script Jalan");
let nama = "pix0";
console.log(nama);

let inputTanggal = document.getElementById("tanggal");
console.log(inputTanggal);

inputTanggal.addEventListener("change", function() {
    let tanggalDipilih = new Date(inputTanggal.value);
    updateDiagram(tanggalDipilih);
});

let posisi = SunCalc.getPosition(new Date(), -6.2088, 106.8456); //contoh koordinat jakarta
console.log(posisi);

function radToDeg(rad) {
    return rad * (180 / Math.PI);
}

console.log("Altitude (derajat):", radToDeg(posisi.altitude));
console.log("Azimuth (derajat):", radToDeg(posisi.azimuth));

function hitungJalurMatahari(tanggal, lat, lng) {
    let titikTitik = [];

    for (let jam = 0; jam < 24; jam++) {
        let waktu = new Date(tanggal);
        waktu.setHours(jam, 0, 0);

        let pos = SunCalc.getPosition(waktu, lat, lng);
        titikTitik.push({
            jam: jam,
            altitude: radToDeg(pos.altitude),
            azimuth: radToDeg(pos.azimuth)
        });
    }
    return titikTitik;
}

let Jalur = hitungJalurMatahari(new Date(), -6.2088, 106.8456);
console.log(Jalur);

let canvas = document.getElementById("sunChart");
let ctx = canvas.getContext("2d");

let pusatX = canvas.width / 2;
let pusatY = canvas.height / 2;
let radius = 180;

function gambarLingkaranDasar(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(pusatX, pusatY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000";
    ctx.stroke();
}

function gambarLingkaranAltitude() {
    let altitudesLevels = [30, 60];

    for (let i = 0; i < altitudesLevels.length; i++) {
        let alt = altitudesLevels[i];
        let r = radius * (1 - alt/ 90);

        ctx.beginPath();
        ctx.arc(pusatX, pusatY, r, 0, 2 * Math.PI);
        ctx.strokeStyle = "#ddd";
        ctx.stroke();
    }
}

function gambarLabelArah() {
    ctx.fillStyle = "#333";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";

    let labelArah = [
        { teks: "U", azimuth : 0 },
        { teks: "T", azimuth : 90 },
        { teks: "S", azimuth : 180 },
        { teks: "B", azimuth : 270 }   
    ];

    for (let i = 0; i < labelArah.length; i++) {
    let label = labelArah[i];
    let sudutRad = (label.azimuth - 90) * (Math.PI / 180);
    let x = pusatX + (radius + 15) * Math.cos(sudutRad);
    let y = pusatY + (radius + 15) * Math.sin(sudutRad);
    ctx.fillText(label.teks, x, y);
    }
}

function gambarJalurMatahari(datajalur) {
    ctx.beginPath();

    for (let i = 0; i < datajalur.length; i++) {
        let titik = datajalur[i];

        if (titik.altitude < 0) continue; // Lewati titik di bawah horizon
    
        let jarakDariPusat = radius * (1 - titik.altitude / 90);
        let sudutRad = (titik.azimuth - 90) * (Math.PI / 180); // +90 untuk menyesuaikan arah

        let x = pusatX + jarakDariPusat * Math.cos(sudutRad);
        let y = pusatY + jarakDariPusat * Math.sin(sudutRad);

        ctx.lineTo(x, y);
 }

    ctx.strokeStyle = "orange";
    ctx.lineWidth = 2;
    ctx.stroke();
}  

function updateDiagram() {
    let jalurBaru = hitungJalurMatahari(new Date(inputTanggal.value), -6.2088, 106.8456);

    gambarLingkaranDasar();
    gambarLingkaranAltitude();
    gambarLabelArah();
    gambarJalurMatahari(jalurBaru);
}

updateDiagram(new Date());