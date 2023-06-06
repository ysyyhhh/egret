module game {
    export class DebugWebPlatform extends uniLib.WebPlatform {
        //---------------------------------------------------------------------------------------------------
        // 平台初始化
        //---------------------------------------------------------------------------------------------------
        init(callback, thisObj) {
            window["King_SDK_Manager"].init(egret.MainContext.instance.stage);
            if (callback) callback.call(thisObj);
        }

        //---------------------------------------------------------------------------------------------------
        // 平台登陆
        //---------------------------------------------------------------------------------------------------
        login(callback, thisObj, loginData) {
            console.log("DebugWebPlatform.login");
        }

        //---------------------------------------------------------------------------------------------------
        // 热更资源接口
        //---------------------------------------------------------------------------------------------------
        downloadResource(url, name, callback, callbackProgress, thisObj) {
        }

        //---------------------------------------------------------------------------------------------------
        // 显示横幅广告
        //---------------------------------------------------------------------------------------------------
        showBannerAdvertisement(userData, callback, thisObj) {
            console.log("showBannerAdvertisement");
            window['King_SDK_Manager'].showNativeBanner();
        }

        //---------------------------------------------------------------------------------------------------
        // 隐藏横幅广告
        //---------------------------------------------------------------------------------------------------
        hideBannerAdvertisement(userData) {
            console.log("hideBannerAdvertisement");
            window['King_SDK_Manager'].hideAllBanner();
        }

        //---------------------------------------------------------------------------------------------------
        // 显示插页广告
        //---------------------------------------------------------------------------------------------------
        showInterstitialAdvertisement(userData, callback, thisObj) {

        }

        //---------------------------------------------------------------------------------------------------
        // 显示原生广告
        //---------------------------------------------------------------------------------------------------
        showNativeAdvertisement(userData, callback, thisObj) {
            console.log("showNativeAdvertisement");
            window['King_SDK_Manager'].showNativeInter();
        }

        //---------------------------------------------------------------------------------------------------
        // 显示视频广告
        //---------------------------------------------------------------------------------------------------
        showVideoAdvertisement(userData, callback, thisObj) {
            console.log("showVideoAdvertisement");
            Main.instance.videoShowing = true;
            window['King_SDK_Manager'].showRewardedVideoAd(function (res) {
                Main.instance.videoShowing = false;
                if (res) {
                    console.log('播放成功，下发游戏奖励');
                    if (callback) callback.call(thisObj, 1);
                } else {
                    console.log('播放失败');
                    if (callback) callback.call(thisObj, 0);
                }
            });
        }

        //---------------------------------------------------------------------------------------------------
        // 清空资源缓存
        //---------------------------------------------------------------------------------------------------
        clearResCache() {
        }

        //---------------------------------------------------------------------------------------------------
        // 自定义通用接口
        //---------------------------------------------------------------------------------------------------
        customInterface(funcName, userData, callback, thisObj) {
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

        }
    }

}