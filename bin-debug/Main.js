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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.soundLoaded = false;
        _this.videoShowing = false;
        Main._instance = _this;
        uniLib.ViewConfig.mainMediatorName = egret.getQualifiedClassName(game.GameMediator);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.start, _this);
        egret.ImageLoader.crossOrigin = "anonymous";
        return _this;
    }
    Object.defineProperty(Main, "instance", {
        get: function () {
            return Main._instance;
        },
        enumerable: true,
        configurable: true
    });
    Main.onShareMessageCallback = function (result) {
        // if(result)
        // {
        //     let curTimestamp = (new Date()).valueOf();
        //     let lastStrTime = GX.timestampToString(game.GameInfo.instance.sharedFristTimeInDay);
        //     let curStrTime = GX.timestampToString(curTimestamp);
        //     let lastTimeValues = lastStrTime.split(" ");
        //     let curTimeValues = curStrTime.split(" ");
        //     lastTimeValues = lastTimeValues[0].split("-");
        //     curTimeValues = curTimeValues[0].split("-");
        //     if(parseInt(curTimeValues[0]) - parseInt(lastTimeValues[0]) == 0 && parseInt(curTimeValues[1]) - parseInt(lastTimeValues[1]) == 0)
        //     {
        //         let day = parseInt(curTimeValues[2]) - parseInt(lastTimeValues[2]);
        //         if(day >= 1)
        //         {
        //             game.GameInfo.instance.sharedFristTimeInDay = curTimestamp;
        //             game.GameInfo.instance.sharedTimesInDay = 0;
        //         }
        //     }
        //     else
        //     {
        //         game.GameInfo.instance.sharedFristTimeInDay = curTimestamp;
        //         game.GameInfo.instance.sharedTimesInDay = 0;
        //     }
        //     game.GameInfo.instance.sharedTimesInDay++;
        //     game.GameInfo.save();
        //     if(game.GameInfo.instance.sharedTimesInDay >= 5) return;
        //     // 发放奖励
        //     GX.PopUpManager.addPopUp(new game.RewardView(game.GameConsts.TASK_REWARD_LIST[0], null, null, true), true, 0.6, GX.PopUpEffect.CENTER_S);
        // }
    };
    Main.prototype.start = function () {
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        RES.setMaxLoadingThread(6);
        var self = this;
        this.initResource().then(function () {
            self.init();
        });
    };
    Main.prototype.init = function () {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            // egret.ticker.pause();
            uniLib.SoundMgr.instance.pauseBgMusic();
        };
        egret.lifecycle.onResume = function () {
            // egret.ticker.resume();
            if (Main.instance.videoShowing)
                return;
            uniLib.SoundMgr.instance.resumeBgMusic();
        };
        if (null == window.platform) {
            window.platform = new game.DebugWebPlatform();
        }
        window.platform.init();
        var initData = new uniLib.InitOptions();
        initData.debug = (uniLib.BrowersUtils.GetRequest("debug") == "true") ? true : false;
        initData.standAlone = true;
        initData.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        initData.designWidth = 720;
        initData.designHeight = 1280;
        initData.msgTimeOutSec = 0;
        initData.logLevel = uniLib.LOGLEVEL.DEBUG;
        if (uniLib.Global.isWxgame)
            initData.gameName = "xiaochu";
        if (uniLib.Global.isWxgame && game.Config.WXGAME_RES_ROOT_URL && game.Config.WXGAME_RES_ROOT_URL.length > 0)
            initData.wxgameResourceRemoteUrl = game.Config.WXGAME_RES_ROOT_URL;
        uniLib.init(initData);
        uniLib.UIMgr.instance.commonLoadUI = game.PublicLoadingView;
        GX.Tips.TipsClass = game.TipsPanel;
        GX.Tips.PopupClass = game.ConfirmPanel;
        var curResVer = game.Config.WXGAME_RES_ROOT_URL ? game.Config.WXGAME_RES_ROOT_URL : "";
        curResVer = curResVer + game.Config.CURRENT_RES_VERSION;
        curResVer = uniLib.Utils.MD5(curResVer);
        var oldResVersion = uniLib.Utils.getLocalStorage("MAGICDIGIT_RESVERSION", "");
        if (oldResVersion != curResVer) {
            console.log("清除资源缓存");
            window.platform.clearResCache();
            uniLib.Utils.setLocalStorage("MAGICDIGIT_RESVERSION", curResVer);
        }
        var curStorageVer = game.Config.CURRENT_GAMEINFO_VERSION;
        curStorageVer = uniLib.Utils.MD5(curStorageVer);
        var oldStorageVersion = uniLib.Utils.getLocalStorage("MAGICDIGIT_GAMEINFO_VERSION", "");
        if (oldStorageVersion != curStorageVer) {
            console.log("清除GameInfo信息");
            game.GameInfo.clearStorage();
            uniLib.Utils.setLocalStorage("MAGICDIGIT_GAMEINFO_VERSION", curStorageVer);
        }
        this.loadResConfig();
    };
    Main.prototype.initResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/loading.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        if (!(egret.Capabilities.runtimeType != egret.RuntimeType.WXGAME)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, RES.loadGroup("loading", 0, loadingView)];
                    case 4:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    Main.prototype.loadResConfig = function () {
        uniLib.UIMgr.instance.showProcessBar(null, 1, 100, "准备资源配置...", "", true);
        uniLib.ResLoadMgr.instance.loadConfig("resource/game.res.json", "resource/", this.onConfigComplete, this.onConfigError, this);
    };
    Main.prototype.onConfigComplete = function () {
        var strArr = ["game"];
        RES.createGroup("preLoadAll", strArr);
        uniLib.UIMgr.instance.showProcessBar(null, 10, 100, "准备加载资源组...", "", true);
        uniLib.ResLoadMgr.instance.load("preLoadAll", this.onResourceLoadComplete, this.onResourceLoadError, this);
    };
    Main.prototype.onConfigError = function (url, resRoot) {
        console.log("资源配置加载失败", url, resRoot);
        uniLib.UIMgr.instance.showProcessBar(null, 1, 100, "资源配置文件加载失败...", "", true);
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        console.error("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    };
    /**
    * preload资源组加载完成
    * Preload resource group is loaded
    */
    Main.prototype.onResourceLoadComplete = function (event) {
        this.preLoadEnd();
        if (uniLib.Global.isVivogame) {
            var timeout_1 = egret.setTimeout(function () {
                egret.clearTimeout(timeout_1);
                window.platform.customInterface("installShortcut");
            }, this, 150000);
        }
    };
    Main.prototype.preLoadEnd = function () {
        uniLib.Console.log("资源全部加载完毕!");
        uniLib.UIMgr.instance.showProcessBar(null, 93, 100, "正在进入...", "");
        if (uniLib.Global.screenWidth / uniLib.Global.screenHeight < 0.5) {
            game.GameConsts.is_iPhoneX = true;
        }
        this.initData();
    };
    //----------------------------------------------------------------------
    Main.prototype.checkErrorMsg = function () {
        for (var i = 0; i < game.TableData.tableSceneLevelConfig.length; i++) {
            var config = game.TableData.tableSceneLevelConfig[i];
            if (config.colorWeights.length != 4) {
                return "表格配置有误， 第" + config.level + "关颜色分布权重个数有误，只能为4种颜色的分布，请检查表格";
            }
            else if (config.digits.length <= 0 || config.digitalWeights.length != config.digits.length) {
                return "表格配置有误， 第" + config.level + "关数字分布与数字分布权重个数不匹配，请检查表格";
            }
            else {
                var maxValue = 0;
                for (var i_1 = 0; i_1 < config.digitalWeights.length; i_1++) {
                    var value = config.digitalWeights[i_1];
                    maxValue += value;
                }
                if (maxValue != 100) {
                    return "表格配置有误， 第" + config.level + "关数字分布权重相加必须为100，请检查表格";
                }
                maxValue = 0;
                for (var i_2 = 0; i_2 < config.colorWeights.length; i_2++) {
                    var value = config.colorWeights[i_2];
                    maxValue += value;
                }
                if (maxValue != 100) {
                    return "表格配置有误， 第" + config.level + "关颜色分布权重相加必须为100，请检查表格";
                }
            }
        }
        return null;
    };
    //----------------------------------------------------------------------
    Main.prototype.initData = function () {
        game.TableData.init();
        game.GameInfo.instance.init();
        if (uniLib.Global.isH5) {
            var errorMsg = this.checkErrorMsg();
            if (errorMsg && errorMsg.length > 0) {
                uniLib.SceneManager.instance.changeScene(game.MainScene);
                GX.Tips.showPopup(errorMsg, function () {
                    window.location.reload();
                }, null, this);
                return;
            }
            this.showLogin();
        }
        else {
            this.showLogin();
        }
    };
    //----------------------------------------------------------------------
    Main.prototype.showLogin = function () {
        var level = uniLib.BrowersUtils.GetRequest("level");
        if (level && level > 0) {
            this.loadGameScene(level);
        }
        else {
            var maxSceneLevel = game.GameInfo.instance.maxSceneLevel;
            var enterLevel = maxSceneLevel + 1;
            if (enterLevel > 1) {
                uniLib.SceneManager.instance.changeScene(game.MainScene, true);
            }
            else {
                this.loadGameScene(1);
            }
        }
        var timeout = egret.setTimeout(function () {
            egret.clearTimeout(timeout);
            uniLib.AdPlat.instance.init();
            Main.instance.soundLoaded = false;
            uniLib.Sound.loadSoundGroup("sound", null, Main.instance.onSoundLoaded, Main.instance);
        }, Main.instance, 1000);
    };
    //----------------------------------------------------------------------
    Main.prototype.onSoundLoaded = function () {
        Main.instance.soundLoaded = true;
        uniLib.Config.InteractiveSoundName = "buttonClick_mp3";
        if (uniLib.Global.isInGame) {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_main_mp3"]);
        }
        else {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_start_mp3"]);
        }
    };
    //----------------------------------------------------------------------
    Main.prototype.changeToMainScene = function (goToSelectLevel) {
        if (Main.instance.soundLoaded) {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_start_mp3"]);
        }
        uniLib.SceneManager.instance.changeScene(game.MainScene, goToSelectLevel);
    };
    //----------------------------------------------------------------------
    Main.prototype.loadGameScene = function (level) {
        var currentGameScene = uniLib.SceneManager.instance.currentScene;
        if (currentGameScene && currentGameScene.unloadSceneLevel) {
            currentGameScene.unloadSceneLevel();
        }
        if (!uniLib.Global.isInGame && Main.instance.soundLoaded) {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_main_mp3"]);
        }
        uniLib.SceneManager.instance.changeScene(game.GameScene, level);
    };
    Main._instance = null;
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map