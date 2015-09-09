<?php
/**
 * Created by PhpStorm.
 * Author: ershov-ilya
 * Website: http://ershov.pw/
 * Date: 19.01.2015
 * Time: 17:14
 */

define('API_ROOT_PATH', '/var/www/mfpa.ru/public/api');
define('API_ROOT_URL', 'http://synergy.ru//api');

define('API_CORE_PATH', API_ROOT_PATH.'/core');
define('API_CORE_URL', API_ROOT_URL.'/core');

define('API_LOG_PATH', API_ROOT_PATH.'/core/logs/log.txt');
function logMessage($message)
{
    $date = date("m.d.Y G:i:s T ");
    $message = $date.' '.$message."\n";
    file_put_contents(API_LOG_PATH, $message, FILE_APPEND);
}