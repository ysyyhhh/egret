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
    * 公共加载
    */
    var PublicLoadingView = (function (_super) {
        __extends(PublicLoadingView, _super);
        function PublicLoadingView() {
            var _this = _super.call(this) || this;
            _this.skinName = new PublicLoadingSkin();
            _this.init();
            _this.adaptationHeight();
            _this.adaptationWidth();
            return _this;
        }
        PublicLoadingView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        PublicLoadingView.prototype.addUIListener = function () {
            egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        };
        PublicLoadingView.prototype.removeUIListener = function () {
            egret.MainContext.instance.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        };
        PublicLoadingView.prototype.onResize = function () {
            this.adaptationHeight();
            this.adaptationWidth();
        };
        PublicLoadingView.prototype.init = function () {
            this.thumb.mask = this.maskRect;
            this.maskRect.width = 0;
            this.labelDisplay.text = "";
        };
        PublicLoadingView.prototype.setProgress = function (loaded, total, desc, resourceName, force) {
            if (force === void 0) { force = false; }
            var cur = loaded * (force == false ? 93 : 100) / total;
            cur = cur < 1 ? 1 : cur;
            cur = Math.floor(cur);
            if (resourceName == null && total == 100) {
                cur = loaded;
            }
            this.descLabel.text = desc ? desc : "";
            this.labelDisplay.text = cur + "%";
            this.maskRect.width = this.progressBarGroup.width / 100 * cur;
        };
        return PublicLoadingView;
    }(ui.BaseUI));
    game.PublicLoadingView = PublicLoadingView;
    __reflect(PublicLoadingView.prototype, "game.PublicLoadingView");
})(game || (game = {}));
//# sourceMappingURL=PublicLoadingView.js.map