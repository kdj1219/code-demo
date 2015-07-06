/**
 * Created by kongdaniel on 7/5/15.
 */

//定义别名
requirejs.config({
    paths: {
        jquery: 'jquery-2.1.4.min'
    }
});

//引入模块
requirejs(['jquery', 'backtop'], function($, backtop) {

    //jquery插件方式调用
    $('#backTop').backtop({
        mode: 'move'
    });

    //实例化对象方式调用
    //new backtop.BackTop($('#backTop'), {
    //    mode: 'move'
    //});
});