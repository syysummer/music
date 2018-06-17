(function (window, document) {
    window.$ = window.myQuery = myQuery;

    function myQuery(selector) {
        return new Init(selector);
    }

    function Init(selector) {
        if (typeof selector == "string") {
            this.ele = document.querySelector(selector);
        } else if (typeof selector == "object") {
            this.ele = selector;
        }
    }

    Init.prototype = {
        //模拟桌面轻触
        tap: function (callBack) {
            var ele = this.ele;
            ele.addEventListener("touchstart", handler);
            ele.addEventListener("touchend", handler);
            var startTime;

            function handler(event) {
                var type = event.type;
                var touch = event.changedTouches[0];
                var clientX = touch.clientX;
                var clientY = touch.clientY;
                if (type == "touchstart") {
                    startTime = new Date();
                } else {
                    var deltaTime = new Date() - startTime;
                    if (deltaTime < 200) {
                        (typeof callBack == "function") && callBack.call(ele, {
                            type: "tap",
                            clientX: clientX,
                            clientY: clientY
                        })
                    }
                }
            }

            return this;
        },
        //模拟桌面滑动
        pan: function (callBack) {
            var ele = this.ele;
            ele.addEventListener("touchstart", handler);
            ele.addEventListener("touchmove", handler);
            ele.addEventListener("touchend", handler);
            var startX = 0, startY = 0, disX = 0, disY = 0;
            var lastTime = 0, currentTime = 0, speedX = 0, speedY = 0, lastDeltaX = 0, lastDeltaY = 0;

            function handler(event) {
                var type = event.type;
                var touch = event.changedTouches[0];
                if (type == "touchstart") {
                    lastTime = new Date();
                    disX = 0;
                    disY = 0;
                    speedX = 0;
                    speedY = 0;
                    startX = touch.clientX;
                    startY = touch.clientY;
                    (typeof callBack == "function") && callBack.call(ele, {
                        type: "panstart",
                        disX: disX,
                        disY: disY,
                        speedX: speedX,
                        speedY: speedY,
                        start:true
                    });
                } else if (type == "touchmove") {
                    disX = touch.clientX - startX;
                    disY = touch.clientY - startY;
                    currentTime = new Date();
                    var deltaTime = currentTime - lastTime;
                    speedX = (disX - lastDeltaX) / (deltaTime / 1000);
                    speedY = (disY - lastDeltaY) / (deltaTime / 1000);
                    (typeof callBack == "function") && callBack.call(ele, {
                        type: "panmove",
                        disX: disX,
                        disY: disY,
                        speedX: speedX,
                        speedY: speedY,
                        start:false
                    });
                    lastTime = currentTime;
                    lastDeltaX = disX;
                    lastDeltaY = disY;
                } else {
                    (typeof callBack == "function") && callBack.call(ele, {
                        type: "panend",
                        disX: disX,
                        disY: disY,
                        speedX: speedX,
                        speedY: speedY,
                        end: true,
                        start:false
                    })
                }
            }

            return this;
        },
        //增加滚动条
        scrollBar: function (color, width) {
            var ele = this.ele;
            var parent = ele.parentElement;
            var span = document.createElement("span");
            span.style.position = "absolute";
            span.style.right = "0";
            span.style.top = "0";
            span.style.width = width + "px";
            span.style.backgroundColor = color;
            span.style.opacity = "0";
            span.style.height = (parent.offsetHeight * parent.offsetHeight) / ele.offsetHeight + "px";
            parent.insertBefore(span, ele.nextElementSibling);
            return this;
        },
        scroll: function (deltaDis, scrolling) {
            var ele = this.ele;
            var parent = ele.parentElement;
            var bar = ele.nextElementSibling;
            if(scrolling){
                bar.style.transition = "opacity 1s";
            }else{
                bar.style.transition = "opacity 1s 1s";
            }
            bar.style.opacity = scrolling ? "1" : "0";
            var barMax = parent.offsetHeight - bar.offsetHeight;
            var eleMax = ele.offsetHeight - parent.offsetHeight;
            var barTop = -deltaDis * barMax / eleMax;
            if (barTop <= 0) {
                barTop = 0;
            } else if (barTop >= barMax) {
                barTop = barMax;
            }
            bar.style.transform = "translateY(" + barTop + "px)";
            return this;
        },
        toggle: function () {
            var display = window.getComputedStyle(this.ele, null)["display"];
            if (display == "block") {
                this.hide();
            } else if (display == "none") {
                this.show();
            }
            return this;
        },
        show: function () {
            this.ele.style.display = "block";
            return this;
        },
        hide: function () {
            this.ele.style.display = "none";
            return this;
        },
        //transform 属性只能一次设置平移,旋转,缩放中的一个,而不能同时设置;
        transform: function (name, v1= 0, v2 = 0, v3 = 0) {
            var ele = this.ele;
            if (name == "translate3d") {
                ele.style.transform = "translate3d(" + v1 + "px," + v2 + "px," + v3 + "px)";
            } else if (name == "rotate3d") {
                ele.style.transform = "rotate3d(" + v1 + "deg," + v2 + "deg," + v3 + "deg)";
            } else if (name == "scale3d") {
                ele.style.transform = "scale3d(" + v1 + "," + v2 + "," + v3 + ")";
            }
            return this;
        },
        //记录当前的transform中的translateX,与offsetLeft用法类似;
        tx:function (){
        var m = window.getComputedStyle(this.ele,null)["transform"];
            var arr = m.split(",");
            return +arr[arr.length - 2];
        },
        //记录当前的transform中的translateY,与offsetTop用法类似;
        ty:function (){
            var m = window.getComputedStyle(this.ele,null)["transform"];
            var arr = m.split(",");
            return +(arr[arr.length - 1].replace(")",""));
        },
        //过渡封装方法
        transition:function (value){
        if(value == "undefined"){
             window.getComputedStyle(this.ele,null)["transition"];
        }else{
            this.ele.style.transition = value;
            return  this;
        }
        }
    }

}(window, document));