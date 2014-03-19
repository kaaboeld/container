<?php
/**
 * Created by JetBrains PhpStorm.
 * User: kaaboeld
 * Date: 7/27/12
 * Time: 4:29 PM
 * To change this template use File | Settings | File Templates.
 */
$root = $_SERVER["DOCUMENT_ROOT"];
if(isset($_POST)){
	$filename = "json";
	if(isset($_POST["filename"])) $filename = $_POST["filename"];
echo $root."/app/map/".$filename.".json";

	$fp = fopen($root."/app/map/".$filename.".json", 'w+');
	fwrite($fp, "_appLinkMap=".$_POST["data"].";");
	fclose($fp);
}