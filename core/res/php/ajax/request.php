<?php
/**
 * Created by JetBrains PhpStorm.
 * User: kaaboeld
 * Date: 11/3/11
 * Time: 4:39 PM
 * To change this template use File | Settings | File Templates.
 */

require_once("../soap/soap.php");
require_once("../mime/mime.php");

/**
 * TODO: move to abstract module "Data Preparing Module"
 * Preparing Serialized array(0=>array("key"=>,"value"=>)...) for soap request array("key"=>"value")
 * @param $data
 * @return array|null
 */
function prepareData($data)
{
	$result = null;

	if (is_array($data) AND isset($data[0]["name"])) {
		$count = count($data);

		if ($count > 0) {
			for ($i = 0; $i < $count; $i++) {
				$item = $data[$i];
				$key = $item["name"];
				$val = $item["value"];

				if (count(explode("[", $key)) > 1) {
					if ($val != "") {
						list($arr, $key) = explode("[", $key);
						$key = substr($key, 0, -1);
						$ar = array(
							"Key" => $key,
							"_" => $val
						);
						if (!isset($result[$arr])) $result[$arr] = array();

						array_push($result[$arr], $ar);
					}
				} else {
					$result[$key] = $val;
				}
			}
		}
	} elseif (is_array($data) && isset($data["_file"])) {

		$filePath = $_SERVER["DOCUMENT_ROOT"] . $data["_file"]["Path"];
		if (file_exists($filePath)) {
			$mime = mime_content_type($filePath);
			$contents = file_get_contents($filePath);
			$file = new stdClass();
			$file->ContentType = $mime;
			$file->BinaryContents = $contents;
			$file->FileName = $data["_file"]["Name"];
			$data["File"] = $file;
		}

		$result = $data;
	} else {
		$result = $data;
	}
	return $result;
}

$request = new stdClass();

/**
 * Getting request data from $_GET & $_POST
 * Require: $_GET["Method"] this name of soap web-method on server side
 */
if ($_GET) {
	$request->get = $_GET;
}
if ($_POST) {
	$request->post = $_POST;
}
$adapter = new SoapAdapter();
$adapter->debug = true;

// Array of soap hosts and parameters for access
/*
 * client_name = any name for access to Soap WS host from js(/app/res/js/init.js) _appClient="client_name"
 * host        = host name and protocol sting
 * path        = url string to root of Soap WS
 * basicAuth   = access user data: login & password
 */
$clientArr = array(
	"client_name" => array(
		"host" => "http://domain||ip",
		"path" => "url/string",
		"basicAuth" => array(
			"login"    => "auth_login",
			"password" => "auth_password"
		)
	),
);

if (isset($request->post["Client"])) $client = $clientArr[$request->post["Client"]];
else $client = $clientArr["proffis"];

/**
 * Soap Adapter configuration
 */
$adapter->host = $client["host"];
$adapter->path = $client["path"];
$adapter->IP = $_SERVER["REMOTE_ADDR"];
if(isset($_SERVER["HTTP_X_FORWARDED_FOR"])){
	$forwardArr = explode(",",$_SERVER["HTTP_X_FORWARDED_FOR"]);
	$realip = trim($forwardArr[0]);
	$adapter->IP = $realip;
}
/**
 * Soap Basic Authorization parameters. If need for request needed get $_POST["BasicAuth"]=true
 */
$basicAuthParam = $client["basicAuth"];


$method = null;
if (isset($request->get['Method'])) $method = $request->get['Method'];

$data = null;
if (isset($request->post)) {
	if (isset($request->post['Data'])) $data = prepareData($request->post['Data']);

	/**
	 * Require: param for request, full name of web-service, example: "API.Problem.Service"
	 */
	if (isset($request->post['Service']))     $adapter->service = $request->post['Service'];
	if (isset($request->post['AccessToken'])) $adapter->accessToken = $request->post['AccessToken'];
	if (isset($request->post['BasicAuth'])) {
		$adapter->basicAuth = false;
		$adapter->basicAuth = ($request->post['BasicAuth'] == "true");

		$adapter->basicAuthParam = $basicAuthParam;
	}
	if (isset($request->post['Session'])) {
		$adapter->session = false;
		$adapter->session = ($request->post['Session'] == "true");
		$CSPCHD = "";
		if ((isset($_COOKIE['CSPCHD']) AND $_COOKIE['CSPCHD'] != '')) {
			$CSPCHD = $_COOKIE['CSPCHD'];
		}
		$adapter->sessionId = $CSPCHD;
	}

}
/**
 * Executing(send request) web-method on web-service
 */
$result = $adapter->execute($method, $data);

/**
 * Getting result data and encoding to json
 */
if ($result != null) {
	echo json_encode($result);
}
