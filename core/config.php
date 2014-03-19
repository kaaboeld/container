<?php
/**
 * Created by JetBrains PhpStorm.
 * User: kaaboeld
 * Date: 7/23/12
 * Time: 3:06 PM
 * To change this template use File | Settings | File Templates.
 */

require_once($core_path."res/php/lessphp/lessc.inc.php");
require_once($core_path."res/php/crypt/crypt.php");
$app_res_path = $base."app/res/";

$res_path = array(
	"css"  => $app_res_path."css/",
	"less" => $app_res_path."less/",
	"js"   => $app_res_path."js/"
);
try {
	lessc::ccompile($res_path["less"].'input.less', $res_path["css"].'styles.css');
} catch (exception $ex) {
	exit($ex->getMessage());
}
try {
	lessc::ccompile($res_path["less"].'comingsoon.less', $res_path["css"].'comingsoon.css');
} catch (exception $ex) {
	exit($ex->getMessage());
}
try {
	lessc::ccompile($res_path["less"].'error.less', $res_path["css"].'error.css');
} catch (exception $ex) {
	exit($ex->getMessage());
}
try {
	lessc::ccompile($res_path["less"].'start.less', $res_path["css"].'start.css');
} catch (exception $ex) {
	exit($ex->getMessage());
}