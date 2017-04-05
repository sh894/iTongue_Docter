/**
 * Created by MacBook Air on 2017/3/12.
 */
function hintText(text){
    if($("#myModal").length == 0){
        var str = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog modal-sm" role="document">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
            '<h4 class="modal-title">提示</h4>'+
            '</div>'+
            '<div class="modal-body">'+
            '<p></p>'+
            '</div>'+
            '<div class="modal-footer">'+
            '<button type="button" class="btn btn-default" data-dismiss="modal">确认</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $("body").append(str);
    }
    $(".modal-body").html(text);
    $('#myModal').modal();
}
function sureText(text,callback){
    if($("#myModal").length == 0){
        var str = '<div class="modal fade" id="myModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog modal-sm" role="document">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
            '<h4 class="modal-title">提示</h4>'+
            '</div>'+
            '<div class="modal-body">'+
            '<p>One fine body&hellip;</p>'+
            '</div>'+
            '<div class="modal-footer">'+
            '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
            '<button type="button" class="btn btn-default sure-btn">确定</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $("body").append(str);
    }
    $(".modal-body").html(text);
    $(".sure-btn").click(function(){
        if(callback){
            callback();
        }
    });
    $('#myModal').modal();
}