document.addEventListener('DOMContentLoaded', function() {

    // Crée les éléments HTML
    var zoneSelect = document.getElementById('zoneSelect2');
    var submitButton = document.getElementById('submitButton2');
    var countrySelect = document.getElementById('countrySelect2');
    var experienceSelect = document.getElementById('experienceSelect2');
    var myChart2;

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

      function processChartData(jsonData) {

        var experience = experienceSelect.value;
        var experience_min = parseInt(experience.split("-")[0]);
        var experience_max = parseInt(experience.split("-")[1]);
        var country = countrySelect.value;

        // On récupère les frameworks utilisées & le nombre de développeur par plateforme
        var frameworkList = {};

        jsonData.forEach(function (item) {
          if (
            item.Country === country &&
            item.Currency !== "NA" &&
            item.CompTotal !== "NA" &&
            item.WebframeHaveWorkedWith !== "NA" &&
            item.YearsCodePro !== "NA" &&
            item.YearsCodePro >= experience_min &&
            item.YearsCodePro < experience_max
          ) {
            var framework = item.WebframeHaveWorkedWith.split(";");
            framework.forEach(function (framework) {
              var trimmedFramework = framework.trim();
              if (trimmedFramework !== "") {
                if (frameworkList.hasOwnProperty(trimmedFramework)) {
                  frameworkList[trimmedFramework] += 1;
                } else {
                  frameworkList[trimmedFramework] = 1;
                }
              }
            });
          }
        });

      // On récupère le totalCompt par framework
       var averageSalaryFramework = {};

       jsonData.forEach(function(item){

         currency = item.Currency.substring(0, 3);

         if (
           item.Country === country &&
           item.Currency !== "NA" &&
           item.CompTotal !== "NA" &&
           parseInt(item.CompTotal) > 0 &&
           convert(item.CompTotal, item.Currency) < 1000000 &&
           item.WebframeHaveWorkedWith !== "NA" &&
           item.YearsCodePro !== "NA" &&
           item.YearsCodePro >= experience_min &&
           item.YearsCodePro < experience_max
         ) {

           Object.keys(frameworkList).forEach(function (framework) {

             if (item.WebframeHaveWorkedWith.includes(framework)) {

               if (averageSalaryFramework.hasOwnProperty(framework)) {

                 amount_convert = convert(item.CompTotal, item.Currency);
                 averageSalaryFramework[framework] += parseInt(amount_convert);

               } else {

                 amount_convert = convert(item.CompTotal, item.Currency);
                 averageSalaryFramework[framework] = parseInt(amount_convert);

               }
             }
           }); 
         }
       });

       // On calcule la moyenne par plateforme
       Object.keys(averageSalaryFramework).forEach(function(item){
        if (averageSalaryFramework.hasOwnProperty(item)) {
          averageSalaryFramework[item] = averageSalaryFramework[item] / frameworkList[item];
          averageSalaryFramework[item] = Math.round(averageSalaryFramework[item]/12);
        }
      });

        var sortedArray = Object.entries(averageSalaryFramework);

        sortedArray.sort(function(a, b) {
          return b[1] - a[1];
        });

        var sortedaverageSalaryFramework = {};
        sortedArray.forEach(function(item) {
          sortedaverageSalaryFramework[item[0]] = item[1];
        });

        console.log(sortedaverageSalaryFramework);

        // Crée un graphique avec les données récupérées chart.js
      var ctx = document.getElementById('chart2').getContext('2d');

      // S'il existe déjà un diagramme, le détruire
      if (typeof myChart2 !== 'undefined' && myChart2 !== null) {
        myChart2.destroy();
      }

      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(sortedaverageSalaryFramework),
          datasets: [{
            label: 'Salaire moyen / plateforme en €',
            backgroundColor: "rgba(45, 198, 83, 0.6)",
            borderColor: "rgba(45, 198, 83, 0.6)",
            data: Object.values(sortedaverageSalaryFramework)
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
      
      myChart2 = chart;

      }

      function processgeneralChartData(jsonData){

        var country = countrySelect.value;

        // On récupère les frameworks utilisées & le nombre de développeur par plateforme
        var frameworkList = {};

        jsonData.forEach(function (item) {
          if (
            item.Country === country &&
            item.Currency !== "NA" &&
            item.CompTotal !== "NA" &&
            item.WebframeHaveWorkedWith !== "NA" &&
            item.YearsCodePro !== "NA"
          ) {
            var framework = item.WebframeHaveWorkedWith.split(";");
            framework.forEach(function (framework) {
              var trimmedFramework = framework.trim();
              if (trimmedFramework !== "") {
                if (frameworkList.hasOwnProperty(trimmedFramework)) {
                  frameworkList[trimmedFramework] += 1;
                } else {
                  frameworkList[trimmedFramework] = 1;
                }
              }
            });
          }
        });

      // On récupère le totalCompt par framework
       var averageSalaryFramework = {};

       jsonData.forEach(function(item){

         currency = item.Currency.substring(0, 3);

         if (
           item.Country === country &&
           item.Currency !== "NA" &&
           item.CompTotal !== "NA" &&
           parseInt(item.CompTotal) > 0 &&
           convert(item.CompTotal, item.Currency) < 1000000 &&
           item.WebframeHaveWorkedWith !== "NA" &&
           item.YearsCodePro !== "NA"
         ) {

           Object.keys(frameworkList).forEach(function (framework) {

             if (item.WebframeHaveWorkedWith.includes(framework)) {

               if (averageSalaryFramework.hasOwnProperty(framework)) {

                 amount_convert = convert(item.CompTotal, item.Currency);
                 averageSalaryFramework[framework] += parseInt(amount_convert);

               } else {

                 amount_convert = convert(item.CompTotal, item.Currency);
                 averageSalaryFramework[framework] = parseInt(amount_convert);

               }
             }
           }); 
         }
       });

       // On calcule la moyenne par plateforme
       Object.keys(averageSalaryFramework).forEach(function(item){
        if (averageSalaryFramework.hasOwnProperty(item)) {
          averageSalaryFramework[item] = averageSalaryFramework[item] / frameworkList[item];
          averageSalaryFramework[item] = Math.round(averageSalaryFramework[item]/12);
        }
      });

        var sortedArray = Object.entries(averageSalaryFramework);

        sortedArray.sort(function(a, b) {
          return b[1] - a[1];
        });

        var sortedaverageSalaryFramework = {};
        sortedArray.forEach(function(item) {
          sortedaverageSalaryFramework[item[0]] = item[1];
        });

        console.log(sortedaverageSalaryFramework);

        // Crée un graphique avec les données récupérées chart.js
      var ctx = document.getElementById('chart2').getContext('2d');

      // S'il existe déjà un diagramme, le détruire
      if (typeof myChart2 !== 'undefined' && myChart2 !== null) {
        myChart2.destroy();
      }

      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(sortedaverageSalaryFramework),
          datasets: [{
            label: 'Salaire moyen / plateforme en €',
            backgroundColor: "rgba(45, 198, 83, 0.6)",
            borderColor: "rgba(45, 198, 83, 0.6)",
            data: Object.values(sortedaverageSalaryFramework)
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
      
      myChart2 = chart;

      }



});