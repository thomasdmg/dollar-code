
document.addEventListener('DOMContentLoaded', function() {

<<<<<<< HEAD
    // Load the data from the JSON file en fonction de la zone gï¿½ographique sï¿½lectionnï¿½ par l'utilisateur

    var zoneSelect = document.getElementById('zoneSelect');
    var submitButton = document.getElementById('submitButton');
    var countrySelect = document.getElementById('countrySelect');
    var formationSelect = document.getElementById('formationSelect');

    var countryListEU = [
                        'United Kingdom of Great Britain and Northern Ireland',
                        'Netherlands',
                        'Germany',
                        'France',
                        'Spain',
                        'Belgium',
                        'Italy',
                        'Portugal',
                        'Switzerland',
                        'Poland',
                        'Ireland'
                        ];

    var countryListNA = ['United States of America', 'Canada'];

    var formalEducationList = {
        '': 'Choisir un niveau d\'Ã©tude',
        'Primary/elementary school': 'Primary/Elementary school',
        'Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)': 'Secondary School',
        'Some college/university study without earning a degree': 'College / University without degree',
        'Associate degree (A.A., A.S., etc.)': 'Associate degree',
        'Bachelor\'s degree (B.A., B.S., B.Eng., etc.)': 'Bachelors degree',
        'Master\'s degree (M.A., M.S., M.Eng., MBA, etc.)': 'Master\'s degree',
        'Professional degree (JD, MD, Ph.D, Ed.D, etc.)': 'Professional degree',
        'Something else': 'Others'
      };

    zoneSelect.addEventListener('change', function() {
        var zone = zoneSelect.value;
        // Vide countrySelect
        countrySelect.innerHTML = '';

        // Ajoute l'option "Veuillez sÃ©lectionner un pays"
        var optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.text = 'Veuillez sÃ©lectionner un pays';
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

        // InsÃ¨re dans formationSelect les diffÃ©rentes formations possibles
        formationSelect.innerHTML = '';
        for (var key in formalEducationList) {
            var option = document.createElement('option');
            option.value = key;
            option.text = formalEducationList[key];
            formationSelect.appendChild(option);
        }

    });

    submitButton.addEventListener('click', function() {
        // console.log(zoneSelect.value)    
        if(zoneSelect.value != '' && countrySelect.value != '' && experienceSelect.value != '') {
            console.log(zoneSelect.value);
            console.log(countrySelect.value);
            console.log(formationSelect.value);
        }   
    });
=======
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
>>>>>>> d82d3e0df8125c56a008271827d4b0e54e055f0e


});

