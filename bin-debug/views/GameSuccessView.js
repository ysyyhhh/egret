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
    var GameSuccessView = (function (_super) {
        __extends(GameSuccessView, _super);
        function GameSuccessView() {
            var _this = _super.call(this) || this;
            _this.skinName = new GameSuccessViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            if (uniLib.Global.isVivogame)
                window.platform.showBannerAdvertisement();
            if (uniLib.Global.isVivogame)
                window.platform.showNativeAdvertisement();
            _this.init();
            return _this;
        }
        GameSuccessView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        GameSuccessView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        //-----------------------------------------------------------------------------
        GameSuccessView.prototype.init = function () {
            this.levelLabel.text = "关卡" + game.GameInfo.instance.sceneLevel.toString();
            this.scoreLabel.text = game.GameInfo.instance.curScore.toString();
            this.bestScoreLabel.text = game.GameInfo.instance.maxScore.toString();
            if (uniLib.Global.isWxgame)
                this.autoCloseTimeout = egret.setTimeout(this.autoEnterNextSceneLevel, this, 2000);
        };
        //-----------------------------------------------------------------------------
        GameSuccessView.prototype.destroy = function () {
            if (this.autoCloseTimeout) {
                egret.clearTimeout(this.autoCloseTimeout);
                this.autoCloseTimeout = null;
            }
            uniLib.AdPlat.instance.hideBanner();
            _super.prototype.destroy.call(this);
        };
        //-----------------------------------------------------------------------------
        GameSuccessView.prototype.autoEnterNextSceneLevel = function () {
            if (this.autoCloseTimeout) {
                egret.clearTimeout(this.autoCloseTimeout);
                this.autoCloseTimeout = null;
            }
            GX.PopUpManager.removePopUp(this);
            var gameScene = uniLib.SceneManager.instance.currentScene;
            gameScene.loadNextSceneLevel();
        };
        //-----------------------------------------------------------------------------
        GameSuccessView.prototype.onClickTap = function (e) {
            if (e.target == this.continueBtn) {
                GX.PopUpManager.removePopUp(this);
                var gameScene = uniLib.SceneManager.instance.currentScene;
                gameScene.loadNextSceneLevel();
            }
            else if (e.target == this.homeBtn) {
                GX.PopUpManager.removePopUp(this);
                Main.instance.changeToMainScene();
            }
            else if (e.target == this.shareBtn) {
                uniLib.AdPlat.instance.share();
            }
        };
        return GameSuccessView;
    }(ui.BaseUI));
    game.GameSuccessView = GameSuccessView;
    __reflect(GameSuccessView.prototype, "game.GameSuccessView");
})(game || (game = {}));
//# sourceMappingURL=GameSuccessView.js.map