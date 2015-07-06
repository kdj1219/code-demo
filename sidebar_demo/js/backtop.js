/**
 * Created by kongdaniel on 7/6/15.
 */

define(['jquery', 'scrollto'], function($, scrollto) {
    function BackTop(el, opts) {
        this.opts = $.extend({}, BackTop.DEFAULTS, opts);
        this.$el = $(el);
        this.scroll = new scrollto.ScrollTo({
            dest: 0,
            speed: this.opts.speed
        });

        this._checkPosition();

        //proxy 指定this._move中的this指向BackTop当前对象
        if (this.opts.mode == 'move') {
            this.$el.on('click', $.proxy(this._move, this));
        } else {
            this.$el.on('click', $.proxy(this._go, this));
        }
        $(window).on('scroll', $.proxy(this._checkPosition, this));
    }
    BackTop.DEFAULTS = {
        mode: 'move',
        pos: $(window).height(),
        speed: 800
    };

    BackTop.prototype._move = function () {
        this.scroll.move();
    };
    BackTop.prototype._go = function() {
        this.scroll.go();
    }
    BackTop.prototype._checkPosition = function() {
        var $el = this.$el;

        if ($(window).scrollTop() > this.opts.pos) {
            $el.fadeIn();
        } else {
            $el.fadeOut();
        }
    }

    //注册成jquery插件 可以以插件方式调用
    $.fn.extend({
        backtop: function(opts) {
            return this.each(function() {
               new BackTop(this, opts);
            });
            //return this;
        }
    });

    //返回BackTop对象 以便外部调用
    return {
        BackTop: BackTop
    }
});