document.addEventListener('DOMContentLoaded', function() {
    // Load the data from the JSON file en fonction de la zone géographique sélectionnée
  
    // Crée les éléments HTML
    var zoneSelect = document.getElementById('zoneSelect');
    var submitButton = document.getElementById('submitButton');
    var countrySelect = document.getElementById('countrySelect');
    // var formationSelect = document.getElementById('formationSelect');

    var zoneSelect2 = document.getElementById('zoneSelect2');
    var submitButton2 = document.getElementById('submitButton2');
    var countrySelect2 = document.getElementById('countrySelect2');

    // Chart1

      zoneSelect.addEventListener('change', function() {
        var zone = zoneSelect.value;
        // Vide countrySelect
        countrySelect.innerHTML = '';
    
        // Ajoute l'option "Veuillez sélectionner un pays"
        var optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.text = 'Veuillez sélectionner un pays';
        countrySelect.appendChild(optionDefault);
    
        if (zone === 'NA') {
          countryListNA.forEach(function(country) {
            var option = document.createElement('option');
            option.value = country;
            option.text = country;
            countrySelect.appendChild(option);
          });
        } else {
          countryListEU.forEach(function(country) {
            var option = document.createElement('option');
            option.value = country;
            option.text = country;
            countrySelect.appendChild(option);
          });
        }
    
      });
    
      submitButton.addEventListener('click', function() {
        // Charge le fichier JSON correspondant à la zone géographique sélectionnée
        var jsonData;
    
        if (zoneSelect.value == 'WE') {
          $.ajax({
            url: '../data/survey_results_WE.json',
            dataType: 'json',
            success: function(data) {
              jsonData = data;
              processChartData(jsonData);
            }
          });
        } else if (zoneSelect.value == 'NA') {
          $.ajax({
            url: '../data/survey_results_NA.json',
            dataType: 'json',
            success: function(data) {
              jsonData = data;
              processChartData(jsonData);
            }
          });
        }
      });

      function processChartData(jsonData) {

        // Récupérer la liste des niveaux d'éducation formels pour le pays sélectionné
        var country = countrySelect.value;
        var formalEducationList = [];
        var sortedSalaries = [];
        var yearListOccurrence1 = {};

        // On récupère le nombre de réponse enregistré par pays & diplome
        jsonData.forEach(function (item) {

          if(item.Country === country &&
            item.EdLevel != "NA" &&
            item.Currency != "NA" &&
            item.CompTotal != "NA"){

              if(item.EdLevel in yearListOccurrence1){
                yearListOccurrence1[item.EdLevel] += 1;
              }else{
                yearListOccurrence1[item.EdLevel] = 1;
              }

          }
          
        });

        console.log(yearListOccurrence1);

        jsonData.forEach(function (item) {
          if (
            item.Country === country &&
            item.EdLevel != "NA" &&
            item.Currency != "NA" &&
            item.CompTotal != "NA" &&
            yearListOccurrence1[item.EdLevel] >= 15
          ) {
            var formalEducation = item.EdLevel;
            if (!formalEducationList.includes(formalEducation)) {
              formalEducationList.push(formalEducation);
            }
          }
        });

        var deviseList = [];
        jsonData.forEach(function (item) {
          var devise = item.Currency;
          if (!deviseList.includes(devise) && item.Country === country) {
            deviseList.push(devise);
          }
        });

        // Récupérer le salaire moyen pour chaque niveau d'éducation formel, le diviser par 12 pour obtenir le salaire mensuel,
        // et exclure les salaires avec la valeur "NA"
        var averageSalaryList = {};
        formalEducationList.forEach(function (formalEducation) {
          var salaries = [];
          var totalSalary = 0;
          var i = 0;
          jsonData.forEach(function (item) {
            devise = item.Currency.substring(0, 3);
            if (
              item.Country === country &&
              item.EdLevel === formalEducation &&
              item.CompTotal != "NA" &&
              item.ComptTotal != "NA" &&
              item.Currency != "NA" &&
              parseInt(item.CompTotal) * exchange_rate[devise] < 1000000 &&
              parseInt(item.CompTotal) > 0
            ) {
              devise = item.Currency.substring(0, 3);
              annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
              salaries.push(annualSalary);
              totalSalary += annualSalary;
              i++;
            }
          });

          // Supprimer 5% des valeurs extrêmes
          sortedSalaries = salaries.sort((a, b) => a - b);
          var numToRemove = Math.ceil(0.10 * sortedSalaries.length);
          var trimmedSalaries = sortedSalaries.slice(numToRemove, sortedSalaries.length - numToRemove);

          averageSalaryList[formalEducation] = Math.round((trimmedSalaries.reduce((a, b) => a + b, 0) / trimmedSalaries.length) / 12);
        });

        // Tri des données par ordre croissant
        var sortedAverageSalaryList = Object.entries(averageSalaryList).sort(
          (a, b) => a[1] - b[1]
        );
        averageSalaryList = Object.fromEntries(sortedAverageSalaryList);

        var ctx = document.getElementById("chart").getContext("2d");

        // S'il existe déjà un diagramme, le détruire
        if (window.myChart && typeof window.myChart.destroy === "function") {
          window.myChart.destroy();
        }

        // Calculer la moyenne de tous les salaires
        var totalSum = 0;
        var totalCount = 0;

        // Calculer la somme de tous les salaires et le nombre total de diplômes
        Object.values(averageSalaryList).forEach(function (salary) {
          if (typeof salary === 'number' && !isNaN(salary)) {
            totalSum += salary;
            totalCount++;
          }
        });

        var averageSalaryOverall = Math.round(totalSum / totalCount);

        // Remplace les clés par des labels plus lisibles a partir de  formalEducationListKey
        Object.keys(averageSalaryList).forEach(function (key) {
          averageSalaryList[formalEducationListKey[key]] = averageSalaryList[key];
          delete averageSalaryList[key];
        });

        // console.log(averageSalaryList);

        window.myChart = new Chart(ctx, {
          type: "bar,line",
          data: {
            labels: Object.keys(averageSalaryList),
            datasets: [
              {
                type: "bar",
                label: "Salaire moyen (EUR)",
                data: Object.values(averageSalaryList),
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
              {
                type: "line",
                label: "Moyenne globale (EUR)",
                data: Object.keys(averageSalaryList).map(function () {
                  return averageSalaryOverall;
                }),
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                borderColor: "rgba(255, 0, 0, 1)",
                borderWidth: 1,
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Salaires Mensuel en €'
                }
              },
            },
            // maintainAspectRatio: true,
            // responsive: false,
          },
        });
      }

    //Chart2
    zoneSelect2.addEventListener('change', function() {

      var zone = zoneSelect2.value;
      
      // Vide countrySelect2
      countrySelect2.innerHTML = '';
  
      // Ajoute l'option "Veuillez sélectionner un pays"
      var optionDefault = document.createElement('option');
      optionDefault.value = '';
      optionDefault.text = 'Veuillez sélectionner un pays';
      countrySelect2.appendChild(optionDefault);
   
      if (zone === 'NA') {
        countryListNA.forEach(function(country) {
          var option = document.createElement('option');
          option.value = country;
          option.text = country;
          countrySelect2.appendChild(option);
        });
      } else {
        countryListEU.forEach(function(country) {
          var option = document.createElement('option');
          option.value = country;
          option.text = country;
          countrySelect2.appendChild(option);
        });
      }

    });

    submitButton2.addEventListener('click', function() {
      // Charge le fichier JSON correspondant à la zone géographique sélectionnée
      var jsonData2;
  
      if (zoneSelect2.value == 'WE') {
        $.ajax({
          url: '../data/survey_results_WE.json',
          dataType: 'json',
          success: function(data) {
            jsonData2 = data;
            processChartData2(jsonData2);
          }
        });
      } else if (zoneSelect.value2 == 'NA') {
        $.ajax({
          url: '../data/survey_results_NA.json',
          dataType: 'json',
          success: function(data) {
            jsonData2 = data;
            processChartData2(jsonData2);
          }
        });
      }
    });

    function processChartData2(jsonData) {
      

      var yearListOccurrence = {};
      jsonData.forEach(function (item) {
        devise = item.Currency.substring(0, 3);
        if(item.YearsCodePro != "NA" && item.Currency != "NA" && item.CompTotal != "NA" && 
        parseInt(item.CompTotal) * exchange_rate[devise] < 1000000 && parseInt(item.CompTotal) > 1){
          
          if(item.YearsCodePro in yearListOccurrence){
            yearListOccurrence[item.YearsCodePro] += 1;
          }else{
            yearListOccurrence[item.YearsCodePro] = 1;
          }

        }
          
      });

      // console.log(yearListOccurrence);

      // Récupérer la liste l'expérience pour le pays sélectionné
      var country = countrySelect2.value;

      jsonData.forEach(function (item) {

        experience = parseInt(item.YearsCodePro);
        devise = item.Currency.substring(0, 3);

        if (
          item.Country === country &&
          item.YearsCodePro != "NA" &&
          item.Currency != "NA" &&
          item.CompTotal != "NA" &&
          parseInt(item.CompTotal) * exchange_rate[devise] < 1000000 &&
          parseInt(item.CompTotal) > 0 &&
          yearListOccurrence[item.YearsCodePro] >= 15
        ) {
          
         
          if((experience > 0 && experience <= 5) || experience == "Less than 1 year"){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['0-5'] += annualSalary;
            counterList['0-5'] += 1;

          }else if(experience > 5 && experience <= 10  ){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['5-10'] += annualSalary;
            counterList['5-10'] += 1;

          }else if(experience > 10 && experience <= 15){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['10-15'] += annualSalary;
            counterList['10-15'] += 1;

          }else if(experience > 15 && experience <= 20){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['15-20'] += annualSalary;
            counterList['15-20'] += 1;

          }else if(experience > 20 && experience <= 25){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['20-25'] += annualSalary;
            counterList['20-25'] += 1;

          }else if(experience > 25 && experience <= 30){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['25-30'] += annualSalary;
            counterList['25-30'] += 1;

          }else if(experience > 30 && experience <= 35){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['30-35'] += annualSalary;
            counterList['30-35'] += 1;

          }else if(experience > 35 && experience <= 40){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['35-40'] += annualSalary;
            counterList['35-40'] += 1;

          }else if(experience > 40 && experience <= 45){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['40-45'] += annualSalary;
            counterList['40-45'] += 1;

          }else if(experience > 45 && experience <= 50){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['45-50'] += annualSalary;
            counterList['45-50'] += 1;

          }else if (experience > 50){

            devise = item.Currency.substring(0, 3);
            annualSalary = parseInt(item.CompTotal) * exchange_rate[devise];
            salaryYearsList['50+'] += annualSalary;
            counterList['50+'] += 1;

          }

        }

      });

      console.log(salaryYearsList);

      Object.keys(salaryYearsList).forEach(function (salary) {
    
        salaryYearsList[salary] = Math.round((salaryYearsList[salary] / counterList[salary]) / 12);
                      
      });

      //  console.log(salaryYearsList);

      // On crée un diagramme Bar avec les données récupérées
      var ctx2 = document.getElementById("chart2").getContext("2d");

      // S'il existe déjà un diagramme, le détruire
      if (window.myChart2 && typeof window.myChart2.destroy === "function") {
        window.myChart2.destroy();
      }



      window.myChart2 = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: Object.keys(salaryYearsList),
          datasets: [
            {
              label: "Salaire moyen (EUR)",
              data: Object.values(salaryYearsList),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            x: {
              scaleLabel: {
                display: true,
                labelString: "Expérience en années"
              },
            },
            y: {
              scaleLabel: {
                display: true,
                labelString: "Salaire en €"
              },
              beginAtZero: true, 
            },
          },
        }
      });
    }  
});   

