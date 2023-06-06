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
    var SettingView = (function (_super) {
        __extends(SettingView, _super);
        function SettingView() {
            var _this = _super.call(this) || this;
            _this.skinName = new SettingViewSkin();
            _this.adaptationWidth();
            _this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            if (uniLib.Global.isVivogame)
                window.platform.showBannerAdvertisement();
            _this.init();
            return _this;
        }
        SettingView.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        SettingView.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        SettingView.prototype.destroy = function () {
            if (uniLib.Global.isVivogame)
                window.platform.showNativeAdvertisement();
            uniLib.AdPlat.instance.hideBanner();
            _super.prototype.destroy.call(this);
        };
        SettingView.prototype.init = function () {
            if (uniLib.Global.isInGame) {
                this.mainGroup.visible = false;
                this.gameGroup.visible = true;
            }
            else {
                this.mainGroup.visible = true;
                this.gameGroup.visible = false;
                this.musicControl();
            }
        };
        SettingView.prototype.musicControl = function () {
            if (game.GameInfo.instance.musicEnabled) {
                this.musicCheckBox.currentState = "up";
            }
            else {
                this.musicCheckBox.currentState = "down";
            }
            if (game.GameInfo.instance.soundEnabled) {
                this.soundCheckBox.currentState = "up";
            }
            else {
                this.soundCheckBox.currentState = "down";
            }
        };
        SettingView.prototype.onClickTap = function (e) {
            if (e.target == this.skin["closeLayer"] || e.target == this.skin["closeBtn"]) {
                if (!uniLib.Global.isInGame) {
                    var soundState = game.GameInfo.instance.soundEnabled ? 1 : 0;
                    var musicState = game.GameInfo.instance.musicEnabled ? 1 : 0;
                    uniLib.Utils.setLocalStorage("MAGICDIGIT_soundState", soundState.toString());
                    uniLib.Utils.setLocalStorage("MAGICDIGIT_musicState", musicState.toString());
                }
                GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
            }
            else if (e.target == this.soundCheckBox) {
                if (this.soundCheckBox.currentState == "up") {
                    this.soundCheckBox.currentState = "down";
                    uniLib.SoundMgr.instance.soundOpen = false;
                    game.GameInfo.instance.soundEnabled = false;
                }
                else {
                    uniLib.SoundMgr.instance.soundOpen = true;
                    game.GameInfo.instance.soundEnabled = true;
                    this.soundCheckBox.currentState = "up";
                }
            }
            else if (e.target == this.musicCheckBox) {
                if (this.musicCheckBox.currentState == "up") {
                    uniLib.SoundMgr.instance.musicOpen = false;
                    game.GameInfo.instance.musicEnabled = false;
                    this.musicCheckBox.currentState = "down";
                    uniLib.SoundMgr.instance.stopBgMusic();
                }
                else {
                    uniLib.SoundMgr.instance.musicOpen = true;
                    game.GameInfo.instance.musicEnabled = true;
                    this.musicCheckBox.currentState = "up";
                    uniLib.SoundMgr.instance.playBgMusic(uniLib.SoundMgr.instance.bgMusics);
                }
            }
            else if (e.target == this.homeBtn) {
                if (uniLib.Global.isVivogame)
                    window.platform.showNativeAdvertisement();
                GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                Main.instance.changeToMainScene();
            }
            else if (e.target == this.restartBtn) {
                GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                var winChips = game.GameInfo.instance.winChips;
                winChips += game.GameInfo.instance.config.winChips;
                game.GameInfo.instance.curChips = game.GameInfo.instance.curChips + winChips;
                game.GameInfo.instance.winChips = 0;
                game.GameInfo.instance.needGuide = false;
                game.GameInfo.instance.sceneLevel = 0;
                game.GameInfo.instance.maxSceneLevel = 0;
                if (game.GameInfo.instance.maxScore < game.GameInfo.instance.curScore) {
                    game.GameInfo.instance.maxScore = game.GameInfo.instance.curScore;
                }
                game.GameInfo.instance.clearGameMatchup();
                game.GameInfo.instance.curScore = 0;
                uniLib.EventListener.getInstance().dispatchEventWith(game.EventConsts.EVENT_UPDATE_GAME_INFO);
                game.GameInfo.save();
                Main.instance.loadGameScene(1);
            }
        };
        return SettingView;
    }(ui.BaseUI));
    game.SettingView = SettingView;
    __reflect(SettingView.prototype, "game.SettingView");
})(game || (game = {}));
//# sourceMappingURL=SettingView.js.map