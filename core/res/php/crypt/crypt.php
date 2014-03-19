<?php
/**
 * Created by JetBrains PhpStorm.
 * User: kaaboeld
 * Date: 3/15/12
 * Time: 10:56 AM
 * To change this template use File | Settings | File Templates.
 */

class Cryptr{
	public $key   = "white code";
	private $salt = "prive salt";
	
function base64_url_encode($input) {
 return strtr(base64_encode($input), '+/=', '-_,');
}

function base64_url_decode($input) {
 return base64_decode(strtr($input, '-_,', '+/='));
}

	function decrypt($string){
		$salt = $this->key.$this->salt;
		return rtrim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, md5($salt), base64_decode($string), MCRYPT_MODE_CBC, md5(md5($salt))), "\0");
	}
	function encrypt($string){
		$salt = $this->key.$this->salt;
		return base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, md5($salt), $string, MCRYPT_MODE_CBC, md5(md5($salt))));
	}
}
