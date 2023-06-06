var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var game;
(function (game) {
    /**
     * 消息提示 显示在屏幕中央，没有操作，显示3秒后移除
     */
    var TipsPanel = (function (_super) {
        __extends(TipsPanel, _super);
        function TipsPanel(msg) {
            var _this = _super.call(this) || this;
            _this.skinName = new TipsSkin();
            _this.msgLabel.text = msg;
            _this.touchChildren = false;
            _this.touchEnabled = false;
            return _this;
        }
        return TipsPanel;
    }(eui.Component));
    game.TipsPanel = TipsPanel;
    __reflect(TipsPanel.prototype, "game.TipsPanel");
})(game || (game = {}));
//# sourceMappingURL=TipsPanel.js.map