

function   showAlert(title, message, id, type) {
var aclass = "row alert alert-"+type.trim();
var aId = "alert_"+id;
if($('#'+aId).length ==0) {
    $('#' + id).parent().parent().prepend(
        '<div id="'+aId+'" class="' + aclass + '">' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
        '<strong>' + title + '!</strong>' + message +
        '</div>'
    );
    window.setTimeout(function () {
        $('#'+aId).remove();
    }, 1500);
}
}




function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validDate(date) {
var re= /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
    return re.test(date.trim());
}


function resetSetup() {
    $('#report_table_tbody').html('');
    $('#utils_table_tbody').html('');
    ReportList = [];
    reportSavedListe = [];
    currentLastSavedreportID = 0;
    currentLastReportID = 0;
    localStorage.clear();
}

function exist(v) {
    if (!v || v == 'undefined' || v == null || v == [] || v.length == 0) {
        consoleLog("\n Element" + " not exist or empty!");
        return false;
    }

    else {
        consoleLog("\n Element" + " allready exist!");
        return true;

    }
}

//Console ein und auschalten
function consoleLog(message) {
    if(isConsoleOn){
        console.log(message);
        //writeTextFile("http://knm.de/_AppShare/share/log.text", message);
    }
}
/*
function writeTextFile(filepath, output) {
    var txtFile = new File(filepath);
    txtFile.open("w"); //
    txtFile.writeln(output);
    txtFile.close();
}
*/