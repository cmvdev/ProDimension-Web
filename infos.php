<?php
/**
 * Created by PhpStorm.
 * User: marvinvounkeng
 * Date: 02.02.17
 * Time: 15:50
 */

$fileName="infos.txt";
$message="";



function readDirs($path){
    $dirHandle = opendir($path);
    while($item = readdir($dirHandle)) {
        $newPath = $path."/".$item;
        if(is_dir($newPath) && $item != '.' && $item != '..') {
            //$path=substr($newPath, 1);
           // echo substr($newPath, 1)."<br>";
            readDirs($newPath);
        }
        else{
            if(substr($item, -1)!='.') {
                echo substr($path, 1) . "/" . $item . '<br>';
            }
        }
    }
}

$path =  ".";
//echo "$path<br>";

readDirs($path);











?>