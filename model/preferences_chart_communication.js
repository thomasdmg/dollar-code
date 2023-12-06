document.addEventListener('DOMContentLoaded', function() {

    // Cible les éléments du DOM
    var zoneSelect = document.getElementById('zoneSelect2');
    var submitButton = document.getElementById('submitButton2');
    var jobSelect = document.getElementById('jobSelect2');
    var nbResult = document.getElementById('nbResultSelect2');
    var myChart2;

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
        var nbResultSelected = nbResult.value;
        var jobSelected = jobSelect.value;
      
        let i = 0;
        
        var softwareList = getsoftwareList(jsonData, jobSelected);
        
        // Calcul du nombre total de développeurs
        var total = 0;
        for (var os in softwareList) {
          total += softwareList[os];
        }
        
        // Calcul du pourcentage de développeurs utilisant chaque OS
        var softwareListPercentage = {};
        for (var os in softwareList) {
          softwareListPercentage[os] = ((softwareList[os] / total) * 100).toFixed(1);
        }
        
        // Tri du tableau par ordre décroissant
        var softwareListPercentageSorted = {};
        Object.keys(softwareListPercentage).sort(function(a, b) {
          return softwareListPercentage[b] - softwareListPercentage[a];
        }).forEach(function(key) {
          softwareListPercentageSorted[key] = softwareListPercentage[key];
        });
      
        // On modifie la taille du tableau en fonction du nombre de résultats sélectionnés
        var softwareListPercentageSortedSliced = {};
        let x = 0;
        for (var os in softwareListPercentageSorted) {
          if (x < nbResultSelected) {
            softwareListPercentageSortedSliced[os] = softwareListPercentageSorted[os];
          }
          x++;
        }
        
        // Calcul le total des pourcentages des OS sélectionnés
        var totalSelectedPercentage = 0;
        for (var os in softwareListPercentageSortedSliced) {
          totalSelectedPercentage += parseFloat(softwareListPercentageSortedSliced[os]);
        }
        
        console.log(totalSelectedPercentage);
      
        // Si pourcentage < 100, on ajoute un OS "Autres"
        if (totalSelectedPercentage < 100) {
          softwareListPercentageSortedSliced["Autres"] = (100 - totalSelectedPercentage).toFixed(1);
        }
      
        // Création du graphique donuts
        var ctx = document.getElementById('chart2').getContext('2d');
      
        // S'il existe déjà un diagramme, le détruire
        if (typeof myChart2 !== 'undefined' && myChart2 !== null) {
          myChart2.destroy();
        }
      
        chart2 = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(softwareListPercentageSortedSliced),
            datasets: [{
              data: Object.values(softwareListPercentageSortedSliced),
              backgroundColor: [
                'rgba(15, 93, 20, 1)',
                'rgba(15, 93, 20, 0.8)',
                'rgba(45, 198, 83, 1)',
                'rgba(45, 198, 83, 0.6)',
                'rgba(45, 106, 79, 1)',
                'rgba(64, 145, 108, 1)',
                'rgba(116, 198, 157, 1)',
                'rgba(149, 213, 178, 0.6)',
                'rgba(100, 190, 178, 0.2)'
              ]
            }]
          }
        });
      
        myChart2 = chart2;
      }


      function processChartDataGeneral(jsonData){

        var nbResultSelected = nbResult.value;
        let i = 0;
        
        var softwareList = getsoftwareList(jsonData);
        // Calcul du nombre total de développeurs
        var total = 0;
        for (var os in softwareList) {
          total += softwareList[os];
        }
  
        // Calcul du pourcentage de développeurs utilisant chaque OS
        var softwareListPercentage = {};
        for (var os in softwareList) {
          softwareListPercentage[os] = ((softwareList[os] / total) * 100).toFixed(1);
        }
        
        // Tri du tableau par ordre décroissant
        var softwareListPercentageSorted = {};
        Object.keys(softwareListPercentage).sort(function(a, b) {
          return softwareListPercentage[b] - softwareListPercentage[a];
        }).forEach(function(key) {
          softwareListPercentageSorted[key] = softwareListPercentage[key];
        });
  
        // On modifie la taille du tableau en fonction du nombre de résultats sélectionnés
        var softwareListPercentageSortedSliced = {};
        let x = 0;
        for (var os in softwareListPercentageSorted) {
          if (x < nbResultSelected) {
            softwareListPercentageSortedSliced[os] = softwareListPercentageSorted[os];
          }
          x++;
        }

         // Calcul le total des pourcentages des OS sélectionnés
         var totalSelectedPercentage = 0;
         for (var os in softwareListPercentageSortedSliced) {
           totalSelectedPercentage += parseFloat(softwareListPercentageSortedSliced[os]);
         }
         
         console.log(totalSelectedPercentage);
       
         // Si pourcentage < 100, on ajoute un OS "Autres"
         if (totalSelectedPercentage < 100) {
           softwareListPercentageSortedSliced["Autres"] = (100 - totalSelectedPercentage).toFixed(1);
         }

        // Création du graphique donuts
        var ctx = document.getElementById('chart2').getContext('2d');
  
        // S'il existe déjà un diagramme, le détruire
        if (typeof myChart2 !== 'undefined' && myChart2 !== null) {
          myChart2.destroy();
        }
  
        chart2 = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(softwareListPercentageSortedSliced),
            datasets: [{
              data: Object.values(softwareListPercentageSortedSliced),
              backgroundColor: [
                'rgba(15, 93, 20, 1)',
                'rgba(15, 93, 20, 0.8)',
                'rgba(45, 198, 83, 1)',
                'rgba(45, 198, 83, 0.6)',
                'rgba(45, 106, 79, 1)',
                'rgba(64, 145, 108, 1)',
                'rgba(116, 198, 157, 1)',
                'rgba(149, 213, 178, 0.6)',
                'rgba(100, 190, 178, 0.2)'
              ]
            }]
          }
        });
        
        myChart2 = chart2;
        
      }

    // Retourne un objet contenant les logiciel de communication et le nombre de développeurs utilisant chaque OS
    function getsoftwareList(jsonData, jobSelected = false){
        var softwareList = {};
  
        if(jobSelected){
  
          jsonData.forEach(function(item) {
  
            if(item.OfficeStackSyncHaveWorkedWith !== 'NA' && item.OfficeStackSyncHaveWorkedWith !== '' && item.DevType !== 'NA' && item.DevType.toString() === jobSelected.toString()){
              var os = item.OfficeStackSyncHaveWorkedWith.split(";");
              os.forEach(function(platform) {
                var trimmedPlatform = platform.trim();
                if (trimmedPlatform !== "") {
                  if (softwareList.hasOwnProperty(trimmedPlatform)) {
                    softwareList[trimmedPlatform] += 1;
                  } else {
                    softwareList[trimmedPlatform] = 1;
                  }
                }
              });
            }
  
          });
  
        }else{
  
          jsonData.forEach(function(item) {
            var os = item.OfficeStackSyncHaveWorkedWith.split(";");
            os.forEach(function(platform) {
              var trimmedPlatform = platform.trim();
              if (trimmedPlatform !== "") {
                if (softwareList.hasOwnProperty(trimmedPlatform)) {
                  softwareList[trimmedPlatform] += 1;
                } else {
                  softwareList[trimmedPlatform] = 1;
                }
              }
            });
          });
  
        }
        console.log(softwareList);
        return softwareList;
      }
});