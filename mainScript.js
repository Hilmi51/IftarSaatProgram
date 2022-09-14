let countries = [],
  cities = [],
  counties = [];

let counter;
function GetTime() {
  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();

  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;

  document.getElementById("current-time").innerText = hour + " : " + minute;
}

function GetCountry() {
  return fetch("https://ezanvakti.herokuapp.com/ulkeler")
    .then((response) => response.json())
    .then((data) => {
      countries = data;
      let html = "";
      let indexTürkiye = 0;
      for (let i = 0; i < data.length; i++) {
        html +=
          '<option value="' +
          data[i].UlkeID +
          '">' +
          data[i].UlkeAdi +
          "</option>";
        if (data[i].UlkeAdi == "TÜRKİYE") indexTürkiye = i;
      }
      document.getElementById("countries").innerHTML = html;
      document.getElementById("countries").selectedIndex = indexTürkiye;
      GetCity(2); //* 2 Türkiye'nin ID si
    });
}

function GetCity(countryId) {
  return fetch("https://ezanvakti.herokuapp.com/sehirler/" + countryId)
    .then((response) => response.json())
    .then((data) => {
      cities = data;
      let html = "";
      let indexNigde = 0;
      for (let i = 0; i < data.length; i++) {
        html +=
          '<option value="' +
          data[i].SehirID +
          '">' +
          data[i].SehirAdi +
          "</option>";
        if (data[i].SehirAdi == "NİĞDE") indexNigde = i;
      }

      document.getElementById("cities").innerHTML = html;
      if (countryId == 2) {
        document.getElementById("cities").selectedIndex = indexNigde;
        GetCounty(561); //* Niğde'nin ID'si 561 olduğu için parametere olarak 561'i gönder.
      } else {
        document.getElementById("cities").selectedIndex = 0;
        GetCounty(data[0].SehirID);
      }
    });
}

function GetCounty(cityId) {
  return fetch("https://ezanvakti.herokuapp.com/ilceler/" + cityId)
    .then((response) => response.json())
    .then((data) => {
      counties = data;
      let html = "";

      for (let i = 0; i < data.length; i++) {
        html +=
          '<option value="' +
          data[i].IlceID +
          '">' +
          data[i].IlceAdi +
          "</option>";
      }

      document.getElementById("counties").innerHTML = html;
    });
}

function GetPrayerTimes(countyId) {
  return fetch("https://ezanvakti.herokuapp.com/vakitler/" + countyId)
    .then((response) => response.json())
    .then((data) => {
      let currentDate = new Date();
      let day =
        currentDate.getDate() < 10
          ? "0" + currentDate.getDate()
          : currentDate.getDate();
      let month =
        currentDate.getMonth() + 1 < 10
          ? "0" + (currentDate.getMonth() + 1)
          : currentDate.getMonth();
      let year = currentDate.getFullYear();

      currentDate = day + "." + month + "." + year;
      let index = data.findIndex((d) => d.MiladiTarihKisa == currentDate);
      let selectData = data[index];

      document.getElementById("imsak").innerText =
        "İMSAK : " + selectData.Imsak;
      document.getElementById("gunes").innerText =
        "GÜNES : " + selectData.Gunes;
      document.getElementById("ogle").innerText = "ÖĞLE : " + selectData.Ogle;
      document.getElementById("ikindi").innerText =
        "İKİNDİ : " + selectData.Ikindi;
      document.getElementById("aksam").innerText =
        "AKŞAM : " + selectData.Aksam;
      document.getElementById("yatsi").innerText =
        "YATSI : " + selectData.Yatsi;

      clearInterval(counter);
      counter = setInterval(function () {
        IftaraKalanSure(selectData.Aksam);
      }, 1);
    });
}

function IftaraKalanSure(aksam) {
  let now = new Date().getTime();
  let endDate = new Date();
  endDate.setHours(aksam.substr(0, 2));
  endDate.setMinutes(aksam.substr(3, 2));
  endDate.setSeconds("0");

  let t = endDate - now;

  if (t > 0) {
    let hour = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minute = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((t % (1000 * 60)) / 1000);

    document.getElementById("time-left").innerText =
      ("0" + hour).slice(-2) +
      ":" +
      ("0" + minute).slice(-2) +
      ":" +
      ("0" + seconds).slice(-2);
  } else {
    document.getElementById("time-left").innerText = "00:00:00";
  }
}

function ChangeCoutry() {
  let country = document.getElementById("countrie").value;
  GetCity(country);
}

function ChangeCity() {
  let city = document.getElementById("cities").value;
  GetCounty(city);
}

function ChangeLocation() {
  let countryInput = document.getElementById("countries");
  let country = countryInput.options[countryInput.selectedIndex].text;

  let cityInput = document.getElementById("cities");
  let city = cityInput.options[cityInput.selectedIndex].text;

  let countyInput = document.getElementById("counties");
  let county = countyInput.options[countyInput.selectedIndex].text;

  document.getElementById("country").innerText = country;
  document.getElementById("city").innerText = city;
  document.getElementById("county").innerText = county;

  GetPrayerTimes(countyInput.value);

  $("#locationModal").modal("hide");
}

setInterval(function () {
  GetTime();
}, 1);
GetCountry();
GetPrayerTimes(9766);
