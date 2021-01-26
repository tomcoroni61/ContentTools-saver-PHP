<?php
include 'funcis.php';

// sag saverphp.js: Du hast mich gefunden .. Hi
if (isset($_POST['isalive']) ) {  http_response_code(200); exit; }


  http_response_code(6000); //409=conflict  error_log
  startLog("saverlog.txt");
 //return;

  if(!isset($_POST['__page__'])) { //and $_POST['isalive'] =='Frage'
                doLog("675 Fileparameter missing"."\n".implode($_POST),true, 655); }

  http_response_code(6012);
  $Datei = $_POST['__page__'];
  $Datei = check_file($_POST['__page__']);
  if (!file_exists($Datei)) { //"File ".$Datei."not found"
    doLog("622 File ".$Datei." not found", true, 622 );  
    //die("File ".$Datei."not found");
}

  $DataChanges=0;
  if (isset($_POST['__ChangeCount__'])) {
    $DataChanges=$_POST['__ChangeCount__'];
    doLog('Datas to change: '.$DataChanges); }
  
  //  http_response_code(6012);
// $Datei = check_file oberhalb
  //wtf("Copy file now"); //wtf($arg1, $arg2,..);
  doLog("found: ".$Datei);
  //copy($Datei, $Datei."bak.html");
  $aArray = file($Datei, FILE_IGNORE_NEW_LINES);
    if (!$aArray) doLog('700-Lesefehler!!', true, 700);

  $daName='non';               $upsi = array();
  $doReplace=false;            $startDiv = 1;

  foreach ($aArray as $sLine) {
    if (!$doReplace) { 
      $upsi[]=$sLine;

      if (hgEditable($sLine, $daName) and (isset($_POST[$daName])) ) {
        $doReplace=true;   //ab jetzt ersetzen bis </div>
        //$newVal = betterReadable( $_POST[$daName] ); //für später <einmal class=""></einmal>
        $newVal = $_POST[$daName];
        doLog('Found editable: ' . $daName);
        //doLog('new Val:'.PHP_EOL.$newVal);
        $upsi[] = $newVal;
      }  
    //doLog($sLine); 
    }
     else { //replacemode:
      if (hasStartDiv($sLine)) {$startDiv++; doLog('Startdiv++: '.$startDiv);
       }
      if (hasEndDiv($sLine)) { $startDiv--;  doLog('Startdiv--: '.$startDiv);
          if ($startDiv==0) {
            $startDiv=1;
            $upsi[] = $sLine;    //array_push($stack, //    
            $doReplace=false;
            $DataChanges--;
          }
      }
    } //else
   }
   //if (updateContent($Datei))  http_response_code(200);//200=OK
   doLog('Datas left to change: '.$DataChanges);
   if (saveArray($Datei,$upsi)) http_response_code(200);//200=OK
?>