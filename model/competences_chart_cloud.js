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
            url: survey_results_WE_path,
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
            url: survey_results_NA_path,
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

      //Moyenne par plateforme Cloud / Pays & Expérience
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

        // console.log(platformList);

        // On récupère le totalCompt par plateforme
        var averageSalaryPlatform = {};

        jsonData.forEach(function(item){
          currency = item.Currency.substring(0, 3);
          if (
            item.Country === country &&
            item.Currency !== "NA" &&
            item.CompTotal !== "NA" &&
            parseInt(item.CompTotal) > 0 &&
            convert(item.CompTotal, item.Currency) < 1000000 &&
            item.PlatformHaveWorkedWith !== "NA" &&
            item.YearsCodePro !== "NA" &&
            item.YearsCodePro >= experience_min &&
            item.YearsCodePro < experience_max
          ) {

            Object.keys(platformList).forEach(function (platform) {

              if (item.PlatformHaveWorkedWith.includes(platform)) {

                if (averageSalaryPlatform.hasOwnProperty(platform)) {

                  amount_convert = convert(item.CompTotal, item.Currency);
                  averageSalaryPlatform[platform] += parseInt(amount_convert);

                } else {

                  amount_convert = convert(item.CompTotal, item.Currency);
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
          return b[1] - a[1];
        });

        var sortedAverageSalaryPlatform = {};
        sortedArray.forEach(function(item) {
          sortedAverageSalaryPlatform[item[0]] = item[1];
        });

        // console.log(sortedAverageSalaryPlatform);
        
        // On remplace les clés par les valeurs de cloudPlatformListKey
        var updatedSortedAverageSalaryPlatform = {};

        Object.keys(sortedAverageSalaryPlatform).forEach(function(item) {

          if (cloudPlatformListKey[item]) {
            
            var updatedKey = cloudPlatformListKey[item];

            updatedSortedAverageSalaryPlatform[updatedKey] = sortedAverageSalaryPlatform[item];
          }
        });

        // console.log(updatedSortedAverageSalaryPlatform);

        
        
        // Crée un graphique avec les données récupérées chart.js
        var ctx = document.getElementById('chart').getContext('2d');

        // S'il existe déjà un diagramme, le détruire
        if (typeof myChart !== 'undefined' && myChart !== null) {
          myChart.destroy();
        }

        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(updatedSortedAverageSalaryPlatform),
            datasets: [{
              label: 'Salaire moyen / plateforme en €',
              backgroundColor: "rgba(45, 198, 83, 0.6)",
              borderColor: "rgba(45, 198, 83, 0.6)",
              data: Object.values(updatedSortedAverageSalaryPlatform)
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


    // Moyenne par plateforme Cloud tout pays confondus
    function processgeneralChartData(jsonData){

      // On récupère les types de plateformes utilisées & le nombre de développeur par plateforme
      var platformList = {};
      var country = countrySelect.value;

      jsonData.forEach(function (item) {
        if (
          item.EdLevel !== "NA" &&
          item.Currency !== "NA" &&
          item.CompTotal !== "NA" &&
          item.PlatformHaveWorkedWith !== "NA" &&
          item.Country === country 
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

      // console.log(platformList);

      // On récupère le totalCompt par plateforme
      var averageSalaryPlatform = {};

      jsonData.forEach(function(item){
        if (
          item.Currency !== "NA" &&
          item.CompTotal !== "NA" &&
          parseInt(item.CompTotal) > 0 &&
          convert(item.CompTotal, item.Currency) < 900000 &&
          item.PlatformHaveWorkedWith !== "NA" &&
          item.YearsCodePro !== "NA" &&
          item.Country === country 
        ) {

          Object.keys(platformList).forEach(function (platform) {

            if (item.PlatformHaveWorkedWith.includes(platform)) {

              if (averageSalaryPlatform.hasOwnProperty(platform)) {

                currency = item.Currency.substring(0, 3);
                amount_convert = convert(item.CompTotal, item.Currency);
                averageSalaryPlatform[platform] += parseInt(amount_convert);

              } else {

                currency = item.Currency.substring(0, 3);
                amount_convert = convert(item.CompTotal, item.Currency);
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

      var sortedArray = Object.entries(averageSalaryPlatform);

      sortedArray.sort(function(a, b) {
        return b[1] - a[1];
      });

      var sortedAverageSalaryPlatform = {};
      sortedArray.forEach(function(item) {
        sortedAverageSalaryPlatform[item[0]] = item[1];
      });

      // On remplace les clés par les valeurs de cloudPlatformListKey
      var updatedSortedAverageSalaryPlatform = {};

      Object.keys(sortedAverageSalaryPlatform).forEach(function(item) {

         if (cloudPlatformListKey[item]) {
           
           var updatedKey = cloudPlatformListKey[item];

           updatedSortedAverageSalaryPlatform[updatedKey] = sortedAverageSalaryPlatform[item];
         }
       });

      // graphique

       // Crée un graphique avec les données récupérées chart.js
       var ctx = document.getElementById('chart').getContext('2d');

       // S'il existe déjà un diagramme, le détruire
       if (typeof myChart !== 'undefined' && myChart !== null) {
         myChart.destroy();
       }

       chart = new Chart(ctx, {
         type: 'bar',
         data: {
           labels: Object.keys(updatedSortedAverageSalaryPlatform),
           datasets: [{
             label: 'Salaire moyen / plateforme en €',
             backgroundColor: "rgba(45, 198, 83, 0.6)",
             borderColor: "rgba(45, 198, 83, 0.6)",
             data: Object.values(updatedSortedAverageSalaryPlatform)
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
});