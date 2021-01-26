
<?php

function startLog($logname) { 
    $GLOBALS["LogFileName"] = $logname;  
    $Log=fopen($GLOBALS["LogFileName"], "w");  
    $objDateTime = new DateTime('NOW');
    fwrite($Log, $objDateTime->format('D,  d .M .Y     H:i:s')."\n"); fclose($Log);  //empty log  
}
$LogFileName="myLog.txt";

function doLog($msg, $isErr=false, $errcod=0) {   
    
    $Log=fopen($GLOBALS["LogFileName"], "a"); fwrite($Log, $msg."\n"); fclose($Log);
    if ($isErr==true) { error_log($msg); 
        http_response_code($errcod);
        die($msg); }        
    
    }

  function check_file($aFile) {
      doLog("check_file ".$aFile);
      if (strpos($aFile, ".htm")<1) $aFile =$aFile."index.html";  //ne: $aFile+="index.html";
     // doLog("check_file 11".$aFile);
      if (file_exists($aFile)) return $aFile;
      if (file_exists("{$_SERVER['DOCUMENT_ROOT']}aFile$aFile"))    return "{$_SERVER['DOCUMENT_ROOT']}aFile$aFile";
      if (file_exists(realpath($aFile))) return realpath($aFile);
      if (file_exists("..".$aFile)) {// doLog("found some");
        $aFile = "..".$aFile;
          return $aFile;
      }
      //if (file_exists("../sowas/san/index.html")) return "../sowas/san/index.html";
      doLog("Documentroot: {$_SERVER['DOCUMENT_ROOT']}" ); //forgot ; php err 404
      $path_parts = pathinfo($aFile);
     // doLog("check_file 2 ".$path_parts['basename']);
      if (file_exists($path_parts['basename'])) return $path_parts['basename'];
     // doLog("check_file 3 ".$path_parts['filename']);
      if (file_exists($path_parts['filename'])) return $path_parts['filename'];
  
    return $aFile;
  }

  /*
<!-- editable moving1 -->
<div data-editable data-name="moving1">
     <blockquote>[Enter content here]</blockquote>
    <p>[your name]</p>
</div>
<!-- endeditable moving1 -->
  */

  function hgEditable($sLine, &$DataName) {
        $idx=strpos($sLine,'data-editable');
        if ($idx<1) return false;
        $idx=strpos($sLine,'data-name="');     $idx2=strpos($sLine,'">');
        if ($idx<1 or $idx2<1 or $idx2<$idx+5 ) return false;
        $dif=11;
        $DataName=substr($sLine, $idx+$dif, ($idx2-$idx)-$dif);
        //doLog('DataName: ' . $DataName);
        return true;
    }

    function hasStartDiv($line) {
       return stripos($line, '<div')>-1;
    }
    function hasEndDiv($line) {
        return stripos($line, '</div>')>-1;
     }

    function saveArray($aFile, $aAri) {
        $myfile = fopen($aFile, "w") or doLog("640-Unable to open file! ".$aFile, true, 640);

        foreach($aAri as $line) {
          fwrite($myfile, $line.PHP_EOL);
          }
        
        fclose($myfile); 
        return true;              
    }

   
?>
