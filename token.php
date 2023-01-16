<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$cmd = $_GET['cmd'];
$password = $_GET['password'];
$token = $_GET['token'];
$file = './.token';
if($cmd === 'get'){
 $content = file_get_contents($file);
 echo $content;
}
if($cmd === 'set') {
  if($password === 'xxx') {
   $return = file_put_contents($file, $token);
   var_dump($return);
  } else {
   http_response_code(500);
   echo 'Wrong password';
  }
} 

