/**
 * Created by gioshakara on 13.01.17.
 */


//var languages = ["be","ch","cz","de","fr","gr","hr","hu","it","lu","nl","pl","si","sk","ua","us"];

var languages = ["de", "be", "cz", "ch", "fr", "gr", "hr", "hu", "it", "lu", "nl", "pl", "si", "sk", "ua"];
mobil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log(window.navigator.appName);

device = "";
function setDevice(value) {
    device = value;
}

var HeaterType = null;

var iconSelect;

function logoResize() {
    var selectLogoImage = $('#img-container');
    var leftNavContainerWidth = $('#left_nav_container').width();
    var logoContainerWidth = selectLogoImage.width();
    var logoMargin = (leftNavContainerWidth-logoContainerWidth)/2;
    selectLogoImage.css("margin-left", logoMargin+"px");
}

window.onresize = function(){ logoResize() };

$(document).ready(function () {

    logoResize();

    //Enter Taste
    document.onkeypress = function (event) {
        if (event.keyCode == 13) {
            var found = false;
            if ($("#raum_watt_text").is(":focus")) {
                $( "#raum_watt_text" ).blur();
            }
            if ($("#temp_vor_text").is(":focus")) {
                $( "#temp_vor_text" ).blur();
            }
            if ($("#temp_rueck_text").is(":focus")) {
                $( "#temp_rueck_text" ).blur();
            }
            if ($("#temp_text").is(":focus")) {
                $( "#temp_text" ).blur();
            }
            if ($("#ventildif_text").is(":focus")) {
                $( "#ventildif_text" ).blur();
            }
            if ($("#raum_groesse").is(":focus")) {
                $( "#raum_groesse" ).blur();
            }
            if ($("#bestand_hohe_text").is(":focus")) {
                $( "#bestand_hohe_text" ).blur();
                //$("#bestand_tiefe_text").focus();
                //found = true;
            }
            if ($("#bestand_tiefe_text").is(":focus") && !found) {
                $( "#bestand_tiefe_text" ).blur();
                //$("#bestand_glieder_text").focus();
                //found = true;
            }
            if ($("#bestand_glieder_text").is(":focus") && !found) {
                $( "#bestand_glieder_text" ).blur();
                //$("#bestand_temp_vor_text").focus();
                //found = true;
            }
            if ($("#bestand_temp_vor_text").is(":focus") && !found) {
                $( "#bestand_temp_vor_text" ).blur();
                //$("#bestand_temp_rueck_text").focus();
                //found = true;
            }
            if ($("#bestand_temp_rueck_text").is(":focus") && !found) {
                $( "#bestand_temp_rueck_text" ).blur();
                //$("#bestand_temp_raum_text").focus();
                //found = true;
            }
            if ($(".list-name-input").is(":focus")) {
                $( ".save-list" ).click();
            }

        }
    };


    isConsoleOn = true;
    // mobil= true;

    if (mobil) {
        consoleLog('*******  MOBILE DEVISE **********');
    } else {
        consoleLog('*******  WEB DEVISE **********')
    }

    if (exist(localStorage.getItem('languages'))) {
        languages = JSON.parse(localStorage.getItem('languages'));
    }

    $('#C-Profil').text('C-Profil');
    $('#VC-Profil').text('VC-Profil');
    $('#VCM-Profil').text('VCM-Profil');
    $('#CV-Profil').text('CV-Profil');

    $('#C-Plan').text('C-Plan');
    $('#VC-Plan').text('VC-Plan');
    $('#VCM-Profil').text('VCM-Profil');
    $('#CV-Profil').text('CV-Profil');

    $('#Therm-Direct').text('Therm Direct');
    $('#Therm-Direct-E').text('Therm Direct E');
    $('#Therm-Curve').text('Therm Curve');
    $('#Therm-Curve-E').text('Therm Curve E');


    /*
     if(are_cookies_enabled()){
     alert('enable');
     }else{
     alert('not enable')

     var store = new Persist.Store('easyplanpro');
     localStorage.prototype.setItem= function (v1, v2) {
     store.set(v1, v2);
     };
     localStorage.prototype.getItem= function (v) {
     store.get(v);
     };

     }
     alert(localStorage.getItem('test'));

     */

    /*
     if(localStorage.getItem('language') == null){
     $(".transparent-layer").css("display","block");
     }
     */
    /*
     if(localStorage.getItem("language") != null){
     var lang = localStorage.getItem("language");
     $(".img-language").attr('src', "language/flags/" + lang + ".png");
     setLanguage(lang + ".xml")
     }
     */

    $(".img-language").on('click', function () {
        $(".transparent-layer").css("display", "block");
    });

    $(".img-hamburger").on('click', function () {
        if ($(".hamburger_menu").css("display") == 'none') {
            $(".img-hamburger").attr('src', "images/icon-close.png");
            $(".hamburger_menu").css('display', 'block');
        } else {
            $(".img-hamburger").attr('src', "images/icon-hamburger.png");
            $(".hamburger_menu").css('display', 'none');
        }
    });


    //language selection


    iconSelect = new IconSelect("my-icon-select");

    document.getElementById('my-icon-select').addEventListener('changed', function (e) {
        setLanguage(iconSelect.getSelectedValue());
    });

    var icons = [];
    //var languageSelection = "<select class='languages-content'>";
    for (var l = 0; l < languages.length; l++) {
        icons.push({'iconFilePath': 'language/flags/' + languages[l] + '.png', 'iconValue': languages[l] + '.xml'});
    }
    iconSelect.refresh(icons);
});


function are_cookies_enabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
}

// XML Parser
function setLanguage(lang) {
    try {
        // change flag icon
        // $(".img-language").attr('src', "language/flags/" + lang.replace(".xml","") + ".png");

        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for older browsers
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {


            if (mobil || (this.readyState == 4 && this.status == 200)) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                // if(exist(xmlDoc.getElementsByTagName("root")[0])) {
                var root = xmlDoc.getElementsByTagName("root")[0].childNodes;
                var terms = [];
                for (var t = 1; t < root.length; t++) {
                    if (t % 2 == 1) {
                        // XML Begriffe in assoziativen Array speichern: NodeName : Value
                        terms[root[t].nodeName] = root[t].getAttribute("value");
                    }
                }

                //texte übersetzen
                $(".button-types").html(terms['typ']);
                $(".button-calculation").html(terms['layer_main']);
                $(".button-accessories").html(replaceUmlauts(terms['layer_zub_spez']));
                $(".button-report").html(replaceUmlauts(terms['layer_report']));
                $(".button-bestand").html(replaceUmlauts(terms['bestand']));
                $(".button-imprint").html(replaceUmlauts(terms['imprint']));
                $('#bestand_bedarf').text(replaceUmlauts(terms['bestand_bedarf']));
                $('#bestand_radiator').text(replaceUmlauts(terms['bestand_radiator']));

                $('.raum_kueche').text(replaceUmlauts(terms['raum_kueche']));
                $('.raum_wohn').text(terms['raum_wohn']);
                $('.raum_schlaf').text(terms['raum_schlaf']);
                $('.raum_kind').text(terms['raum_kind']);
                $('.raum_bad').text(terms['raum_bad']);
                $('.raum_flur').text(terms['raum_flur']);
                $('.raum_treppe').text(terms['raum_treppe']);
                $('.raum_wc').text(terms['raum_wc']);


                // $('#selected_room').text(terms['raum_kueche']);

                $('.speichern').text(replaceUmlauts(terms['speichern']));
                $('.zu_projekt').text(replaceUmlauts(terms['zu_projekt']));
                $('#projekt').text(replaceUmlauts(terms['projekt']));
                $('#leistung').text(replaceUmlauts(terms['leistung']));
                $('#bestand_raumgroesse').text(replaceUmlauts(terms['bestand_raumgroesse']));
                $('.einstell').text(replaceUmlauts(terms['einstell']));
                $('.ventil').text(replaceUmlauts(terms['ventil']));
                $('.heizk').text(replaceUmlauts(terms['heizk']));

                $('#ventil_liefer2').text(replaceUmlauts(terms['ventil_liefer2']));
                $('#ventil_einbau_vorein').text(replaceUmlauts(terms['ventil_einbau_vorein']));
                $('#ventil_liefer').text(replaceUmlauts(terms['ventil_liefer']));

                $('#ventil_laut').text(replaceUmlauts(terms['ventil_laut']));

                $('#layer_info').text(replaceUmlauts(terms['layer_info']));

                $('#msg_bestand_bedarf').text(replaceUmlauts(terms['msg_bestand_bedarf']));
                $('#msg_bestand_radiator').text(replaceUmlauts(terms['msg_bestand_radiator']));


                var htmlVals = document.getElementsByTagName("*");
                for (var i = 0; i < htmlVals.length; ++i) {
                    var v = htmlVals[i].getAttribute("class");
                    if (terms[v] != null) {
                        $('.' + v).text(replaceUmlauts(terms[v]));
                        $('.' + v).html(replaceUmlauts(terms[v]));
                    }
                }
            }
        }

        ;
        xmlhttp.open("GET", "language/xml/" + lang, true);
        xmlhttp.send();

        lang = lang.replace(".xml", "");

        var temp = languages[0];
        for (var i = 0; i < languages.length; i++) {
            if (languages[i] == lang) {
                languages[0] = lang;
                languages[i] = temp;
                break;
            }
        }
        localStorage["languages"] = JSON.stringify(languages);

        localStorage.setItem("language", lang);
        //$(".transparent-layer").css("display", "none");

    }

    catch (e) {
        console.error(e.message);
    }
}


function replaceAllUmlaut(value) {
    value = value.replace(/ö/g, 'oe');
    value = value.replace(/Ö/g, 'Oe');
    value = value.replace(/ä/g, 'ae');
    value = value.replace(/Ä/g, 'Ae');
    value = value.replace(/ü/g, 'ue');
    value = value.replace(/Ü/g, 'Ue');
    value = value.replace(/ß/g, 'ss');


    return value;
}


function replaceUmlauts(value) {
    value = value.replace(/Ă¶/g, 'ö');
    value = value.replace(/Ă¤/g, 'ä');
    value = value.replace(/ĂĽ/g, 'ü');
    value = value.replace(/Ăź/g, 'ß');
    value = value.replace(/Ăś/g, 'Ü');
    //value = value.replace(/\[b]/g, '<b>');
    //value = value.replace(/\[\*b]/g, '</b>');
    value = value.replace(/##/g, '');

    /*
     value = value.replace(/&#246;/g, '&ouml');
     value = value.replace(/&#xF6;/g, '&ouml');


     value = value.replace(/ä/g, '&auml;');
     value = value.replace(/ö/g, '&ouml;');
     value = value.replace(/ü/g, '&uuml;');
     value = value.replace(/##/g, '');
     value = value.replace(/Ä/g, '&Auml;');
     value = value.replace(/Ö/g, '&Ouml;');
     value = value.replace(/Ü/g, '&Uuml;');
     value = decodeURIComponent(value);
     */
    return value;
}

function datenschutzPop(){

$("#datenschutzContainer").fadeIn(function () {
    $("#Datenschutz").slideDown(300);
});


}

function datenschutzclose() {
    $("#Datenschutz").slideUp(function () {
        $("#datenschutzContainer").fadeOut(200);
    });

}



