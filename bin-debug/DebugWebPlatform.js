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
    var DebugWebPlatform = (function (_super) {
        __extends(DebugWebPlatform, _super);
        function DebugWebPlatform() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //---------------------------------------------------------------------------------------------------
        // 平台初始化
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.init = function (callback, thisObj) {
            window["King_SDK_Manager"].init(egret.MainContext.instance.stage);
            if (callback)
                callback.call(thisObj);
        };
        //---------------------------------------------------------------------------------------------------
        // 平台登陆
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.login = function (callback, thisObj, loginData) {
            console.log("DebugWebPlatform.login");
        };
        //---------------------------------------------------------------------------------------------------
        // 热更资源接口
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.downloadResource = function (url, name, callback, callbackProgress, thisObj) {
        };
        //---------------------------------------------------------------------------------------------------
        // 显示横幅广告
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.showBannerAdvertisement = function (userData, callback, thisObj) {
            console.log("showBannerAdvertisement");
            window['King_SDK_Manager'].showNativeBanner();
        };
        //---------------------------------------------------------------------------------------------------
        // 隐藏横幅广告
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.hideBannerAdvertisement = function (userData) {
            console.log("hideBannerAdvertisement");
            window['King_SDK_Manager'].hideAllBanner();
        };
        //---------------------------------------------------------------------------------------------------
        // 显示插页广告
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.showInterstitialAdvertisement = function (userData, callback, thisObj) {
        };
        //---------------------------------------------------------------------------------------------------
        // 显示原生广告
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.showNativeAdvertisement = function (userData, callback, thisObj) {
            console.log("showNativeAdvertisement");
            window['King_SDK_Manager'].showNativeInter();
        };
        //---------------------------------------------------------------------------------------------------
        // 显示视频广告
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.showVideoAdvertisement = function (userData, callback, thisObj) {
            console.log("showVideoAdvertisement");
            Main.instance.videoShowing = true;
            window['King_SDK_Manager'].showRewardedVideoAd(function (res) {
                Main.instance.videoShowing = false;
                if (res) {
                    console.log('播放成功，下发游戏奖励');
                    if (callback)
                        callback.call(thisObj, 1);
                }
                else {
                    console.log('播放失败');
                    if (callback)
                        callback.call(thisObj, 0);
                }
            });
        };
        //---------------------------------------------------------------------------------------------------
        // 清空资源缓存
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.clearResCache = function () {
        };
        //---------------------------------------------------------------------------------------------------
        // 自定义通用接口
        //---------------------------------------------------------------------------------------------------
        DebugWebPlatform.prototype.customInterface = function (funcName, userData, callback, thisObj) {
            console.log("customInterface", funcName, userData);
            if (funcName == "installShortcut") {
                // qg.hasShortcutInstalled({
                //     success: function (status) {
                //         if (status) {
                //             console.log('已创建')
                //         } else {
                //             console.log('未创建')
                //             qg.installShortcut({
                //                 success: function () {
                //                     console.log('创建成功')
                //                     if(callback) callback.call(thisObj, true);
                //                 },fail:function(){
                //                     if(callback) callback.call(thisObj, false);
                //                 }
                //             })
                //         }
                //     }
                // })
                window['King_SDK_Manager'].addInstallShortcut();
            }
            else if (funcName == "moosnow.test") {
                GX.Tips.showPopup("moosnow.test");
            }
        };
        return DebugWebPlatform;
    }(uniLib.WebPlatform));
    game.DebugWebPlatform = DebugWebPlatform;
    __reflect(DebugWebPlatform.prototype, "game.DebugWebPlatform");
})(game || (game = {}));
//# sourceMappingURL=DebugWebPlatform.js.map