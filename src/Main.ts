
 
class Main extends egret.DisplayObjectContainer 
{
    private static _instance:Main = null;

    soundLoaded:boolean = false;

    public videoShowing:boolean = false;

    public static get instance(): Main 
    {
        return Main._instance;
    }

    public static onShareMessageCallback(result:boolean)
    {
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
        
    }

    public constructor() 
    {
        super();

        Main._instance = this;

        uniLib.ViewConfig.mainMediatorName = egret.getQualifiedClassName(game.GameMediator);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.start, this);
        egret.ImageLoader.crossOrigin = "anonymous";
    }

    protected start(): void 
    {
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        RES.setMaxLoadingThread(6);

        let self = this;

        this.initResource().then(()=>{
            self.init();
        });
    }

    private init()
    {
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
            uniLib.SoundMgr.instance.pauseBgMusic();
        }

        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
            if(Main.instance.videoShowing) return;
            uniLib.SoundMgr.instance.resumeBgMusic();
        }

        if(null == window.platform)
        {
            window.platform = new game.DebugWebPlatform();
        }

        window.platform.init();

        let initData:uniLib.InitOptions = new uniLib.InitOptions();
        initData.debug = (uniLib.BrowersUtils.GetRequest("debug") == "true") ? true : false;
        initData.standAlone = true;
        initData.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        initData.designWidth = 720;
        initData.designHeight = 1280;
        initData.msgTimeOutSec = 0;
        initData.logLevel = uniLib.LOGLEVEL.DEBUG;
        if(uniLib.Global.isWxgame) initData.gameName = "xiaochu";
        if(uniLib.Global.isWxgame && game.Config.WXGAME_RES_ROOT_URL && game.Config.WXGAME_RES_ROOT_URL.length > 0) initData.wxgameResourceRemoteUrl = game.Config.WXGAME_RES_ROOT_URL;
        uniLib.init(initData);

        uniLib.UIMgr.instance.commonLoadUI = game.PublicLoadingView;
        GX.Tips.TipsClass = game.TipsPanel;
        GX.Tips.PopupClass = game.ConfirmPanel;

        let curResVer:string = game.Config.WXGAME_RES_ROOT_URL ? game.Config.WXGAME_RES_ROOT_URL : "";
        curResVer = curResVer + game.Config.CURRENT_RES_VERSION;
        curResVer = uniLib.Utils.MD5(curResVer);

        let oldResVersion:string = uniLib.Utils.getLocalStorage("MAGICDIGIT_RESVERSION", "");
        if(oldResVersion != curResVer)
        {
            console.log("清除资源缓存");
            window.platform.clearResCache();
            uniLib.Utils.setLocalStorage("MAGICDIGIT_RESVERSION", curResVer);
        }

        let curStorageVer:string = game.Config.CURRENT_GAMEINFO_VERSION;
        curStorageVer = uniLib.Utils.MD5(curStorageVer);
        let oldStorageVersion:string = uniLib.Utils.getLocalStorage("MAGICDIGIT_GAMEINFO_VERSION", ""); 
        if(oldStorageVersion != curStorageVer)
        {
            console.log("清除GameInfo信息");
            game.GameInfo.clearStorage();
            uniLib.Utils.setLocalStorage("MAGICDIGIT_GAMEINFO_VERSION", curStorageVer);
        }

        this.loadResConfig();
    }

    private async initResource()
    {
        const loadingView = new LoadingUI();
        this.stage.addChild(loadingView);
        await RES.loadConfig("resource/loading.res.json", "resource/");
        if(egret.Capabilities.runtimeType != egret.RuntimeType.WXGAME)
        {
            await this.loadTheme();
        }
        await RES.loadGroup("loading", 0, loadingView);
        this.stage.removeChild(loadingView);
    }

    private loadTheme() 
    {
        return new Promise((resolve, reject) => {
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }

    private loadResConfig(): void 
    {
        uniLib.UIMgr.instance.showProcessBar(null, 1, 100, "准备资源配置...", "", true);
        uniLib.ResLoadMgr.instance.loadConfig("resource/game.res.json", "resource/", this.onConfigComplete, this.onConfigError, this);
    }

    private onConfigComplete(): void 
    {
        let strArr: Array<string> = ["game"];
        RES.createGroup("preLoadAll", strArr);
        uniLib.UIMgr.instance.showProcessBar(null, 10, 100, "准备加载资源组...", "", true);
        uniLib.ResLoadMgr.instance.load("preLoadAll", this.onResourceLoadComplete, this.onResourceLoadError, this);
    }

    private onConfigError(url:string, resRoot:string): void 
    {
        console.log("资源配置加载失败", url, resRoot);
        uniLib.UIMgr.instance.showProcessBar(null, 1, 100, "资源配置文件加载失败...", "", true);
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void 
    {
        console.error("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    }

    /**
    * preload资源组加载完成
    * Preload resource group is loaded
    */
    private onResourceLoadComplete(event: RES.ResourceEvent): void 
    {
        this.preLoadEnd();

        if (uniLib.Global.isVivogame) {
            let timeout = egret.setTimeout(() => {
                egret.clearTimeout(timeout);
                window.platform.customInterface("installShortcut");
            }, this, 150000);
        }
    }

    private preLoadEnd(): void 
    {
        uniLib.Console.log("资源全部加载完毕!");

        uniLib.UIMgr.instance.showProcessBar(null, 93, 100, "正在进入...", "");

        if(uniLib.Global.screenWidth / uniLib.Global.screenHeight < 0.5)
        {
            game.GameConsts.is_iPhoneX = true;
        }
        this.initData();
    }

    //----------------------------------------------------------------------
    private checkErrorMsg() : string
    {
        for(let i = 0; i < game.TableData.tableSceneLevelConfig.length; i++)
        {
            let config:table.TableSceneLevelConfig = game.TableData.tableSceneLevelConfig[i];
            if(config.colorWeights.length != 4)
            {
                return "表格配置有误， 第" + config.level + "关颜色分布权重个数有误，只能为4种颜色的分布，请检查表格";
            }
            else if(config.digits.length <= 0 || config.digitalWeights.length != config.digits.length)
            {
                return "表格配置有误， 第" + config.level + "关数字分布与数字分布权重个数不匹配，请检查表格";
            }
            else
            {
                let maxValue = 0;
                for(let i = 0; i < config.digitalWeights.length; i++)
                {
                    let value = config.digitalWeights[i];
                    maxValue += value;
                }
                if(maxValue != 100)
                {
                    return "表格配置有误， 第" + config.level + "关数字分布权重相加必须为100，请检查表格";
                }

                maxValue = 0;
                for(let i = 0; i < config.colorWeights.length; i++)
                {
                    let value = config.colorWeights[i];
                    maxValue += value;
                }
                if(maxValue != 100)
                {
                    return "表格配置有误， 第" + config.level + "关颜色分布权重相加必须为100，请检查表格";
                }
            }
        }
        return null;
    }

    //----------------------------------------------------------------------
    private initData()
    {
        game.TableData.init();
        game.GameInfo.instance.init();

        if(uniLib.Global.isH5)
        {
            let errorMsg = this.checkErrorMsg();
            if(errorMsg && errorMsg.length > 0)
            {
                uniLib.SceneManager.instance.changeScene(game.MainScene);
                GX.Tips.showPopup(errorMsg, ()=>{
                    window.location.reload();
                }, null, this);
                return;
            }
            this.showLogin();
        }
        else
        {
            this.showLogin();
        }
    }

    //----------------------------------------------------------------------
    public showLogin(): void
    {
        let level = uniLib.BrowersUtils.GetRequest("level");
        if(level && level > 0) 
        {
            this.loadGameScene(level);
        }
        else
        {
            let maxSceneLevel = game.GameInfo.instance.maxSceneLevel;
            let enterLevel = maxSceneLevel+1;
            if(enterLevel > 1)
            {
                uniLib.SceneManager.instance.changeScene(game.MainScene, true);
            }
            else
            {
                this.loadGameScene(1);
            }
            
        }

        let timeout = egret.setTimeout(() => {
            egret.clearTimeout(timeout);
            uniLib.AdPlat.instance.init();
            Main.instance.soundLoaded = false;
            uniLib.Sound.loadSoundGroup("sound", null, Main.instance.onSoundLoaded, Main.instance);
        }, Main.instance, 1000);
    }

    //----------------------------------------------------------------------
    private onSoundLoaded()
    {
        Main.instance.soundLoaded = true;
        uniLib.Config.InteractiveSoundName = "buttonClick_mp3";

        if(uniLib.Global.isInGame)
        {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_main_mp3"]);
        }
        else
        {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_start_mp3"]);
        }
    }

    //----------------------------------------------------------------------
    public changeToMainScene(goToSelectLevel?:boolean)
    {
        if(Main.instance.soundLoaded)
        {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_start_mp3"]);
        }
        
        uniLib.SceneManager.instance.changeScene(game.MainScene, goToSelectLevel);
    }

    //----------------------------------------------------------------------
    public loadGameScene(level:number)
    {
        let currentGameScene:game.GameScene = uniLib.SceneManager.instance.currentScene as game.GameScene;

        if(currentGameScene && currentGameScene.unloadSceneLevel)
        {
            currentGameScene.unloadSceneLevel();
        }

        if(!uniLib.Global.isInGame && Main.instance.soundLoaded)
        {
            uniLib.SoundMgr.instance.playBgMusic(["bgm_main_mp3"]);
        }

        uniLib.SceneManager.instance.changeScene(game.GameScene, level);
    }

}
