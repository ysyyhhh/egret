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
     * 游戏弹窗
     */
    var ConfirmPanel = (function (_super) {
        __extends(ConfirmPanel, _super);
        function ConfirmPanel(msg, confirmFunc, cancelFunc, thisObject, cancelVisible, title, confirmLabel, cancelLabel) {
            var _this = _super.call(this) || this;
            _this.skinName = new ConfirmPanelSkin();
            _this.msgText.text = msg;
            _this.confirmFunc = confirmFunc;
            _this.cancelFunc = cancelFunc;
            _this.thisObject = thisObject;
            if (!cancelVisible) {
                _this.cancelButton.parent.removeChild(_this.cancelButton);
                _this.confirmButton.horizontalCenter = 0;
                _this.closeBtn.visible = false;
            }
            return _this;
        }
        ConfirmPanel.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this.thisObject = null;
            this.cancelFunc = null;
            this.confirmFunc = null;
        };
        ConfirmPanel.prototype.addUIListener = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        ConfirmPanel.prototype.removeUIListener = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        };
        ConfirmPanel.prototype.onClickTap = function (e) {
            if (e.target == this.confirmButton) {
                this.confirmFunc && this.confirmFunc.call(this.thisObject);
                GX.PopUpManager.removePopUp(this);
                this.destroy();
            }
            else if (e.target == this.cancelButton || e.target == this.closeBtn) {
                this.cancelFunc && this.cancelFunc.call(this.thisObject);
                GX.PopUpManager.removePopUp(this);
                this.destroy();
            }
        };
        return ConfirmPanel;
    }(ui.BaseUI));
    game.ConfirmPanel = ConfirmPanel;
    __reflect(ConfirmPanel.prototype, "game.ConfirmPanel");
})(game || (game = {}));
//# sourceMappingURL=ConfirmPanel.js.map