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
    var SiginView = (function (_super) {
        __extends(SiginView, _super);
        function SiginView(callback, callbackTarget) {
            var _this = _super.call(this) || this;
            _this.isVideoShowed = false;
            _this.isStartMisTouching = false;
            _this.skinName = new SiginViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.closeCallback = callback;
            _this.closeCallbackTarget = callbackTarget;
            if (uniLib.Global.isVivogame)
                window.platform.showBannerAdvertisement();
            _this.init();
            return _this;
        }
        SiginView.prototype.destroy = function () {
            if (uniLib.Global.isVivogame)
                window.platform.showNativeAdvertisement();
            this.isStartMisTouching = false;
            ui.AdMisTouchManager.instance.stopMisTouchPos(this.misTouchLayer);
            if (this.closeCallback) {
                this.closeCallback.call(this.closeCallbackTarget);
                this.closeCallback = null;
                this.closeCallbackTarget = null;
            }
            _super.prototype.destroy.call(this);
        };
        //-----------------------------------------------------------------------------
        SiginView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        SiginView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        //-----------------------------------------------------------------------------
        SiginView.prototype.init = function () {
            var querySignResult = game.GameInfo.instance.querySigninTime(); // true 今天未签到 , false 今天已签到
            this.receiveBtn.visible = querySignResult;
            this.doubleReceiveBtn.visible = querySignResult;
            if (querySignResult) {
                this.misTouchLayer.visible = true;
                this.startMisTouchPos();
            }
            else {
                uniLib.AdPlat.instance.showBanner();
                this.misTouchLayer.visible = true;
                this.misTouchLayer.touchEnabled = false;
                this.misTouchLayer.alpha = 0;
                var self_1 = this;
                egret.Tween.get(this.misTouchLayer).wait(2000).to({ alpha: 1 }, 250).call(function () {
                    self_1.misTouchLayer.touchEnabled = true;
                }, this);
            }
            this.totalSinginLabel.text = "已累计签到" + game.GameInfo.instance.totalSigninDays.toString() + "天";
            var signinRewards = game.GameInfo.instance.signinRewards;
            var isShowSelectedFrame = false;
            for (var i = 0; i < 6; i++) {
                var day = i + 1;
                var name_1 = "signDayBtn" + day;
                var button = this.skin[name_1];
                var data = signinRewards[i];
                button.skin["dayImage"].source = "di" + day + "tian";
                button.skin["markRect"].visible = false;
                button.skin["finished"].visible = false;
                var valueLabel = button.skin["valueLabel"];
                var iconImage = button.skin["icon"];
                if (game.GameInfo.instance.signinDays >= day) {
                    button.skin["markRect"].visible = true;
                    button.skin["finished"].visible = true;
                    // GX.setGray(button);
                }
                else {
                    if (querySignResult && !isShowSelectedFrame) {
                        // 今天未签到
                        isShowSelectedFrame = true;
                    }
                }
                if (data[0] == 1) {
                    // 金币
                    valueLabel.text = "x" + data[1];
                    iconImage.source = "gold";
                }
            }
        };
        //-----------------------------------------------------------------------------
        SiginView.prototype.onClickTap = function (e) {
            if (e.target == this.closeBtn || e.target == this.closeLayer) {
                GX.PopUpManager.removePopUp(this);
            }
            else if (e.target == this.receiveBtn || e.target == this.misTouchLayer) {
                if (this.isStartMisTouching)
                    return;
                this.receiveRewards(1);
            }
            else if (e.target == this.doubleReceiveBtn) {
                var self_2 = this;
                if (!this.isVideoShowed) {
                    this.isVideoShowed = true;
                    uniLib.SoundMgr.instance.pauseBgMusic();
                    if (uniLib.Global.isVivogame)
                        window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                    else
                        uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                    this.showVideoTimeout = egret.setTimeout(function () {
                        self_2.isVideoShowed = false;
                        if (self_2.showVideoTimeout) {
                            egret.clearTimeout(self_2.showVideoTimeout);
                            self_2.showVideoTimeout = null;
                        }
                    }, this, 3000);
                }
            }
        };
        SiginView.prototype.onVideoAdCallback = function (status) {
            uniLib.SoundMgr.instance.resumeBgMusic();
            if (this.showVideoTimeout) {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if (status == 1) {
                this.receiveRewards(2);
            }
            else if (status == 0) {
                // 视频未看完
                GX.Tips.showTips("获取奖励失败");
            }
            else {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        };
        //-----------------------------------------------------------------------------
        SiginView.prototype.receiveRewards = function (chipsMultiple) {
            var reward = game.GameInfo.instance.signinRewards[game.GameInfo.instance.signinDays];
            game.GameInfo.instance.updateSigninTime();
            var rewardChips = 0;
            var rewardKeys = 0;
            if (reward[0] == 1) {
                rewardChips = reward[1] * chipsMultiple;
                game.GameInfo.instance.curChips = game.GameInfo.instance.curChips + rewardChips;
            }
            else if (reward[0] == 3) {
                // 7日大礼包
                rewardChips = reward[1] * chipsMultiple;
                game.GameInfo.instance.curChips = game.GameInfo.instance.curChips + rewardChips;
            }
            uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
            game.GameInfo.save();
            GX.PopUpManager.removePopUp(this);
        };
        //-----------------------------------------------------------------------------
        SiginView.prototype.startMisTouchPos = function () {
            this.isStartMisTouching = false;
            if (ui.AdMisTouchManager.instance.startMisTouchPos(this.misTouchLayer, this.onStopMisTouchPos, this)) {
                this.isStartMisTouching = true;
                this.misTouchLayerInitVertical = this.misTouchLayer.verticalCenter;
                this.misTouchLayer.verticalCenter = uniLib.Global.screenHeight * 0.5 - this.misTouchLayer.height - 80;
            }
        };
        SiginView.prototype.onStopMisTouchPos = function (result) {
            var self = this;
            if (result) {
                egret.Tween.get(this.misTouchLayer).to({ verticalCenter: this.misTouchLayerInitVertical }, 500).call(function () {
                    self.isStartMisTouching = false;
                }, this);
            }
        };
        return SiginView;
    }(ui.BaseUI));
    game.SiginView = SiginView;
    __reflect(SiginView.prototype, "game.SiginView");
})(game || (game = {}));
//# sourceMappingURL=SiginView.js.map