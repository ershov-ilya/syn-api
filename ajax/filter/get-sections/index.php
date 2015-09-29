<?php
/**
 * Created by PhpStorm.
 * Author:   ershov-ilya
 * GitHub:   https://github.com/ershov-ilya/
 * About me: http://about.me/ershov.ilya (EN)
 * Website:  http://ershov.pw/ (RU)
 * Date: 14.04.2015
 * Time: 16:47
 */

header("Access-Control-Allow-Origin: http://synergy.ru");

// Errors control
header('Content-Type: text/plain; charset=utf-8');
if(isset($_REQUEST['t'])) define('DEBUG', true);
defined('DEBUG') or define('DEBUG', false);
$response=array();
$format='json';
$parent=9573;

if(DEBUG){
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
}

/* MODX
------------------------------------------------------------------- */
/** @var modX $modx */
defined('MODX_API_MODE') or define('MODX_API_MODE', true);
require('../../../../index.php');

/* CONFIG
------------------------------------------------------------------- */
require_once('../../../core/config/api.private.config.php');
require_once(API_CORE_PATH.'/class/restful/restful.class.php');
require_once(API_CORE_PATH.'/class/format/format.class.php');

try {
    $user_id = $modx->user->id;
    $rest=new RESTful('get-sections',array('course'));

    $json='[]';
    $q = $modx->newQuery('modResource');
    $q->select('id,pagetitle,alias,uri');
    $q->where(array('modResource.parent' => $parent));
    if ($q->prepare() && $q->stmt->execute()) {
        $rows = $q->stmt->fetchAll(PDO::FETCH_ASSOC);
        if(!empty($rows)) $response=array('sections'=>$rows);
    }

    if(!empty($rest->data['course'])){
        $q = $modx->newQuery('modResource');
        $q->select('id,pagetitle,alias,uri');
        $q->where(array('modResource.parent' => $rest->data['course']));
        if ($q->prepare() && $q->stmt->execute()) {
            $rows = $q->stmt->fetchAll(PDO::FETCH_ASSOC);
            if(!empty($rows)) $response['course']=$rows;
        }
    }

    if(DEBUG) {
        print_r($response);
    }

}
catch(Exception $e){
    $response['message']=$e->getMessage();
    $response['code']=$e->getCode();
}

require_once(API_CORE_PATH.'/class/format/format.class.php');
print Format::parse($response, $format);
