document.addEventListener('DOMContentLoaded', function() {

    // Cible les éléments HTML
    var zoneSelect2 = document.getElementById('zoneSelect2');
    var submitButton2 = document.getElementById('submitButton2');
    var countrySelect2 = document.getElementById('countrySelect2');

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
            url: survey_results_WE_path,
            dataType: 'json',
            success: function(data) {
              jsonData2 = data;
              processChartData2(jsonData2);
            }
          });
        } else if (zoneSelect.value2 == 'NA') {
          $.ajax({
            url: survey_results_NA_path,
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
         
          if(item.YearsCodePro != "NA" && item.Currency != "NA" && item.CompTotal != "NA" && 
          convert(item.CompTotal, item.Currency) < 1000000 && parseInt(item.CompTotal) > 1){
            
            if(item.YearsCodePro in yearListOccurrence){
              yearListOccurrence[item.YearsCodePro] += 1;
            }else{
              yearListOccurrence[item.YearsCodePro] = 1;
            }
  
          }
            
        });
  
        // Récupérer la liste l'expérience pour le pays sélectionné
        var country = countrySelect2.value;
  
        // Calculer le salaire moyen par tranche d'expérience
        jsonData.forEach(function (item) {
  
          experience = parseInt(item.YearsCodePro);
        
          if (
            item.Country === country &&
            item.YearsCodePro != "NA" &&
            item.Currency != "NA" &&
            item.CompTotal != "NA" &&
            convert(item.CompTotal, item.Currency) < 1000000 &&
            parseInt(item.CompTotal) > 0 &&
            yearListOccurrence[item.YearsCodePro] >= 15
          ) {
            for (const range in salaryYearsList) {
              const [start, end] = range.split('-').map(Number);
        
              if (experience > start && experience <= end) {
                annualSalary = convert(item.CompTotal, item.Currency);
                salaryYearsList[range] += annualSalary;
                counterList[range] += 1;
                break;
              }
            }
          }
        });
  
        Object.keys(salaryYearsList).forEach(function (salary) {
          salaryYearsList[salary] = Math.round((salaryYearsList[salary] / counterList[salary]) / 12);
          counterList[salary] = 0; 
        });

  
        // On instancie un diagramme Bar avec les données récupérées
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
                backgroundColor: "rgba(45, 198, 83, 0.6)",
                borderColor: "rgba(45, 198, 83, 0.6)",
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
