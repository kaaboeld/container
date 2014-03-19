<?php
/**
 * Created by JetBrains PhpStorm.
 * User: kaaboeld
 * Date: 11/3/11
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */

class SoapAdapter {
	public $host      = "";
	public $path      = "";
	public $postfix   = "?WSDL=1";
	public $service   = "";
	public $sessionId = "";
	public $IP        = "";
	public $accessToken    = "";
	public $basicAuthParam = array();

	public $session   = false;
	public $basicAuth = false;
	public $trace     = true;
	public $debug     = false;

	/**
	 * Executing(send request) web-method on web-service
	 * @param $method
	 * @param null $data
	 * @return stdClass
	 */
	public function execute($method,$data=null){
		$result = new stdClass();
		$result->Result = null;
		$result->Error  = false;
		$soapXML = new stdClass();
		/**
		 * Creating soapclient
		 */
		$client = $this->createClient();

		$exception = null;
		/**
		 * Try execute request
		 */
		try{
			/**
			 * If have $data for request add this
			 */

			if($data != null) $request = $client->$method($data);
			else $request = $client->$method();

			$methodResult = $method."Result";
			/**
			 * Get request result to $result object
			 */
			if(isset($request->$methodResult)) $result->Result = $request->$methodResult;
			else $result->Result = $request;

		}catch(Exception $exception){
			/**
			 * If have soap fault create SoapFault object and die
			 */
			$soapXML->Request  = $client->__getLastRequest();
			$soapXML->Response = $client->__getLastResponse();
			$result->SoapXML = $soapXML;

			$result->Error  = true;
			$result->ex = $exception;
			$result->SoapFault = $this->parseSoapFault($exception);
			echo json_encode($result);
			die();
		}

		if(!isset($result->SoapFault)){
			$requestStatus = new stdClass();
			$requestStatus->Code = 1;
			$requestStatus->Text = "";
			
			if(isset($result->Result->Status)){
				$statusCode = (int) $result->Result->Status->Code;
				$statusText = $result->Result->Status->Text;

				$requestStatus->Code = $statusCode;
				$requestStatus->Text = $statusText;

			}
			if($requestStatus->Code == 0) $result->Error = true;
			
			$result->Status = $requestStatus;
		}

		if($this->debug){
			$soapXML->Request  = $client->__getLastRequest();
			$soapXML->Response = $client->__getLastResponse();
			$soapXML->Headers = $client->__getLastRequestHeaders();
			$result->SoapXML = $soapXML;
		}

		return $result;
	}

	/**
	 * Parsing soap fault object and creating $soapFault object
	 * @param $exception
	 * @return stdClass
	 */
	private function parseSoapFault($exception){
		$soapFault = new stdClass();
		$soapFault->Code = $exception->faultcode;

		$faultText = "";
		if(isset($exception->detail->error->text)) $faultText .= $exception->detail->error->text;
		//if(isset($exception->faultstring))         $faultText .= $exception->faultstring;

		$soapFault->Text = $faultText;

		return $soapFault;
	}
	
	/**
	 * Creating soap client (authorization, tracing, session)
	 * @return SoapClient
	 */
	private function createClient(){
		$wsdl = $this->host . $this->path . $this->service . ".cls" . $this->postfix;
		
		try{
			$clientParam = array();
			/**
			 * if $this->basicAuth true add basic authorization params to request
			 */
			if($this->basicAuth){
				$clientParam = $this->basicAuthParam;
			}

			$clientParam['trace'] = $this->trace;
			$clientParam['features'] = SOAP_SINGLE_ELEMENT_ARRAYS;

			$headersStr = 'IP: '.$this->IP;
			if($this->accessToken != ""){
				$headersStr .= "\n".
					'ACCESS_TOKEN: '.$this->accessToken;
			}
			if($this->session){
				$headersStr .= "\n".
					'Session: 1';
			}

			$httpHeaders = stream_context_create(array(
					"http" => array(
						"header" => $headersStr
					)
				)
			);
			$clientParam['stream_context'] = $httpHeaders;

			$client = new SoapClient($wsdl,$clientParam);
			
		}catch(Exception $exception){
			/**
			 * If have soap fault create SoapFault object and die
			 */
			$ex = new stdClass();
			$ex->Error = true;
			$soapXML = new stdClass();
			$ex->ex = $exception;
			$ex->SoapFault = $this->parseSoapFault($exception);
			echo json_encode($ex);
			die();
		}
		if($this->session AND $this->accessToken == ""){
			$sessionStr    = "<csp:CSPCHD xmlns:csp='http://www.intersystems.com/SOAPheaders'><id>".$this->sessionId."</id></csp:CSPCHD>";
			$sessionVar    = new SoapVar($sessionStr, XSD_ANYXML, null, null, null);
			$sessionHeader = new SoapHeader('http://www.intersystems.com/SOAPheaders', 'cspchd', $sessionVar);

			$client->__setSoapHeaders(array($sessionHeader));
		}

		return $client;
	}
}
