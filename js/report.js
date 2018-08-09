/**
 * Created by marvinvounkeng on 04.04.17.
 */
msg_delete_dialog = $('#msg_removeReport').text();
msg_delete_report_dialog = 'Sollen die Report-und Zugehörlisten gelöscht werden?';
var ReportList = [];
var utilListe = [];
currentLastReportID = 0;
currentLastSavedreportID = 0;
reportSavedListe = [];
currentReportTableData = '';
currentUtilsTableData = '';

kundenData = [];

$(document).ready(function () {
    $('#back-to-report').on('click', function () {
        $('#shop-panel').css('display', 'none');
        $('#report').css('display', 'block')
    });
    $('#save_report').on('click', function () {

        saveListe();
    });
    $('#open_report').on('click', function () {
        showProjectsList();
    });
    /*

     $('iframe').load( function() {
     $('#login-frame').contents().find("#containerHeader")
     .append($("<style type='text/css'>  #containerHeader{display:none;}  </style>"));
     });
     */


    //OPEN ONLINE SHOP
    $('#open_shop').on('click', function () {
        if ($('#report_table_tbody tr').length > 0 || $('#utils_table_tbody tr').length > 0) {
            // $('#report').css('display', 'none');
            //$('#shop-panel').css('display', 'block');


            var itemsXML = '';
            for (var i = 0; i < ReportList.length; i++) {
                itemsXML += "<OrderItem><ArtNo>" + ReportList[i].artikelnummer + "</ArtNo><Qty>" + ReportList[i].anzahl + ".000</Qty></OrderItem>";
            }

            if (mobil) {
                if(device==="android"){
                    jsInterface.loadShopWebView(itemsXML);
                } else {
                    window.location = "getxml::" + itemsXML;
                }

            }
            else {
                BootstrapDialog.show({

                    size: BootstrapDialog.SIZE_WIDE,
                    title: "Online Shop",
                    onshow: function (dialogRef) {
                        $('#login-frame').src = "";
                        $(".modal-dialog ").css("width", "100%");
                        $('#warenkorbID2').val($('#warenkorbID2').val().replace('%%%CARTITEMS%%%', itemsXML));
                        setTimeout(function () {

                            var old = $('#login-frame').src;

                            document.getElementById('IDS-FORM').submit();
                            $('.loadingImg_auswahl').css('display', 'none');
                            $('#login-frame').src = old;
                            $('#login-frame').css('display', 'block');
                            $('#login-frame').css('height', '95%');
                        }, 1000);

                    },
                    message: '<div id="shop-content" style="height: 600px; width: 100%; overflow:scroll"><div style="display: block; width: 300px" class="loadingImg_auswahl"><img style="margin: 0 auto" src="images/spinner.gif" width="100px"><p>Shop wird geöffnet...</p></div><iframe style="width: 100%; overflow:scroll; height=95%"; name="login-frame" frameborder="0" id="login-frame" scrolling="yes"></iframe></div>',
                    buttons: [{
                        label: '<< Zurück zurm Report',
                        action: function (dialog) {
                            dialog.close();

                        }
                    }]
                });

            }

        }
        else {
            showDialog('Onlineshop', 'Die Artikelliste ist leer!', false, function () {
            });
        }
    });

    $('#delete_report').on('click', function () {
        if ($('#report_table_tbody tr').length <= 0 && $('#utils_table_tbody tr').length <= 0) {
            showDialog('Report löschen', 'Die Artikelliste ist leer!', false, function () {
            });
        }
        else {
            showDialog('Artikelliste löschen', msg_delete_report_dialog, true, function () {
                clearTable();
            });
        }
    });

    $('#send_report').on('click', function () {
        if ($('#report_table_tbody tr').length <= 0 && $('#utils_table_tbody tr').length <= 0) {
            showDialog('Report senden', 'Die Artikelliste ist leer!', false, function () {
            });
        }
        else {
            //Email dialog öffnen
            showMailForm();
        }
    });
    $('#print_report').on('click', function () {
        if ($('#report_table_tbody tr').length > 0 || $('#utils_table_tbody tr').length > 0) {
            self.print();
        }
        else {
            showDialog('Report drucken', 'Die Artikelliste ist leer!', false, function () {
            });
        }
    });


});


//PREPORT PER MAIL SENDEN
function showMailForm() {
    $('.form_dialog').html('');

    var mailDialog = '<div class="form_dialog" style="background-color: #EDEDED;visibility:visible; padding: 10px;height:500px;overflow: scroll; text-align: left;"title="Kundendaten"> ' +
        '<div style="padding:30px; background: #e3e3e3 !important;" class="panel panel-default">' +
        '<form  style=" height:400px">' +
        '<div  style="display: none" id="customer_nr_warning" class="ui-state-error ui-corner-all" style="padding: 0 .3em;"><p style="font-size:small"><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .2em;"></span>' +
        '<strong>' + $("#warning").text() + '</strong>' + $("#msg_ugs_bud").text() + '</p></div>' +
        ' <div class="row">' +
        '                                <div class="form-group">' +
        '                                    <div class="input-group">' +
        '                                        <span class=" input-group-addon">Buderus-Kundennummer</span>' +
        '                                        <input class="form-control" id="customer_nr"' +
        '                                               type="number"' +
        '                                               />' +
        '                                    </div>' +
        '                                </div>' +
        '                            </div>' +
        ' <div class="row">' +
        '                                <div style="width:100%" class="form-group">' +
        '                                    <div class="input-group">' +
        '                                        <span class=" input-group-addon addon-title ">Wunschlieferdatum(tt.mm.jjjj)</span>' +
        '                                        <input style="text-align: center"  id="datepicker" class="form-control" ' +
        '                                               type="date"' +
        '                                               value=""/>' +
        '                                    </div>' +
        '                                </div>' +
        '                            </div>' +
        '<div class ="row">' +
        '<div>Lieferanschrift</div>' +

        '<div style="float: left; width: 45%; padding-bottom: 10px">' +
        '<label for="radio-1">Standard Adresse</label>' +
        '<input checked="checked" onclick="setRadiobtn()" style="width:10%" type="radio" name="radio-1" id="radio-1" value="1">' +
        '</div>' +
        '<div style="float: right; width: 50%; padding-bottom: 10px">' +
        '<label for="radio-2">Abweichende Adresse</label>' +
        '<input onclick="setRadiobtn()" style="width:10%"  type="radio" name="radio-1" id="radio-2" value="2">' +
        '</div>' +
        '<table  id="customer_adress" style="width: 100%; opacity: 0.5">' +
        '<tr><td  style="width: 50%"><span>Name</span></td><td><input disabled="disabled"  class="form-control" id="customer_name" type="text"></td></tr>' +
        '<tr><td><span>Straße</span></td><td><input disabled="disabled"  class="form-control" id="street" type="text"  value=""></td></tr>' +
        '<tr><td><span>Hausnummer</span></td><td><input disabled="disabled"  class="form-control" id="houseNr" value=""  style="width:30%" type="number"></td></tr>' +
        '<tr><td><span>PLZ</span></td><td><input disabled="disabled"  class="form-control" id="plz" style="width:50%" type="number" value=""></td></tr>' +
        '<tr><td><span>Ort</span></td><td><input disabled="disabled"  class="form-control" id="city" style="width:100%" type="text" value=""></td></tr>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>' +

        '</div>';


    BootstrapDialog.show({
        title: 'Kundendaten',
        message: mailDialog,
        onshow: function (dialogRef) {

            $('.customer_adress input').prop('disabled', true);
            $(function () {
                $('input[type="radio"]').on('click', function () {
                    if ($('#radio-2').is(':checked')) {
                        $('.customer_adress').css('opacity', 1);
                        $('.customer_adress input').prop('disabled', false);
                    } else {
                        $('.customer_adress').css('opacity', 0.5);
                        $('.customer_adress input').prop('disabled', true);
                        $('.customer_adress input').val('');
                    }
                });
            });
        },

        buttons: [{
            label: 'Weiter >>',
            action: function (dialog) {
                var buKundenNr = $('#customer_nr').val();
                var name = $('#customer_name').val();
                var strasse = $('#street').val();
                var Hausnummer = $('#houseNr').val();
                var plz = $('#plz').val();
                var ort = $('#city').val();
                var adresse = name + "; " + strasse + " " + Hausnummer + "; " + plz + " " + ort;
                var isValid = true;
                var date = $('#datepicker').val().trim();

                if ($('#customer_nr').val().trim() == "") {
                    showAlert('Fehler', 'Der Kundennummer ist nicht gültig', 'customer_adress', 'danger');
                    isValid = false;
                }

                if (date == "") {
                    showAlert('Fehler', 'Das Datum ist nicht gültig', 'customer_adress', 'danger');
                    isValid = false;
                }


                if (!$('#radio-2').is(':checked')) {
                    adresse = "Standard Adresse";
                }
                else {
                    if ($('#customer_adress input').val() == "") {
                        showAlert('Fehler', 'Bitte geben Sie eine Adresse ein', 'customer_adress', 'danger');
                        isValid = false;

                    }
                }
                var wunschlieferdatum = new Date($('#datepicker').val().trim());
                wunschlieferdatum = wunschlieferdatum.getDate() + '.' + wunschlieferdatum.getMonth() + '.' + wunschlieferdatum.getFullYear();
                var kundenData = [];
                kundenData.push({
                    buKundenNr: buKundenNr,
                    name: name,
                    strasse: strasse,
                    hausnummer: Hausnummer,
                    plz: plz,
                    ort: ort,
                    wunschlieferdatum: wunschlieferdatum.toString()
                });
                var pdf = sendEMail(buKundenNr, name, strasse, Hausnummer, plz, ort, wunschlieferdatum);
                if(mobil && isValid)
                {
                    var jsonData= JSON.stringify(kundenData);
                    var jsonProductList = JSON.stringify(ReportList);
                    dialog.close();
                    var message = getMessageBoy(buKundenNr, adresse, wunschlieferdatum);
                    if(device==="android"){
                        jsInterface.sendMail(jsonData, message, jsonProductList);
                    } else {
                        window.location= "sendemailfromnativ::" +jsonData+ "::" + message + "::" + jsonProductList;
                    }

                }
                else if(isValid)
                {

                    var urldata = {
                        pdffile: pdf,
                        customer: buKundenNr
                    };
                    if (isValid == true) {

                        $.ajax({
                            type: "POST",
                            // url: 'http://localhost/db/upload.php',
                            url: 'http://knm.de/_AppShare/share/upload.php',
                            crossDomain: true,
                            global: true,
                            data: urldata,
                            success: function (response) {
                                openMail(buKundenNr, adresse, wunschlieferdatum, filename);
                                dialog.close();

                                consoleLog("Daten wurde gespeichern");
                                consoleLog(response);
                                return false;

                            },
                            error: function (xhr, textStatus, err) {
                                consoleLog("readyState: " + xhr.readyState);
                                consoleLog("responseText: " + xhr.responseText);
                                consoleLog("status: " + xhr.status);
                                consoleLog("text status: " + textStatus);
                                consoleLog("error: " + err);
                            }
                        });
                    }
                }

            }
        },
            {
                label: $('#abbrechen').text(),
                action: function (dialog) {
                    dialog.close();
                }
            },
        ]
    });


}

function isDate(date) {
    var valid = true;
    if (typeof date.split('.') !== 'undefined') {
        var date_arr = date.split('.');
        valid = date_arr.length == 3;
        valid = date_arr[0].length == 2;
        valid = date_arr[1].length == 2;
        valid = date_arr[2].length == 4;

    } else {
        valid = false;
    }
    return valid;
}

function setRadiobtn() {
    if ($('#radio-2').is(':checked')) {
        deactivElem('customer_adress', false);
    } else {
        deactivElem('customer_adress', true);

    }

}


//DATEIL FÜR EMAIL ERSTELLEN
var sendEMail = function (buKundenNr, name, strasse, hausnummer, plz, ort, wunschlieferdatum) {
    //  var report_string = '<table>',
    var report_string = '';
    zubehoer_string = '',
        kunden_string = '';
    bud = '';
    // var doc = new jsPDF('p', 'pt');
    doc = new jsPDF();
    var distFromTop = 20;
    doc.setFontSize(11);
    var budKundenNrString = '';
    var kundeString = '';
    var strasseString = '';
    var hausnummerString = '';
    var plzString = '';
    var ortString = '';

    if (buKundenNr != '') {
        budKundenNrString = buKundenNr;
        kunden_string += 'Kundennummer: ' + budKundenNrString + '<br/>';
        doc.text(10, distFromTop, 'Kundennummer: ' + budKundenNrString);
        distFromTop += 7;
    }

    if (name != '') {
        kundeString = name;
        kunden_string += 'Name: ' + name + '<br/>';
        doc.text(10, distFromTop, 'Kunde: ' + kundeString);
        distFromTop += 7;
    }
    if (strasse != '') {
        strasseString = strasse;
        kunden_string += 'Strasse: ' + strasse + '<br/>';
        doc.text(10, distFromTop, 'Strasse: ' + strasseString);
        distFromTop += 7;
    }
    if (hausnummer != '') {
        hausnummerString = hausnummer.toString();
        kunden_string += 'Hausnummer: ' + hausnummer + '<br/>';
        doc.text(10, distFromTop, 'Hausnummer: ' + hausnummer);
        distFromTop += 7;
    }
    if (plz != '') {
        plzString = plz;
        kunden_string += 'PLZ: ' + plz + '<br/>';
        doc.text(10, distFromTop, 'PLZ: ' + plz);
        distFromTop += 7;
    }
    if (ort != '') {
        ortString = ort.toString();
        kunden_string += 'Ort: ' + ort + '<br/><br/>';
        doc.text(10, distFromTop, 'Ort: ' + ortString);
        distFromTop += 7;
    }
    if (wunschlieferdatum != '') {
        kunden_string += 'Wunschlieferdatum  : ' + wunschlieferdatum + '<br/>';
        doc.text(10, distFromTop, 'Wunschlieferdatum: ' + wunschlieferdatum);
        distFromTop += 7;
    }

    distFromTop += 7;
    doc.text(10, distFromTop, 'Report');
    distFromTop += 7;
    doc.text(10, distFromTop, 'Raum                   Stueck  Artikelnummer       Typ           Temperatur        H/L/T       WL     EZ      KV    Ventil');


    var reportDistanceFromTop = distFromTop + 10;
    var rows = [];
    var space = '\xa0\xa0\xa0\xa0';


    for (var i = 0; i < ReportList.length; i++) {
        if (ReportList[i].typ == 'report') {
            // report_string+= '<tr>';
            bud += ReportList[i].artikelnummer + '    ' + ReportList[i].anzahl + '  ' + ReportList[i].kurztext + '   ' + ReportList[i].preis + '    ' + ReportList[i].rabatt + '\n';
            report_string += ReportList[i].raum + space + ReportList[i].anzahl + ' x ' + space + ReportList[i].artikelnummer + space + ReportList[i].heizkoerper + space + ReportList[i].temperatur + space + ReportList[i].hlt + space + ReportList[i].waermeleistung + space + ReportList[i].einstellzahl + space + ReportList[i].kv_wert + space + ReportList[i].ventil + '\n';

            var tempRaum = (ReportList[i].raum).toString();
            if (tempRaum == 'Küche') {
                tempRaum = 'Kueche';
            }
            if (tempRaum == 'Gäste WC') {
                tempRaum = 'Gaeste WC';
            }
            doc.text(10, reportDistanceFromTop, tempRaum);
            doc.text(43, reportDistanceFromTop, (ReportList[i].anzahl!==null?ReportList[i].anzahl:"").toString());
            doc.text(52, reportDistanceFromTop, (ReportList[i].artikelnummer!==null?ReportList[i].artikelnummer:"").toString());
            doc.text(80, reportDistanceFromTop, (ReportList[i].heizkoerper!==null?ReportList[i].heizkoerper:"").toString());
            doc.text(104, reportDistanceFromTop, (ReportList[i].temperatur!==null?ReportList[i].temperatur:"").toString());
            doc.text(125, reportDistanceFromTop, (ReportList[i].hlt!==null?ReportList[i].hlt:"").toString());
            doc.text(152, reportDistanceFromTop, (ReportList[i].waermeleistung!==null?ReportList[i].waermeleistung:"").toString());
            doc.text(167, reportDistanceFromTop, (ReportList[i].einstellzahl!==null?ReportList[i].einstellzahl:"").toString());
            doc.text(176, reportDistanceFromTop, (ReportList[i].kv_wert!==null?ReportList[i].kv_wert:"").toString());
            doc.text(190, reportDistanceFromTop, (ReportList[i].ventil!==null?ReportList[i].ventil:"").toString());
            reportDistanceFromTop += 7;
            if (reportDistanceFromTop > 270) {
                doc.addPage();
                reportDistanceFromTop = 20;
            }
        }
        else {
            bud += ReportList[i].zubehoer_artikelnummer + ' ' + ReportList[i].zubehoer_anzahl + '   ' + replaceAllUmlaut(ReportList[i].kurztext) + '   ' + ReportList[i].preis + '   ' + ReportList[i].rabatt + '\n';
            zubehoer_string += ReportList[i].zubehoer_anzahl + '   x    ' + ReportList[i].zubehoer_artikelnummer + '        ' + ReportList[i].kurztext + '\n';
        }
    }
    //  report_string+= '</table>';

    // doc.autoTable(columns, rows);

    if (reportDistanceFromTop > 270) {
        doc.addPage();
        zubehoerDistanceFromTop = 20;
    }
    var zubehoerDistanceFromTop = reportDistanceFromTop + 30;

    if (zubehoerDistanceFromTop > 270) {
        doc.addPage();
        zubehoerDistanceFromTop = 20;
    }
    if ($('#zubehoer_table tr').length > 1) {


        doc.text(10, zubehoerDistanceFromTop, 'Zubehoere');
        zubehoerDistanceFromTop += 7;
        if (zubehoerDistanceFromTop > 270) {
            doc.addPage();
            zubehoerDistanceFromTop = 20;
        }
        doc.text(10, zubehoerDistanceFromTop, 'Stueck  Artikelnummer     Kurztext');
        zubehoerDistanceFromTop += 7;
        if (zubehoerDistanceFromTop > 270) {
            doc.addPage();
            zubehoerDistanceFromTop = 20;
        }
    }
    for (var i = 0; i < ReportList.length; i++) {
        if (ReportList[i].typ != 'report') {
            doc.text(10, zubehoerDistanceFromTop, (ReportList[i].zubehoer_anzahl).toString());
            doc.text(20, zubehoerDistanceFromTop, (ReportList[i].zubehoer_artikelnummer).toString());

            var kurztextString = '';
            if (ReportList[i].kurztext != '') {
                kurztextString = replaceAllUmlaut(ReportList[i].kurztext);
            }

            doc.text(51, zubehoerDistanceFromTop, kurztextString.toString());

            zubehoerDistanceFromTop += 7;
            if (zubehoerDistanceFromTop > 270) {
                doc.addPage();
                zubehoerDistanceFromTop = 20;
            }
        }
    }


    var messageBody = "";
    if ($('#report_table tr').length > 1) {
        messageBody += kunden_string + '\nReport\nRaum' + space + 'Anzahl' + space + 'Artikelnummer' + space + 'Typ' + space + 'Temperatur' + space + 'H/L/T' + space + 'WL' + space + 'EZ' + space + 'kv-Wert' + space + 'Ventil\n\n' + report_string
    }
    if ($('#zubehoer_table tr').length > 1) {
        messageBody += '\nZubehoere\nAnz.' + space + 'Artikelnummer' + space + 'Kurztext\n\n' + replaceAllUmlaut(zubehoer_string);
    }


    //var messageBody = kunden_string + '\nReport\nRaum            Anz.    Artikelnummer     Typ          Temperatur     H/L/T            WL     EZ     kv-Wert      Ventil\n\n' + report_string + '\nZubehör\nAnz.   Artikelnummer    Kurztext\n\n' + zubehoer_string;

    emailPdf = doc.output();


    var email = '';
    var subject = 'DimmentionPRO';
    emailBody = decodeURIComponent(messageBody);
    //var attach = "http://knm.de/webapps/easyplanpro/report.pdf";
    var attach = "http://knm.de/webapps/easyplanpro/report_" + buKundenNr + ".pdf";

    filename = buKundenNr + '_report.pdf';

    function sav() {
        doc.save(filename);
    }


    return emailPdf;
};

function getPDF(doc) {
    doc.output('datauri');

}

//_________________________

function getMessageBoy(buKundenNr, adresse, Wunschlieferdatum){
    var td_style = 'border: 1px solid #dddddd;padding: 8px';
    var th_style = 'border: 1px solid #dddddd;padding: 8px; font-weight:bold';
    var td_style1 = 'padding: 8px; font-weight:bold; width:30%';
    if (ReportList.length > 0) {
        var report_table = '<table style="width: 90%; border-collapse: collapse" cellspacing="2">' +
            '                            <thead >' +
            '                            <tr>' +
            '                                <th style="' + th_style + '">Raum</th>' +
            '                                <th style="' + th_style + '">Stück</th>' +
            '                                <th style="' + th_style + '">Artikelnr.</th>' +
            '                                <th style="' + th_style + '">Heizkörper</th>' +
            '                                <th style="' + th_style + '">Temperatur</th>' +
            '                                <th style="' + th_style + '">H/L/T</th>' +
            '                                <th style="' + th_style + '">WL</th>' +
            '                                <th style="' + th_style + '">EZ</th>' +
            '                                <th style="' + th_style + '">KV</th>' +
            '                                <th style="' + th_style + '">Ventil</th>' +
            '                            </tr>' +
            '                            </thead>' +
            '                            <tbody >';

        var zubehoer_table = '<table style="width: 90%; border-collapse: collapse" cellspacing="2">' +
            '                            <thead >' +
            '                            <tr>' +
            '                                <th style="' + th_style + '">Stück</th>' +
            '                                <th style="' + th_style + '">Artikelnr.</th>' +
            '                                <th style="' + th_style + '">Kurztext</th>' +
            '                            </tr>' +
            '                            </thead>' +
            '                            <tbody >';

        for (var i = 0; i < ReportList.length; i++) {
            if (ReportList[i].typ == 'report') {
                report_table += '<tr>';
                report_table +=
                    '<td style="' + td_style + '">' + ReportList[i].raum + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].anzahl + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].artikelnummer + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].heizkoerper + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].temperatur + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].hlt + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].waermeleistung + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].einstellzahl + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].kv_wert + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].ventil + '</td>';
                report_table += '</tr>';
            } else {
                zubehoer_table += '<tr>';
                zubehoer_table +=
                    '<td style="' + td_style + '">' + ReportList[i].anzahl + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].artikelnummer + '</td>' +
                    '<td style="' + td_style + '">' + ReportList[i].kurztext + '</td>';
                zubehoer_table += '</tr>';
            }
        }
        report_table += '</tbody></table>';
        zubehoer_table += '</tbody></table>';
    }
    var message =
        '<div>' +
        '<table style="width: 100%;">' +
        '<tr><td style="' + td_style1 + '">Buderus-Kundennummer</td><td>' + buKundenNr + '</td></tr>' +
        '<tr><td style="' + td_style1 + '">Wunschlieferdatum</td><td>' + Wunschlieferdatum + '</td></tr>' +
        '<tr><td style="' + td_style1 + '">Lieferanschrift</td><td>' + adresse + '</td></tr>' +
        '</table>' +
        '</br>';

    if ($('#report_table tr').length > 1) {
        message += '<label>Report</label></br>' +report_table;
    }

    if ($('#zubehoer_table tr').length > 1) {
        message += '</br><label>Zubehör</label></br>' +zubehoer_table;
    }

    return message;
}


function openMail(buKundenNr, adresse, Wunschlieferdatum, filename) {

    var messageBody = getMessageBoy(buKundenNr, adresse, Wunschlieferdatum);


    //MAIL DIALOG
    var mailForm = '<div id="mail_form" style="background-color: transparent; max-height: 600px; overflow-y: scroll">' +
        '<div style="padding:30px; background: #e3e3e3 !important;"  class="form_dialog panel panel-default" > ' +
        '<form >' +
        '<div  style="display: none" id="customer_nr_warning" class="ui-state-error ui-corner-all"><p><span class="ui-icon ui-icon-alert"></span>' +
        '<strong>' + $("#warning").text() + '</strong>' + $("#msg_ugs_bud").text() + '</p></div>' +
        /*
         '<div class="row">' +

         '                                <div class="form-group">' +
         '                                    <div class="input-group">' +
         '                                        <span class=" input-group-addon addon-title ">Sender</span>' +
         '                                        <input type="email"   class="form-control" id="sender_email"' +
         '                                               value=""/>' +
         '                                        <span style="color: red" class="input-group-addon addon-unity">&nbsp;*</span>' +
         '                                    </div>' +
         '                                </div>' +
         '                            </div>' +
         */
        '<div class="row">' +
        '                                <div class="form-group">' +
        '                                    <div class="input-group">' +
        '                                        <span type="email" required  class=" input-group-addon addon-title ">E-Mail des Empfängers</span>' +
        '                                        <input class="form-control" id="receiver_email"' +
        '                                               type="email"' +
        '                                               value=""/>' +
        '                                        <span style="color: red" class="input-group-addon addon-unity">&nbsp;*</span>' +
        '                                    </div>' +
        '                                </div>' +
        '                            </div>' +
        '</br>';


    mailForm += messageBody +
        '<label>Anhang</label><br>' +
        '<img onclick="\'sav()\'"  style="float: left" width="50px" width="auto" src="images/pdf-icon.png" alt=""><br><span style="float: left">' + filename + '</span>' +
        //        '<input style="height:60px; width:auto" type="image" src="images/pdf-icon.png" onclick="getPDF()"/><br><span style="float: left">'+ Kundennummer+ '_Report.pdf</span>'
        '</div>' +
        '</form>' +
        '</div>' +
        '</div>';


    BootstrapDialog.show({
        size: BootstrapDialog.SIZE_WIDE,
        title: "Per E-Mail senden",
        message: mailForm,
        buttons: [{
            label: "Senden",
            action: function (dialog) {

                if (!validateEmail($('#receiver_email').val().trim())) {
                    showAlert('Fehler', 'Bitte geben Sie eine günstige Email-Adresse', 'sender_email', 'danger');
                }

                else {
                    $.ajax({
                        type: "POST",
                        url: 'http://appshare.knm.de/share/mailer.php',
                        crossDomain: true,
                        global: true,
                        data: {
                            to: $('#receiver_email').val(),
                            subject: "Buderus ProDimension - Report",
                            message: replaceAllUmlaut(messageBody),
                            sender: "Buderus ProDimension",
                            sender_email: "prodimension@buderus.de",
                            reply_email: "prodimension@buderus.de",
                            dateien: "/upload/" + filename
                        },
                        success: function (response) {
                            consoleLog(response);
                            if (response.toString() == 'Nachricht wurde gesendet') {
                                dialog.close();
                            }
                            showDialog('Meldung', response, false, null);

                            return false;
                        },
                        error: function (xhr, textStatus, err) {
                            showDialog("Fehler beim Senden", "Nachricht könnte nicht versendet werden.\n Bitte Internetverbindung überprüfen", false, null);
                            consoleLog("readyState: " + xhr.readyState);
                            consoleLog("responseText: " + xhr.responseText);
                            consoleLog("status: " + xhr.status);
                            consoleLog("text status: " + textStatus);
                            consoleLog("error: " + err);
                        }
                    });
                }
            }
        },
            {
                label: "Abbrechen",
                action: function (dialog) {
                    dialog.close();
                }
            }]

    });

}


//ARTIKEL HINZUFÜGEN
var report_row_id = 0;

function addToCart(artikelnummer, text) {

    if (heizkoerperTyp.indexOf("Therm") > -1) {
        artikelnummer = localStorage.getItem("currentThermArtNr");
    }
    var leistung = currentHeizlast;
    if (leistung == '0') {
        leistung = 1000;
    }
    var temp = Vorlauf + "/" + Ruecklauf + "/" + Raumtemperatur;
    var ventil = ventilText.trim().charAt(0);
    var vText = ventilText.trim().charAt(1);
    var KV = currentKV;
    var room = $('#selected_room').text();
    var hlt = placeHolderHLT;

    if (room == "Auswählen") {
        room = "";
    }

    if (heizkoerperTyp.trim().charAt(0) !== 'V' || heizkoerperTyp.trim().charAt(0) == 'T') {

        ventil = "";
        vText = "";
        KV = "";
    }


    $('#report_table_tbody').append("<tr class='tr_report table_row' id='" + currentLastReportID + "' >" +
        "<td>" + room + "</td>" +
        "<td>" + HeizkoerperZahl + "</td>" +
        "<td>" + artikelnummer + "</td>" +
        "<td style='text-align: left'>" + heizkoerperTyp + "</td>" +
        "<td>" + temp + "</td>" +
        "<td style='text-align: left'>" + hlt + "</td>" +
        "<td>" + leistung + "</td>" +
        "<td>" + vText + "</td>" +
        "<td>" + KV + "</td>" +
        "<td>" + ventil + "</td>" +
        "<td class='remove_btn' style='text-align: center; width: 30px; cursor: pointer;' onclick='showDialog($(\"#warning\").text(), $(\"#msg_removeReport\").text(), true, function(callback){$(callback).parent().remove(); removeReport(callback.parentElement.id)}, this)' " +
        "><a style='color: #FFFFFF'><span class='glyphicon glyphicon-trash'> </span></a></td>" +
        "</tr>");


    var rabatt = '';
    var preis = '';

    consoleLog('ReportList length:' + ReportList.length);

    ReportList.push({
        id: currentLastReportID,
        typ: 'report',
        raum: room,
        anzahl: HeizkoerperZahl,
        artikelnummer: artikelnummer,
        zubehoer_anzahl: '',
        zubehoer_artikelnummer: '',
        heizkoerper: heizkoerperTyp,
        temperatur: temp,
        hlt: hlt,
        waermeleistung: leistung,
        einstellzahl: vText,
        kv_wert: KV,
        ventil: ventil,
        kurztext: text,
        preis: preis,
        rabatt: rabatt
    });
    currentLastReportID++;
    currentReportTableData = $('#report_table_tbody').html();
    storeData();

    BootstrapDialog.show({
        size: BootstrapDialog.SIZE_SMALL,
        title: $('#set').text(),
        message: '<p style="color:#3C3C3B; font-size: small"><span class="glyphicon glyphicon-ok" style="padding-right: 20px;"></span><span class="dialogMsg">' + $('#msg_toCart_succes').text() + '</span></p>',
        buttons: [{
            label: 'OK',
            action: function (dialog) {
                dialog.close();
            }
        }]
    });


    var closeDialog = function (Obj) {
        setTimeout(
            function () {
                Obj.close();

            }, 1000);
    };
}

//DATEN IN LOCAL STORAGE SPEICHERN
function storeData() {
    localStorage.setItem('ReportList', ReportList);
    localStorage.setItem('currentReportTableData', currentReportTableData);
    localStorage.setItem('currentUtilsTableData', currentUtilsTableData);
    localStorage.setItem('currentLastReportID', currentLastReportID);
    localStorage["ReportList"] = JSON.stringify(ReportList);
}

//PROJEKT ÖFFNEN
function showProjectDetails(id) {
    for (var i = 0; i < reportSavedListe.length; i++) {
        if (reportSavedListe[i].id == id) {
            $('#report_table_tbody').html(reportSavedListe[i].reportTable);
            $('#utils_table_tbody').html(reportSavedListe[i].utilsTable);
            currentReportTableData = reportSavedListe[i].reportTable;
            currentUtilsTableData = reportSavedListe[i].utilsTable;
            storeData();
            break;
        }
    }
    $('.listDialog').dialog("close");
}

//ALLE REPORTS LÖSCHEN
function clearTable() {
    ReportList = [];
    $('#report_list_name').html('');
    $('#report_table_tbody').html('');
    $('#utils_table_tbody').html('');
    currentLastReportID = 0;
    currentUtilsTableData = '';
    currentReportTableData = '';

    localStorage.setItem('currentReportTableData', '');
    localStorage.setItem('currentUtilsTableData', '');
    storeData();
}

//GESPEICHERTE DATEN ANZEIGEN
function showProjectsList() {
    var artikelContent = "<div class='listDialog'  style='margin: 0 auto; height: 80%; text-align: center;'>";

    if (reportSavedListe.length > 0) {
        for (var i = 0; i < reportSavedListe.length; i++) {
            artikelContent += "<div><button style='width: 80%' id='savedList_" + i + "' class='ui-button ui-corner-all ui-widget showList_btn' onclick='showProjectDetails(" + reportSavedListe[i].id + ")'>" + reportSavedListe[i].name + "</button>" +
                "<div style='float: right; width: 40px; padding-top: 15px'><a  id='" + reportSavedListe[i].id + "'  title='Artikelliste löschen'  onclick='removeProject(" + i + ", this)'><span class='glyphicon glyphicon-trash' style='cursor: pointer;'></span><span class='ui-button-icon-space'> </span></a></div>" +
                "</div><hr style='background: #afafaf; height: 1px; width: 50%;'>";
        }
        artikelContent += "</div>";
    } else {
        artikelContent += '<p style="color:#3C3C3B; font-size: small; text-align: left"><span class="glyphicon glyphicon-info-sign" style="padding-right: 20px;"></span><span id="dialogMsg">Keine Artikelliste!</span></p>';
    }

    BootstrapDialog.show({
        size: BootstrapDialog.SIZE_NORMAL,
        title: 'Gespeicherte Artikellisten',
        message: artikelContent,
        buttons: [{
            label: $('#ok').text(),
            action: function (dialog) {
                dialog.close();
            }
        }]
    });

}

//LISTE ALS PROJEKT SPEICHERN
function saveListe() {
    if ($('#report_table_tbody tr').length > 0 || $('#utils_table_tbody tr').length > 0) {
        $('#input_dialog').remove();

        var content = '<div id="input_dialog" title="Atikelliste speichern">'
            + '<span>Bitte geben Sie einen Name für die Artikelliste ein.</span>'
            + '<form>'
            + '<div  style="display: none" class="ui-state-error ui-corner-all" style="padding: 0 .3em;"><p style="font-size:small"><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .2em;"></span>'
            + '<strong>Fehler:</strong>Name ungültig oder schon vergeben!</p></div>'
            + '<input class="form-control" type="text" style="z-index:10000; width: 100%;color: #333333; margin: 0 auto" autocomplete="off" id="' + reportSavedListe.length + 1 + '" onclick="$(\'.ui-state-error\').css(\'display\', \'none\');"><br></form></div>';

        BootstrapDialog.show({
            size: BootstrapDialog.SIZE_SMALL,
            title: 'Artikelliste speichern',
            message: content,
            buttons: [{
                label: $('#bestand_save').text(),
                action: function (dialog) {
                    var name = $('#' + reportSavedListe.length + 1).val();
                    var nameExist = false;
                    if (name.length > 0) {
                        for (var i = 0; i < reportSavedListe.length; i++) {
                            if (reportSavedListe[i].name == name) {
                                nameExist = true;
                                break;
                            }
                        }
                        if (!nameExist) {
                            currentReportTableData = $('#report_table_tbody').html();
                            currentUtilsTableData = $('#utils_table_tbody').html();

                            reportSavedListe.push({
                                id: currentLastSavedreportID,
                                name: name,
                                reportTable: currentReportTableData,
                                utilsTable: currentUtilsTableData
                            });
                            currentLastSavedreportID++;

                            localStorage["reportSavedListe"] = JSON.stringify(reportSavedListe);
                            localStorage.setItem('currentLastSavedreportID', currentLastSavedreportID);
                            dialog.close();
                        }
                        else {
                            $('.ui-state-error').css('display', 'block');
                            $('.name_input').val('');
                        }
                    }
                    else {
                        $('.ui-state-error').css('display', 'block');
                        $('.name_input').val('');
                    }
                }
            },
                {
                    label: $('#abbrechen').text(),
                    action: function (dialog) {
                        dialog.close();
                    }
                }]
        });
    }
    else {
        showDialog($("#warning").text(), 'Die Artikelliste ist leer!', false);
    }
}

//PROJEKT LÖSCHEN
function removeProject(i, Obj) {

    showDialog('Atikelliste löschen', 'Soll die Artikelliste ' + reportSavedListe[i].name + ' gelöscht werden?', true, function (callback) {
        for (var j = 0; j < reportSavedListe.length; j++) {
            if (reportSavedListe[i].id == reportSavedListe[j].id) {
                consoleLog(reportSavedListe[j].id);
                reportSavedListe.splice(j, 1);
                break;
            }
        }
        localStorage["reportSavedListe"] = JSON.stringify(reportSavedListe);
        // localStorage.setItem('currentLastSavedreportID', reportSavedListe[reportSavedListe.length].id);

        if (reportSavedListe.length > 0) {
            $(callback).parent().parent().remove();
            storeData();
        }
        else {
            $(callback).parent().parent().html('<p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span id="msg_leistung_warning ">keine Artikelliste!</p>');
            storeData();
        }
    }, Obj);
}

//REPORT ZEILE LÖSCHEN
function removeReport(i) {
    //alert(i+ ' lenght' + ReportList.length);

    for (var j = 0; j < ReportList.length; j++) {
        if (ReportList[j].id == i) {
            ReportList.splice(j, 1);
            break;
        }
    }
    currentReportTableData = $('#report_table_tbody').html();
    currentUtilsTableData = $('#utils_table_tbody').html();

    //alert(ReportList.length);
    storeData();
}

//ARTIKEL UND ZUBEHÖR SPEICHERN
var util_row_id = 0;

function saveArticleIUtils(quantity, articleNr, text) {

    quantity = $('#' + quantity).val();
    articleNr = $('#' + articleNr).text();
    text = $('#' + text).text();

    /* var artikelDetails = JSON.parse(localStorage[articleNr]);
     var rabatt = artikelDetails[0].rabatt;
     var preis = artikelDetails[0].preis;
     */

    var rabatt = '';
    var preis = '';
    /*
     $(".utils_message_succes").animate({
     display: "toggle",
     }, 2000, function () {
     });
     */

    BootstrapDialog.show({
        size: BootstrapDialog.SIZE_SMALL,
        title: $('#set').text(),
        message: '<p style="color:#3C3C3B; font-size: small"><span class="glyphicon glyphicon-ok" style="padding-right: 20px;"></span><span class="dialogMsg">' + $('#msg_toCart_succes').text() + '</span></p>',
        buttons: [{
            label: 'OK',
            action: function (dialog) {
                dialog.close();
            }
        }]
    });


    $('#utils_table_tbody').append('<tr class="tr_report table_row" id="' + currentLastReportID + '">'
        + '<td>' + quantity + '</td>'
        + '<td>' + articleNr + '</td>'
        + '<td style="text-align: left">' + text + '</td>'

        + "<td class='remove_btn' style='text-align: center; width: 30px; cursor: pointer;' onclick='showDialog($(\"#warning\").text(), $(\"#msg_removeReport\").text(), true, function(callback){$(callback).parent().remove(); removeReport(callback.parentElement.id)}, this)' " +
        "><a style='color: #ffffff'><span class='glyphicon glyphicon-trash'> </span></a></td>" + +"</tr>");

    currentUtilsTableData = $('#utils_table_tbody').html();
    ReportList.push({
        id: currentLastReportID,
        typ: 'utils',
        raum: currentRoom,
        anzahl: quantity,
        artikelnummer: articleNr,
        zubehoer_anzahl: quantity,
        zubehoer_artikelnummer: articleNr,
        heizkoerper: heizkoerperTyp,
        temperatur: Vorlauf + "/" + Ruecklauf + "/" + Raumtemperatur,
        hlt: placeHolderHLT,
        waermeleistung: parseInt($('#raum_watt_text').val() / HeizkoerperZahl),
        einstellzahl: ventilText.charAt(1),
        kv_wert: currentKV,
        ventil: ventilText.charAt(0),
        kurztext: text,
        preis: preis,
        rabatt: rabatt
    });
    currentLastReportID++;
    storeData();

}

