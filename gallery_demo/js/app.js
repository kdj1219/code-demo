$(document).ready(function(){
    //禁止选择
    $('div.wrap').disableSelection();

    //点击图片触发翻转
    $('.photo').click(function(){
        turn($(this));
    });

    //执行海报排序 随机取一张海报正中显示
    pic_rsort(random([1,17]));
    //点击导航执行翻转
    $('div.nav .i').click(function(){
        var pic_id = $(this).attr('pic-id');
        if( typeof(pic_id)=='undefined' || pic_id ==null) return false;
        turn($('#'+pic_id));
    });

});

// 翻面控制
function turn(elem) {
    var cls = elem.attr('class');
    var n = elem.attr('id').split('_')[1];

    //判断当前是否是photo-center
    if( !elem.hasClass('photo-center') ) {
        return pic_rsort(n);
    }

    if( elem.hasClass('photo-front')) {
        elem.removeClass('photo-front').addClass('photo-back');
        $('#nav_'+n).addClass('i-back');
    } else {
        elem.removeClass('photo-back').addClass('photo-front');
        $('#nav_'+n).removeClass('i-back');
    }

}

//排序海报
function pic_rsort(n) {
    var photos = $('.photo');

    //去除海报上原有的photo-center
    photos.each(function(idx,el){
        $(el).removeClass('photo-back photo-center')
            .unbind('mouseenter mouseleave')
            .css({
                'left':'',
                'top':'',
                '-moz-transform': 'rotate(360deg) scale(1.3)',
                '-webkit-transform': 'rotate(360deg) scale(1.3)',
                'transform': 'rotate(360deg) scale(1.3)'
            });

    });

    //加上新的选中海报
    var photo_center = $('#photo_'+n);
    photo_center.addClass('photo-center');
    photo_center.hover(function(){
        $(this).css({
            '-moz-transform': 'scale(1.8)',
            '-webkit-transform': 'scale(1.8)',
            'transform': 'scale(1.8)'
        });
    },function(){
        $(this).css({
            '-moz-transform': 'scale(1.3)',
            '-webkit-transform': 'scale(1.3)',
            'transform': 'scale(1.3)'
        });
    });

    //把不是居中的元素提取出来
    var not_center_photos = photos.not('.photo-center');

    /** 环绕效果 **/
    //$(not_center_photos).each(function(idx,el){
    //    $(el).css({
    //        '-moz-transform': 'rotate('+ (idx+1)*23 +'deg) translateY(500px) scale(1)',
    //        '-webkit-transform': 'rotate('+ (idx+1)*23 +'deg) translateY(500px) scale(1)',
    //        'transform': 'rotate('+ (idx+1)*23 +'deg) translateY(500px) scale(1)'
    //    });
    //});

    /** 散列效果 **/
    //把海报分为左右两个区
    var photos_left = not_center_photos.splice(0,Math.ceil(not_center_photos.length/2));
    var photos_right = not_center_photos;
    //设置左分区样式
    var ranges = range();
    $(photos_left).each(function(idx,el){
        $(el).css('left', random(ranges.left.x)+'px');
        $(el).css('top', random(ranges.left.y)+'px');
        $(el).css({
            '-moz-transform': 'rotate('+ random([-150,150]) +'deg) scale(1)',
            '-webkit-transform': 'rotate('+ random([-150,150]) +'deg) scale(1)',
            'transform': 'rotate('+ random([-150,150]) +'deg) scale(1)'
        });
    });
    //设置左分区样式
    $(photos_right).each(function(idx,el){
        $(el).css('left', random(ranges.right.x)+'px');
        $(el).css('top', random(ranges.right.y)+'px');
        $(el).css({
            '-moz-transform': 'rotate('+ random([-150,150]) +'deg) scale(1)',
            '-webkit-transform': 'rotate('+ random([-150,150]) +'deg) scale(1)',
            'transform': 'rotate('+ random([-150,150]) +'deg) scale(1)'
        });
    });

    //控制按钮处理
    $('span.i').each(function(idx,el){
        if( $(el).hasClass('i-current') ) {
            $(el).removeClass('i-current');
        }
        if( $(el).hasClass('i-back') ) {
            $(el).removeClass('i-back');
        }
    });
    $('#nav_'+n).addClass('i-current');
}

// 随机生成一个值，支持取值范围
function random(range) {
    var max = Math.max(range[0], range[1]);
    var min = Math.min(range[0], range[1]);
    var c = max-min+1;
    return Math.floor(Math.random() * c + min);
}

// 计算左右分区的范围
function range() {
    var range = { left:{ x:[], y:[] }, right:{ x:[], y:[] } };
    var wrap = {
        w:$('#wrap').width(),
        h:$('#wrap').height()
    };
    var photo = {
        w:$('.photo').eq(0).width(),
        h:$('.photo').eq(0).height()
    }

    range.wrap = wrap;
    range.photo = photo;
    /**
     *  小范围
    **/
    //左分区
    //range.left.x = [photo.w, wrap.w/2-photo.w/2];
    //range.left.y = [photo.h, wrap.h-photo.h];
    ////右分区
    //range.right.x = [wrap.w/2+photo.w/2, wrap.w-photo.w];
    //range.right.y = range.left.y;

    /**
     *  大范围
     **/
    //左分区
    range.left.x = [0-photo.w, wrap.w/2-photo.w/2];
    range.left.y = [0-photo.h, wrap.h];
    //右分区
    range.right.x = [wrap.w/2+photo.w/2, wrap.w+photo.w];
    range.right.y = range.left.y;

    return range;
}

