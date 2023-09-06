/* App Meteo */

document.addEventListener('DOMContentLoaded', function() {
    var ville =  document.querySelector('#ville');
    ville.textContent = document.querySelector("#SelectVille").value;
   recupereVilleJsonForCombobox ();
   recupererData7timer();
   switchCelsusToFarenheit();
});

let SelectVille = document.querySelector('#SelectVille');
 
 selectVilleComboBox = SelectVille.addEventListener('change',()=>{
    afficherLattitudeEtLongitudeVille();
    recupererData7timer();
    recuperationDonneeGraphique();
    afficherWeatherImage();
    
    var ville =  document.querySelector('#ville');
    ville.textContent = document.querySelector("#SelectVille").value;   
});


let switchToFarenheitButton = document.querySelector('#switchFarenheight');
let temperatureElementCelsius = document.getElementById('temperature');
let temperatureElementFarenheit = document.getElementById('temperatureFarenheit');
let enCelsius = true; 

celsusToFarenheit = switchToFarenheitButton.addEventListener('click',()=>{
    console.log("Switch en F°")
    switchCelsusToFarenheit();

});

function recupererData7timer(){
    var LattitudeVille = document.getElementById('LattitudeVilleSelect').textContent;
    var LongitudeVille = document.getElementById('LongitudeVilleSelect').textContent;
    const urlAPI ="http://www.7timer.info/bin/api.pl?lon="+ LongitudeVille +"&lat="+ LattitudeVille + "&product=civil&output=json";

    // FETCH pour l'appel APPI 
    fetch(urlAPI)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        afficherDonneesMeteo(data);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des données météorologiques :', error);
    });

}

function afficherDonneesMeteo(data) {
    console.log("temperature " + data.dataseries[0].temp2m);
   document.querySelector('#temp_label').textContent = data.dataseries[0].temp2m;
  const temperatureCelsuis = data.dataseries[0].temp2m;
  convertitTempCelsuisToFaren(temperatureCelsuis);
 

    document.querySelector("#weather").textContent = data.dataseries[0].weather;
    console.log("Type de météo " + data.dataseries[0].weather);
    document.querySelector("#HumiditeRelative").textContent = data.dataseries[0].rh2m;
    console.log("humidité relative " + data.dataseries[0].rh2m);
    console.log("timePoint(Heure) " + data.dataseries[0].timepoint);
    console.log("Vitesse du vent à dix metres " + data.dataseries[0].wind10m.speed);  
   
}

function recuperationDonneeGraphique(){
   var lattitude = document.getElementById('LattitudeVilleSelect').textContent ;
   var longitude = document.getElementById('LongitudeVilleSelect').textContent ;
   
const url = 'http://www.7timer.info/bin/astro.php?lon='+ longitude +'&lat='+lattitude+'&ac=0&lang=en&unit=metric&output=internal&tzshift=0';
    
        fetch(url)
            .then(response => { 
                if (!response.ok) {
                throw new Error('Échec de la récupération du fichier PNG');
            }
            return response.blob(); // Définir le type de réponse attendu comme "blob"
        })
            .then(data => {
               console.log(data);
               const imageUrl = URL.createObjectURL(data);
                  
         const getElementImage = document.getElementById('img');
               if (getElementImage) {
             console.log("'jai un element img");
             getElementImage.src = imageUrl;
             console.log(imageUrl);
            
           } else {
            console.log("je n'ai pas d'element img") 
         }})
          .catch(error => {
                console.error('Une erreur s\'est produite lors de la récupération des données météorologiques :', error);
            });
}
// Je recupere le nom de la Ville dans le fichier ville.json

function recupereVilleJsonForCombobox (){
    fetch('ville.json') 
.then(response => response.json()) // Analyse de la réponse JSON
.then(data => {
    var comboboxVille = document.getElementById('SelectVille');
    // Parcourez les données ville du JSON et ajoutez-les à la combobox
  
    data.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.ville;
        option.text = item.ville;
        comboboxVille.appendChild(option);
    });
})
.catch(error => {
   console.error('Une erreur s\'est produite lors du chargement du JSON :', error);
});

}

function afficherLattitudeEtLongitudeVille(){
    let VilleSelect = document.querySelector('#SelectVille').value;
    console.log(VilleSelect);

    // Parcourir le Json ville et recuperer la lattitude et la longitude;

    fetch('ville.json') // Remplacez 'votre-fichier.json' par le chemin vers votre fichier JSON
    .then(response => response.json()) // Analyse de la réponse JSON
    .then(data => { 
     
        // Parcourez les données ville du JSON et ajoutez-les à la combobox
        data.forEach(function(item) {
            if(item.ville == VilleSelect)
            {
                document.querySelector('#LongitudeVilleSelect').textContent = item.long;
                document.querySelector('#LattitudeVilleSelect').textContent =   item.lat;
            }
        });}
        )
}

function afficherWeatherImage(){     
     // je recupere le weather titre
  const weatherFoImage =  document.querySelector('#weather').textContent;
    // Je lis le fichier JSON weather
    fetch('weather.json') 
    .then(response => response.json()) // Analyse de la réponse JSON
    .then(data => {
        const divWeather = document.getElementById('imageWeather');
        // Parcourez les données ville du JSON et ajoutez-les à la combobox
        data.forEach(function(item) {
           if(item.weather == weatherFoImage){
            divWeather.src = "images/"+ item.png; 
           }        
        });
    })
    .catch(error => {
       console.error('Une erreur s\'est produite lors du chargement du JSON :', error);
    });

}

function convertitTempCelsuisToFaren(degres){
    // Je recupere la temperature de la ville selectionne
    console.log(degres)
 const  tempFaren =  Math.trunc((degres*1.8)+ 32);
 document.querySelector('#tempFaren_label').textContent= tempFaren;
 console.log("degres:" +tempFaren);
 
} 

function switchCelsusToFarenheit(){
  
    if (enCelsius) {
        // Masquer l'élément Celsius et afficher l'élément Fahrenheit
        temperatureElementCelsius.hidden = true;
        temperatureElementFarenheit.hidden = false;
        switchToFarenheitButton.textContent = 'Switch en °C';

        enCelsius = false;
    } else {
        // Masquer l'élément Fahrenheit et afficher l'élément Celsius
        temperatureElementFarenheit.hidden = true;
        temperatureElementCelsius.hidden = false;
        switchToFarenheitButton.textContent = 'Switch en °F';

        enCelsius = true;
    }
}
    


 
 

 
