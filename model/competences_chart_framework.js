document.addEventListener('DOMContentLoaded', function() {

    // Crée les éléments HTML
    var zoneSelect = document.getElementById('zoneSelect2');
    var submitButton2 = document.getElementById('submitButton2');
    var countrySelect = document.getElementById('countrySelect2');
    var experienceSelect = document.getElementById('experienceSelect2');
    var myChart2;

    zoneSelect2.addEventListener('change', function() {
        var zone = zoneSelect2.value;
        // Vide countrySelect
        countrySelect2.innerHTML = '';
    
        // Ajoute l'option "Veuillez sélectionner un pays"
        var optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.text = 'Veuillez sélectionner un pays';
        countrySelect2.appendChild(optionDefault);
    
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



});