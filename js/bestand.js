/**
 * Created by marvinvounkeng on 04.04.17.
 */


function setBaujahr(jahr) {
    $('.jahr').css('background-color', backgroundColorButton);
    $('.jahr').css('color', colorButtonText);

    $('#' + jahr).css('background-color', backgroundColorButton_activ);
    $('#' + jahr).css('color', colorButtonText_activ);


    // alert( $('#'+jahr).text());

    bauJahr = jahr;
    var leistung = 0;
    var raum_groesse = parseInt($('#raum_groesse').val());
    var factor = 0;
    switch (bauJahr) {
        case
        'bis_1977':
            factor = 120;
            break;

        case
        '1877-1982'
        :
            factor = 90;
            break;

        case
        '1982-1994'
        :
            factor = 70;
            break;
        case
        'ab_1995'
        :
            factor = 50;
            break;
        default:
    }
    if (isNumber(raum_groesse) && parseInt(raum_groesse) > 0) {
        $('#bestand_waermeleistung').val(raum_groesse * factor);

    }
}

/*----------------Bestand-------------------*/
var berechneHeizlast = function () {
    var hoeheTF = parseInt($('#bestand_hohe_text').val());
    var tiefeTF = parseInt($('#bestand_tiefe_text').val());
    var gliederTF = parseInt($('#bestand_glieder_text').val());
    var bestand_vorlaufTF = parseInt($('#bestand_temp_vor_text').val());
    var bestand_rucklaufTF = parseInt($('#bestand_temp_rueck_text').val());
    var bestand_raumtempTF = parseInt($('#bestand_temp_raum_text').val());


    if (hoeheTF.length != 0 && tiefeTF.length != 0 && gliederTF.length != 0 && bestand_vorlaufTF.length != 0 && bestand_rucklaufTF.length != 0 && bestand_raumtempTF.length != 0) {
        var t_a = 19.2 * hoeheTF * tiefeTF / 1000000;
        var t_b = (bestand_vorlaufTF + bestand_rucklaufTF) * 0.5 - bestand_raumtempTF;
        var t_c = t_a * t_b * gliederTF;
        $('#radiator_leistung_text').val(Math.round(t_c));
        berechneteHeizlast = Math.round(t_c);

    }
};
