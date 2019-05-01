// 监听窗滚动
$(document).scroll(function() {
    var top1 = $('#navbar').offset().top;
    var gun = $(document).scrollTop();
    if (top1 = gun) {
      $('#navbar').addClass('navbar-fixed-top');
      $('#logo').hide();
      
    }else{
      $('#navbar').removeClass('navbar-fixed-top');
      $('#logo').show();
    }
  }); 
  // 监听窗口大小变化
window.onresize = function(){
  article_img();
}
// 动态设置图片属性
function article_img()
{
  
  $(".left-content ul li.article .pic img").height($(".article .article-right").parent().height());
  $(".left-content ul li.article .pic img").width($(".left-content ul li.article .pic").width());
}
//窗体加载
window.onload = function(){
  article_img();
}

//底部
function footerPosition(){
        $("footer").removeClass("navbar-fixed-bottom");
        var contentHeight = document.body.clientHeight ,//网页正文全文高度
            winHeight = document.documentElement.clientHeight; //可视窗口高度，不包括浏览器顶部工具栏
        if(!(contentHeight > winHeight)){
            //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
            $("footer").addClass("navbar-fixed-bottom");
        }
}

$(function(){

footerPosition();

window.resize = function(){
  footerPosition();
}

})