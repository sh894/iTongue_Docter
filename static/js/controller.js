
myapp.controller("doctor",function($scope){
    var userId = window.sessionStorage.getItem("userId");
    var isDeleteEvent = false;
    var time = [];
    var param = {};
    window.calendarData = [];
    if(!userId){
        sureText("Login first!",function(){
            location.href = "/login";
        });
    }
    param.userId = userId;

    $(".calendar-btn").click(function(){
        if(!$(this).attr("name")){
            setTimeout(function(){
                $("#myCalendar").fullCalendar({
                    header:{
                        left:"",
                        center:"",
                        right:""
                    },
                    aspectRatio:"1.5",
                    slotMinutes:60,
                    defaultView:"agendaWeek",
                    columnFormat:"ddd",
                    allDaySlot:false,
                    minTime:8,
                    maxTime:20,
                    events:{
                        url:"/doctor/appointment/detail?userId="+userId,
                        type:"GET"
                    },
                    dayClick:function(data,bool,jsEvent,view){
                        if(isDeleteEvent){
                            return false;
                        }
                        var time = new Date(data).getTime();
                        var endTime = new Date(time + 60 * 60 * 1000);
                        var selDate =$.fullCalendar.formatDate(data,'yyyy-MM-dd HH:mm');//格式化日期
                        var end =$.fullCalendar.formatDate(endTime,'yyyy-MM-dd HH:mm');//格式化日期
                        var eventParam = {
                            userId:userId,
                            event:{
                                allDay:false,
                                start:selDate,
                                end:end,
                                title:"Available",
                                color:"rgb(0, 222, 0)"
                            }
                        };
                        $.ajax({
                            url:"/doctor/appointment",
                            data:JSON.stringify(eventParam),
                            dataType:"json",
                            type:"POST",
                            contentType:"application/json",
                            success:function(data){
                                if(data.status == 0){
                                    $("#myCalendar").fullCalendar('removeEvents');
                                    $("#myCalendar").fullCalendar('addEventSource',"/doctor/appointment/detail?userId="+userId);
                                }
                            }

                        });
                    },
                    eventClick:function(calEvent){
                        isDeleteEvent = true;
                        var selDate =$.fullCalendar.formatDate(calEvent.start,'yyyy-MM-dd HH:mm');//格式化日期
                        var resetParam = {
                            userId:userId,
                            date:selDate
                        };
                        $.ajax({
                            url:"/doctor/appointment/reset",
                            dataType:"json",
                            data:JSON.stringify(resetParam),
                            type:"POST",
                            contentType:"application/json",
                            success:function(data){
                                if(data.status == 0){
                                    isDeleteEvent = false;
                                    $("#myCalendar").fullCalendar('removeEvents');
                                    $("#myCalendar").fullCalendar('addEventSource',"/doctor/appointment/detail?userId="+userId);
                                }
                            }
                        });
                    }
                });
            },200);
        }
        $(this).attr("name",true);
    });
    // 日历

    // 图片上传
    $(".image-upload input").change(function(){
        if($("#newWindow").length == 0){
            $("body").append('<iframe id="newWindow" style="display: none;" name="newWindow"></iframe>');
        }
        $(this).parents("form").submit();
        $("#newWindow")[0].onload = function(){
            var str = $("#newWindow").contents().find("body pre").html();
            var json = JSON.parse(str);
            if(json.status == 0){
                json.body = json.body.split("static/")[1];
                param.img = json.body;
                $(".image-upload").css({"background":"url("+json.body+") no-repeat","background-size":"100% 100%"});
            }
            $("#newWindow").empty().remove();
        }
    });

    // 拉取用户信息
    $.ajax({
        url:"/doctor/detail?id="+userId,
        dataType:"json",
        type:"GET",
        success:function(data){
            if(data.status == 0){
                $(".image-upload").css({"background":"url("+data.body[0].img+") no-repeat","background-size":"100% 100%"});
                param.img = data.body[0].img;
                if(data.body[0].sex == 0){
                    $(":radio:eq(0)").prop("checked","checked");
                }else{
                    $(":radio:eq(1)").prop("checked","checked");
                }
                $(".input-age").val(data.body[0].age);
                $(".input-education").val(data.body[0].education);
                $(".input-school").val(data.body[0].school);
                $(".input-name").val(data.body[0].name);
                $(".input-tel").val(data.body[0].tel);
                $(".input-email").val(data.body[0].email);
                $(".input-major").val(data.body[0].major);
                $(".input-msg").val(data.body[0].introduce);

                if(data.body[0].name){
                    $("#user-name").html(data.body[0].name);
                }else{
                    $("#user-name").html(data.body[0].username);
                }

            }
        }
    });

    // 用户完善信息
    $(".submit-btn").click(function(){
        var className = [".input-sex",".input-age",".input-education",".input-school",
            ".input-name",".input-tel",".input-email",".input-major",".input-msg"];
        // for(var i = 0; i < className.length; i++){
        //     if(!$(className[i]).val()){
        //         hintText("输入框的值不能为空");
        //         return false;
        //     }
        // }
        param.sex = $(":radio:checked").val();
        param.age = $(".input-age").val();
        param.education = $(".input-education").val();
        param.school = $(".input-school").val();
        param.name = $(".input-name").val();
        param.tel = $(".input-tel").val();
        param.email = $(".input-email").val();
        param.major = $(".input-major").val();
        param.msg = $(".input-msg").val();
        $.ajax({
            url:"/doctor/perfect",
            dataType:"json",
            data:JSON.stringify(param),
            contentType:"application/json",
            type:"POST",
            success:function(data){
                alert("change success");
                if(data.status == 0){
                    $(".nav-tabs li").eq(0).addClass("active").siblings().removeClass("active");
                    $(".tab-content div").eq(0).addClass("active").siblings().removeClass("active");
                }else{
                    hintText(data.msg);
                }
            }
        });
    });


    //0416 2017
    //所有appointment

    $.ajax({
        url:"/doctor/appointment/all_events?id="+userId,
        dataType:"json",
        type:"GET",

        success:function(data){
            if(data.status == 0){
                $.each( data.body[0].appointment, function(index, el) {
                    $(".input-test").val(index);
                    //alert("element at " + index + ": " + el); // will alert each value
                });

            }
        }
    });

    //php test POST

    $(".php-post-btn").click(function(){
       var post = $(".input-php-post").val();

        // $.ajax({
        //     //url: "http://www.handsomebird.cn:3000/doctorlist",
        //     url: "http://localhost:80/appointment.php",
        //     data: {"pi:": post},
        //     type:"POST",
        //     success:function(data){
        //         alert("post success");
        //     },
        //     error: function(xhr, type, errorThrown) {
        //         alert("xhr: " + xhr);
        //         alert("type: " + type);
        //         alert("error:" + errorThrown);
        //     }
        // });
        $.ajax({
            url:"http://localhost:80/appointment.php", //the page containing php script
            data: {"pi:": post},
            dataType: "json",
            type: "POST", //request type
            success:function(result){
                alert("success");
            },
            error:function(x,e) {
                if (x.status==0) {
                    alert('You are offline!!\n Please Check Your Network.');
                } else if(x.status==404) {
                    alert('Requested URL not found.');
                } else if(x.status==500) {
                    alert('Internel Server Error.');
                } else if(e=='parsererror') {
                    alert('Error.\nParsing JSON Request failed.');
                } else if(e=='timeout'){
                    alert('Request Time out.');
                } else {
                    alert('Unknow Error.\n'+x.responseText);
                }
            }
        });


    });



    $scope.logout = function(){
        window.sessionStorage.removeItem("userId");
        location.href = "/login";
    }
});
