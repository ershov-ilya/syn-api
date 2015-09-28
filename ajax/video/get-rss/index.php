<?php
/**
 * Created by PhpStorm.
 * Author:   ershov-ilya
 * GitHub:   https://github.com/ershov-ilya/
 * About me: http://about.me/ershov.ilya (EN)
 * Website:  http://ershov.pw/ (RU)
 * Date: 28.09.2015
 * Time: 11:50
 */


header('Content-Type: application/rss+xml;charset= utf-8 ');
//header('Content-Type: text/plain; charset=utf-8');
if(isset($_GET['t'])) define('DEBUG', true);
defined('DEBUG') or define('DEBUG', false);

if(DEBUG){
    error_reporting(E_ALL);
    ini_set("display_errors", 1);
}


if(isset($_REQUEST['parents']))
{
    $parents=preg_replace('/\|\|/',',',$_REQUEST['parents']);
    $parents=preg_replace('/[^\d,]/','',$parents);
}
$result='';
?><rss version="2.0" xmlns:jwplayer="http://rss.jwpcdn.com/">
    <channel>
        <?
        defined('MODX_API_MODE') or define('MODX_API_MODE', true);
        require('../../../../index.php');

        // Self
        $props=array(
            'parents'   =>'9222',
            'tpl'       =>'bz.jwplayer.item.tpl',
            //'where'     =>"template IN ('41','57')",
            'limit'     =>'20',
            'includeTVs'=>'video_source,img',
        );
        if(isset($parents)) $props['resources']=$parents;
        $result=$modx->runSnippet('pdoResources',$props);

        // Children
        $props=array(
            'parents'   =>'24',
            'tpl'       =>'bz.jwplayer.item.tpl',
            'where'     =>"template IN ('38')",
            'limit'     =>'20',
            'depth'     =>10,
            'includeTVs'=>'video_source,img',
            'sortby'    =>'id',
            'sortdir'    =>'ASC',
        );
        if(isset($parents)){
            $props['parents']=$parents;
        }
        $result.=$modx->runSnippet('pdoResources',$props);

        print $result;
        ?>
    </channel>
</rss>
