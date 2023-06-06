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
    var GameRankView = (function (_super) {
        __extends(GameRankView, _super);
        function GameRankView() {
            var _this = _super.call(this) || this;
            _this.curPage = 0;
            _this.skinName = new GameRankViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            _this.init();
            return _this;
        }
        //------------------------------------------------------------------------------
        GameRankView.prototype.init = function () {
            this.shareBtn.visible = false;
            this.switchToPage(1);
        };
        //------------------------------------------------------------------------------
        GameRankView.prototype.switchToPage = function (page) {
            if (this.curPage == page)
                return;
            this.curPage = page;
            this.shareBtn.visible = false;
            egret.Tween.removeTweens(this.shareBtn);
            var self = this;
            this.destroyRankCanvas();
            if (page == 1) {
                this.createRankCanvas({ command: "friendRank" });
                if (game.GameInfo.instance.maxScore > 0 || game.GameInfo.instance.curScore > 0) {
                    this.shareBtn.visible = true;
                    this.shareBtn.alpha = 0;
                    egret.Tween.get(this.shareBtn).wait(500).to({ alpha: 1 }, 250);
                }
                else {
                    this.shareBtn.visible = false;
                }
            }
        };
        GameRankView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        GameRankView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        GameRankView.prototype.destroy = function () {
            uniLib.AdPlat.instance.hideBanner();
            _super.prototype.destroy.call(this);
        };
        GameRankView.prototype.onClickTap = function (e) {
            if (e.target == this.closeLayer || e.target == this.skin["closeBtn"]) {
                this.destroyRankCanvas();
                GX.PopUpManager.removePopUp(this);
            }
            if (e.target == this.dataLayer) {
            }
            else if (e.target == this.shareBtn) {
                uniLib.AdPlat.instance.share();
            }
        };
        GameRankView.prototype.getOpenDataContext = function () {
            if (window[uniLib.Global.platformName] && window[uniLib.Global.platformName].getOpenDataContext) {
                return window[uniLib.Global.platformName].getOpenDataContext();
            }
            return null;
        };
        GameRankView.prototype.createRankCanvas = function (postData) {
            var sharedCanvas = window["sharedCanvas"];
            if (null == sharedCanvas)
                return;
            this.rankBitmapData = new egret.BitmapData(sharedCanvas);
            this.rankBitmapData.$deleteSource = false;
            this.rankTexture = new egret.Texture();
            this.rankTexture.bitmapData = this.rankBitmapData;
            this.rankCanvas = new egret.Bitmap(this.rankTexture);
            this.rankCanvas.width = uniLib.Global.screenWidth;
            this.rankCanvas.height = uniLib.Global.screenHeight;
            this.rankCanvas.touchEnabled = false;
            this.addChild(this.rankCanvas);
            egret.startTick(this.drawRankCanvas, this);
            console.log("postMessage", postData);
            var openDataContext = this.getOpenDataContext();
            if (openDataContext) {
                openDataContext.postMessage(postData);
            }
        };
        GameRankView.prototype.destroyRankCanvas = function () {
            if (this.rankCanvas) {
                egret.stopTick(this.drawRankCanvas, this);
                var openDataContext = this.getOpenDataContext();
                openDataContext.postMessage({ command: "close" });
                this.rankCanvas.parent.removeChild(this.rankCanvas);
                this.rankCanvas = null;
                this.rankBitmapData = null;
                this.rankTexture = null;
            }
        };
        GameRankView.prototype.drawRankCanvas = function (timeStarmp) {
            egret.WebGLUtils.deleteWebGLTexture(this.rankBitmapData.webGLTexture);
            this.rankBitmapData.webGLTexture = null;
            return false;
        };
        return GameRankView;
    }(ui.BaseUI));
    game.GameRankView = GameRankView;
    __reflect(GameRankView.prototype, "game.GameRankView");
})(game || (game = {}));
//# sourceMappingURL=GameRankView.js.map