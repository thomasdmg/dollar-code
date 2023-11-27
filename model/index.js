
document.addEventListener('DOMContentLoaded', function() {

    // Load the data from the JSON file en fonction de la zone g�ographique s�lectionn� par l'utilisateur

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
        '': 'Choisir un niveau d\'étude',
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

        // Insère dans formationSelect les différentes formations possibles
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


});

