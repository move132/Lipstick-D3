var viewWidth = $(window).width();
var viewHeight = $(window).height();
$('.svg-div').append(`<svg  width=${viewWidth}  height=${viewHeight} > <defs>  
    <linearGradient id="gradientline" x1="0%" y1="20%" x2="0%" y2="100%">  
            <stop offset="0%" stop-color="#EA5331" />  
            <stop offset="100%" stop-color="#550001" />  
    </linearGradient>  
    <image id="imagesBg" height="100%" width="100%" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/bg.png">
        </image>
    </defs></svg>`); 
//$('.svg-div').append(`<svg  width=${viewWidth}  height=${viewHeight} ></svg>`); 
$(function(){
    $(window).resize(function(){
        var viewWidth = $(window).width();
        var viewHeight = $(window).height();
        $("svg").attr({width:viewWidth,"height":viewHeight});
        $("#svg_rect").attr({width:viewWidth,"height":viewHeight});
    })
})
fetchData();