



loginByCredentials = function(handle, password, itemsXML) {
	//alert(handle + ';' + password +';' +itemsXML);


    var xhttp = new XMLHttpRequest();
   var xml= $('#warenkorbID').val().replace('%%%CARTITEMS%%%', itemsXML);
    $('#warenkorbID').val(xml)
document.getElementById('IDS-FORM').submit();

    //window.open('./OnlineShop/ids_wks.html');


    /*
        var okIndex = 0;
        var defaultIndex = 0;
        var userIndex = 0;
        var passIndex = 0;
        var gesperrtIndex = 0;

        var secGuidRq = '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:sap-com:document:sap:soap:functions:mc-style"><SOAP-ENV:Body><ns1:Zt6v1EsiSsoSecGuidWs/></SOAP-ENV:Body></SOAP-ENV:Envelope>';
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for older browsers
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.timeout = 10000;
        xmlhttp.open('POST', 'https://www.onlineshop.buderus.de/zssosecguid', true);
        xmlhttp.onreadystatechange = function() {
            alert(xmlhttp.responseXML);
            if (xmlhttp.readyState == 4) {
                alert(xmlhttp.status);
                switch(xmlhttp.status) {
                case 200:
                    //secGuid holen
                    var doc = xmlhttp.responseXML;
                    var firstChild = doc.getElementsByTagName('EpSecGuid');
                    var secguid = firstChild.item(0).getChildNodes().item(0).text;
                    var checkUserRq = '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:sap-com:document:sap:soap:functions:mc-style"><SOAP-ENV:Body><ns1:Zt6v1EsiSsoCheckUserWs><IpPwd>' + password + '</IpPwd><IpSecGuid>' + secguid + '</IpSecGuid><IpUser>' + handle + '</IpUser></ns1:Zt6v1EsiSsoCheckUserWs></SOAP-ENV:Body></SOAP-ENV:Envelope>';
                    var xmlhttpUser = Ti.Network.createHTTPClient();
                    xmlhttpUser.timeout = 5000;
                    xmlhttpUser.open('POST', 'https://www.onlineshop.buderus.de/zssocheckuser', true);
                    xmlhttpUser.onreadystatechange = function() {
                        if (xmlhttpUser.readyState == 4) {
                            switch(xmlhttpUser.status) {
                            case 200:
                                //EpReturn holen und interpretieren
                                var doc = xmlhttpUser.responseXML;
                                var fChild = doc.getElementsByTagName('EpReturn');
                                returncode = fChild.item(0).getChildNodes().item(0).text;

                                alert(returncode);

                                switch(returncode) {
                                case 'OK':
                                    okIndex++;
                                    if (okIndex == 1) {
                                        var date = new Date();
                                        onlineshopLastLogin = '' + date.getTime();
                                        Benutzerkennung = handle;
                                        Passwort = password;

                                        /* NACH EINDER STUNDE WIRD DIE BENUTZERKENNUNG UND PASSWORT AUF NULL GESETZT */
									setTimeout(function() {
										if (Benutzerkennung != null) {
											Benutzerkennung = null;
											Passwort = null;
										}
									}, 60 * 60 * 1000);

                                    /*
                                    var xhttp = new XMLHttpRequest();
                                    xhttp.onreadystatechange = function() {
                                        if (this.readyState == 4 && this.status == 200) {
                                            var ADLTemplate = this.responseText;
                                            ADLTemplate = ADLTemplate.replace('Kundennummer', Benutzerkennung);
                                            ADLTemplate = ADLTemplate.replace('Passwort', Passwort);
                                            ADLTemplate = ADLTemplate.replace('%%%CARTITEMS%%%', itemsXML);
                                        }
                                    };
                                    xhttp.open("GET", "OnlineShop/ids_wks.html", true);
                                    xhttp.send();

                                    $("[name='kndnr']").val(Benutzerkennung);
                                    $("[name='pw_kunde']").val(Passwort);
                                    var xml= $("[name='pw_kunde']").val().replace('%%%CARTITEMS%%%', itemsXML);
                                    $("[name='warenkorb']").val(xml);

                                    window.open('OnlineShop/ids_wks.html');

								}
								break;
							case 'F4':
								passIndex++;
								if (passIndex == 1) {
                                    showDialog('Falsches Passwort', 'ACHTUNG: Nach dreimaliger Falscheingabe wird das Benutzerkonto gesperrt.', false );

                                }
								break;
							case 'E3':
								userIndex++;
								if (userIndex == 1) {
                                    showDialog('Login fehlgeschlagen', 'Unbekannter Benutzername.', false );
                                }
								break;
							case 'F5', 'F6', 'F8':
								gesperrtIndex++;
								if (gesperrtIndex == 1) {
                                    showDialog('Login fehlgeschlagen', 'Benutzer ist gesperrt. Bitte wenden Sie sich an die zust&auml;ndige Niederlassung.', false );
                                }
								break;
							default:
								defaultIndex++;
								if (defaultIndex == 1) {
                                    showDialog('Login fehlgeschlagen', 'Unbekannter Fehler. Bitte stellen Sie sicher, dass sie ueber eine aktive Internetverbindung verfuegen und ihre Logindaten korrekt sind.', false );
								}
								break;
							}
							break;
						}// switch
					}// if
				};
				xmlhttpUser.setRequestHeader('Content-Type', 'text/xml');
				xmlhttpUser.setRequestHeader('Content-Length', checkUserRq.length);
				xmlhttpUser.send(checkUserRq);
				break;
			case 0:
                showDialog('Verbindungsfehler', 'Es steht keine Internetverbindung zur Verfügung!', false );
				break;
			default:
                showDialog('Fehler', 'Unbekannter Fehler aufgetretten!', false );
				break;
			} //switch
		} //if
	};
	xmlhttp.setRequestHeader('Content-Type', 'text/xml');
	xmlhttp.setRequestHeader('Content-Length', secGuidRq.length);
	xmlhttp.send(secGuidRq);
	*/
};
