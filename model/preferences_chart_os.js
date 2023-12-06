document.addEventListener('DOMContentLoaded', function() {

    var zoneSelect = document.getElementById('zoneSelect');
    var submitButton = document.getElementById('submitButton');
    var jobSelect = document.getElementById('jobSelect');
    var nbResult = document.getElementById('nbResultSelect');
    var myChart;

    // On ajoute les options dans jobSelect contenu dans le fichier const.js => postList
    for (var post in postList) {
        var option = document.createElement('option');
        option.value = post;
        option.innerHTML = post;
        jobSelect.appendChild(option);
    }


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
              
                if(jobSelect.value == ''){
                    processChartDataGeneral(jsonData)
                }else{
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
                if(jobSelect.value == ''){
                    processChartDataGeneral(jsonData);
                }else{
                    processChartData(jsonData);
                }   
            }
          });
        }
      });


    function processChartData(jsonData) {

      var jobSelected = jobSelect.value;
      var nbResultSelected = nbResult.value;
      let i = 0;
      
      var osList = getOsList(jsonData, jobSelected);
      // Calcul du nombre total de développeurs
      var total = 0;
      for (var os in osList) {
        total += osList[os];
      }
      console.log(total);

      // Calcul du pourcentage de développeurs utilisant chaque OS
      var osListPercentage = {};
      for (var os in osList) {
        osListPercentage[os] = ((osList[os] / total) * 100).toFixed(1);
      }
      
      // Tri du tableau par ordre décroissant
      var osListPercentageSorted = {};
      Object.keys(osListPercentage).sort(function(a, b) {
        return osListPercentage[b] - osListPercentage[a];
      }).forEach(function(key) {
        osListPercentageSorted[key] = osListPercentage[key];
      });

      // On modifie la taille du tableau en fonction du nombre de résultats sélectionnés
      var osListPercentageSortedSliced = {};
      let x = 0;
      for (var os in osListPercentageSorted) {
        if (x < nbResultSelected) {
          osListPercentageSortedSliced[os] = osListPercentageSorted[os];
        }
        x++;
      }

      // Création du graphique donuts
      var ctx = document.getElementById('chart').getContext('2d');

      // S'il existe déjà un diagramme, le détruire
      if (typeof myChart !== 'undefined' && myChart !== null) {
        myChart.destroy();
      }

      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(osListPercentageSortedSliced),
          datasets: [{
            data: Object.values(osListPercentageSortedSliced),
            backgroundColor: [
              'rgba(15, 93, 20, 1)',
              'rgba(15, 93, 20, 0.8)',
              'rgba(45, 198, 83, 1)',
              'rgba(45, 198, 83, 0.6)',
              'rgba(45, 106, 79, 1)',
              'rgba(64, 145, 108, 1)',
              'rgba(116, 198, 157, 1)',
              'rgba(149, 213, 178, 0.4)'
                  
            ]
          }]
        }
      });
      
      myChart = chart;

    }


    // Graphique sans poste sélectionné
    function processChartDataGeneral(jsonData){
      var nbResultSelected = nbResult.value;
      let i = 0;
      
      var osList = getOsList(jsonData);
      // Calcul du nombre total de développeurs
      var total = 0;
      for (var os in osList) {
        total += osList[os];
      }
      // console.log(total);

      // Calcul du pourcentage de développeurs utilisant chaque OS
      var osListPercentage = {};
      for (var os in osList) {
        osListPercentage[os] = ((osList[os] / total) * 100).toFixed(1);
      }
      
      // Tri du tableau par ordre décroissant
      var osListPercentageSorted = {};
      Object.keys(osListPercentage).sort(function(a, b) {
        return osListPercentage[b] - osListPercentage[a];
      }).forEach(function(key) {
        osListPercentageSorted[key] = osListPercentage[key];
      });

      // On modifie la taille du tableau en fonction du nombre de résultats sélectionnés
      var osListPercentageSortedSliced = {};
      let x = 0;
      for (var os in osListPercentageSorted) {
        if (x < nbResultSelected) {
          osListPercentageSortedSliced[os] = osListPercentageSorted[os];
        }
        x++;
      }

      // Création du graphique donuts
      var ctx = document.getElementById('chart').getContext('2d');

      // S'il existe déjà un diagramme, le détruire
      if (typeof myChart !== 'undefined' && myChart !== null) {
        myChart.destroy();
      }

      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(osListPercentageSortedSliced),
          datasets: [{
            data: Object.values(osListPercentageSortedSliced),
            backgroundColor: [
              'rgba(15, 93, 20, 1)',
              'rgba(15, 93, 20, 0.8)',
              'rgba(45, 198, 83, 1)',
              'rgba(45, 198, 83, 0.6)',
              'rgba(45, 106, 79, 1)',
              'rgba(64, 145, 108, 1)',
              'rgba(116, 198, 157, 1)',
              'rgba(149, 213, 178, 0.4)' 
            ]
          }]
        }
      });
      
      myChart = chart;
      
    }

    // Retourne un objet contenant les os et le nombre de développeurs utilisant chaque OS
    function getOsList(jsonData, jobSelected = false){
      var osList = {};

      if(jobSelected){

        jsonData.forEach(function(item) {

          if(item.OpSysProfessionaluse !== 'NA' && item.OpSysProfessionaluse !== '' && item.DevType !== 'NA' && item.DevType.toString() === jobSelected.toString()){
            var os = item.OpSysProfessionaluse.split(";");
            os.forEach(function(platform) {
              var trimmedPlatform = platform.trim();
              if (trimmedPlatform !== "") {
                if (osList.hasOwnProperty(trimmedPlatform)) {
                  osList[trimmedPlatform] += 1;
                } else {
                  osList[trimmedPlatform] = 1;
                }
              }
            });
          }

        });

      }else{

        jsonData.forEach(function(item) {
          var os = item.OpSysProfessionaluse.split(";");
          os.forEach(function(platform) {
            var trimmedPlatform = platform.trim();
            if (trimmedPlatform !== "") {
              if (osList.hasOwnProperty(trimmedPlatform)) {
                osList[trimmedPlatform] += 1;
              } else {
                osList[trimmedPlatform] = 1;
              }
            }
          });
        });

      }

      return osList;
    }
    
        


}); 