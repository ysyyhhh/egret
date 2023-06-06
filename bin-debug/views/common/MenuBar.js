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
    var MenuBar = (function (_super) {
        __extends(MenuBar, _super);
        function MenuBar() {
            var _this = _super.call(this) || this;
            _this.skinName = new MenuBarSkin();
            _this.adaptationWidth();
            _this.init();
            return _this;
        }
        MenuBar.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().addEventListener(game.EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
        };
        MenuBar.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().removeEventListener(game.EventConsts.EVENT_UPDATE_GAME_INFO, this.updateGameInfo, this);
        };
        MenuBar.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        MenuBar.prototype.updateGameInfo = function () {
            this.chipsLabel.text = game.GameInfo.instance.curChips.toString();
        };
        MenuBar.prototype.init = function () {
            this.updateGameInfo();
        };
        MenuBar.prototype.onClickTap = function (e) {
            if (e.target == this.settingBtn) {
                GX.PopUpManager.addPopUp(new game.SettingView(), true, 0.8);
            }
        };
        return MenuBar;
    }(ui.BaseUI));
    game.MenuBar = MenuBar;
    __reflect(MenuBar.prototype, "game.MenuBar");
})(game || (game = {}));
//# sourceMappingURL=MenuBar.js.map