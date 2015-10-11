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
$output='';

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

    $rest=new RESTful('get-course-html', array('section'));
    if(empty($rest->data['section'])) die('');

    // Значения о умолчанию
    $props = array(
        'parents'=>$rest->data['section'],
        'depth' => 1,
        'tpl' => 'bz.video-list.item.tpl',
        'where' => "template IN ('41') AND published='1'",
        'limit' => 50,
        "includeTVs" => 'img,speaker,view_count',
        "processTVs" => 1,
        'sortby' => 'menuindex',
        'sortdir' => 'ASC',
//        'fastMode'=>1
    );
    $output= $modx->runSnippet('pdoResources', $props);
//    $modx->getParser()->processElementTags('', $output, false, false, '[[', ']]', array(), 10);
//    $modx->getParser()->processElementTags('', $output, true, true, '[[', ']]', array(), 10);
    print $output;
    die;
}
catch(Exception $e){
    $response['message']=$e->getMessage();
    $response['code']=$e->getCode();
    require_once(API_CORE_PATH.'/class/format/format.class.php');
    print Format::parse($response, $format);
}

print $output;


