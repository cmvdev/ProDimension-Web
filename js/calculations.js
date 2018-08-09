/**
 * Created by marvinvounkeng on 14.02.17.
 */

/*
 *GLOBALE VARIABLEN
 */
var flach_calc = [];
ergebnis = [];
inhalt_gewicht = [];
currentTab = 'calculation';
HLT = "";
currentRoomSelect = [];
finischToReadData = false;
db_count = 1;
var logetherm_breite = [450, 500, 550, 600, 750, 950];
var logetherm_breite_E = [450, 500, 550, 600, 750, 950];
var logatherm_seitenanschluesse = [183, 223, 266, 313, 474, 0];
var logatherm_mittenanschluesse = [183, 223, 266, 313, 474, 0];
var logatherm_waermeleistungen = [400, 400, 400, 500, 600, 0];
var logather_bauhoehe = [740, 1220, 1500, 1820];


heizlastTF = null,
    berechneteHeizlast = null;
Raumtemperatur = 20;
Vorlauf = 70;
Ruecklauf = 55;
hoheLaengeTyp = '';
currentRoom = '';
currentItem = '';
currentHeizlast = null;
currentKV = '';
HeizkoerperZahl = 1;
placeHolderHLT = null;
placeHolderKGL = null;
artikelView = null;
ventilView = null;
currentVentil = null;
standartVentil = null;
einbauVentil_1 = '';
einbauVentil_2 = '';
heizkoerperTyp = "VC-Profil";
VentildiffTF = 000;
ventilText = '';

fluessig = true,
    gas = false,
    einstellzahl_1 = false,
    einstellzahl_2 = false;
/*
 * LOCALE VARIABLEN
 */
var bauJahr = 'bis 1977';
var currentHeight = 600;
var currentThermHeight = 740;
var currentAnschluss = "Seitenanschluss";
var currentAusfuehrung = "mit Raumtemperaturregler";
var currentFarbe = "Standarfarbe";


var currentHeightCV = 1800;
var Heizlast = 1000;
var heizlastNeu = null,
    maxWert = null,
    fluessig = true,
    gas = false,
    einstellzahl_1 = false,
    einstellzahl_2 = false;

var Hoehen = [300, 400, 500, 600, 900];
var Typen = [10, 11, 20, 21, 22, 30, 33];
var Laengen = [400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2300, 2600, 3000];
var LaengenCV = [300, 400, 500, 600, 700, 900];
var TypenCV = [10, 20, 21, 22];
var HoehenCV = [1400, 1600, 1800, 2000, 2200, 2400];

isConsoleOn = true;
var RaumTemperaturen = [];
RaumTemperaturen['Küche'] = 20;
RaumTemperaturen['Wohnraum'] = 20;
RaumTemperaturen['Kinderzimmer 1'] = 20;
RaumTemperaturen['Kinderzimmer 2'] = 20;
RaumTemperaturen['Kinderzimmer 3'] = 20;
RaumTemperaturen['Arbeitszimmer'] = 20;
RaumTemperaturen['Bad'] = 24;
RaumTemperaturen['WC'] = 20;
RaumTemperaturen['Flur'] = 15;
RaumTemperaturen['Gäste WC'] = 20;
RaumTemperaturen['Treppenhaus'] = 10;
RaumTemperaturen['Keller'] = 15;
var custom_roomID = 1;
var defalutMenu = 'VC-Profil';
var defaultTab = 'tabs_calculation';

var Ventil_Fluessig = [];
var Ventil_Gas = [];
var isFirstInsatalltion = true;


$(document).ready(function () {


    $('#loadingView').fadeTo("slow", 0.5);
    /*
    $(document).on('keydown', function(e){
                   if(e.keyCode=='13'){
                   $(':focus').blur();
                   }
                   });
     */


    $(window).on('load', function () {
        if (localStorage.getItem('isFirstInsatalltion') == false) {
            getDataStorage();
        }
    });

    //MENU STEUERUNG
    $('.hk-type').on('click', function () {
        $('#rooms').css('display', 'none');
        $('.right_panel').fadeOut("slow");
        onChangeMenu('tabs_calculation');
        $(".info_panel").css("display", "none");
        $(".hk-type").css("background", backgroundColorMenu);
        $(".hk-type").css("border-left", "none");
        $(".hk-type").css("color", colorMenuText);
        $('#' + this.id).css("background", backgroundColorMenu_activ);
        $('#' + this.id).css("border-left", "3px solid #0f2f59");
        $('#' + this.id).css("color", colorMenuText_activ);
        heizkoerperTyp = $('#' + this.id).text();
        $('#profil_title').text(heizkoerperTyp);

        // if (heizkoerperTyp.charAt(0) != 'T') {
        loadZubehort();
        // }
    });


    if (mobil) {
        $('p, span, h2, h1, h, label').addClass('unselectable');
        $(".tab-calculation input[type=text]").attr('type', 'number');
        $(".tab-bestand input[type=text]").attr('type', 'number');
        $("#room_input").attr('type', 'text');
        $('#print_btn').css("display", "none");


        $('#print_report').css("display", "none");
        $(".menu button").removeClass("col-lg-2 col-md-2 ");
        $(".menu button").addClass("col-lg-3 col-md-3 col-sm-4");
        $(".menu button").css("width", "19.6%");

    }


    $('.E').on('click', function () {
        deactivElem('temp_vor', false);
        deactivElem('temp_rueck', false);
        deactivElem('temp', false);
        deactivElem('raumauswahl', true);
        // $('.td_temp').css('visibility', 'hidden');
    });
    $('.curve').on('click', function () {
        $('.td_temp').css('visibility', 'visible');
        deactivElem('temp', false);
        deactivElem('temp_vor', false);
        deactivElem('temp_rueck', false);
        deactivElem('heizlast', true);
    });
    $('.direct').on('click', function () {
        // $('.td_temp').css('visibility', 'visible');
        deactivElem('temp', false);
        deactivElem('temp_vor', false);
        deactivElem('temp_rueck', false);
        deactivElem('heizlast', true);
    });


    $('#addRoom_btn').on('click', function () {
        var tsr = $("#room_input").val();
        if (tsr.length > 0 && tsr != '') {
            if (exist(localStorage.getItem('custom_roomID')) == false) {
                custom_roomID = 0;
            } else {
                custom_roomID = localStorage.getItem('custom_roomID');
            }
            var btn_id = "raum_" + custom_roomID;

            $('#rooms_content').append('<li><button class="room" onclick="changeRoom(this.id)" id="' + btn_id + '" value="20">' + tsr + '</button></li>');
            currentRoomSelect = $('#rooms_content').html();
            localStorage.setItem('currentRoomSelect', currentRoomSelect);
            currentRoom = $('#selected_room').text();
            $('#room_input').val('');
            $('#temp_text').val('20');
            $('#selected_room').text(tsr);
            $('#rooms').toggle();
            custom_roomID++;
            localStorage.setItem('custom_roomID', custom_roomID);
            // reloadMatrixTable();
            $('#room_input').click;
        }
        consoleLog('Room ' + $('#selected_room').text());
    });


    //FÜR APP
    $('#room_input').keypress(function (e) {
        if (e.keyCode == 13) {
            $('#addRoom_btn').click();
        }
    });


    $('#selected_room').on('click', function () {
        //$('#rooms').toggle();
        $("#rooms").slideToggle("normal", function () {
        });

    });

    $('.room').on('click', function () {
        changeRoom(this.id);
    });


    //Setzt den alten Wert wenn Feld unverändert bleibt

    /*
       var oldVal;

       $('input').focusin(function () {
           oldVal = $('#' + this.id).val();
           $('#' + this.id).val('');
       });
       $('input').focusout(function () {
           var val = $('#' + this.id).val();
           if (val.length < 1) {
               $('#' + this.id).val(oldVal);
           }
       });
       */

    $('.room').focusout(function () {
        $('#rooms').css('display', 'none');
    });


    $('#temp_rueck_text').val(Ruecklauf);
    onChangeMessage('temp_rueck_text', '55');
    //alert(localStorage.getItem('currentTab'));

    onChangeMenu("tabs_" + localStorage.getItem('currentTab'));


    $('.tab-button').on('click', function () {
        $('.tab-button').css('background-color', backgroundColorTab);
        $('.tab-button').css('color', colorTabText);

        $('.' + this.id).css('background-color', backgroundColorTab_activ);
        $('.' + this.id).css('color', colorTabText_activ);
    });


    // $('#temp_vor_text').val(Vorlauf);
    onChangeMessage('temp_vor_text', '70');
    onChangeMessage('raum_watt_text', '1000');
    onChangeMessage('temp_text', '20');


    $('#temp_text').val($("#rooms_content button").val());


    $('#reloadTable_btn').on('click', function () {
        reloadMatrixTable();
    });

    $('#heizk_selectbox').on("change", function () {
        HeizkoerperZahl = $('#heizk_selectbox').val();
        reloadMatrixTable();
    });

    $('input[type=radio][name=thermostatkopf]').on('change', function () {
        determineVentil();
    });

    $('#einstellzahlButton1').on('click', function () {
        activeButton('einstellzahlButton1', true);
        activeButton('einstellzahlButton2', false);

        ventilText = $('#einstellzahlButton1').text();
    });
    $('#einstellzahlButton2').on('click', function () {
        activeButton('einstellzahlButton2', true);
        activeButton('einstellzahlButton1', false);
        ventilText = $('#einstellzahlButton2').text();
    });

    $('#id_' + currentHeight).css('background-color', 'grey');

    /* ------------VENTIL VIEW -----------*/
    $('#ventildif_text').val(100);

    $('#ventildif_text').keyup(function () {
        if (($('#ventildif_text').val().toString().length > 1 && parseInt($('#ventildif_text').val()) > 200 ) || !isNumber($('#ventildif_text').val())) {
            showDialog($('#layer_info').text(), $('#msg_druck_warning').text(), false, null);
            $('#ventildif_text').val(200);
            calculate_kv(currentHeizlast);
        } else {
            calculate_kv(currentHeizlast);
        }
    });
    /* ------------VENTIL VIEW - END -----------*/

    /*--------------BESTAND --------------*/
    $("#raum_groesse").keyup(function () {
        setBaujahr(bauJahr);
    });
    onChangeMessage('raum_groesse', '');

    $('.jahr').on('click', function () {
        setBaujahr(this.id);
    });
    $('#bestand_hohe_text').val('300');
    $('#bestand_tiefe_text').val('100');
    $('#bestand_glieder_text').val('1');


    $('#bestand_temp_vor_text').val('75');
    $('#bestand_temp_rueck_text').val('65');
    $('#bestand_temp_raum_text').val('20');

    berechneHeizlast();

    onChangeMessage('bestand_temp_vor_text', '75');
    onChangeMessage('bestand_temp_rueck_text', '65');
    onChangeMessage('bestand_glieder_text', '1');
    onChangeMessage('bestand_tiefe_text', '100');
    onChangeMessage('bestand_hohe_text', '300');
    onChangeMessage('bestand_temp_raum_text', '20');

    var activeTabId = 0;
    $('#tabs').tabs({
        activate: function (event, ui) {
            activeTabId = $(this).tabs('option', 'active');
        }
    });


    $('#bestand_save').on('click', function () {

        if (activeTabId == 0) {
            $('#raum_watt_text').val($('#bestand_waermeleistung').val());
            currentHeizlast = $('#bestand_waermeleistung').val();

        } else {
            $('#raum_watt_text').val($('#radiator_leistung_text').val());
            currentHeizlast = $('#radiator_leistung_text').val();
        }
        onChangeMenu('tabs_calculation');
        reloadMatrixTable();

    });


    $('#selected_room').text($('#raum_kueche').val());

});

function init() {
    //APP ZURÜCKSETZEN
    //resetSetup();
    // mobil=true;

    consoleLog("******* EASY PLAN PRO ********");
    localStorage.setItem('isFirstInsatalltion', isFirstInsatalltion);

    // beginToLoadData();

    if (!exist(localStorage.getItem('isFirstInsatalltion'))) {
        //  alert('Die App kann im privaten Modus nicht benutzt werden.!');
    } else {
        consoleLog('Local storage work');
    }


    if (localStorage.getItem('isFirstInsatalltion') == true || !exist(localStorage.getItem('zubehoere'))) {

        consoleLog('First installation');
        // setLanguage("de.xml");
        beginToLoadData();
    } else {
        consoleLog('App is allready installed!');
        finishToLoadData();
        getDataStorage();
    }

    onChangeMenu(defaultTab);
    heizkoerperTyp = defalutMenu;


    if (exist(localStorage.getItem('currentTab'))) {
        currentTab = localStorage.getItem('currentTab');
    }
    else {
        localStorage.setItem('currentTab', currentTab);
    }

    onChangeMenu("tabs_" + localStorage.getItem('currentTab'));


    //  $('#selected_room').text($('#raum_kueche').text());
    $('#selected_room').text("Auswählen");
    $('#room_input').val("");
    currentRoom = $("#selected_room").text();
    $('#raum_groesse').val('0');
    $('#bestand_waermeleistung').val('0');

    HeizkoerperZahl = $('#heizk_selectbox').val();


    //Felder initialisieren
    localStorage.setItem('height', '600');
    $('#profil_title').html("VC-Profil");

    $("#heater_count").val(1);
    $('#raum_watt_text').val('');

    setTimeout(function () {
        setProfile('VC-Profil');
        reloadMatrixTable();

        activeButton('id_600', true);

    }, 1000);

    activeButton('bis_1977', true);
    setBaujahr('bis_1977');
}


function setHeaderCount() {
    HeizkoerperZahl = $("#heater_count").val();
    reloadMatrixTable();
}

function showArtikelLangText(artikelnummer, text) {
    $("#artikel-dialog").html('<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>' + text + '</p>');
    $("#artikel-dialog").attr('title', artikelnummer);

    $(function () {
        $("#artikel-dialog").dialog({
            resizable: false,
            height: "auto",
            width: 500,
            modal: true,
            buttons: {
                Ja: function () {
                    $(this).dialog("close");
                    func(Obj);
                },
                Nein: function () {
                    $(this).dialog("close");
                }
            }
        });
    });
}

/* ARTIKEL AUS DER TABELLE PROFIL & PLAN ÜBERNEHMEN*/
var ArtikelUebernehmen = function (currentButton) {
    HeizkoerperZahl = $('#heizk_selectbox').val();
    try {
        currentHeizlast = parseInt(currentButton.title);
        calculate_kv(currentHeizlast);
        var temp = (currentButton.index).toString().split('_');
        var _hoehe = temp[0];
        var _typ = temp[2];
        var _breite = temp[1];

        placeHolderHLT = (_hoehe + '/' + _breite + '/' + _typ);
        placeHolderKGL = (temp[4] + '/' + temp[3]);
        standartVentil = "N";

        $("#placeHolderHLT").text(placeHolderHLT);
        $("#placeHolderKGL").text(placeHolderKGL);

        $('.info_plan_profil').html('');
        var hkArray = [];
        var hktyp = heizkoerperTyp.trim().toLowerCase().replace(/(\r\n|\n|\r)/gm, "");
        console.log('hktyp: ' + hktyp);
        var hkArray = JSON.parse(localStorage.getItem(hktyp));
        //consoleLog(hkArray);
        var info_content = "";
        if (exist(hkArray)) {
            for (var h = 0; h < hkArray.length; h++) {
                var hk = hkArray[h];
                // consoleLog(hk);
                if (hk.ausf.toLowerCase() == heizkoerperTyp.trim().toLowerCase().replace(/(\r\n|\n|\r)/gm, "")) {
                    if (parseInt(hk.hoehe) == _hoehe && parseInt(hk.breite) == _breite && parseInt(hk.typ) == _typ) {
                        if (exist(hk.ventil.trim())) {
                            standartVentil = hk.ventil.trim();
                        }
                        var src = "images/produkte/" + hk.bild + ".jpg";
                        info_content = "<table class='info_table' id='table_info_content'><tr>" +
                            "<td><button class='button-add-cart' onclick='addToCart(" + hk.artikelnummer + ",\"" + hk.kurz_1 + "\")'>+</button></td>" +
                            "<td>" + HeizkoerperZahl + "X " + hk.artikelnummer + "</td>" +
                            //"<td width='20%'><img  width='50px' src='"+src+ "'/></td>"+
                            "<td style='width: 56%'>" + hk.kurz_1 + '<br>' + hk.kurz_2 + '<br>' + $('.preis_currency').text() + ": " + hk.preis + '<br>' + $('.rabatt').text() + ': ' + hk.rabatt + "</td>" +
                            "<td></td><td style='width: 30px'><button style='margin-right: 1px' id='button-info-pp' class='button-add-cart' onclick='getLongDescriptionByArtikelnumber(" + hk.artikelnummer + ")'>i</button></td>" +
                            "<td></td>" +
                            "</tr></table>";
                        $('#ventilvoreinstellung').text(standartVentil + ' ');
                        break;
                    }
                }
            }
        }

        if ($('#einstellzahlButton1').text() == standartVentil) {
            activeButton("einstellzahlButton1", true);
            activeButton("einstellzahlButton1", false);
            ventilText = $('#einstellzahlButton1').text();

        } else if ($('#einstellzahlButton2').text() == standartVentil) {
            activeButton("einstellzahlButton1", false);
            activeButton("einstellzahlButton2", true);
            ventilText = $('#einstellzahlButton2').text();
        }
        else {
            if ($('#einstellzahlButton1').text().trim().charAt(0) == standartVentil.charAt(0)) {
                activeButton("einstellzahlButton2", false);
                activeButton("einstellzahlButton1", true);
                ventilText = $('#einstellzahlButton1').text();
            } else {
                activeButton("einstellzahlButton1", false);
                activeButton("einstellzahlButton2", true);
                ventilText = $('#einstellzahlButton2').text();
            }
            if (!$('#einstellzahlButton1').is(":visible") && !$('#einstellzahlButton1').is(":visible")) {
                ventilText = standartVentil;
            }
        }
        $('.info_panel').css("display", "block");
        $('.info_plan_profil').html(info_content);
    }
    catch (e) {
        console.error(e.message);
    }
};

function setArtikelNummer(newartikelnummer) {
    BootstrapDialog.show({
        size: BootstrapDialog.SIZE_NORMAL,
        title: 'Artikelnummer: ' + currentThermArtNr,
        message: 'Möchten Sie den Badheizkörper mit Universalarmatur-Set aufnehmen?',
        buttons: [{
            label: 'Normal: '+ currentThermArtNr,
            cssClass: 'btn-primary',
            action: function (dialog) {
                dialog.close();
            }
        },
            {
                label: 'Universalarmatur-Set: '+ newartikelnummer,
                cssClass: 'btn-primary',
                action: function (dialog) {
                    localStorage.setItem("currentThermArtNr", newartikelnummer);
                    currentThermArtNr = newartikelnummer;
                    $('#artnr_therm').text(currentThermArtNr);
                    dialog.close();
                }
            }
        ]
    });


    return localStorage.getItem("currentThermArtNr");
}

/* ARTIKEL AUS DER TABELLE THERM ÜBERNEHMEN*/
var ArtikelThermUebernehmen = function (_typ, _ventil, _hoehe, _breite, value) {
    HeizkoerperZahl = $('#heizk_selectbox').val();
    consoleLog('Typ: ' + _typ + ' Ventil: ' + _ventil + ' Hoehe: ' + _hoehe + ' Breite: ' + _breite);

    if (heizkoerperTyp == 'Therm Curve E' || heizkoerperTyp.trim() == 'Therm Curve') {
        placeHolderHLT = (_hoehe + '/' + (parseInt(_breite) - 5).toString() + '/' + _typ);
    }
    else {
        placeHolderHLT = (_hoehe + '/' + _breite + '/' + _typ);

    }


    var hktyp = heizkoerperTyp.toLowerCase().replace(/\ /g, '-');
    var hkArray = JSON.parse(localStorage.getItem(hktyp));
    var info_content = "";
    if (exist(hktyp)) {
        for (var h = 0; h < hkArray.length; h++) {
            hk = hkArray[h];

            if (hk.breite == _breite) {
                // if (parseInt(hk[0] == _typ && hk[6]) == _hoehe && parseInt(hk[8]) == _breite && hk[1]==_ventil) {

                if (hk.typ == _typ && hk.hoehe == _hoehe && hk.breite == _breite && (hk.typ == _ventil || hk.ventil == _ventil)) {
                    consoleLog("Current: typ: " + _typ + "| hk.typ: " + hk.typ + " hoehe:" + _hoehe + "| hk.hoehe: " + hk.hoehe + " |ventil: " + _ventil + " |hk.ventil:" + hk.ventil + " >>>>>>");

                    currentThermArtNr = hk.artikelnummer;
                    localStorage.setItem("currentThermArtNr", hk.artikelnummer);
                    var universalArtikel;
                    if (hk.ventil = "Standardfarbe" && hk.typ == "Mittenanschluss" && (heizkoerperTyp.trim()== 'Therm Direct'||heizkoerperTyp.trim()== 'Therm Curve' )) {
                        if (heizkoerperTyp.trim() == 'Therm Direct') {
                            if (hk.hoehe == 1500 && hk.breite == 600) {
                                universalArtikel = 7738322133;
                                currentThermArtNr = setArtikelNummer(universalArtikel);

                            }
                            else if (hk.hoehe == 1820 && hk.breite == 500) {
                                universalArtikel = 7738322134;
                                currentThermArtNr = setArtikelNummer(universalArtikel);

                            }
                            else if (hk.hoehe == 1820 && hk.breite == 600) {
                                universalArtikel = 7738322135;
                                currentThermArtNr = setArtikelNummer(universalArtikel);
                            }
                        }
                        else if (heizkoerperTyp.trim() == 'Therm Curve') {
                            if (hk.hoehe == 1820 && (hk.breite == 600 || hk.breite == 595)) {
                                universalArtikel = 7738322136;
                                currentThermArtNr = setArtikelNummer(universalArtikel);

                            }
                        }
                    }


                    var imageSrc = "images/produkte/" + hk.bild + ".jpg";

                    info_content = "<table class='info_table' style='width: 100%' class='table_info_therm'>" +
                        "<tr>" +
                        "<td width='7%'><button class='button-add-cart' onclick='addToCart(" + currentThermArtNr + ",\"" + hk.kurz_1 + "\")'>+</button></td>" +
                        "<td  width='20%' ><span style='font-size: small'>" + HeizkoerperZahl + "</span>X <span id='artnr_therm' style='font-size: small'>" + hk.artikelnummer + "</span></td>" +
                        //    "<td width='20%'><img  width='50px' src='"+imageSrc+ "'/></td>"+
                        "<td style='text-align: left'  width='30%'>" + hk.kurz_1 + '<br>' + hk.kurz_2 + '<br>' + $('.preis_currency').text() + ': ' + hk.preis + '<br>' + $('.rabatt').text() + ': ' + hk.rabatt + "</td>" +
                        //  "<td  width='20%'><button id='button-info' class='button-add-cart' onclick='showArtikelLangText(" + hk.artikelnummer + ",\"" + JSON.stringify(gesamt) + "\")'>i</button></td>" +
                        "<td  width='7%'><button id='button-info' class='button-add-cart' onclick='getLongDescriptionByArtikelnumber(" + $('#artnr_therm').text() + ")'>i</button></td>" +
                        "</tr>" +
                        "</table>";
                    break;
                }
            }
        }
    }
    consoleLog(info_content);
    $('.info_panel').css("display", "block");
    $('#info_therm').html(info_content);
}

//THERM VIEW AKTUALISIEREN

function initThermView(t) {
    heizkoerperTyp = t;
    currentThermHeight = 740;
    currentFarbe = "Standardfarbe";
    currentAusfuehrung = "mit An/Aus-Schalter";
    currentAnschluss = "Seitenanschluss";


    $('#selected_room').text($('#raum_bad').text());
    $('#selected_room').val('24');
    $('#temp_text').val('24');
    $('#temp_rueck_text').val('55');
    $('#temp_vor_text').val('70');

    $('#heizk_selectbox').val('1');
    $('.content_profil_plan').css('display', 'none');
    $('.therm_content').css('display', 'block');
    deactivElem('raumauswahl', true);
    deactivElem('heizk_selectbox', true);
    deactivElem('heizlast', true);
    deactivElem('temp', false);

    $('#zubehoert_profil').text("Zubehör für " + t);
    $('.info_content').css("display", "none");
    reloadMatrixTable();
}

//THERM PROFIL PLAN AKTUALISIEREN
function initProfilPlan() {
    deactivElem('heizlast', false);
    deactivElem('heizk_selectbox', false);
    deactivElem('raumauswahl', false);
    deactivElem('temp', false);
    deactivElem('temp_vor', false);
    deactivElem('temp_rueck', false);
    $('#temp_text').val('20');
    $('#temp_rueck_text').val('55');
    $('#temp_vor_text').val('70');
    $('#raum_watt_text').val('');
    $('#heizk_selectbox').val('1');
    $('#selected_room').text("Auswählen");
    currentHeizlast = "1000";
}


function loadZubehort() {
    // if (heizkoerperTyp.charAt(0) != 'T') {
    var FHKTYP = heizkoerperTyp.replace('\n', '').trim();
    createZubehoetTable('zubehoert_table', FHKTYP);
    createZubehoetTable('zubehoert_thermoVentil', 'Thermostatköpfe und Ventile');
    createZubehoetTable('zubehoert_Heizkoerper', 'Heizkörperbefestigungen');
    createZubehoetTable('zubehoert_heizkörperanbindung', 'Heizkörperanbindung');

    //}
}

function getDataStorage() {
    onChangeMenu("tabs_" + localStorage.getItem('currentTab'));
    if (exist(localStorage.getItem('currentReportTableData'))) {
        $('#report_table_tbody').html(localStorage.getItem('currentReportTableData'));
    }
    if (exist(localStorage.getItem('currentUtilsTableData'))) {
        $('#utils_table_tbody').html(localStorage.getItem('currentUtilsTableData'));
    }
    if (exist(localStorage.getItem('reportSavedListe'))) {
        //localStorage["reportSavedListe"]=[];
        reportSavedListe = JSON.parse(localStorage["reportSavedListe"]);
        //reportSavedListe=[];
    }
    if (exist(localStorage.getItem('ReportList'))) {
        ReportList = JSON.parse(localStorage['ReportList']);
    }
    if (exist(localStorage.getItem('currentLastSavedreportID'))) {
        currentLastSavedreportID = localStorage.getItem('currentLastSavedreportID');
        //currentLastSavedreportID=0;
    }
    if (exist(localStorage.getItem('currentLastReportID'))) {
        currentLastReportID = localStorage.getItem('currentLastReportID');
    }
    if (exist(localStorage.getItem('language'))) {
        setLanguage(localStorage.getItem("language") + ".xml");
    }

}


function changeRoom(roomID) {
    $('#rooms').css('display', 'none');
    $('#selected_room').text($('#' + roomID).text());

    currentRoom = $('#' + roomID).text();
    $('#temp_text').val($('#' + roomID).val());
    reloadMatrixTable();

}

var slideReady = true;

function onChangeMenu(tabID) {
    var tab = tabID.split('_');

    $('.tab-button').css('background-color', backgroundColorTab);
    $('.tab-button').css('color', colorTabText);
    currentTab = tab[1];
    localStorage.setItem('currentTab', currentTab);
    $('.tab').css('display', 'none');
    $('#' + tabID).css('display', 'block');

    $('#button-' + currentTab).css('background-color', backgroundColorTab_activ);
    $('#button-' + currentTab).css('color', colorTabText_activ);

}


function createMatrixTable() {
    var flach_calc = JSON.parse(localStorage["flach_calc"]);
    heizlastNeu = Math.round(parseInt(Heizlast) / parseInt(HeizkoerperZahl));
    maxWert = parseInt(heizlastNeu) + ((heizlastNeu / 100) * 15.4);
    var matrixContent = "";

    //Tabellen ausfüllen
    matrixContent += "<table class='table-matrix-content-height-row'>";
    matrixContent += "<tr>";
    matrixContent += "<td><span>H</span></td>";

    for (var y = 0; y < Hoehen.length; y++) {
        var h_id = "id_" + Hoehen[y];
        matrixContent += "<td><button style='background-color: #3c3c3b;color:white' class='button-heights' onclick='setHeight(" + Hoehen[y] + ")' id='" + h_id + "'>" + Hoehen[y] + "</button></td>";
    }
    matrixContent += "</tr>";
    matrixContent += "</table>";

    matrixContent += "<table style='height: 100%;' class='table-matrix-content'>";

    matrixContent += "<tr>";
    matrixContent += "<td><span>L/T</span></td>";
    for (var k = 0; k < Typen.length; k++) {
        matrixContent += "<td><span>" + Typen[k] + "</span></td>";
    }
    matrixContent += "</tr>";


    for (var i = 0; i < Laengen.length; i++) {
        matrixContent += "<tr>";
        matrixContent += "<td><span>" + Laengen[i] + "</span></td>";

        for (var x = 0; x < ergebnis.length; x++) {
            var width = 75;
            var item = "button_" + i + x;
            var buttonName = Math.round((ergebnis[x] / 10) * (parseInt(Laengen[i]) / 100));
            //alert(ergebnis.length);
            var backgroundCol = backgroundColorButton;
            var borderColor = 'transparent';
            var color = colorButtonText;
            var btClass = 'matrix';

            if (buttonName >= heizlastNeu && buttonName <= maxWert && exist($('#raum_watt_text').val())) {
                // backgroundCol = '#EE7203';
                //color = '#fff';
                borderColor = '#EE7203';
            }
            currentHeizlast = buttonName;
            // borderColor = '#EE7203';
            matrixContent += "<td style='background-color: transparent; border: none'><button style='background-color: " + backgroundCol + "; color: " + color + "; border: solid 2px " + borderColor + ";' onclick='onclickMatrix(" + buttonName + "," + x + "," + i + ")'  class ='matrix_table_cell matrix " + item + "'><span style='width: 50px'>" + buttonName + "</span></button></td>";
        }
        matrixContent += "</tr>";
    }
    matrixContent += "</table>";
    $('.matrix_table_pro_plan').html(matrixContent);
    $('.table-matrix-content td').width($('.table-matrix-content').width() / 8);

}

//THERM TABELLE BAUEN
function createLogaTable() {
    var therm_data = [];
    var content = '';
    var flach_calc = "";
    if (exist(localStorage["flach_calc"])) {
        flach_calc = JSON.parse(localStorage["flach_calc"]);
        try {
            consoleLog('*** Selected Bauhöhe: ' + currentThermHeight + " heizkoerperTyp: " + heizkoerperTyp + " *****");
            for (var i = 0; i < flach_calc.length; i++) {
                if (flach_calc[i].hoehe.trim() == currentThermHeight && flach_calc[i].heizkoerper.trim() == heizkoerperTyp.trim()) {
                    therm_data.push({
                        heizkoerperTyp: flach_calc[i].heizkoerper,
                        bauhoehe: flach_calc[i].hoehe,
                        breite: flach_calc[i].typ,
                        waermeleistung: flach_calc[i].normwert,
                        seitenanschluss: flach_calc[i].normwert,
                        mittenanschluss: flach_calc[i].normwert,
                        faktor: flach_calc[i].faktor
                    });
                }
            }
            consoleLog('therm_data: ' + therm_data.length);
            if (therm_data.length > 0) {
                if (heizkoerperTyp.trim() == 'Therm Direct E' || heizkoerperTyp.trim() == 'Therm Curve E') {

                    $(".table-matrix-content").remove();
                    content += '<table class="table-matrix-content-height-row">' + '<tr>' +
                        "<td style='width:50%'><button style='background-color: #3c3c3b;color:white' class='button-heights'  onclick='setFarbetTherm(\"Standardfarbe\")' id='id_Standardfarbe'>Standardfarbe</button></td>" +
                        "<td style='width: 50%'><button style='background-color: #3c3c3b;color:white' class='button-heights'  onclick='setFarbetTherm(\"Sonderfarbe\")' id='id_Sonderfarbe'>Sonderfarbe</button></td>" +
                        "</tr>" +
                        '<tr>' +
                        "<td style='width: 50%'><button style='background-color: #3c3c3b;color:white' class='button-heights' onclick='setAusfuehrungTherm(\"mit An/Aus-Schalter\")' id='mitAn_Aus-Schalter'>mit An/Aus-Schalter</button></td>" +
                        "<td style='width:50%'><button style='background-color: #3c3c3b;color:white' class='button-heights'  onclick='setAusfuehrungTherm(\"mit Raumtemperaturregler\")' id='mitRaumtemperaturregler'>mit Raumtemperaturregler</button></td>" +

                        "</tr>" +
                        "</table>";

                    content += "<table class='table-matrix-content-height-row'><tr><td><span>L/H</span></td>";
                    for (var i = 0; i < logather_bauhoehe.length; i++) {
                        var h_id = "id_" + logather_bauhoehe[i];
                        content += "<td><button style='background-color: #3c3c3b;color:white' class='button-heights' onclick='setHeightTherm(" + logather_bauhoehe[i] + ")' id='" + h_id + "'>" + logather_bauhoehe[i] + "</button></td>";
                    }
                    content += "</table></tr>";
                    content += '<table class="table-matrix-content">';

                    for (var k = 0; k < therm_data.length; k++) {
                        var waermeleistung_id = 'waermeleistung_' + k;
                        var breite_id = 'breite_' + k;
                        var breite = logetherm_breite[k];
                        if (heizkoerperTyp.trim() == 'Therm Curve E' || heizkoerperTyp.trim() == 'Therm Curve') {
                            breite = parseInt(breite) - 5;
                        }

                        content += '<tr>' +
                            "<td class='anschluss_breite'><p   id='" + breite_id + "'>" + breite + "</p></td>" +
                            "<td style='background-color:transparent; border: none;color:white'  onclick='anschlussCellOnclick(" + "\"" + currentAusfuehrung + "\"" + "," + k + "," + therm_data[i].waermeleistung + "," + logetherm_breite[k] + "," + currentThermHeight + "," + therm_data[i].waermeleistung + ")' ><button style='background-color:" + backgroundColorButton + "; border: none'  id='" + waermeleistung_id + "' >" + therm_data[k].waermeleistung + "</button></td>" +
                            "</tr>"
                    }
                }
                else {

                    $(".table-matrix-content").remove();
                    content += '<table class="table-matrix-content-height-row">' + '<tr>' +
                        "<td style='width:50%'><button style='background-color: #3c3c3b;color:white' class='button-heights'  onclick='setFarbetTherm(\"Standardfarbe\")' id='id_Standardfarbe'>Standardfarbe</button></td>" +
                        "<td style='width: 50%'><button style='background-color: #3c3c3b;color:white' class='button-heights'  onclick='setFarbetTherm(\"Sonderfarbe\")' id='id_Sonderfarbe'>Sonderfarbe</button></td>" +
                        "</tr>" +
                        '<tr>' +
                        "<td onclick='setAnschluss(" + "\"Seitenanschluss\"" + ")'   class='anschluss_breite'><button id='id_Seitenanschluss'   class='button-heights' style='background-color: #3c3c3b;color:white' class='button-heights'>Seitenanschluss</button></td>" +
                        "<td onclick='setAnschluss(\"Mittenanschluss\")'  class='anschluss_breite'><button id='id_Mittenanschluss' class='button-heights' style='background-color: #3c3c3b;color:white' class='button-heights'>Mittenanschluss</button></td>" + ''
                    "</tr>" +
                    "</table>";

                    content += "<table class='table-matrix-content-height-row'><tr><td><span>L/H</span></td>";
                    for (var i = 0; i < logather_bauhoehe.length; i++) {
                        var h_id = "id_" + logather_bauhoehe[i];
                        content += "<td><button style='background-color: #3c3c3b;color:white' class='button-heights' onclick='setHeightTherm(" + logather_bauhoehe[i] + ")' id='" + h_id + "'>" + logather_bauhoehe[i] + "</button></td>";
                    }
                    content += "</table></tr>";
                    content += '<table class="table-matrix-content">';


                    var backgroundCol = '#ffffff';
                    var color = '#00000';
                    for (var x = 0; x < ergebnis.length; x++) {
                        var borderColor = 'white';
                        var breite_id = 'breite_' + x;
                        var seitenanschluss_id = 'Seitenanschluss_' + x;
                        var mittenanschluss_id = 'Mittenanschluss_' + x;
                        var buttonName = parseInt(ergebnis[x]);
                        consoleLog(buttonName);
                        if (buttonName >= heizlastNeu && buttonName <= maxWert) {
                            borderColor = '#EE7203';
                        }
                        var breite = logetherm_breite[x];
                        if (heizkoerperTyp.trim() == 'Therm Curve E' || heizkoerperTyp.trim() == 'Therm Curve') {
                            breite = parseInt(breite) - 5;
                        }
                        var anschlussCell_id = currentAnschluss + "_" + x;

                        content += '<tr>';
                        content += "<td style='background-color: transparent' ><p style='background-color: transparent; cursor: auto'   id='" + breite_id + "'>" + breite + "</p></td>";
                        content += "<td style='background-color:transparent; border: none;color:white' onclick='anschlussCellOnclick(" + "\"" + currentAnschluss + "\"" + "," + x + "," + therm_data[i].seitenanschluss + "," + logetherm_breite[x] + "," + currentThermHeight + "," + buttonName + ")' ><button style='border: solid 0px; width: 100% ; background-color:" + backgroundColorButton + ";color:" + colorButtonText + "; cursor: pointer'  id='" + anschlussCell_id + "'   >" + buttonName + "</button></td>";
                        // <td style='background-color:transparent; border: none' onclick='anschlussCellOnclick(" + "\"Mittenanschluss\"" + "," + x + "," + therm_data[i].mittenanschluss + "," +  logetherm_breite[x] + "," + currentThermHeight + "," + buttonName + ")' ><button style='border: solid 0px; width: 100%; background-color:" + backgroundColorButton + ";color:" + colorButtonText + ";cursor: pointer'  id='" + mittenanschluss_id + "' >" + buttonName + "</button></td>";
                        content += "</tr>";
                    }
                }
                content += "</table>";
                $('#anschluss_table').html(content);
            }
        }
        catch
            (e) {
            console.error(e.message);
        }
    }
}

function finishToLoadData() {
    // $('#loadingView').fadeOut();
    //  $('#container').fadeIn();
    $('#container').fadeIn('slow');
    $('.loadingImg_utils').fadeOut('slow');
    // $('#loadingView').css('display', 'none');
    $('#loadingView').fadeOut('slow', function () {
        $('#loading_label').text('Daten erfolgreich geladen');
    });

    $('.matrix_table').fadeIn('slow');
    $('.therm_table').css('display', 'inline-table');
    $('.tzubehoert').fadeIn('slow');
    $('#VC-Profil').click();

    isFirstInsatalltion = false;
    localStorage.setItem('isFirstInsatalltion', isFirstInsatalltion);
}

function beginToLoadData() {
    $('#loadingView').fadeIn('slow');
    // $('#container').css('display', 'none');
    $('.matrix_table').fadeOut('slow');
    $('.therm_table').fadeOut('slow');
    $('.loadingImg_auswahl').fadeIn('slow');

    $('.loadingImg_utils').fadeIn('slow');
    $('.tzubehoert').fadeOut('slow');

    //  countAll(function (callback) {
    // db_count= parseInt(callback[0]);
    db_count = 5155;
    consoleLog('Anzahl: ' + db_count);
    resetSetup();
    readFlachCalc(function (callback) {
        getAllProfilPlanData(function (callback) {
            getVentilData(function (callback) {
                getAllZubehoert(function (callback) {
                    consoleLog("Finisch to load Data");
                    setTimeout(function () {
                        finishToLoadData();
                        consoleLog('TOTAL DURATION: ' + totalDuration);
                    }, 200);
                });
            });
        });
    });
    //  });
}


function showDialog(title, message, option, func, Obj) {
    if (!$('.dialogMsg').is(':visible')) {
        message = '<p style="color:#3C3C3B; font-size: small"><span class="glyphicon glyphicon-info-sign" style="padding-right: 20px;"></span><span class="dialogMsg">' + message + '</span></p>';
        if (option) {
            BootstrapDialog.show({
                size: BootstrapDialog.SIZE_NORMAL,
                title: title,
                message: message,
                buttons: [{
                    label: $('#ja').text(),
                    action: function (dialog) {
                        func(Obj);
                        dialog.close();
                    }
                },
                    {
                        label: $('#nein').text(),
                        action: function (dialog) {
                            dialog.close();
                        }
                    }
                ]
            });
        } else {
            BootstrapDialog.show({
                size: BootstrapDialog.SIZE_SMALL,
                title: title,
                message: message,
                buttons: [{
                    label: 'OK',
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
            });
        }
    }

}

function showDialog1(title, message, option, func, Obj) {

    $("#dialog-confirm").html('<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>' + message + '</p>');
    $("#dialog-confirm").attr('title', title);


    $(function () {
        if (option) {
            $("#dialog-confirm").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: [
                    {
                        text: $('#ja').text(),
                        click: function () {
                            $(this).id = "ja";
                            $(this).dialog("close");
                            func(Obj);
                        }
                    },
                    {
                        text: $('#nein').text(),
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        }
        else {
            $("#dialog-confirm").dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,

                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                        func(Obj);
                    }
                }
            });
        }
    });
}

function anschlussCellOnclick(title, i, val, breite, hoehe, buttonName) {
    currentHeizlast = buttonName;
    consoleLog('Title: ' + title + ' index: ' + i + ' Breite: ' + breite + ' Hoehe: ' + hoehe + ' value: ' + val);
    var id = '';
    //var ausfuerung = "";
    if (heizkoerperTyp == 'Therm Direct E' || heizkoerperTyp == 'Therm Curve E') {
        // ausfuerung = currentAusfuehrung;
        id = 'waermeleistung_' + i;
    } else {
        // ausfuerung = currentFarbe;
        id = title + '_' + i;
    }
    activeButton("table-matrix-content button", false);
    activeButton(id, true);

    //alert(title + " "+ i+ " "+ val+ " "+ breite+ " "+ hoehe+ " "+ ausfuerung);
    ArtikelThermUebernehmen(title, currentFarbe, hoehe, breite, parseInt(val));
    $('.info_content').css("display", "block");
}

function onclickMatrix(val, x, i) {
    if (heizkoerperTyp != 'CV-Profil' && heizkoerperTyp != 'C-Profil' && heizkoerperTyp != 'CV-Plan' && heizkoerperTyp != 'C-Plan') {
        $('.ventil_panel').fadeIn("slow");

        //calculate_kv(currentHeizlast);
    } else {
        $('.ventil_panel').css("display", "none");
        $('.info_content').css('margin-top', '0px');
    }
    $('.right_panel').fadeIn("slow");

    var inhaltString = (inhalt_gewicht[x].inhalt).toString().replace(',', '.');
    var inhalt = ((parseFloat(inhaltString)) / 10) * (parseInt(Laengen[i]) / 100);
    var gewichtString = (inhalt_gewicht[x].gewicht).toString().replace(',', '.');
    var gewicht = ((parseFloat(gewichtString)) / 10) * (parseInt(Laengen[i]) / 100);
    var index = currentHeight + '_' + Laengen[i] + '_' + Typen[x] + '_' + inhalt.toFixed(1) + '_' + gewicht.toFixed(1);
    var currentButton = [];
    currentButton.push({
        title: val,
        index: index
    });

    activeButton("matrix", false);
    if (parseInt(val) < heizlastNeu) {
        showDialog($('#layer_info').text(), $('#msg_leistung_warning').text(), true, function () {
            ArtikelUebernehmen(currentButton[0]);
            $('#ventil_info').css('display', 'block');
            activeButton('button_' + i + x, true);

        });
    }
    else {
        ArtikelUebernehmen(currentButton[0]);
        $('#ventil_info').css('display', 'block');
        activeButton('button_' + i + x, true);
    }
}

function onclickThermMatrix(val, x, i) {
    var inhaltString = (inhalt_gewicht[x].inhalt).toString().replace(',', '.');
    var inhalt = ((parseFloat(inhaltString)) / 10) * (parseInt(Laengen[i]) / 100);
    var gewichtString = (inhalt_gewicht[x].gewicht).toString().replace(',', '.');
    var gewicht = ((parseFloat(gewichtString)) / 10) * (parseInt(Laengen[i]) / 100);
    var index = currentHeight + '_' + Laengen[i] + '_' + Typen[x] + '_' + inhalt.toFixed(1) + '_' + gewicht.toFixed(1);
    var currentButton = [];
    currentButton.push({
        title: val,
        index: index
    });

    if (parseInt(val) < heizlastNeu) {
        showDialog($('#layer_info').text(), 'Die Heizkörper-Wärmeleistung ist geringer als die eingegebene Wärmeleistung!\n Trotzdem Übernehmen?', true, function () {
            ArtikelUebernehmen(currentButton[0]);
            $('.matrix_table td button').css('border', 'none');
            $('.button_' + i + x).css('border', 'solid 2px #EE7203');
        });
    } else {
        ArtikelUebernehmen(currentButton[0]);
        $('.matrix').css('border', 'none');
        $('.button_' + i + x).css('border', 'solid 2px #EE7203');
    }
}

function isNumber(n) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}


function validField(id, defaultVal) {
    var v = parseInt($('#' + id).val().trim());
    switch (id) {
        case 'bestand_temp_rueck_text':
            if ((v < 25 || v > 89) || !isNumber(v)) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), $('#msg_temp_rueck_warning2').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v >= $('#bestand_temp_vor_text').val()) {
                $('#bestand_temp_vor_text').val(parseInt(v) + 1);
                showDialog($('#layer_info').text(), $('#msg_temp_rueck_warning').text(), false, function () {
                    reloadMatrixTable();
                });

            }
            else if (v == $('#temp_text').val()) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), 'Die Rücklauftemperatur und die Raumtemperatur müssen nicht gleich sein.', false, function () {
                    reloadMatrixTable();
                });
            }
            else {
                reloadMatrixTable();
            }

            break;

        case 'temp_rueck_text':
            if ((v < 25 || v > 89) || !isNumber(v)) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), $('#msg_temp_rueck_warning2').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v >= $('#temp_vor_text').val()) {
                $('#temp_rueck_text').val(parseInt($('#temp_vor_text').val()) - 1);
                showDialog($('#layer_info').text(), $('#msg_temp_rueck_warning').text(), false, function () {
                    reloadMatrixTable();
                });

            }
            else if (v == $('#temp_text').val()) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), 'Die Rücklauftemperatur und die Raumtemperatur müssen nicht gleich sein.', false, function () {
                    reloadMatrixTable();
                });
            }
            else {
                reloadMatrixTable();
            }

            break;
        case 'bestand_temp_vor_text':
            if (!isNumber(v)) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), $('#msg_temp_vor_warning2').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v <= $('#bestand_temp_rueck_text').val()) {
                $('#bestand_temp_rueck_text').val(parseInt(v) - 1);
                showDialog($('#layer_info').text(), $('#msg_temp_vor_warning').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v < 30 || v > 90) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), $('#msg_temp_vor_warning2').text(), false, function () {
                    reloadMatrixTable();
                });
            } else {
                berechneHeizlast();
                reloadMatrixTable();
            }
            break;

        case 'temp_vor_text':
            if (!isNumber(v)) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), $('#msg_temp_vor_warning2').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v <= $('#temp_rueck_text').val()) {
                // $('#' + id).val(parseInt($('#temp_rueck_text').val()) + 1);
                $('#temp_vor_text').val(parseInt($('#temp_rueck_text').val()) + 1);
                showDialog($('#layer_info').text(), $('#msg_temp_vor_warning').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v < 30 || v > 90) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), $('#msg_temp_vor_warning2').text(), false, function () {
                    reloadMatrixTable();
                });
            } else {
                berechneHeizlast();
                reloadMatrixTable();
            }
            break;
        case 'bestand_temp_raum_text':
            if (v < 10 || v > 30 || !isNumber(v)) {
                // $('#' + id).val(defaultVal);
                $('#bestand_temp_raum_text').val($("#selected_room").val());
                showDialog($('#layer_info').text(), $('#msg_temp_warning').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v == $('#bestand_temp_rueck').val()) {
                // $('#' + id).val(defaultVal);
                $('#bestand_temp_vor').val($("#selected_room").val());
                showDialog($('#layer_info').text(), 'Die Raumtemperatur und die Vorlauftemperatur müssen nicht gleich sein.', false, function () {
                    reloadMatrixTable();
                });
            }
            else {
                berechneHeizlast();
                reloadMatrixTable();
            }
            break;

        case 'temp_text':
            if (v < 10 || v > 30 || !isNumber(v)) {
                // $('#' + id).val(defaultVal);
                $('#temp_text').val($("#selected_room").val());
                showDialog($('#layer_info').text(), $('#msg_temp_warning').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else if (v == $('#temp_rueck_text').val()) {
                // $('#' + id).val(defaultVal);
                $('#temp_text').val($("#selected_room").val());
                showDialog($('#layer_info').text(), 'Die Raumtemperatur und die Vorlauftemperatur müssen nicht gleich sein.', false, function () {
                    reloadMatrixTable();
                });
            }
            else {
                berechneHeizlast();
                reloadMatrixTable();
            }
            break;

        case 'raum_watt_text':
            if (!exist(v)) {
                currentHeizlast = "1000";
                reloadMatrixTable();
            }
            else if (v < 100 || v > 16000 || !isNumber(v)) {
                $('#' + id).val(defaultVal);
                showDialog($('#layer_info').text(), $('#msg_raum_watt_warning').text(), false, function () {
                    reloadMatrixTable();
                });
            }
            else {
                reloadMatrixTable();
            }
            break;
        case 'bestand_glieder_text':
        case 'bestand_tiefe_text':
        case 'bestand_hohe_text':
        case 'raum_groesse':
            if (v <= 0 || !isNumber(v)) {
                $('#' + id).val(defaultVal);
                $('#bestand_waermeleistung').val('0');
                showDialog($('#layer_info').text(), $('#msg_waermeleistung_warning').text(), false, function () {
                    reloadMatrixTable();
                });
            } else {
                berechneHeizlast();
                reloadMatrixTable();
            }
            break;
    }


}

function onChangeMessage(id, defaultVal) {
    $('.info_table').html('');
    $('#' + id).focusout(function (e) {
        // if (e.keyCode == 13) {
        validField(id, defaultVal);
        //   }
    });
    if (!mobil) {
        //consoleLog("broswer");
        $('#' + id).keyup(function () {
            setTimeout(function () {
                validField(id, defaultVal);
            }, 2000)
        });
    }
}


/*ELEMENTE DEACTIVIEREN*/
function deactivElem(idOrClass, deactiv) {
    var op = 1;
    var elems = ['input', 'select', 'button'];
    if (deactiv == true) {
        for (var i = 0; i < elems.length; i++) {
            $('.' + idOrClass + ' ' + elems[i]).prop('disabled', 'true');
            $('#' + idOrClass + ' ' + elems[i]).prop('disabled', 'true');
        }
        op = 0;
        // $('#' + idOrClass).css('opacity', '0.3');
    }
    else {
        for (var i = 0; i < elems.length; i++) {
            $('.' + idOrClass + ' ' + elems[i]).prop('disabled', null);
            $('#' + idOrClass + ' ' + elems[i]).prop('disabled', null);
        }

    }

    $('.' + idOrClass).animate({
        opacity: op,
    }, 200);

}

function setHeight(h) {
    localStorage.setItem('height', h);
    currentHeight = h;
    reloadMatrixTable();
}

function setHeightTherm(h) {
    currentThermHeight = h;

    if (currentThermHeight == '740' || currentThermHeight == '1820') {
        if ($('#breite_5').length == 0 && logetherm_breite.length < 5) {
            logetherm_breite.push(950);
            logatherm_waermeleistungen.push(0);
        }
    }
    else {
        if ($('#breite').length != 0) {
            logetherm_breite.slice(5, 1);
            logatherm_waermeleistungen.splice(5, 1);
        }
    }
    reloadMatrixTable();

    $('.info_content').html('');
    $('.info_panel').css("display", "none");

}

function setAnschluss(anschluss) {
    // console.log("<<<<<<<<<<"+ anschluss);
    currentAnschluss = anschluss;
    reloadMatrixTable();
}


function setFarbetTherm(f) {
    currentFarbe = f;
    reloadMatrixTable();
    $('.info_content').html('');
    $('.info_panel').css("display", "none");
}

function setAusfuehrungTherm(a) {
    currentAusfuehrung = a;
    reloadMatrixTable();
    $('.info_content').html('');
    $('.info_panel').css("display", "none");
}

function setProfile(p) {

    initProfilPlan();
    $('.td_temp').css('visibility', 'visible');
    $('.content_profil_plan').css('display', 'block');
    $('.therm_content').css('display', 'none');

    localStorage.setItem('type', p);
    heizkoerperTyp = p;
    $('#ventil_title').text(p);
    if (heizkoerperTyp == 'CV-Profil' || heizkoerperTyp == 'C-Profil' || heizkoerperTyp == 'CV-Plan' || heizkoerperTyp == 'C-Plan') {
        Hoehen = HoehenCV;
        Typen = TypenCV;
        Laengen = LaengenCV
        currentHeight = currentHeightCV;
    } else {
        //$(".ventil_panel").css('display', 'block');
    }
    if (heizkoerperTyp == 'CV-Profil' || heizkoerperTyp == 'CV-Plan') {
        Laengen = [300, 400, 500, 600, 700, 900];
        Typen = [10, 20, 21, 22];
        Hoehen = [1400, 1600, 1800, 2000, 2200, 2400];
        currentHeight = 1800;
    } else {
        Hoehen = [300, 400, 500, 600, 900];
        Typen = [10, 11, 20, 21, 22, 30, 33];
        Laengen = [400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2300, 2600, 3000];
        currentHeight = 600;
    }
    reloadMatrixTable();
    $('#zubehoert_profil').text("Zubehör für " + p);
    // onChangeMenu('tabs_calculation')
}


function htmlDecode(value) {
    return $('<div/>').html(value).text();
}


//PREISE UND RABATT HOLEN
function readArtikelDetails(artikelnummer) {
    var array = [];
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            var fileContent = this.responseText.toString().split('\n');
            for (var i = 0; i < fileContent.length; i++) {
                if (fileContent[i].indexOf(artikelnummer) > -1) {
                    var lineContents = fileContent[i].split(';');
                    array.push({
                        artikelnummer: lineContents[0],
                        preis: lineContents[1],
                        rabatt: lineContents[2]
                    });
                    break;
                }
            }
            localStorage[artikelnummer] = JSON.stringify(array);
        }
    };
    xmlhttp.open("GET", "csv/preise.csv", true);
    xmlhttp.send();

}


function activeButton(elem, isSeleted) {
    elem = elem.toString().replace('/', '_');
    var el = "";

    if ($('.' + elem).length > 0) {
        el = '.' + elem;
    }
    else {
        el = "#" + elem.toString().replace(' ', '');
    }
    consoleLog("<<<<<<<< " + el);
    if ($(el).length > 0) {
        if (isSeleted == true) {
            $(el).css('background-color', backgroundColorButton_activ);
            $(el).css('color', colorButtonText_activ);
            consoleLog("Element: " + elem + " active");
        } else {
            $(el).css('background-color', backgroundColorButton);
            $(el).css('color', colorButtonText);
            consoleLog("Element: " + el + " iactive");

        }
    }
}

function reloadMatrixTable() {
    $('.right_panel').fadeOut("slow");
    Heizlast = $('#raum_watt_text').val();
    Vorlauf = $('#temp_vor_text').val();
    Ruecklauf = $('#temp_rueck_text').val();
    Raumtemperatur = $('#temp_text').val();
    setCalculation();
    // $('.loadingImg').css('display', 'none');
    activeButton("id_" + currentAnschluss, true);
    activeButton("id_" + currentHeight, true);
    activeButton("id_" + currentThermHeight, true);
    activeButton("id_" + currentFarbe, true);
    activeButton(currentAusfuehrung, true);
    $('.info_content').html("");

};


function setCalculation() {
    ergebnis = [];
    if (exist(localStorage["flach_calc"])) {
        var flach_calc = JSON.parse(localStorage["flach_calc"]);


        var nenner = 49.8328865456397;

        var typArray = Typen;
        var _heigh = currentHeight;

        var hktyp = heizkoerperTyp.replace(/ /g, '').replace(/\n/g, '');

        if (heizkoerperTyp.indexOf('Therm') > -1) {
            typArray = logetherm_breite;
            _heigh = currentThermHeight;
        }
        consoleLog("typen:" + typArray);

        for (var j = 0; j < typArray.length; j++) {
            for (var a = 0; a < flach_calc.length; a++) {
                //consoleLog('csv heizkoerper: '+ flach_calc[a].heizkoerper + ' heizkoerperTyp: '+ heizkoerperTyp);
                var _hktyp = flach_calc[a].heizkoerper.replace(/ /g, '').replace(/\n/g, '');
                if (_hktyp == hktyp) {
                    if (typArray[j] == flach_calc[a].typ && _heigh == flach_calc[a].hoehe) {
                        consoleLog('Heizköroertyp: ' + flach_calc[a].heizkoerper + 'hoehe :' + _heigh + ' db typ: ' + flach_calc[a].typ + ' Normwert:' + flach_calc[a].normwert + ' typArray[j]: ' + typArray[j]);
                        consoleLog('currentHeight');
                        var normwert = parseInt(flach_calc[a].normwert);
                        var faktorString = (flach_calc[a].faktor).toString().replace(',', '.');
                        var faktor = parseFloat(faktorString);
                        inhalt_gewicht.push({
                            inhalt: flach_calc[a].liter,
                            gewicht: flach_calc[a].gewicht
                        });
                        HLT = (((parseInt(Vorlauf) - parseInt(Ruecklauf)) / Math.log((parseInt(Vorlauf) - parseInt(Raumtemperatur)) / (parseInt(Ruecklauf) - parseInt(Raumtemperatur)))) / nenner);
                        ergebnis.push(normwert * (Math.pow(HLT, faktor)));
                    }
                }
            }
        }
        if (!isNaN(ergebnis[0])) {
            createMatrixTable();
            createLogaTable();

        }
        consoleLog('Ergebnis:' + ergebnis);
    }
}

var calculate_kv = function (durchfluess) {
    var konstant = 0.86;
    var V = konstant * ((durchfluess / 1000) / (Vorlauf - Ruecklauf));
    var KV = V / Math.sqrt((parseInt($('#ventildif_text').val()) / 1000));
    KV_Wert = Math.round(KV * 100) / 100;

    var KV_String = null;
    if (KV_Wert.toString().length > 4) {
        KV_String = KV_Wert.toString().substr(0, 4);
    } else {
        KV_String = KV_Wert.toString();
    }
    $("#KV_text").val(KV_String);

    currentKV = KV_Wert;
    determineVentil();
};

var determineVentil = function () {
    if (exist(localStorage.getItem("ventil_fluessig")) && exist(localStorage.getItem("ventil_gas"))) {
        Ventil_Fluessig = JSON.parse(localStorage.getItem("ventil_fluessig"));
        Ventil_Gas = JSON.parse(localStorage.getItem("ventil_gas"));
    }


    consoleLog(Ventil_Fluessig.length);
    consoleLog(Ventil_Gas.length);
    if ($("#radioForm input[type= 'radio']:checked").val() == 1) {
        fluessig = true;
    }
    else {
        fluessig = false;
    }
    var index_1 = null,
        index_2 = null;
    if (fluessig) {
        var index = 0;


        for (var i = 0; i < Ventil_Fluessig.length; i++) {
            if (KV_Wert == Ventil_Fluessig[i].kv) {
                if (index == 0) {
                    index_1 = i;
                } else {
                    index_2 = i;
                }
                index++;
            }
        }
        if (index_1 != null) {
            einbauVentil_1 = Ventil_Fluessig[index_1].ventil + '' + Ventil_Fluessig[index_1].einstellzahl;
            //standartVentil= einbauVentil_1;

        } else {
            einbauVentil_1 = null;
        }
        if (index_2 != null) {
            einbauVentil_2 = Ventil_Fluessig[index_2].ventil + '' + Ventil_Fluessig[index_2].einstellzahl;
            // standartVentil= einbauVentil_2;

        } else {
            einbauVentil_2 = null;
        }
    } else {
        var index = 0;
        for (var i = 0; i < Ventil_Gas.length; i++) {
            if (KV_Wert == Ventil_Gas[i].kv) {
                if (index == 0) {
                    index_1 = i;
                } else {
                    index_2 = i;
                }
                index++;
            }
        }
        if (index_1 != null) {
            einbauVentil_1 = Ventil_Gas[index_1].ventil + '' + Ventil_Gas[index_1].einstellzahl;
            // $("#ventilvoreinstellung").text(einbauVentil_1+" ");
            //standartVentil= einbauVentil_1;

        } else {
            einbauVentil_1 = null;
        }
        if (index_2 != null) {
            einbauVentil_2 = Ventil_Gas[index_2].ventil + '' + Ventil_Gas[index_2].einstellzahl;
            // $("#ventilvoreinstellung").text(einbauVentil_2+" ");
            // standartVentil= einbauVentil_1;

        } else {
            einbauVentil_2 = null;
        }
    }
    if (einbauVentil_1 != null) {
        //  $('#einstellzahlButton1').text(einbauVentil_1);
        $('#einstellzahlButton1').css('display', 'block');

        if (einbauVentil_2 == null) {
            activeButton('einstellzahlButton1', true)
        }

    } else {
        /*
         $('#einstellzahlButton1').text(' ');
         $('#einstellzahlButton1').css('background-color', '#3c3c3b;color:white');
         $('#einstellzahlButton2').css('color', '#000');
         */
        $('#einstellzahlButton1').css('display', 'none');
    }
    if (einbauVentil_2 != null) {
        $('#einstellzahlButton2').text(einbauVentil_2);
        $('#einstellzahlButton2').css('display', 'block');
        //standartVentil= einbauVentil_2;
        // $("#ventilvoreinstellung").text(einbauVentil_2+" ");

        if (einbauVentil_1 == null) {
            activeButton('einstellzahlButton2', true);
        }
    }
    if (einbauVentil_2 == null && einbauVentil_1 == null) {
        $('#ventil_ventil').css('visibility', 'hidden')
    }
    if (einbauVentil_2 != null || einbauVentil_1 != null) {
        $('#ventil_ventil').css('visibility', 'visible')
    }
    else {
        $('#einstellzahlButton2').css('display', 'none');

    }
};


/*

 function countAll(callbackOver){
 doQuery('SUM(DISTINCT table_rows)','INFORMATION_SCHEMA.TABLES','TABLE_SCHEMA', 'Easyplanpro', function (callback) {
 consoleLog('CountAll: ' +callback[0]);
 callbackOver(callback);
 });
 }
 */
