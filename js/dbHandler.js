

//Fachkörper auslesen

function readFlachCalc(callbackOver) {

    flach_calc = [];
    doQuery("*", "flach_calc", null, null,null,null, function (callback) {
        for (var i = 0; i < callback.length; i++) {
            flach_calc.push({
                heizkoerper: callback[i].heizkoerper,
                hoehe: callback[i].hoehe,
                typ: callback[i].typ,
                faktor: callback[i].faktor,
                normwert: callback[i].normwert,
                liter: callback[i].liter,
                gewicht: callback[i].gewicht
            });
        }
        callbackOver(callback);
        localStorage["flach_calc"] = JSON.stringify(flach_calc);

        /*
         setTimeout(function () {
         setProfile('VC-Profil');
         $('#VC-Profil').click();
         }, 1500);
         */

    });

}



//DATEN NACH TYP HOLEN
function getAllProfilPlanData(callbackOut) {
    try {
        var array = [];
        var vc_plan = [], vcm_plan = [], c_plan = [], cv_plan = [], vc_profil = [], vcm_profil = [], c_profil = [],
            cv_profil = [];
        var therm_direct = [], therm_direct_E = [], therm_curve = [], therm_curve_E = [];

//SELECT DISTINCT Nummer, HEIDi.svTyp, AUSF, Hoehe, Tiefe, Laenge, Typ, Einbauventil, HEIDi.kurz_1, HEIDi.kurz_2, HEIDi.Preis,rabatt, bild FROM HEIDi INNER JOIN buderus on HEIDi.Nummer = buderus.produkt
        doQuery("Nummer, HEIDi.svTyp, AUSF, Hoehe, Tiefe, Laenge, Typ, Einbauventil, buderus.Kurz_1, buderus.Kurz_2, buderus.Preis, buderus.rabatt, bild ", "HEIDi", "buderus","HEIDi.Nummer = buderus.produkt", null,null, function (callback) {
            for (var i = 0; i < callback.length; i++) {
                var aufs = (callback[i].AUSF).toLowerCase();
                var result= [];
                result.push({
                    typ: callback[i].Typ,
                    ventil: callback[i].Einbauventil,
                    kurz_1: callback[i].Kurz_1,
                    artikelnummer: callback[i].Nummer,
                    svTyp: callback[i].svTyp,
                    ausf: callback[i].AUSF,
                    hoehe: callback[i].Hoehe,
                    tiefe: callback[i].Tiefe,
                    breite: callback[i].Laenge,
                    kurz_2: callback[i].Kurz_2,
                    preis: ' ' + callback[i].Preis,
                    rabatt: callback[i].rabatt,
                    bild: callback[i].bild

                });


                switch (aufs) {
                    case 'cv-plan': {
                        cv_plan= cv_plan.concat(result);
                        break;
                    }
                    case 'cv-profil': {
                        cv_profil=cv_profil.concat(result);
                        break;
                    }
                    case 'vc-plan': {
                        vc_plan=vc_plan.concat(result);
                        break;
                    }
                    case 'vc-profil': {
                        vc_profil=vc_profil.concat(result);
                        break;
                    }
                    case 'c-plan': {
                        c_plan=c_plan.concat(result);
                        break;
                    }
                    case 'c-profil': {
                        c_profil=c_profil.concat(result);
                        break;
                    }
                    case 'vcm-plan': {
                        vcm_plan=vcm_plan.concat(result);
                        break;
                    }
                    case 'vcm-profil': {
                        vcm_profil=vcm_profil.concat(result);
                        break;
                    }
                    case 'therm direct': {
                        therm_direct=therm_direct.concat(result);
                        break;
                    }
                    case 'therm direct elektrische ausführung': {
                        therm_direct_E=therm_direct_E.concat(result);
                        break;
                    }
                    case 'therm curve': {
                        therm_curve=therm_curve.concat(result);
                        break;
                    }
                    case 'therm curve elektrische ausführung': {
                        therm_curve_E=therm_curve_E.concat(result);
                        break;
                    }

                    default : {

                    }
                }
                if (i == callback.length - 1) {
                    callbackOut(callback);
                }
            }
            consoleLog('vc_plan: ' + vc_plan.length + " elems");
            consoleLog('c_plan: ' + c_plan.length + " elems");
            consoleLog('cv_plan: ' + cv_plan.length + " elems");
            consoleLog('vc_profil: ' + vc_profil.length + " elems");
            consoleLog('vcm_plan: ' + vcm_plan.length + " elems");
            consoleLog('vc_plan: ' + vc_plan.length + " elems");
            consoleLog('c_profil: ' + c_profil.length + " elems");
            consoleLog('cv_profil: ' + cv_profil.length + " elems");

            consoleLog("therm-direct: " + therm_direct.length);
            consoleLog("therm-direct e: " + therm_direct_E.length);
            consoleLog("therm-curve: " + therm_curve.length);
            consoleLog("therm-curve e: " + therm_curve_E.length);


            localStorage["therm-direct"] = JSON.stringify(therm_direct);
            localStorage["therm-direct-e"] = JSON.stringify(therm_direct_E);
            localStorage["therm-curve"] = JSON.stringify(therm_curve);
            localStorage["therm-curve-e"] = JSON.stringify(therm_curve_E);

            //   localStorage[type] = JSON.stringify(array);
            localStorage["vc-plan"] = JSON.stringify(vc_plan);
            localStorage["c-plan"] = JSON.stringify(c_plan);
            localStorage["cv-plan"] = JSON.stringify(cv_plan);
            localStorage["vc-profil"] = JSON.stringify(vc_profil);
            localStorage["vcm-profil"] = JSON.stringify(vcm_profil);
            localStorage["vcm-plan"] = JSON.stringify(vcm_plan);
            localStorage["c-profil"] = JSON.stringify(c_profil);
            localStorage["cv-profil"] = JSON.stringify(cv_profil);
        });
        //THERM DATEN HOLEN

    }
    catch (e) {
        consoleLog(e.message);
    }

}



function getLongDescriptionByArtikelnumber(artikelnummer) {
    if (heizkoerperTyp.indexOf("Therm") > -1) {
        artikelnummer = localStorage.getItem("currentThermArtNr");
    }

    if (exist($('#desk_dialog'))) {
        $('#desk_dialog').remove();
    }
    var langtext = [];
    var content = '<div  id="desk"><img style="padding-left: 53%; padding-top: 50% "  id="loadImg" src="images/spinner.gif" width="100px"></div>';

    doQuery("gesamt", "buderus",null,null, "produkt like " + artikelnummer,null, function (callback) {
        if (callback.length > 0) {
            content = '<textarea   disabled="yes" readonly id="desk" style="width: 100%;  resize: none; background-color: white; border: none; color: black;display: block; height: 350px;">' + callback[0].gesamt + '</textarea>';
        } else {
            content = '<textarea   disabled="yes" readonly id="desk" style="width: 100%;  resize: none; background-color: white; border: none; color: #000000; display: block; height: 350px;">Für dieses Produkt gibt es leider keine Beschreibung</textarea>';
        }
        $('#loadImg').fadeOut();
        var dialogContent = '<div style="max-height: 550px; margin-left: 8%; overflow-y: scroll" id="desk_dialog"><b>' + $('#layer_info').text() + '</b><br />' + htmlDecode(content) + '</div>';

        BootstrapDialog.show({

            title: $('#prodno').text() + ': ' + artikelnummer,
            message: dialogContent,
            buttons: [{
                label: 'OK',
                action: function (dialog) {
                    dialog.close();
                }
            }]
        });

    });
}



function getVentilData(callbackOut) {
    $('#loading_label').text('Ventildaten werden geladen...');

    doQuery("*", "heidi_ventil", null, null, null,null, function (callback) {
        for (var i = 0; i < callback.length; i++) {
            switch (callback[i].typ) {
                case 'fluessig': {
                    Ventil_Fluessig.push({
                        'typ': callback[i].typ,
                        'einstellzahl': callback[i].einstellzahl,
                        'kv': callback[i].kv,
                        'ventil': callback[i].ventil
                    });
                }
                case 'fluessig': {
                    Ventil_Gas.push({
                        'typ': callback[i].typ,
                        'einstellzahl': callback[i].einstellzahl,
                        'kv': callback[i].kv,
                        'ventil': callback[i].ventil
                    });
                }
                default: {

                }
            }
            if (i == callback.length - 1) {
                callbackOut(callback);
            }
        }

        consoleLog("ventil-fluessig: " + Ventil_Fluessig.length);
        consoleLog("ventil-gas: " + Ventil_Gas.length);

        localStorage.setItem("ventil_fluessig", JSON.stringify(Ventil_Fluessig));
        localStorage.setItem("ventil_gas", JSON.stringify(Ventil_Gas));


    });


}

//ZUBEHÖRE HOLEN
function getAllZubehoert(callbackOut1) {
    $('#loading_label').text('Zubehör wird geladen...');
    try {
        doQuery("kat_4.id, nav_1, nav_3, nav_2, kat_4.produkt, kat_4.svTyp, bild, einheit, preis, rabatt, CONCAT(kurz_1,' ',kurz_2) AS text", "kat_4", "buderus","kat_4.produkt=buderus.produkt",null, "zahl", function (callback) {
            if (callback.length > 0) {
                localStorage.setItem("zubehoere", JSON.stringify(callback));
                callbackOut1(callback);
            } else {
                callbackOut1(null);
            }
            consoleLog("zubehoere: " + callback.length + " elems")
        });
    }
    catch (e) {
        console.error('Die Zubehoere könnte nicht geladen werden')
        console.error(e.message);
        callbackOut1(null);
    }
}