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
    var RewardView = (function (_super) {
        __extends(RewardView, _super);
        function RewardView(winChips, eventname, delay, isShowReceiveBtn) {
            var _this = _super.call(this) || this;
            _this.isStartMisTouching = false;
            _this.isVideoShowed = false;
            _this.skinName = new RewardViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            _this.winChips = winChips;
            _this.isShowReceiveBtn = isShowReceiveBtn ? true : false;
            if (null == eventname)
                eventname = "close";
            if (null == delay)
                delay = 3000;
            if (_this.isShowReceiveBtn) {
                delay = 0;
                _this.misTouchLayer.visible = true;
                _this.doubleReceiveBtn.visible = true;
                _this.startMisTouchPos();
            }
            else {
                _this.misTouchLayer.visible = false;
                _this.doubleReceiveBtn.visible = false;
                uniLib.AdPlat.instance.showBanner();
            }
            _this.eventName = eventname;
            _this.delayTime = delay;
            _this.init();
            return _this;
        }
        RewardView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        RewardView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        RewardView.prototype.setCloseCallback = function (callback, thisObj, params) {
            this.closedCallback = callback;
            this.closedCallbackTarget = thisObj;
            this.closedCallbackParmas = params;
        };
        RewardView.prototype.init = function () {
            this.chipsIcon.visible = false;
            this.chipsLabel.visible = false;
            if (this.winChips > 0) {
                this.chipsIcon.visible = true;
                this.chipsLabel.visible = true;
                this.chipsLabel.text = "x" + this.winChips.toString();
            }
            egret.Tween.get(this.bg, { loop: true }).to({ rotation: 360 }, 3000);
            if (this.delayTime > 0) {
                this.timeout = egret.setTimeout(this.doEvent, this, this.delayTime);
            }
        };
        RewardView.prototype.destroy = function () {
            this.isStartMisTouching = false;
            ui.AdMisTouchManager.instance.stopMisTouchPos(this.misTouchLayer);
            egret.Tween.removeTweens(this.bg);
            uniLib.AdPlat.instance.hideBanner();
            _super.prototype.destroy.call(this);
        };
        RewardView.prototype.doEvent = function (forceClose) {
            if (this.timeout) {
                egret.clearTimeout(this.timeout);
                this.timeout = null;
            }
            if (this.eventName == "close") {
                if (forceClose) {
                    if (this.closedCallback) {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
                else if (!this.isShowReceiveBtn) {
                    if (this.closedCallback) {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
            }
            else if (this.eventName == "enterNextScene") {
                if (this.closedCallback) {
                    this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                }
                this.closedCallback = null;
                this.closedCallbackTarget = null;
                this.closedCallbackParmas = null;
                GX.PopUpManager.removePopUp(this);
                var gameScene = uniLib.SceneManager.instance.currentScene;
                gameScene.loadNextSceneLevel();
            }
            else {
                if (forceClose) {
                    if (this.closedCallback) {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
                else if (!this.isShowReceiveBtn) {
                    if (this.closedCallback) {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
            }
        };
        RewardView.prototype.receiveRewards = function (chipsMultiple) {
            this.winChips = this.winChips * chipsMultiple;
            game.GameInfo.instance.curChips = game.GameInfo.instance.curChips + this.winChips;
            game.GameInfo.save();
            uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
            this.doEvent(true);
        };
        RewardView.prototype.onClickTap = function (e) {
            if (e.target == this.closeLayer) {
                this.doEvent();
            }
            else if (e.target == this.doubleReceiveBtn) {
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
            else if (e.target == this.receiveBtn) {
                if (this.isStartMisTouching)
                    return;
                this.receiveRewards(1);
            }
            else {
                if (!this.isShowReceiveBtn) {
                    this.doEvent();
                }
            }
        };
        RewardView.prototype.startMisTouchPos = function () {
            this.isStartMisTouching = false;
            if (ui.AdMisTouchManager.instance.startMisTouchPos(this.misTouchLayer, this.onStopMisTouchPos, this)) {
                this.isStartMisTouching = true;
                this.misTouchLayerInitVertical = this.misTouchLayer.verticalCenter;
                this.misTouchLayer.verticalCenter = uniLib.Global.screenHeight * 0.5 - this.misTouchLayer.height - 80;
            }
            else {
                uniLib.AdPlat.instance.showBanner();
                this.misTouchLayer.visible = true;
                this.misTouchLayer.touchChildren = false;
                this.misTouchLayer.alpha = 0;
                var self_2 = this;
                egret.Tween.get(this.misTouchLayer).wait(2000).to({ alpha: 1 }, 250).call(function () {
                    self_2.misTouchLayer.touchChildren = true;
                }, this);
            }
        };
        RewardView.prototype.onStopMisTouchPos = function (result) {
            var self = this;
            if (result) {
                egret.Tween.get(this.misTouchLayer).to({ verticalCenter: this.misTouchLayerInitVertical }, 500).call(function () {
                    self.isStartMisTouching = false;
                }, this);
            }
        };
        RewardView.prototype.onVideoAdCallback = function (status) {
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
                GX.Tips.showTips("看完视频才能领取");
            }
            else {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        };
        return RewardView;
    }(ui.BaseUI));
    game.RewardView = RewardView;
    __reflect(RewardView.prototype, "game.RewardView");
})(game || (game = {}));
//# sourceMappingURL=RewardView.js.map