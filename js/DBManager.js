/**
 * Created by Marvin Vounkeng on 16.05.17.
 */

database = 'db/buderus.sqlite';
loading_percent = 0;
totalDuration = 0;
//var DBUrl="http://localhost/db/database.php";
var DBUrl = "http://knm.de/_AppShare/share/database_procatalog.php";
var urlData = "";
var online = navigator.onLine;


function isOnline(no,yes){
    var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');
    xhr.onload = function(){
        if(yes instanceof Function){
            yes();
        }
    }
    xhr.onerror = function(){
        if(no instanceof Function){
            no();
        }
    }
    xhr.open("GET","http://knm.de/_AppShare/share/database_procatalog.php",true);
    xhr.send();
}


function doQuery(column, table1, table2, onClause, cond, orderBy, callback) {

    isOnline(
        function(){
            BootstrapDialog.show({
                title: 'Keine Internetverbindung',
                message: 'Bitte stellen Sie eine Internetverbindung her und versuchen Sie erneu',
                buttons: [{
                    label: 'OK',
                    action: function(dialog) {
                        dialog.close();
                        doQuery(column, table1, table2, onClause, cond, orderBy, callback);
                    }
                }]

            });
        },
        function(){
            console.log("Succesfully connected!");





            urlData = "";
            console.log("\n ____TRANSAKTION_BEGINN: " + table1 + "___");
            var querry = "";


            if (column && table1) {
                urlData = {column: column, table: table1};
                querry = '--- SQL-ABFRAGE : SELECT DISTINCT ' + column + ' FROM ' + table1;

                if (table2 && onClause) {
                    urlData = {column: column, table: table1, table2: table2, onClause: onClause};
                    querry += ' JOIN ' + table2 + " on " + onClause;
                    if (cond) {
                        urlData = {column: column, table: table1, table2: table2, onClause: onClause, cond: cond};
                        querry += ' where ' + cond;
                    }
                    if (orderBy) {
                        urlData = {
                            column: column,
                            table: table1,
                            table2: table2,
                            onClause: onClause,
                            cond: cond,
                            orderBy: orderBy
                        };
                        querry += ' order By ' + orderBy;
                    }
                } else {
                    if (cond) {
                        urlData = {column: column, table: table1, cond: cond};
                        querry += ' where ' + cond;
                    }
                    if (orderBy) {
                        urlData = {column: column, table: table1, cond: cond, orderBy: orderBy};
                        querry += ' order By ' + orderBy;
                    }
                }

            }
            console.log(querry);

            $.ajax({
                url: DBUrl,
                type: "POST",
                crossDomain: true,
                global: true,
                //  async: false,
                data: urlData,
                success: function (response) {
                    try {
                        callback(JSON.parse(response));
                    }
                    catch (e) {
                        console.log(e.message);
                    }
                    console.info(JSON.parse(response).length + " " + column + " wurden gefunden");
                    loading_percent =loading_percent+ JSON.parse(response).length;
                    $('#loading_percent').text(parseInt(loading_percent / db_count*100) > 100 ? 100 + '%' : parseInt(loading_percent / db_count*100) + '%');


                },
                error: function (err) {
                    callback(err);
                }
            })
        }
   );

}


/*
 function doQuery(query, context, callback) {

 var dataArray = [];
 var startTime = new Date().getTime();

 console.log("\n ____TRANSAKTION_BEGINN: " + context + "___");
 console.log('--- SQL-ABFRAGE : ' + query);

 if (window.XMLHttpRequest) {
 xmlhttp = new XMLHttpRequest();
 } else {
 // code for older browsers
 xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
 }
 xmlhttp.responseType = 'arraybuffer';
 xmlhttp.onreadystatechange = function () {
 switch (this.readyState) {
 case 4 :
 xmlhttp.onload = function (e) {
 var uInt8Array = new Uint8Array(this.response);
 var db = new SQL.Database(uInt8Array);
 var contents = db.prepare(query);
 //var result = contents.getAsObject({':aval' : artikel});
 // contents.bind({':aval': artikel});
 var count = 0;
 while (contents.step()) {
 var dataRow = contents.get();
 //  console.log("Row" + count + ": " + dataRow);
 dataArray.push(contents.get());
 count++;
 loading_percent++;
 $('#loading_percent').text(parseInt(loading_percent / db_count) > 100 ? 100 + '%' : parseInt(loading_percent / db_count) + '%');
 }
 /*
 for (var i=0; i<count.length; i=i+43){
 loading_percent++;
 $('#loading_percent').text(loading_percent+'%');
 }

 if (count < 0) {
 console.warn("Es wurde keine " + context + " gefunden");

 } else {
 console.info(count + " " + context + " wurden gefunden");
 console.info('Datenbank erfolgreich geladen'); // The result of the query
 var endTime = new Date().getTime();
 var duration = (endTime - startTime) / 1000;
 totalDuration += duration;
 console.info("duration [s] = " + duration + 's');
 console.log('Loading: ' + parseInt(loading_percent / db_count - 5) + '%');
 callback(dataArray);
 }
 db.close();
 }

 break
 case 202:
 console.log(" >>>>>>>completed");
 break;
 }
 };

 xmlhttp.open("GET", database, true);
 xmlhttp.send();
 }
 */


function exist(v) {
    if (v != 'undefined' && v != null) {
        return true;
    } else {
        return false;
    }
}