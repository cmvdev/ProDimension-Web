/**
 * Created by marvinvounkeng on 21.03.17.
 */

$(document).ready( function () {

});

function getAllZubehoertByType(FHKTYP) {


    try {
        var allZubehoerArray = [];
        var allZubehoerArray = JSON.parse(localStorage.getItem("zubehoere"));
        currentZubehoerArray = [];
        for (var i = 0; i < allZubehoerArray.length; i++) {

            var typ = (allZubehoerArray[i].nav_1).trim().replace(/(\r\n|\n|\r)/gm, "");
            var typ_1 = (allZubehoerArray[i].nav_3).trim().replace(/(\r\n|\n|\r)/gm, "");
            var _typ = FHKTYP.trim().replace(/(\r\n|\n|\r)/gm, "");


            var check = ((typ == _typ) || typ_1.indexOf(_typ) > -1);

            if(currentzubehoerTable == "zubehoert_table"){
                var check = ((typ == _typ) || typ_1.indexOf(_typ) > -1) && typ_1.charAt(0)==_typ.charAt(0);

            }

            if (FHKTYP.indexOf('Therm ')>-1) {
                FHKTYP = 'Zubehör für Therm Direct / Therm Curve';

                if(currentzubehoerTable == "zubehoert_table"){
                    if(heizkoerperTyp.indexOf(' E')>-1){
                        check = (typ == _typ || typ.indexOf(_typ)> -1)  && allZubehoerArray[i].nav_3.indexOf('Zubehör')>-1 && allZubehoerArray[i].svTyp=="kat_4_4_Handtuch_Radiatoren_therm_direct_e";
                    }
                    else {
                        check = (typ == _typ || typ.indexOf(_typ)> -1)  && allZubehoerArray[i].nav_3.indexOf('Zubehör')>-1 && allZubehoerArray[i].svTyp=="kat_4_4_Handtuch_Radiatoren_therm_direct";
                    }
                }
            }
                if (check) {

                    if(allZubehoerArray[i].text==null || allZubehoerArray[i].text=="null"){
                        allZubehoerArray[i].text= "keine Bezeichnung";
                    }

                    currentZubehoerArray.push({
                        id: allZubehoerArray[i].id,
                        artikelnummer: allZubehoerArray[i].produkt,
                        bild: allZubehoerArray[i].bild,
                        fhktyp: allZubehoerArray[i].nav_1,
                        paket1: allZubehoerArray[i].nav_3,
                        kurz1: allZubehoerArray[i].nav_3,
                        desk: allZubehoerArray[i].text,
                        einheit: allZubehoerArray[i].einheit,
                        preis: allZubehoerArray[i].preis,
                        rabatt: allZubehoerArray[i].rabatt
                    });
                }

        }
        return currentZubehoerArray;
    }
    catch (e) {
        console.error('Die zubehoer zu ' + FHKTYP + "Könnten nicht geladen werden");
        console.error(e.message);
    }

}

//ARTIKELLISTE AUS ZUBEHÖRE HOLEN


function count(a, obj) {
    var count = 0;
    var i = a.length;
    while (i--) {
        if (a[i] == obj) {
            count++;
        }
    }
    return count;
}


function contains(a, obj) {

    var i = a.length;
    while (i--) {
        if (a[i] == obj) {
            return true;
        }
    }
    return false;
}


function errDB(err) {
   consoleLog("Error processing SQL: " + err.code);
}

function createZubehoetTable(tableClass, FHKTYP) {
    currentzubehoerTable= tableClass;
        currentZubehoerArray = getAllZubehoertByType(FHKTYP);
   //consoleLog(currentZubehoerArray.length);
    var temp1 = [];
    var temp2 = [];

    var div_id = tableClass + "_accordion";
    $('.'+div_id).html("");
    var zubehoert_content = "<ul class='util_table' id='" + div_id + "'>";
    //var zubehoert_content ='<button>';
    for (var i = 0; i < currentZubehoerArray.length; i++) {
        var artikelnummer = currentZubehoerArray[i].artikelnummer;
        var paket = currentZubehoerArray[i].paket1;
        var kurz1 = currentZubehoerArray[i].kurz1;

        var button_id;
        var table_height = 40;

        var content = "";

        if(paket == "Zubehöre") paket = "Zubehör";

        if (count(temp1, paket) < 1) {
            zubehoert_content += '<li  onclick="getArtikelList(\'' + FHKTYP.toString() + '\',\'' + tableClass.toString() + '\',\'' + i + '\')"  id="utils_' + i + '" >' + paket + '<i  class="ui-icon ui-icon-caret-1-e"></i></li>';
            temp1[i] = paket;
        }
    }
        zubehoert_content += '</ul>';
    $('.' + tableClass).html(zubehoert_content);
    }

    function getArtikelList(FHKTYP, tableClass, j) {
        currentzubehoerTable= tableClass;
        currentZubehoerArray= [];
        currentZubehoerArray = getAllZubehoertByType(FHKTYP);

       consoleLog(FHKTYP);
       consoleLog('currentzubehoerTable: '+currentzubehoerTable);

        //consoleLog(currentZubehoerArray.length);
        var temp2 = [];
        $('.util_dialog').html('');
        var content = "<div style='color:#333333; font-size: small; overflow-x: hidden; max-height: 600px; overflow-x: scroll' class='util_dialog' title='" + $('.' + tableClass).prev().text() + " | " + currentZubehoerArray[j].kurz1 + "'>" +
            "<table style='width: 100%' class='util_table_dialog table-bordered'>";
        content += '<div  style="display: none; position: fixed; width: 40%" class="ui-state-error ui-corner-all utils_message_error" style="padding: 0 .3em;"><p style="font-size:small"><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .2em;"></span>';
        content += '<strong>Fehler:</strong>Stückzahl ungültig!</p></div>';
        content += '<div  style="display: none;  position: fixed; width: 600px; border-radius: 2px; margin: 0 auto" class="ui-state-checked ui-corner-all utils_message_succes " style="padding: 0 .3em;"><p style="font-size:small"><span class="ui-icon ui-icon-info" style="float: left; margin-right: .2em;"></span>';
        content += '<strong>Meldung:</strong>Artikel erfolgreich hinzugefügt!</p></div>';
        content += "<tr class='table_row'>" +
            "<th></th>" +
            "<th style='height: auto;'>" + $('#prodno').text() + "</th>" +
            "<th style='height: auto;'>" + $('#Kurztext').text() + "</th>" +
            "<th style='height: auto;'>" + $('#einheit').text() + "</th>" +
            "<th style='height: auto;'>" + $('#preis_currency').text() + "</th>" +
            "<th style='height: auto;'>" + $('#rabatt').text() + "</th>" +
            "<th style='height: auto;'>" + $('#stueck').text() + "</th>" +
            "<th></th>" +
            "</tr>";
        for (var i = 0; i < currentZubehoerArray.length; i++) {
            var bild = currentZubehoerArray[i].bild;
            var imageSrc = "images/produkte/" + bild + ".jpg";

            var imgFrame = $("<img src='images/produkte/" + currentZubehoerArray[i].bild + ".jpg'/>");

            imgFrame.error(function () {
                imageSrc = "images/produkte/ansicht.jpg";
            });
            currentDialogTitle= currentZubehoerArray[j].paket1;

            if (currentZubehoerArray[i].paket1 == currentZubehoerArray[j].paket1 ) {
                if ((imgFrame.attr('src')).width <= 24 || currentZubehoerArray[i].bild == 'null' || bild == null || bild == '' || bild == 'null') {
                    imageSrc = "images/produkte/ansicht.jpg";
                } else {
                    checkImage(imageSrc, 'article_img' + i, "images/produkte/ansicht.jpg");
                }

                if (count(temp2, currentZubehoerArray[i].artikelnummer) < 1)
                {
                    content += "<tr style='border: solid 1px #B2B2B2; margin-bottom: 2%' >";
                    content += "<td onclick='showImage(this)' style='height: auto; cursor: pointer; width: 10%; height: 50px' class='article_img' id='article_img" + i + "'><img  name='" + imageSrc + "'  style=' max-height: 80%; max-width: 100%;display: block;  margin: 0 auto' src='" + imageSrc + "'/></td>";
                    content += "<td style='height: auto; padding-left: 1%; width: 10%' id='article_Nr" + i + "'>" + currentZubehoerArray[i].artikelnummer + "</td>";
                    content += "<td style='height: auto; padding-left: 1%' id='article_text" + i + "'>" + currentZubehoerArray[i].desk + "</td>";
                    content += "<td style='height: auto;text-align: center; width: 60px' id='einheit" + i + "'>" + currentZubehoerArray[i].einheit + "</td>";
                    content += "<td style='height: auto;text-align: center; width: 80px' id='article_text" + i + "'>" + currentZubehoerArray[i].preis + "</td>";
                    content += "<td style='height: auto; width: 70px; text-align: center;' id='article_text" + i + "'>" + currentZubehoerArray[i].rabatt + "</td>";
                    content += "<td  style='text-align: center;width:6% '><div class='quantity_div'><select style='text-align: center' value='1' id='article_quantity" + i + "' class='article_quantity'><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select></div></td>";
                    content += "<td  style='text-align: center; width: 40px; padding-left: 5px; padding-right: 5px; cursor: pointer'><button  style='width: 40px; height: 40px;background: #0f2f59 !important;color:white;' onclick='saveArticleIUtils(\"article_quantity\" + this.id, \"article_Nr\" + this.id, \"article_text\" + this.id)'  id='" + i + "' class='ui-button add_article' title='Artikel übernehmen' ><span style='color:#ffffff' class='glyphicon glyphicon-plus'></span></span></button></td>";
                    content += "</tr>";
                    temp2[i] = currentZubehoerArray[i].artikelnummer;
                }
            }
        }
        content += "</table></div>";


        BootstrapDialog.show({
            size: BootstrapDialog.SIZE_WIDE,
            title: currentDialogTitle,
            message: content,
            buttons: [{
                label: 'OK',
                action: function(dialog) {
                    dialog.close();
                }
            }]
        });

        $('.util_dialog').css('overflow', 'scroll');
    }

function checkImage(imageSrc, id, defaultImage){
    var imgSrc = imageSrc;
    var ID = id;
    var img = defaultImage;
    if(ID!=null) {

        $.ajax({
            url: imgSrc,
            type: "get",
            /*
            success: function(response) {
               consoleLog('success');
                document.getElementById(ID).firstChild.name = imgSrc;
                document.getElementById(ID).firstChild.src = imgSrc;
            },
            */
            error: function (err) {
                if (err.status == 404) {
                   consoleLog("ID: "+ ID);
                    $(document).ready(function () {
                        setTimeout(function () {
                            document.getElementById(ID).firstChild.name = img;
                            document.getElementById(ID).firstChild.src = img;
                        }, 300);
                    })
                }
            }
        });
    }
}

function  showImage(obj) {
    var imgContent = "<div id='img_dialog' style='overflow: hidden; padding-top: 10px'><img style='max-width: 250px;padding: 2%; display: block; margin: 0 auto' src='" + $(obj).find("img").attr('src') + "'/></div>";

    BootstrapDialog.show({
        size: BootstrapDialog.SIZE_NORMAL,
        title:  $('#prodno').text() + " " + $(obj).next().html(),
        message: imgContent,
        buttons: [{
            label: 'OK',
            action: function(dialog) {
                dialog.close();
            }
        }]
    });
}

    function showMessage(message) {
        $('<div id="messagebox" style="background-color: #D9D9D9" title="Meldung"><p style="float: left">' + message + '  ' + '</p><strong class="ui-icon ui-icon-check" style="float:left; margin:12px 12px 20px 0;"></strong id="msg_succes "></div>').dialog({
            modal: false
        });

        $('#messagebox').animate({});
    }

