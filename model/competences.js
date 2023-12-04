document.addEventListener('DOMContentLoaded', function() {

     // Crée les éléments HTML
     var zoneSelect = document.getElementById('zoneSelect');
     var submitButton = document.getElementById('submitButton');
     var countrySelect = document.getElementById('countrySelect');
     var experienceSelect = document.getElementById('experienceSelect');
     var myChart;


    zoneSelect.addEventListener('change', function() {
        var zone = zoneSelect.value;
        // Vide countrySelect
        countrySelect.innerHTML = '';
    
        // Ajoute l'option "Veuillez sélectionner un pays"
        var optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.text = 'Veuillez sélectionner un pays';
        countrySelect.appendChild(optionDefault);
    
        if (zone == 'NA') {
          countryListNA.forEach(function(country) {
            var option = document.createElement('option');
            option.value = country;
            option.text = country;
            countrySelect.appendChild(option);
          });
        } else if (zone == 'WE') {
          countryListEU.forEach(function(country) {
            var option = document.createElement('option');
            option.value = country;
            option.text = country;
            countrySelect.appendChild(option);
          });
        }
    
        // console.log(zone);
      });

      // Bouton submit
      submitButton.addEventListener('click', function() {
        // Charge le fichier JSON correspondant à la zone géographique sélectionnée
        var jsonData;
    
        if (zoneSelect.value == 'WE') {
          $.ajax({
            url: '../data/survey_results_WE.json',
            dataType: 'json',
            success: function(data) {
              jsonData = data;
              if (experienceSelect.value == ''){
                processgeneralChartData(jsonData);
              }else if(experienceSelect.value !== ''){
                processChartData(jsonData);
              }
              
            }
          });
        } else if (zoneSelect.value == 'NA') {
          $.ajax({
            url: '../data/survey_results_NA.json',
            dataType: 'json',
            success: function(data) {
              jsonData = data;
              if (experienceSelect.value == ''){
                processgeneralChartData(jsonData);
              }else if(experienceSelect.value !== ''){
                processChartData(jsonData);
              }
            }
          });
        }
      });

      // Graphique 1 : Moyenne par plateforme Cloud / Pays & Expérience
      function processChartData(jsonData) {

        var experience = experienceSelect.value;
        var experience_min = parseInt(experience.split("-")[0]);
        var experience_max = parseInt(experience.split("-")[1]);
        var country = countrySelect.value;

        // On récupère les types de plateformes utilisées & le nombre de développeur par plateforme
        var platformList = {};

        jsonData.forEach(function (item) {
          if (
            item.Country === country &&
            item.Currency !== "NA" &&
            item.CompTotal !== "NA" &&
            item.PlatformHaveWorkedWith !== "NA" &&
            item.YearsCodePro !== "NA" &&
            item.YearsCodePro >= experience_min &&
            item.YearsCodePro < experience_max
          ) {
            var platforms = item.PlatformHaveWorkedWith.split(";");
            platforms.forEach(function (platform) {
              var trimmedPlatform = platform.trim();
              if (trimmedPlatform !== "") {
                if (platformList.hasOwnProperty(trimmedPlatform)) {
                  platformList[trimmedPlatform] += 1;
                } else {
                  platformList[trimmedPlatform] = 1;
                }
              }
            });
          }
        });

        console.log(platformList);

        // On récupère le totalCompt par plateforme
        var averageSalaryPlatform = {};

        jsonData.forEach(function(item){
          currency = item.Currency.substring(0, 3);
          if (
            item.Country === country &&
            item.Currency !== "NA" &&
            item.CompTotal !== "NA" &&
            parseInt(item.CompTotal) > 0 &&
            parseInt(item.CompTotal) * exchange_rate[currency] < 1000000 &&
            item.PlatformHaveWorkedWith !== "NA" &&
            item.YearsCodePro !== "NA" &&
            item.YearsCodePro >= experience_min &&
            item.YearsCodePro < experience_max
          ) {

            Object.keys(platformList).forEach(function (platform) {

              if (item.PlatformHaveWorkedWith.includes(platform)) {

                if (averageSalaryPlatform.hasOwnProperty(platform)) {

                  amount_convert = item.CompTotal * exchange_rate[currency];
                  averageSalaryPlatform[platform] += parseInt(amount_convert);

                } else {

                  amount_convert = item.CompTotal * exchange_rate[currency];
                  averageSalaryPlatform[platform] = parseInt(amount_convert);

                }
              }
            });

          }
      
        });

        // On calcule la moyenne par plateforme
        Object.keys(averageSalaryPlatform).forEach(function(item){
          if (averageSalaryPlatform.hasOwnProperty(item)) {
            averageSalaryPlatform[item] = averageSalaryPlatform[item] / platformList[item];
            averageSalaryPlatform[item] = Math.round(averageSalaryPlatform[item]/12);
          }
        });

        // console.log(averageSalaryPlatform);
        var sortedArray = Object.entries(averageSalaryPlatform);

        sortedArray.sort(function(a, b) {
          return a[1] - b[1];
        });

        var sortedAverageSalaryPlatform = {};
        sortedArray.forEach(function(item) {
          sortedAverageSalaryPlatform[item[0]] = item[1];
        });

        console.log(sortedAverageSalaryPlatform);
        
        // Remplace les clés de sortedAverageSalaryPlatform par les valeurs de cloudPlatformListKey
        Object.keys(sortedAverageSalaryPlatform).forEach(function(item){
          if(sortedAverageSalaryPlatform.hasOwnProperty(item)){
            

          }
        });
        

        console.log(sortedAverageSalaryPlatform);
        
        // Crée un graphique avec les données récupérées chart.js
        var ctx = document.getElementById('chart').getContext('2d');

        // S'il existe déjà un diagramme, le détruire
        if (typeof myChart !== 'undefined' && myChart !== null) {
          myChart.destroy();
        }

        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(sortedAverageSalaryPlatform),
            datasets: [{
              label: 'Salaire moyen / plateforme en €',
              backgroundColor: 'rgb(0, 128, 132)',
              borderColor: 'rgb(0, 99, 132)',
              data: Object.values(sortedAverageSalaryPlatform)
            }]
          },
          options: {
            scales: {
              yAxes: {
                ticks: {
                  beginAtZero: true,
                }
              }
            }
          }
        });
        myChart = chart;
      }


    // Graphique 1 : Moyenne par plateforme Cloud tout pays confondus
    function processgeneralChartData($jsonData){

      var experience = experienceSelect.value;
      var country = countrySelect.value;

      // On récupère les types de plateformes utilisées & le nombre de développeur par plateforme
      var platformList = {};

      jsonData.forEach(function (item) {
        if (
          item.Country === country &&
          item.EdLevel !== "NA" &&
          item.Currency !== "NA" &&
          item.CompTotal !== "NA" &&
          item.PlatformHaveWorkedWith !== "NA"
        ) {
          var platforms = item.PlatformHaveWorkedWith.split(";");
          platforms.forEach(function (platform) {
            var trimmedPlatform = platform.trim();
            if (trimmedPlatform !== "") {
              if (platformList.hasOwnProperty(trimmedPlatform)) {
                platformList[trimmedPlatform] += 1;
              } else {
                platformList[trimmedPlatform] = 1;
              }
            }
          });
        }
      });

      console.log(platformList);

      // On récupère le totalCompt par plateforme
      var averageSalaryPlatform = {};

      jsonData.forEach(function(item){
        if (
          item.Country === country &&
          item.Currency !== "NA" &&
          item.CompTotal !== "NA" &&
          parseInt(item.CompTotal) > 0 &&
          parseInt(item.CompTotal) < 900000 &&
          item.PlatformHaveWorkedWith !== "NA" &&
          item.YearsCodePro !== "NA"
        ) {

          Object.keys(platformList).forEach(function (platform) {

            if (item.PlatformHaveWorkedWith.includes(platform)) {

              if (averageSalaryPlatform.hasOwnProperty(platform)) {

                currency = item.Currency.substring(0, 3);
                amount_convert = item.CompTotal * exchange_rate[currency];
                averageSalaryPlatform[platform] += parseInt(amount_convert);

              } else {

                currency = item.Currency.substring(0, 3);
                amount_convert = item.CompTotal * exchange_rate[currency];
                averageSalaryPlatform[platform] = parseInt(amount_convert);

              }
            }
          });

        }
    
      });

      // On calcule la moyenne par plateforme
      Object.keys(averageSalaryPlatform).forEach(function(item){
        if (averageSalaryPlatform.hasOwnProperty(item)) {
          averageSalaryPlatform[item] = averageSalaryPlatform[item] / platformList[item];
          averageSalaryPlatform[item] = Math.round(averageSalaryPlatform[item]/12);
        }
      });

      console.log(averageSalaryPlatform);

    }
});