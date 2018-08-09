<?php
/**
 * Created by PhpStorm.
 * User: marvinvounkeng
 * Date: 28.04.17
 * Time: 12:59
 */
$bud= $_REQUEST['bud'];
$kundennummer= $_REQUEST['kundennummer'];

$lieferName= $_REQUEST['lieferName'];
$lieferStrasse= $_REQUEST['lieferStrasse'];
$lieferHausnummer= $_REQUEST['lieferHausnummer'];
$lieferPLZ= $_REQUEST['lieferPLZ'];
$lieferOrt= $_REQUEST['lieferOrt'];


$fileName="report.txt";

$myfile = fopen($fileName, "w") or die("Unable to open file!");

function linebreack($lines, $myfile){
    for ( $x = 0; $x < $lines; $x++) {
        fwrite($myfile, ''."\r\n");
    }
}
function writeIfExist($var, $myfile){
    if($var !=''){
        fwrite($myfile, $var."\r\n");
    }else{
        linebreack(1, $myfile);
    }
}

fwrite($myfile, 'Absender:'."\r\n");
linebreack(7, $myfile);

fwrite($myfile, 'Empfänger:'."\r\n");
linebreack(7, $myfile);

fwrite($myfile, 'Lieferdaten:'."\r\n");
writeIfExist($lieferName, $myfile);
writeIfExist($lieferStrasse, $myfile);
writeIfExist($lieferHausnummer, $myfile);
writeIfExist($lieferPLZ, $myfile);
writeIfExist($lieferOrt, $myfile);
fwrite($myfile, $kundennummer."\r\n");

linebreack(33, $myfile);

fwrite($myfile, '2017/1 Datanormstand 03.07.2017'."\r\n");
fwrite($myfile, 'SAP/R3'."\r\n");
fwrite($myfile, $kundennummer."\r\n");
fwrite($myfile, $bud);

fclose($myfile);


//SEND MAIL

function mail_att($to, $subject, $message, $sender, $sender_email, $reply_email, $dateien)
{
    if ($dateien != false) {
        if (!is_array($dateien)) {
            $dateien = array($dateien);
        }

        $attachments = array();
        foreach ($dateien AS $key => $val) {
            if (is_int($key)) {
                $datei = $val;
                $name = basename($datei);
            } else {
                $datei = $key;
                $name = basename($val);
            }

            $size = filesize($datei);
            $data = file_get_contents($datei);
            $type = mime_content_type($datei);

            $attachments[] = array("name" => $name, "size" => $size, "type" => $type, "data" => $data);
        }

        $mime_boundary = "-----=" . md5(uniqid(microtime(), true));

        $header = "From:" . $sender . "<" . $sender_email . ">\n";
        //$header .= 'Cc:m.vounkeng@knm.de' . "\r\n";
        //$header .= "Reply-To: " . $reply_email . "\n";

        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-Type: multipart/mixed;\r\n";
        $header .= " boundary=\"" . $mime_boundary . "\"\r\n";

        $encoding = mb_detect_encoding($message, "utf-8, iso-8859-1, cp-1252");
        $content = "This is a multi-part message in MIME format.\r\n\r\n";
        $content .= "--" . $mime_boundary . "\r\n";
        $content .= "Content-Type: text/html; charset=\"$encoding\"\r\n";
        $content .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $content .= $message . "\r\n";

        //$anhang ist ein Mehrdimensionals Array
        //$anhang enthält mehrere Dateien
        foreach ($attachments AS $dat) {
            $data = chunk_split(base64_encode($dat['data']));
            $content .= "--" . $mime_boundary . "\r\n";
            $content .= "Content-Disposition: attachment;\r\n";
            $content .= "\tfilename=\"" . $dat['name'] . "\";\r\n";
            $content .= "Content-Length: ." . $dat['size'] . ";\r\n";
            $content .= "Content-Type: " . $dat['type'] . "; name=\"" . $dat['name'] . "\"\r\n";
            $content .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $content .= $data . "\r\n";
        }
        $content .= "--" . $mime_boundary . "--";

        return mail($to, $subject, $content, $header);
    } else {

        $hl = array();
        $hl[] = 'MIME-Version: 1.0';
        $hl[] .= 'Content-type: text/html; charset=UTF-8';
        $hl[] .= 'From:' . $sender . '<' . $sender_email . '>';
        //$hl[] .= 'Cc:m.vounkeng@knm.de' . "\r\n";
        $hl[] .= 'Subject: ' . $subject;
        $hl[] .= "X-Mailer: PHP/" . phpversion();

        return mail($to, $subject, $message, implode("\r\n", $hl));
    }
}





?>