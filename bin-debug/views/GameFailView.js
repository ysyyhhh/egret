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
    var GameFailView = (function (_super) {
        __extends(GameFailView, _super);
        function GameFailView(sceneLevel, winChips, curScore, bestScore) {
            var _this = _super.call(this) || this;
            _this.isVideoShowed = false;
            _this.sceneLevel = 0;
            _this.winChips = 0;
            _this.curScore = 0;
            _this.bestScore = 0;
            _this.skinName = new GameFailViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.sceneLevel = sceneLevel;
            _this.winChips = winChips;
            _this.curScore = curScore;
            _this.bestScore = bestScore;
            uniLib.AdPlat.instance.showBanner();
            if (uniLib.Global.isVivogame)
                window.platform.showBannerAdvertisement();
            if (uniLib.Global.isVivogame)
                window.platform.showNativeAdvertisement();
            _this.init();
            return _this;
        }
        GameFailView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        GameFailView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        //-----------------------------------------------------------------------------
        GameFailView.prototype.init = function () {
            // uniLib.SoundMgr.instance.playSound("game_success_mp3");
            if (uniLib.Global.isVivogame)
                this.shareBtn.visible = false;
            this.levelLabel.text = "关卡" + this.sceneLevel.toString();
            this.scoreLabel.text = this.curScore.toString();
            this.bestScoreLabel.text = this.bestScore.toString();
            this.chipsLabel.text = "+" + this.winChips.toString();
            egret.Tween.get(this.doubleReceiveBtn).to({ rotation: 20 }, 100, egret.Ease.sineIn).to({ rotation: -20 }, 100, egret.Ease.sineOut).to({ rotation: 0 }, 80);
            egret.Tween.get(this.doubleReceiveBtn).to({ scaleX: 1.5, scaleY: 1.5 }, 200, egret.Ease.sineIn).to({ scaleX: 1, scaleY: 1 }, 250, egret.Ease.sineOut);
        };
        //-----------------------------------------------------------------------------
        GameFailView.prototype.destroy = function () {
            uniLib.AdPlat.instance.hideBanner();
            egret.Tween.removeTweens(this.doubleReceiveBtn);
            _super.prototype.destroy.call(this);
        };
        //-----------------------------------------------------------------------------
        GameFailView.prototype.onClickTap = function (e) {
            if (e.target == this.doubleReceiveBtn) {
                var self_1 = this;
                if (!this.isVideoShowed) {
                    this.isVideoShowed = true;
                    uniLib.SoundMgr.instance.pauseBgMusic();
                    if (uniLib.Global.isVivogame)
                        window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                    else
                        uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                    this.showVideoTimeout = egret.setTimeout(function () {
                        self_1.isVideoShowed = false;
                        if (self_1.showVideoTimeout) {
                            egret.clearTimeout(self_1.showVideoTimeout);
                            self_1.showVideoTimeout = null;
                        }
                    }, this, 3000);
                }
            }
            else if (e.target == this.restartBtn) {
                GX.PopUpManager.removePopUp(this);
                Main.instance.loadGameScene(1);
            }
            else if (e.target == this.homeBtn) {
                GX.PopUpManager.removePopUp(this);
                Main.instance.changeToMainScene();
            }
            else if (e.target == this.shareBtn) {
                uniLib.AdPlat.instance.share();
            }
        };
        //-----------------------------------------------------------------------------
        GameFailView.prototype.onVideoAdCallback = function (status) {
            uniLib.SoundMgr.instance.resumeBgMusic();
            if (this.showVideoTimeout) {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if (status == 1) {
                this.doubleReceiveBtn.enabled = false;
                var addChips = this.winChips * 2;
                game.GameInfo.instance.curChips += addChips;
                game.GameInfo.save();
                this.winChips += addChips;
                this.chipsLabel.text = "+" + this.winChips.toString();
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                GX.PopUpManager.addPopUp(new game.RewardView(this.winChips), true, 0.6, GX.PopUpEffect.CENTER_S);
            }
            else if (status == 0) {
                // 视频未看完
                GX.Tips.showTips("获取奖励失败");
            }
            else {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        };
        return GameFailView;
    }(ui.BaseUI));
    game.GameFailView = GameFailView;
    __reflect(GameFailView.prototype, "game.GameFailView");
})(game || (game = {}));
//# sourceMappingURL=GameFailView.js.map