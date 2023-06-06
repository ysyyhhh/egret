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
     * 误触
     */
    var MisTouchGifBox = (function (_super) {
        __extends(MisTouchGifBox, _super);
        function MisTouchGifBox() {
            var _this = _super.call(this) || this;
            _this.skinName = new MisTouchGifBoxSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.init();
            return _this;
        }
        MisTouchGifBox.prototype.destroy = function () {
            console.log("----destroy MisTouchGifBox----");
            uniLib.AdPlat.instance.hideBanner();
            _super.prototype.destroy.call(this);
        };
        MisTouchGifBox.prototype.addUIListener = function () {
            console.log("---MisTouchGifBox----");
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        MisTouchGifBox.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        MisTouchGifBox.prototype.onClickTap = function (e) {
            if (e.target == this.goBtn) {
                this.curValue += 10;
            }
        };
        MisTouchGifBox.prototype.init = function () {
            this.thumb.mask = this.maskRect;
            this.maskRect.height = 0;
        };
        MisTouchGifBox.prototype.reward = function (clickedBanner) {
            GX.PopUpManager.addPopUp(new game.RewardView(2, null, null, true), true, 0.8, GX.PopUpEffect.CENTER);
        };
        MisTouchGifBox.prototype.setProgress = function (loaded, total) {
            var cur = loaded * 100 / total;
            cur = cur < 1 ? 1 : cur;
            cur = Math.floor(cur);
            if (total == 100) {
                cur = loaded;
            }
            this.maskRect.width = this.progressBarGroup.width / 100 * cur;
        };
        return MisTouchGifBox;
    }(ui.AdMisTouchGifBox));
    game.MisTouchGifBox = MisTouchGifBox;
    __reflect(MisTouchGifBox.prototype, "game.MisTouchGifBox");
})(game || (game = {}));
//# sourceMappingURL=MisTouchGifBox.js.map