
document.addEventListener('DOMContentLoaded', function() {

    // Load the data from the JSON file
    var zoneSelect = document.getElementById('zoneSelect');
    var countrySelect = document.getElementById('countrySelect');
    var experienceSelect = document.getElementById('experienceSelect');
    var submit = document.getElementById('submit');

    function getCountryList(zone) {
        let countryList = [];
        $.ajax({
            url: '../data/survey_results_' + zone + '.json',
            dataType: 'json',
            success: function(data) {
                var jsonData = data;
                
                if(jsonData.length > 0 ) {

                    // Récupère la liste des pays dans le fichier JSON
                    // console.log(jsonData)

                    jsonData.forEach(function(item){
                        var country = item.Country;
                        if (!countryList.includes(country)) {
                            countryList.push(country);
                        }     
                    });
                    return countryList;
                }else{
                    return "No data";
                }
            }
        });
    }

    console.log(getCountryList('NA'));

    submit.addEventListener('click', function() {
        var zone = zoneSelect.value;
        var country = countrySelect.value;
        var experience = experienceSelect.value;

        $.ajax({
            url: '../data/survey_results_' + zone + '.json',
            dataType: 'json',
            success: function(data) {
                var jsonData = data;
                
                if( zone != '' && country != '' && experience != '' ) {

                    // Récupère la liste des pays dans le fichier JSON
                    // console.log(jsonData)

                    jsonData.forEach(function(item){
                        var country = item.Country;
                        if (!countryList.includes(country)) {
                            countryList.push(country);
                        }     
                    });
                    // console.log(countryList);
                    
                }
            }
        });
    });

    // Load the data from the JSON file en fonction de la zone géographique sélectionné par l'utilisateur

    // zoneSelect.addEventListener('change', function() {
    //     var zone = zoneSelect.value;
    //     // console.log(zone);
    //     $.ajax({
    //         url: '../data/survey_results_' + zone + '.json',
    //         dataType: 'json',
    //         success: function(data) {
    //             var jsonData = data;
                
    //             if(jsonData.length > 0 ) {
    //                 // Récupère la liste des pays dans le fichier JSON
    //                 // console.log(jsonData)

    //                 jsonData.forEach(function(item){
    //                     var country = item.Country;
    //                     if (!countryList.includes(country)) {
    //                         countryList.push(country);
    //                     }     
    //                 });
    //                 console.log(countryList);
    //             }
    //         }
    //     });
    // });


});

