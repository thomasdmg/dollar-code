
document.addEventListener('DOMContentLoaded', function() {

    // Load the data from the JSON file en fonction de la zone géographique sélectionné par l'utilisateur

    var zoneSelect = document.getElementById('zoneSelect');
    zoneSelect.addEventListener('change', function() {
        var zone = zoneSelect.value;
        // console.log(zone);
        $.ajax({
            url: '../data/survey_results_' + zone + '.json',
            dataType: 'json',
            success: function(data) {
                var jsonData = data;
                // console.log(jsonData)
                if(jsonData.length > 0 ) {
                    // Récupère la liste des pays dans le fichier JSON
                    
                    jsonData.forEach(function(item){
                        var country = item.EdLevel;
                        if (!countryList.includes(country)) {
                            countryList.push(country);
                        }     
                    });
                    console.log(countryList);
                }
            }
        });
    });

});

