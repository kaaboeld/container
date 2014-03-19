<?php
/**
 * Created by JetBrains PhpStorm.
 * User: kaaboeld
 * Date: 7/23/12
 * Time: 3:03 PM
 * To change this template use File | Settings | File Templates.
 */

$salt  = 'white code';

require_once($core_path."res/php/soap/soap.php");

$clientArr = array(
	"portmonet" => array(
		"host" => "http://127.0.0.1",
		"path" => "/",
		"basicAuth" => array(
			"login"    => "user",
			"password" => "password"
		)
	)
);

$ip = $_SERVER["REMOTE_ADDR"];
if(isset($_SERVER["HTTP_X_FORWARDED_FOR"])){
	$forwardArr = explode(",",$_SERVER["HTTP_X_FORWARDED_FOR"]);
	$realip = trim($forwardArr[0]);
	$ip = $realip;
}