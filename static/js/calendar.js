/**
 * Created by MacBook Air on 2017/3/13.
 */
// 声明一个日历
$.prototype.calendar = function(num){
    var str = '<table class="table table-bordered calendar-style">' +
        '<thead>' +
        '<tr>' +
        '<th></th>' +
        '<th>一</th>' +
        '<th>二</th>' +
        '<th>三</th>' +
        '<th>四</th>' +
        '<th>五</th>' +
        '<th>六</th>' +
        '<th>日</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr>' +
        '<th>8:00</th>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '</tr>' +
        '<tr>' +
        '<th>10:00</th>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '</tr>' +
        '<tr>' +
        '<th>2:00</th>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '</tr>' +
        '<tr>' +
        '<th>4:00</th>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '</tr>' +
        '<th>6:00</th>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '</tr>' +
        '</tbody>'+
        '</table>';
    $(this).append(str);
    $(this).find("td").mouseenter(function(event){
        $(this).addClass("active");
    });
    $(this).find("td").mouseleave(function(){
        $(this).removeClass("active");
    });
    $(this).find("td").click(function(){
        if(num == 1){
            return false;
        }
        var day = $(this).parents("tr").find("td").index(this);
        var hour = $(this).parents("body").find("tr").index($(this).parents("tr"));
        if($(this).hasClass("success")){
            $(this).removeClass("success").html("");
            for(var i = window.calendarData.length - 1; i >= 0; i--){
                if(window.calendarData[i].day == day && window.calendarData[i].hour == hour){
                    window.calendarData.splice(i,1);
                }
            }
        }else{
            $(this).addClass("success").html("Available");
            var obj = {};
            obj.day = day;
            obj.hour = hour;
            window.calendarData.push(obj);
        }
    });
};