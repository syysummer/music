//去除浏览器默认样式
// ;(function (){
//   var wrap = document.querySelector(".wrap");
//   document.addEventListener("touchstart",function (event){
//       event.preventDefault();
//   })
// })

// 移动端适配
(function (designWidth){
var size = document.documentElement.clientWidth*100/designWidth;
document.documentElement.style.fontSize = size +"px";
document.body.style.fontSize = "14px";
}(1080));


(function (){
    window.onload = function (){
        menuShowHide();
        navHandler();
        turnPics();
        scrollBarShow();
        labChange();

    };

    //解决菜单栏,决定定位后高度塌陷问题
    var headerWrap = document.querySelector(".header-wrap");
    var header = document.querySelector(".header-wrap .header");
    headerWrap.style.height = header.offsetHeight + "px";
    //单机菜单按钮时,隐藏的菜单进行显示
    function menuShowHide(){
        var menuBtn = document.querySelector(".header .menu-btn");
        var menu = document.querySelector(".header .menu");
        var style = window.getComputedStyle(menu,null);
        $(menuBtn).tap(function (){
            if(style.display == "block"){
                menuBtn.classList.remove("active");
                $(menu).hide();
                headerWrap.style.height = header.offsetHeight + "px";
            }else {
                menuBtn.classList.add("active");
                $(menu).show();
                headerWrap.style.height = header.offsetHeight + "px";
            }
            //当监听了document的轻点时间后,不能点击菜单里面的内容
            // document.addEventListener("touchstart", function (event){
            //     if (event.changedTouches[0].target.id != "active"){
            //         $(menu).hide();
            //         menuBtn.classList.remove("active");
            //         headerWrap.style.height = header.offsetHeight + "px";
            //     }
            // })
        });
    }

    //导航栏的相关事件
    function navHandler(){
        var lis = document.querySelectorAll(".content .nav-wrap .nav li");
        var nav = document.querySelector(".content .nav-wrap .nav");
        var lastIndex = 0;
        for(var i = 0;i < lis.length;i++){
            lis[i].index = i;
            $(lis[i]).tap(function (){
                lis[lastIndex].classList.remove("active");
                this.classList.add("active");
                lastIndex = this.index;
            })
        }
        var initX = 0;
       $(".content .nav-wrap .nav").pan(function (event){
           nav.style.transition = "";
            var disX = event.disX;
           $(this).transform("translate3d",initX+disX,0,0);
            if(event.end){
                initX += disX;
                if(initX > 0){
                    initX = 0;
                    nav.style.transition = "transform 0.5s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d",initX,0,0);
                }else if(initX < document.documentElement.clientWidth - nav.offsetWidth){
                    initX = document.documentElement.clientWidth - nav.offsetWidth;
                    nav.style.transition = "transform 0.5s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d",initX,0,0);
                }
            }
       })

    }

    //轮播图逻辑处理
    function turnPics(){
        var pics = document.querySelector(".content .pics-wrap .sliders");
        var spans = document.querySelectorAll(".content .pics-wrap .indicator span");
        var w = document.documentElement.clientWidth;
        var currentIndex = 0;
        var initX = -(currentIndex+1)*w;
        $(pics).transform("translate3d",initX);
        var timer = null;//定义自动轮播时的定时器
        var timer1 = null;//定义自动轮播时的定时器
            $(pics).pan(function (event){
            // if(Math.abs(event.disY) > Math.abs(event.disX)) return;
            if(Math.abs(event.disX) < 50) return;
            if(currentIndex == -1 || currentIndex == 5) return;
            clearInterval(timer);
            clearTimeout(timer1);
            var disX = event.disX;
            this.style.transform = "translateX("+(initX+disX)+"px)";
            if(event.end){
                clearTimeout(timer1);
                timer1 = setTimeout(function (){
                    autoPlay();
                },1000);
                this.style.transition = "transform 0.5s";
                var i = Math.round(disX / w);
                initX += i * w;
                currentIndex -= i ;
                this.style.transform = "translateX("+initX+"px)";
            }
        });
        //监听过渡结束;
        pics.addEventListener("transitionend",function (){
            this.style.transition = "";
            if(currentIndex <= -1){
                currentIndex = 4;
                initX = -(currentIndex + 1)*w;
                this.style.transform = "translateX("+initX+"px)";
            }else if(currentIndex >= 5){
                currentIndex = 0;
                initX = -(currentIndex + 1)*w;
                this.style.transform = "translateX("+initX+"px)";
            }
            for(var i = 0;i < spans.length;i++){
                spans[i].classList.remove("active");
            }
            spans[currentIndex].classList.add("active");
        });
            //实现自动播放
            autoPlay();
            function autoPlay(){
                timer = setInterval(function (){
                    pics.style.transition = "transform 0.5s";
                    currentIndex++;
                    initX = -(currentIndex+1)*w;
                    pics.style.transform = "translateX("+initX+"px)";
                },1500)
            }
        }

    //上下拖动时让滚动条出现
    function scrollBarShow(){
    var content = document.querySelector(".wrap .content");
    var wrap = document.querySelector(".wrap");
    var startY;
    $(content).scrollBar("gray",4);
    $(content).pan(function (event){
        // if(Math.abs(event.disX) > Math.abs(event.disY)) return;
        if(Math.abs(event.disY) < 50) return;
        if(event.start){
            this.style.transition = "";
            startY = $(content).ty();
        }
        $(content).transform("translate3d",0,startY + event.disY);
        $(content).scroll(startY + event.disY,true);
        if(event.end){
            startY = $(this).ty();
            $(content).scroll(startY,false);
            if(startY >= 0){
                content.style.transition = "transform 0.6s";
                $(content).transform("translate3d",0,0);
            }else if(startY <= wrap.offsetHeight - content.offsetHeight){
                content.style.transition = "transform 0.6s";
                $(content).transform("translate3d",0,wrap.offsetHeight - content.offsetHeight);
            }
        }
    })
    }

    //lab页面拖动的逻辑及lab导航联动逻辑
    function labChange(){
        var startX;
        var currentIndex = 0;
        var w = window.innerWidth;
        var labContent = document.querySelector(".content .lab-content");
        var timer = null;
        var inputs = document.querySelectorAll(".content .lab-nav input");
        var lastLabIndex = 0;
        $(".content .lab-content").pan(function (event){
          // if(Math.abs(event.disY) > Math.abs(event.disX)) return;
          if(Math.abs(event.disX) < 50) return;
           if(event.start){
               startX = $(this).tx();
               this.style.transition = "";
           }
            $(this).transform("translate3d",event.disX);
            if(event.end){
                this.style.transition = "transform 0.4s";
                currentIndex += Math.round(event.disX / w);
                $(this).transform("translate3d", currentIndex * w);
                changeLabNav(Math.round(event.disX / w));
           }
      });
        function changeLabNav(direction){
            if(direction == -1){
                lastLabIndex++;
                lastLabIndex = lastLabIndex == 6 ? 0 :lastLabIndex;
            }else if(direction == 1){
                lastLabIndex--;
                lastLabIndex = lastLabIndex == -1 ? 5 :lastLabIndex;
            }
            inputs[lastLabIndex].checked = true;
        }
      labContent.addEventListener("transitionend",function (){
               timer = setTimeout(function (){
                   currentIndex = 0;
                   labContent.style.transition = "";
                   labContent.style.transform = "translateX(0px)";
           },1000)
      });

        //单机lab-na实现图片切换
        for(var i = 0;i < inputs.length;i++){
            inputs[i].index = i;
            inputs[i].onchange = function (){
            if(lastLabIndex < this.index){
            $(labContent).transform("translate3d",-w).transition("transform 0.6s");
            }else{
            $(labContent).transform("translate3d",w).transition("transform 0.6s");
            }
                lastLabIndex = this.index;
            }
        }

    }



}());
