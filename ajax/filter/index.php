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

if(DEBUG){
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
}

/* MODX
------------------------------------------------------------------- */
/** @var modX $modx */
defined('MODX_API_MODE') or define('MODX_API_MODE', true);
require('../../../index.php');

/* CONFIG
------------------------------------------------------------------- */
require_once('../../core/config/api.private.config.php');
require_once(API_CORE_PATH.'/class/restful/restful.class.php');

print $modx->getOption('site_name');
die;

// Значения о умолчанию
$props = array(
    'parents'=>'263',
    'tpl' => 'v3.bz.schedule-list.old-style.item.tpl',
    'where' => "template IN ('9','59','61') AND published='1' AND start_date>CURDATE()",
    'limit' => 12,
    "includeTVs" => 'lecture_theme,speaker,view_count,start_date,programm_land,cost,currency,city,programm_priority,city',
    'sortby' => '{
            	"TVprogramm_priority.value": "DESC",
            	"TVstart_date.value": "ASC"
            }',
    "showHidden" => 1,
    'depth' => 1
    );

if(!isset($_REQUEST['city'])) {
    $props['where'] .= " AND (city IS NULL OR city='931' OR city='943' OR city='2258')";
    $props['paramCity']='263';
}

// Список полей разрешённых к фильтрации и сортировке
$fields= array_merge(array('publishedon'), explode(',', $props["includeTVs"]));
//print_r($fields);
$DEFAULT_YEAR=intval(date('Y'));
$YEAR=$DEFAULT_YEAR;
$MONTH=0;

$DATA = $_REQUEST;
if(isset($DATA['filter_month']) && ($DATA['filter_month'] <= 0 || $DATA['filter_month'] > 12)) unset($DATA['filter_month']);
if(DEBUG) print_r($DATA);

// Поступающие значения
foreach($DATA as $key => $val)
{
    if(empty($val)) continue;
    switch($key)
    {
//        case 'parents':
//            $props['parents'] = preg_replace('/[^\d,]/','',$val);
//            break;
//        case 'page':
//            $props['page'] = preg_replace('/[^\d]/','',$val);
//            //$props['page']=$val;
//            break;
        case 'sortby':
            foreach($fields as $sort_el) { if($val == $sort_el) $props["sortby"] = $sort_el; }
            break;
        case 'lecture_theme':
            $clean_val = preg_replace('/[^\d]/', '', $val);
            if(!empty($clean_val)) $props['where'] = $props['where'] . " AND lecture_theme = '" . $clean_val . "'";
            break;
        case 'city':
            $clean_val = preg_replace('/[^\d]/', '', $val);
            if(!empty($clean_val)) $props['where'] = $props['where'] . " AND (city = '" . $clean_val . "' OR city='2258')";
            $props['paramCity']=$clean_val;
            break;
        case 'filter_year':
            $clean_val = preg_replace('/[^\d]/','',$val);
            $YEAR=(int)$clean_val;
            if(empty($YEAR)) $YEAR=$DEFAULT_YEAR;

            //mktime(hour,minute,second,month,day,year,is_dst[opt]);
            $stampFrom =mktime(0,0,0,1,1,$YEAR);
            $stampTo =mktime(0,0,0,1,1,$YEAR+1);

            $dateFrom=date( 'Y-m-d H:i:s', $stampFrom);
            $dateTo=date( 'Y-m-d H:i:s', $stampTo);

            if(!isset($DATA['filter_month'])) $props['where'] = $props['where']." AND start_date >= '".$dateFrom."' AND start_date < '".$dateTo."'";
            break;
        case 'filter_month':
            //if(empty($DATA['filter_year'])) $YEAR=2015;

            $clean_val = preg_replace('/[^\d]/','',$val);
            $MONTH=(int)$clean_val;

            //mktime(hour,minute,second,month,day,year,is_dst[opt]);
            $stampFrom =mktime(0,0,0,$MONTH,1,$YEAR);
            $stampTo =mktime(0,0,0,$MONTH+1,1,$YEAR);

            $dateFrom=date( 'Y-m-d H:i:s', $stampFrom);
            $dateTo=date( 'Y-m-d H:i:s', $stampTo);

            $props['where'] = $props['where']." AND start_date >= '".$dateFrom."' AND start_date < '".$dateTo."'";
            break;
        case 'sortdir':
            if(preg_match('/^desc$/i', $val)) $props['sortdir']='DESC';
            if($val == 1) $props['sortdir']='DESC';
            break;
    }
}

//if($props['page']==1) unset($props['page']);

if(DEBUG) print_r($props);
else {
    $result = $modx->runSnippet('pdoPage', $props);
    print $result;
}