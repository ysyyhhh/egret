declare module uniLib {
    class MvcSender {
        constructor();
        sendNotification(cmd: string, vo?: any, type?: string): void;
        onRemove(): void;
    }
}
declare module ui {
    /**
     * ui界面的父类 继承子eui.Component
     */
    abstract class BaseUI extends eui.Component implements UIClickInterface, ActionInterface {
        constructor();
        private onAddToStage();
        private onRemoveFromStage();
        /**
         * 销毁 子类重写次方法时需要调用次方法，以销毁父类事件
         */
        destroy(): void;
        /**
         * 监听数据更新事件 需手动调用
         */
        addActionListener(): void;
        /**
         * 移除数据更新事件 切换场景是自动卸载
         */
        removeActionListener(): void;
        /**
         * 监听ui事件 添加到舞台是自动调用
         */
        abstract addUIListener(): void;
        /**
         * 移除ui事件 移除舞台是自动调用
         */
        abstract removeUIListener(): void;
        /**
        * 面板宽度适配至舞台宽度
        */
        protected adaptationWidth(): void;
        /**
        * 面板高度适配至舞台高度
        */
        protected adaptationHeight(): void;
    }
}
declare module uniLib {
    class Command extends MvcSender {
        constructor();
        init(): void;
        destory(): void;
    }
}
declare module uniLib {
    class Proxy extends MvcSender {
        private _name;
        constructor(name?: string);
        readonly name: string;
        onRemove(): void;
    }
}
declare module uniLib {
    /**
     * 游戏数据
     */
    class GameData {
        private static _instance;
        myBaseInfo: Cmd.UserBaseInfo;
        constructor();
        static readonly instance: GameData;
    }
}
declare module ui {
    class AdFullScreenScrollView extends ui.BaseUI {
        private continueBtn;
        private returnBtn;
        private topAdScrollView;
        private adScroller;
        private adGroup;
        private timerLayer;
        private timeLabel;
        private timerHandler;
        private timeDown;
        private itemRenderList;
        private scrollDir;
        private callback;
        private thisObj;
        private cbParams;
        private isStartMisTouching;
        private isNewMode;
        private movieClip;
        private circle;
        private markIcon;
        private updateAnimTimeHandler;
        private autoNavigateToMiniprogram;
        constructor(callback?: Function, thisObj?: any, params?: any, isSupper?: boolean, isNewMode?: boolean, autoNavigateToMiniprogram?: boolean);
        destroy(): void;
        addUIListener(): void;
        removeUIListener(): void;
        private init();
        private onLoad();
        private onUpdateFingerAnim();
        private onUpdateFrame();
        private startDownTime();
        private endDownTime();
        private onUpdateTime();
        private onReturn();
        randomNavigateToMiniProgram(): void;
        private onNavigateToMiniProgramCallback(result, userData);
        private onClickTap(e);
        private startMisTouchPos();
        private onStopMisTouchPos(result);
    }
}
declare module uniLib {
    class AdGameBoxData {
        reward: number;
        tryTimes: number;
        received: boolean;
    }
    class AdGameBoxItemData {
        id: number;
        isPlayed: boolean;
        appid: string;
        img: string;
        path: string;
        title: string;
    }
    class AdGameBoxConfig {
        createTimestamp: number;
        tryTimesTotal: number;
        boxData: AdGameBoxData[];
    }
    abstract class AdGameBox extends ui.BaseUI {
        protected tryPlayGameTime: number;
        protected userBoxData: {
            reward: number;
            tryTimes: number;
        }[];
        protected userTryPlayGameReward: number;
        protected tryPlayTimeDescLabel: eui.Label;
        protected totalDescLabel: eui.Label;
        protected config: AdGameBoxConfig;
        protected gameList: AdGameBoxItemData[];
        protected itemRenderList: AdGameBoxItemRenderer[];
        private adGroup;
        private closeBtn;
        private progressBarGroup;
        private thumb;
        private maskRect;
        private tryPlayGameItemRenderer;
        private startGameTimestamp;
        constructor(tryPlayReward: number, tryPlayTime: number, boxData: {
            reward: number;
            tryTimes: number;
        }[]);
        addUIListener(): void;
        removeUIListener(): void;
        destroy(): void;
        private load();
        private unload();
        private loadConfig();
        private saveConfig();
        private onClickTap(e);
        notityStartTryPlayGame(renderer: AdGameBoxItemRenderer): void;
        notityExitTryPlayGame(): void;
        private refreshBoxData();
        abstract showTryPlayReward(reward: number): void;
        abstract showBoxReward(reward: number): void;
    }
}
declare module uniLib {
    class AdGameBoxItemRenderer extends eui.Component {
        private adGameBox;
        private data;
        private adImage;
        private adLabel;
        private tryPlayBtn;
        private rewardDescLabel;
        private rewardValueLabel;
        private descTimeLabel;
        private staticGroup;
        private dynamicGroup;
        private redPointRect;
        private navigateTimeout;
        constructor(gameBox: AdGameBox, data: AdGameBoxItemData);
        destroy(): void;
        readonly adData: AdGameBoxItemData;
        updateData(data?: AdGameBoxItemData): void;
        private load();
        private onLoaded(url, texture);
        private onTryPlayGame();
        private onNavigateTimeout();
        private navigateToMiniProgram();
        private onNavigateToMiniProgramCallback(result, userData);
    }
}
declare module ui {
    class AdGameFinishScrollView extends ui.BaseUI {
        private continueBtn;
        private adScroller;
        private adGroup;
        private itemRenderList;
        private scrollDir;
        private callback;
        private thisObj;
        private cbParams;
        private isStartMisTouching;
        private timerHandler;
        private movieClip;
        private circle;
        private markIcon;
        constructor(callback?: Function, thisObj?: any, params?: any);
        destroy(): void;
        addUIListener(): void;
        removeUIListener(): void;
        private init();
        private onLoad();
        private onUpdateTime();
        private onUpdateFrame();
        private onClose();
        randomNavigateToMiniProgram(): void;
        private onNavigateToMiniProgramCallback(result, userData);
        private onClickTap(e);
        private startMisTouchPos();
        private onStopMisTouchPos(result);
    }
}
declare module ui {
    class AdGameItemDataRender extends eui.Component {
        private adbg;
        private adImage;
        private adLabel;
        private data;
        private isTouchBegin;
        private isTouchCancel;
        constructor(data: uniLib.AdItemData, skinName?: string, bgImage?: string);
        destroy(): void;
        private load();
        private onLoaded(url, texture);
        private onTouchBegin(e);
        private onTouchEnd(e);
        private onTouchCancel(e);
        private onClickTap(e);
        navigateToMiniProgram(): void;
        private onNavigateToMiniProgramCallback(result, userData);
    }
}
declare module ui {
    class AdGridAdRender {
        private elements;
        private adTimer;
        private animType;
        private processNavigateCallback;
        private movieClip;
        private circle;
        private ignoreFingerAnim;
        private isNewMode;
        static ADGRID_CUR_INDEX: number;
        constructor(root: ui.BaseUI, animType?: number, processNavigate?: boolean, isNewMode?: boolean);
        destroy(): void;
        private init(root);
        private getRandomAdData();
        private findButtonAdByUrl(url);
        private loadButtonAd(button);
        load(ignoreFingerAnim?: boolean): void;
        private onLoaded(url, texture);
        private updateAdButton();
        private onClickTap(e);
        randomNavigateToMiniProgram(): void;
        private onNavigateToMiniProgramCallback(result, userData);
    }
}
declare module uniLib {
    class AdInterstitial {
        private adUnitId;
        private interstitial;
        private state;
        private isShow;
        private showTimestamp;
        private closeCallback;
        private showCallback;
        private showCallbackTarget;
        constructor(unitId: string);
        readonly id: string;
        readonly isLoaded: boolean;
        private createInterstitialAd();
        load(): void;
        private onInterstitialLoad();
        private onInterstitialError(err);
        private onInterstitialClose(res);
        show(force?: boolean, callback?: Function, closeCallback?: Function, thisObj?: any): void;
        destroy(): void;
    }
}
declare module uniLib {
    class AdIPData {
        ip: string;
        country: string;
        province: string;
        city: string;
        county: string;
        isp: string;
        area: string;
    }
}
declare module uniLib {
    class AdItemData {
        appid: string;
        boxAppid: string;
        desc: string;
        img: string;
        path: string;
        title: string;
        priority: number;
        tryPlayEnable: boolean;
    }
}
declare module ui {
    class AdItemDataRender extends eui.Component {
        private adbg;
        private adImage;
        private adLabel;
        private newTitle;
        private data;
        private processNavigateCallback;
        private isTouchBegin;
        private isTouchCancel;
        private isNewMode;
        constructor(data: uniLib.AdItemData, skinName?: string, showBg?: boolean, showTitle?: boolean, stroke?: number, processNavigate?: boolean, titleImage?: string);
        destroy(): void;
        setNewMode(isNewMode: boolean): void;
        private load();
        private onLoaded(url, texture);
        private onTouchBegin(e);
        private onTouchEnd(e);
        private onTouchCancel(e);
        private onClickTap(e);
        navigateToMiniProgram(): void;
        private onNavigateToMiniProgramCallback(result, userData);
    }
}
declare module ui {
    abstract class AdMisTouchGifBox extends ui.BaseUI {
        protected curValue: number;
        private isShowedBanner;
        private isOpenedBanner;
        private openedBannerTimes;
        private randValue;
        private openBannerCallbackTimer;
        private updateIntervalTimer;
        private closeTimeout;
        protected finishedCallback: Function;
        protected finishedCallbackTarget: any;
        protected finishedCallbackParmas: any;
        protected isMistouchAppBox: boolean;
        private isFinished;
        constructor(mistouchAppBox?: boolean);
        setFinishedCallback(callback: Function, thisObj?: any, params?: any): void;
        abstract setProgress(loaded: number, total: number): void;
        abstract reward(clickedBanner: boolean): void;
        protected finished(): void;
        private onUpdate();
        openMistouchBanner(): void;
        private onOpenBannerCallback(isOpen?);
        private onOpenBannerTimeOutCallback(isOpen?);
    }
}
declare module ui {
    /**
     * 广告误触管理器
     */
    class AdMisTouchManager {
        private static _instance;
        static readonly instance: AdMisTouchManager;
        misTouchNum: number;
        misTouchPosNum: number;
        private curMisTouchNum;
        private curMisTouchPosNum;
        private touchTarget;
        private touchTargetCallback;
        private touchTargetObj;
        private misTouchTimer;
        constructor();
        startMisTouch(misTouchGifBox: ui.AdMisTouchGifBox, callback?: Function, thisObj?: any, params?: any): boolean;
        startMisTouchPos(target: egret.DisplayObjectContainer, callback?: Function, thisObj?: any): boolean;
        stopMisTouchPos(target: egret.DisplayObjectContainer): void;
        private onMisTouchTimeoutEvent();
    }
}
declare module uniLib {
    class AdPlat {
        private static _instance;
        static readonly instance: AdPlat;
        private isInit;
        private ipData;
        private tryGameBox;
        private showBannerTimeout;
        private curBannerIndex;
        private autoBannerCallback;
        private autoBannerCallbackTarget;
        private autoBannerTimeout;
        private wx_isShared;
        private wx_sharedCloseTime;
        private shareInfoArr;
        private shareCallback;
        private shareShortCallback;
        private shareCallbackTarget;
        private shareVideoId;
        video: AdRewardedVideo;
        interstitial: AdInterstitial;
        banners: AdBanner[];
        systemInfo: SystemInfo;
        bannerWidth: number;
        private recorderManager;
        private recordVideoPath;
        private recordState;
        private recordDuration;
        private startRecordTimestamp;
        getSystemInfoSync(): SystemInfo;
        /**
         * 注册平台各种回调
         */
        private regisiterCallback();
        /**
         * 游戏回到前台的事件
         */
        private onShowCallback(res);
        /**
         * 游戏隐藏到后台的事件
         */
        private onHideCallback(res);
        /**
         * 初始化
         */
        init(): void;
        initShare(): void;
        initRecord(): void;
        getRecordDuration(): number;
        startRecord(duration?: number): void;
        stopRecord(): void;
        pauseRecord(): void;
        resumeRecord(): void;
        /**
         * 分享
         * @param query 分享参数 { channel:moosnow.SHARE_CHANNEL.LINK }
         * SHARE_CHANNEL.LINK, SHARE_CHANNEL.ARTICLE, SHARE_CHANNEL.TOKEN, SHARE_CHANNEL.VIDEO 可选 仅字节跳动有效
         * @param callback 分享成功回调参数 = true, 分享失败回调参数 = false,
         * @param shortCall 时间过短时回调 ,err 是具体错误信息，目前只在头条分享录屏时用到
         */
        share(query?: any, callback?: Function, shortCall?: Function, thisObj?: any): void;
        buildShareInfo(query?: any): any;
        createRewardedVideo(adUnitId: string): AdRewardedVideo;
        showRewardedVideo(callback?: Function, thisObj?: any): void;
        createInterstitial(adUnitId: string): AdInterstitial;
        showInterstitial(callback?: Function, closeCallback?: Function, thisObj?: any): void;
        setBannerMaxShowTimes(maxTimes: number): void;
        setBannerWidth(width: number): void;
        availableBanner(): AdBanner;
        createBanner(adUnitId: string): AdBanner;
        destroyBanners(): void;
        showBanner(isCarousel?: boolean): void;
        hideBanner(): void;
        private changeShowBanner();
        showAutoBanner(callback?: Function, thisObj?: any): void;
        private hideAutoBanner();
        showAdGameBox(gameBox: AdGameBox): boolean;
        hideAdGameBox(): void;
        showClickMisleadAd(callback?: Function, thisObj?: any, params?: any, effectType?: GX.PopUpEffect, navigateToMiniprogram?: boolean): void;
        showGameFinishAd(callback?: Function, thisObj?: any, params?: any, effectType?: GX.PopUpEffect): void;
        showFullScreenAd(callback?: Function, thisObj?: any, params?: any, isSupper?: boolean, effectType?: GX.PopUpEffect, isNewMode?: boolean, navigateToMiniprogram?: boolean): void;
        private testIpRegion(disabledRegion);
        private isWhitelist(whitelist);
        private initConfig(callBack?, thisObj?);
        private initConfigComplete();
        private requestIP(callBack, thisObj);
        private requestGameConfig(callBack, thisObj);
        private requestGameExportData(callBack, thisObj);
        private requestGameExportDataComplete(data);
    }
}
declare module uniLib {
    class AdRewardedVideo {
        private adUnitId;
        private videoAd;
        private callback;
        private callbackTarget;
        constructor(unitId: string);
        readonly id: string;
        private createRewardedVideoAd();
        load(): void;
        private onVideoLoad();
        private onVideoError(err);
        private onVideoClose(res);
        show(callback?: Function, thisObj?: any): void;
        destroy(): void;
    }
}
declare module ui {
    class AdScrollView extends eui.Component {
        private adScroller;
        private adGroup;
        private itemRenderList;
        private rollDirection;
        private scrollDir;
        openUpdate: boolean;
        private movieClip;
        private circle;
        private timerHandler;
        private _isLoaded;
        constructor();
        readonly isLoaded: boolean;
        randomNavigateToMiniProgram(): void;
        load(dir?: number, needTitle?: boolean, stroke?: number, itemRenderSkin?: string, processNavigate?: boolean, isNewMode?: boolean): void;
        unload(): void;
        private onUpdateTime();
        private onUpdateFrame();
    }
}
declare module Cmd {
    /**
     * 平台枚举
     */
    enum PlatType {
        /**
         * 本平台
         */
        PlatType_Normal = 0,
        /**
         * 微信
         */
        PlatType_WeChat = 1,
    }
    /**
     * HTTP请求错误返回定义
     */
    enum HttpReturnCode {
        /**
         * 无错误
         */
        HttpReturnCode_Null = 0,
        /**
         * 通用错误
         */
        HttpReturnCode_NormalErr = 1,
        /**
         * 数据库出错
         */
        HttpReturnCode_DbError = 2,
        /**
         * 需要绑定账号
         */
        HttpReturnCode_NeedBind = 3,
        /**
         * 脚本错误
         */
        HttpReturnCode_ScriptError = 4,
        /**
         * 已经注册过了
         */
        HttpReturnCode_IsRegisteredError = 5,
        /**
         * 当前账号未注册
         */
        HttpReturnCode_NoRegisteredError = 6,
        /**
         * 签名检查错误，需要重新登录
         */
        HttpReturnCode_SignError = 7,
        /**
         * 服务器未开
         */
        HttpReturnCode_ServerShutDown = 8,
        /**
         * Json语法格式错误
         */
        HttpReturnCode_JsonSyntaxError = 9,
        /**
         * Json消息格式错误
         */
        HttpReturnCode_JsonMessageError = 10,
        /**
         * tokenvalue为空
         */
        HttpReturnCode_TokenValueError = 11,
        /**
         * uid与登录uid不同
         */
        HttpReturnCode_WaiGuaUidError = 12,
        /**
         * 没有可用网关
         */
        HttpReturnCode_NoGatewayDown = 13,
        /**
         * 没有可用Sdk服务器
         */
        HttpReturnCode_NoSdkServer = 14,
        /**
         * 签名错误
         */
        HttpReturnCode_SdkCheckSignErr = 15,
        /**
         * 第三方服务器验证错误
         */
        HttpReturnCode_Sdk3PartyServerErr = 16,
        /**
         * 网关错误
         */
        HttpReturnCode_GatewayErr = 17,
        /**
         * 响应超时,目前设置为20秒
         */
        HttpReturnCode_Timeout = 18,
        /**
         * 账号正在使用中
         */
        HttpReturnCode_AccountUsing = 19,
        /**
         * 线上时，platid＝0被限制
         */
        HttpReturnCode_OnlinePlatidErr = 20,
        /**
         * 绑定账号失败
         */
        HttpReturnCode_BindAccountErr = 21,
        /**
         * 没有可用的区服
         */
        HttpReturnCode_NoZoneDown = 22,
    }
    /**
     * 平台用户信息
     */
    class PlatInfo {
        /**
         * 用户账号
         */
        account: string;
        /**
         * 用户id
         */
        uid: string;
        /**
         * 平台id
         */
        platid: number;
        /**
         * 昵称
         */
        nickname: string;
        /**
         * 时间戳
         */
        timestamp: string;
        /**
         * 平台签名串
         */
        sign: string;
        /**
         * 平台头像
         */
        faceurl: string;
        /**
         * 系统名称
         */
        osname: string;
        /**
         * 客户端机器码
         */
        imei: string;
        /**
         * 增加一个扩展字段，特殊平台自行组装json
         */
        extdata: string;
        GetType(): string;
    }
    /**
     * 平台登录【不需要签名】
     */
    class PlatTokenLogin {
        /**
         * 平台用户信息
         */
        platinfo: Cmd.PlatInfo;
        GetType(): string;
    }
    class PlatTokenLoginReturn {
        /**
         * 平台用户信息
         */
        platinfo: Cmd.PlatInfo;
        /**
         * 可唯一代表一个用户身份的ID，由平台统一生成
         */
        uid: string;
        /**
         * 平台登录密钥，用于上行消息URL签名
         */
        unigame_plat_key: string;
        /**
         * 平台登录token，用于上行消息
         */
        unigame_plat_login: string;
        /**
         * 平台登录token从现在开始多少秒后过期，过期后或服务器返回HttpReturnCode_SignError时客户端需要重新走登录流程
         */
        unigame_plat_login_life: number;
        GetType(): string;
    }
    /**
     * 选区【必须签名】
     */
    class RequestSelectZone {
        GetType(): string;
    }
    class HttpPackage {
        /**
         * 消息类型
         */
        do: string;
        /**
         * 应用层消息内容
         */
        data: any;
        /**
         *  游戏ID
         */
        gameid: number;
        /**
         * 区ID， 如果客户端发，服务器照样返回
         */
        zoneid: number;
        /**
         * 可唯一代表一个用户身份的ID，由平台统一生成
         */
        uid: string;
        /**
         * 由PlatTokenLoginReturn返回
         */
        unigame_plat_login: string;
        /**
         * 客户端当前UNIX时间戳，单位秒
         */
        unigame_plat_timestamp: number;
        GetType(): string;
    }
    class HttpPackageReturn {
        /**
         * 消息类型
         */
        do: string;
        /**
         *  游戏ID
         */
        gameid: number;
        errno: Cmd.HttpReturnCode;
        GetType(): string;
    }
    /**
     * 基础数据
     */
    class UserBaseInfo {
        uid: number;
        headUrl: string;
        nickName: string;
        mobile: string;
        sex: number;
        diamond: number;
        chips: number;
        signature: string;
        level: number;
        score: number;
        GetType(): string;
    }
    class SysMessageCmd_S {
        desc: string;
        pos: number;
        GetType(): string;
    }
    class UserInfoSynCmd_S {
        resultCode: number;
        userInfo: Cmd.UserBaseInfo;
        GetType(): string;
    }
}
declare module ui {
    /**
     * ui交互模式选择
     */
    module UIInteractive {
        /**
        *   按钮点击后高亮反馈
         */
        let Bright: string;
        /**
        *   按钮点击后缩放反馈
         */
        let Scale: string;
    }
    class Button extends eui.Button {
        constructor();
        destroy(): void;
        /**
         * ui交互模式选择 game.UIInteractive
         */
        interactive: string;
        /**
        * 组件是否可以接受用户交互。
        * 将 enabled 属性设置为 false 后，
        * 组件会自动禁用触摸事件(将 touchEnabled 和 touchChildren 同时设置为 false)，
        * 部分组件可能还会将皮肤的视图状态设置为"disabled",使其所有子项的颜色变暗。
        *
        * @default true
        *
        * @version Egret 2.4
        * @version eui 1.0
        * @platform Web,Native
        * @language zh_CN
        */
        enabled: any;
    }
}
declare module eui {
    interface Component {
        customUIInteractive(): void;
        interactive_onAddToStage(): void;
        interactive_onRemoveFromStage(): void;
        interactive_destroy(): void;
        interactive_addUIListener(): void;
        interactive_removeUIListener(): void;
        interactive_changeStatus(e: egret.TouchEvent): void;
        $interactive: string;
    }
}
declare module ui {
    /**
     * UI点击接口
     */
    interface UIClickInterface {
        addUIListener(): void;
        removeUIListener(): void;
    }
    /**
     * 行为接口
     */
    interface ActionInterface {
        addActionListener(): void;
        removeActionListener(): void;
    }
}
declare module ui {
    class ItemRenderer extends eui.ItemRenderer {
        constructor();
        destroy(): void;
        /**
         * ui交互模式选择 game.UIInteractive
         */
        interactive: string;
        /**
        * 组件是否可以接受用户交互。
        * 将 enabled 属性设置为 false 后，
        * 组件会自动禁用触摸事件(将 touchEnabled 和 touchChildren 同时设置为 false)，
        * 部分组件可能还会将皮肤的视图状态设置为"disabled",使其所有子项的颜色变暗。
        *
        * @default true
        *
        * @version Egret 2.4
        * @version eui 1.0
        * @platform Web,Native
        * @language zh_CN
        */
        enabled: any;
    }
}
declare module ui {
    class PanelManage {
        static panelList: Array<ui.BaseUI | ui.Button | ui.ItemRenderer>;
        static addPanel(panel: ui.BaseUI | ui.Button | ui.ItemRenderer): void;
        static destroyPanel(): void;
    }
}
declare module GX {
    /**
     * 时间戳格式
     */
    enum TimeFormat {
        /**
         * Y-M-D H:M:S
         */
        ALL = 1,
        /**
         * H:M
         */
        HM = 2,
        /**
         * H:M:S
         */
        HMS = 3,
        /**
         * M:S
         */
        MS = 4,
    }
    /**
     * 资源风格
     */
    enum RESStyle {
        /**
         * 矩形
         */
        Rect = 1,
        /**
         * 圆形
         */
        Circular = 2,
        /**
         * 圆角矩形
         */
        RoundRect = 3,
    }
    /**
     * 字符串不是`undefined`、`null`或`""`
     */
    function stringIsNullOrEmpty(value: string): boolean;
    /**
     * @ref http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/8809472#8809472
     */
    function generateUUID(): string;
    function MD5(message: string): string;
    /**
     * @ref http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
     */
    function unixTimestamp(): number;
    /**
     * 得到扩展名，带“.”
     * @param path
     */
    function getExtension(path: string): string;
    /**
     * 得到路径，不带末尾“/”
     * @param path
     */
    function getDirectoryName(path: string): string;
    /**
     * 得到文件名，带扩展名
     * @param path
     */
    function getFileName(path: string): string;
    /**
     * 得到不带扩展名的文件名
     * @param path
     */
    function getFileNameWithoutExtension(path: string): string;
    /**
     * 是否是全路径
     * @param path
     */
    function isPathRooted(path: string): boolean;
    /**
     * 时间戳转换为字符串
     * format 参数可设置为
     */
    function timestampToString(time: number, format?: TimeFormat): string;
    /**
     * 【金额表示方法】：
     *1 - 10万（不含10万），不用单位
     *10万 - 1000万（不含1000万），用K
     *1000万及以上，用M
     *数字加千分号，保留2位小数
     *@param isFontRes 是否为美术字 默认false
     *@param precise 是否返回精确数据  默认false  若为true 原始数据返回
     *@param iscomma 返回字符串是否带逗号分隔  默认true
     */
    function GoldFormat(value: number, isFontRes?: boolean, precise?: boolean, iscomma?: boolean): string;
    /**
     * 千位/拉克（十万）/克若尔（千万）分隔
     */
    function toEnInLocaleString(n: string): string;
    /**
     * value转化为num位小数的字符串
     */
    function numToFixed(value: number, num?: number): string;
    /**
     * 获取俩点的弧度
     */
    function getRadianByPoint(p1: {
        x: number;
        y: number;
    }, p2: {
        x: number;
        y: number;
    }): number;
    /**
     *获取俩点的距离
     */
    function getDistanceByPoint(p1: {
        x: number;
        y: number;
    }, p2: {
        x: number;
        y: number;
    }): number;
    /**
     * 通过角度获得弧度
     */
    function getRadian(angle: number): number;
    /**
     * 通过弧度获得角度
     */
    function getAngle(radian: number): number;
    /**
    *获取弧度所在的象限
     */
    function getQuadrantByRadian(radian: number): number;
    /**
     * 返回点和弧度生成的直线指向舞台边界反射后的点和弧度
     */
    function getBorderPoint(point: {
        x: number;
        y: number;
    }, angle: number): {
        x: number;
        y: number;
        angle: number;
    };
    /**
    *是否为json字符串
     */
    function isJsonString(str: any): boolean;
    /**
    * 金币字符串格式化
    */
    function GoldStringReplace(s: string): string;
    /**
     * 是否是数字
     */
    function isNumber(data: any): boolean;
    /**
    * 置灰
    */
    function setGray(target: egret.DisplayObject): void;
    /**
     * 恢复正常
     */
    function setNomarl(target: egret.DisplayObject): void;
    /**
     * 高亮
     */
    function setLight(target: egret.DisplayObject): void;
    /**
     * 变红色
     */
    function setRed(target: egret.DisplayObject): void;
    /**
     * 变白色
     */
    function setWhite(target: egret.DisplayObject): void;
    /**
         * 金额转中文
         */
    function amountToChinese(n: number): string;
}
interface Math {
    /**
     * 得到[min, max)之间的浮点随机数
     */
    randomFloat(min: number, max: number): number;
    /**
     * 得到[min, max]之间的整数随机数，注意max值可以取到
     */
    randomInteger(min: number, max: number): number;
    /**
     * 限制value的值在[min,max]之间
     */
    clamp(value: number, min: number, max: number): number;
}
interface Math {
    randomInteger(min: any, max: any): number;
}
interface Math {
    randomIntegers(min: any, max: any, selectnum: any): Array<number>;
}
interface Math {
    boolFromPercentage(num: number): boolean;
}
interface Number {
    percentage(): number;
}
declare module GX {
    /**
     * 线性同余随机数生成器，因为js提供的api不支持种子，所以为了匹配Unity，另写一套
     */
    class Random {
        /**
         * 创建一个随机数生成器
         */
        constructor(seed: number);
        /**
         * 设置用于随机数生成器的种子，如果不设置则实际是取当前时间毫秒数
         */
        seed: number;
        /**
         * 返回一个随机数，在0.0～1.0之间
         */
        readonly value: number;
        /**
         * 返回半径为1的圆内的一个随机点
         */
        readonly insideUnitCircle: egret.Point;
        /**
         * 返回半径为1的圆边的一个随机点
         */
        readonly onUnitCircle: egret.Point;
        /**
         * 返回一个在min和max之间的随机浮点数
         */
        range(min: number, max: number): number;
        /**
         * 设置用于随机数生成器的种子，如果不设置则实际是取当前时间毫秒数
         */
        static seed: number;
        /**
         * 返回一个随机数，在0.0～1.0之间
         */
        static readonly value: number;
        /**
         * 返回半径为1的圆内的一个随机点
         */
        static readonly insideUnitCircle: egret.Point;
        /**
         * 返回半径为1的圆边的一个随机点
         */
        static readonly onUnitCircle: egret.Point;
        /**
         * 返回一个在min和max之间的随机浮点数
         */
        static range(min: number, max: number): number;
    }
}
interface String {
    /**
     * String.format(...replacements: string[]): string
     * @example "This is an {0} for {0} purposes: {1}".format("example", "end");
     * @ref http://stackoverflow.com/questions/20070158/string-format-not-work-in-typescrypt
     */
    format(...replacements: string[]): string;
    /**
     * 左填充，默认为空格填充
     */
    padLeft(totalWidth: number, paddingChar?: string): string;
    /**
     * 右填充，默认为空格填充
     */
    padRight(totalWidth: number, paddingChar?: string): string;
    /**
     * 确定此字符串实例的开头是否与指定的字符串匹配
     */
    startsWith(str: string): boolean;
    /**
     * 确定此字符串实例的结尾是否与指定的字符串匹配
     */
    endsWith(str: string): boolean;
    /**
     * 移除末尾空白
     */
    trimEnd(): string;
    /**
     * 移除起始空白
     */
    trimStart(): string;
}
interface String {
    padLeft(totalWidth: any, paddingChar: any): string;
}
interface String {
    PadHelper(totalWidth: any, paddingChar: any, isRightPadded: any): string;
}
declare module GX {
    /**
     * 游戏容器类
    *
    */
    class GameLayerManager {
        static removeUI(ui: any): void;
        /**
         *  场景层 如 战场、主城、副本战场之类的
         */
        private static m_sceneLayer;
        static sceneLayer: egret.DisplayObjectContainer;
        static addUIToScene(ui: any): void;
        /**
         * 主UI层 如 底部功能栏
         */
        private static m_mainLayer;
        static mainLayer: egret.DisplayObjectContainer;
        static addUIToMain(ui: any): void;
        /**
         * 特效层 如 闪烁、飘字之类的
         */
        private static m_effectLayer;
        static effectLayer: egret.DisplayObjectContainer;
        static addUIToEffect(ui: any): void;
        /**
         * 弹窗层 如 设置、背包、装备之类的
         */
        private static m_popLayer;
        static popLayer: egret.DisplayObjectContainer;
        static addUIToPop(ui: any): void;
        /**
         * 通讯遮罩层 和服务器通讯UI
         */
        private static m_maskLayer;
        static maskLayer: egret.DisplayObjectContainer;
        static addUIToMask(ui: any): void;
        /**
         * 加载遮罩层 场景切换的时候加载资源UI
         */
        static m_loadLayer: egret.DisplayObjectContainer;
        static loadLayer: egret.DisplayObjectContainer;
        static addUIToLoad(ui: any): void;
    }
}
declare module GX {
    /**
    * 弹出效果
    */
    enum PopUpEffect {
        /**
        * 没有动画
        */
        NOMAL = 0,
        /**
        * 从中间轻微弹出
        */
        CENTER = 1,
        /**
        * 从中间猛烈弹出
        */
        CENTER_S = 2,
        /**
        * 从左向右
        */
        LEFT = 3,
        /**
        * 从右向左
        */
        RIGHT = 4,
        /**
        * 从上到下
        */
        TOP = 5,
        /**
        * 从下到上
        */
        BOTTOM = 6,
    }
    /**
     * 类型推断
     */
    function _typeof(objClass: any): any;
    /**
    * 面板弹出管理类
    */
    module PopUpManager {
        /**
         * 背景对象
         */
        class DarkPop {
            darkSprite: egret.Sprite;
            relyPanel: egret.DisplayObjectContainer;
        }
        let DarkPops: DarkPop[];
        /**
         * 弹出面板栈
         */
        let PanelStack: Array<{
            panel: egret.DisplayObjectContainer;
            effect: PopUpEffect;
        }>;
        function pushToUIStack(panel: egret.DisplayObjectContainer, effect?: PopUpEffect): void;
        function UIStatckPop(panel: egret.DisplayObjectContainer): void;
        /**
        * 添加面板方法
        * @param panel       		面板
        * @param dark        		背景是否变黑
        * @param effectType			0：没有动画 1:从中间轻微弹出 2：从中间猛烈弹出  3：从左向右 4：从右向左 5、从上到下 6、从下到上
        * @param backFun			回调函数 用于动画的完成的后续操作
        * @param darkAlpha			背景变黑的透明的
        */
        function addPopUp(panel: egret.DisplayObjectContainer, dark?: boolean, darkAlpha?: number, effectType?: PopUpEffect, backFun?: Function, duration?: number, parent?: egret.DisplayObjectContainer): void;
        /**
        * 移除面板方法
        * @param panel       		面板
        * @param effectType			0：没有动画 1:从中间缩小消失 2：  3：从左向右 4：从右向左 5、从上到下 6、从下到上
        * @param backFun			回调函数 用于动画的完成的后续操作
        */
        function removePopUp(panel: egret.DisplayObjectContainer, effectType?: PopUpEffect, backFun?: Function, duration?: number): void;
        function clearPopUps(): void;
        function visiblePopUps(visible: boolean): void;
    }
}
declare module GX {
    /**
     * 提示框UI
     */
    module Tips {
        /**
         * 自定义弹出界面
         */
        let PopupClass: any;
        /**
         * 自定义提示界面
         */
        let TipsClass: any;
        let TipsOffsetHeight: number;
        /**
         * 弹窗形式的提示
         * 自定义弹出界面PopupClass   构造方法参数许一致
         * return 返回弹窗对象
         */
        function showPopup(msg: string, confirmFunc?: Function, cancelFunc?: Function, thisObject?: any, cancelVisible?: boolean, title?: string, confirmLabel?: string, cancelLabel?: string, popUpEffect?: GX.PopUpEffect, dark?: boolean, darkAlpha?: number, parent?: egret.DisplayObjectContainer): any;
        /**
         * 消息提示 显示在屏幕中央，没有操作，显示3秒后移除
         * source:指定的图片，如果此值有效，则忽略 msg, 直接使用 source 指定的图片
         */
        function showTips(msg: string, source?: string, container?: egret.DisplayObjectContainer): any;
        function getContainer(): egret.DisplayObjectContainer;
    }
}
declare module uniLib {
    class FacadeConsts {
        static ADPLAT_INIT_COMPLETED: string;
        static STARTUP: string;
        static SEND_DATA: string;
        static DESTORY: string;
        static SYSTEM_MESSAGE: string;
        static JOIN_GAME: string;
        static USER_INFO: string;
        static FARM_INFO: string;
        static BUY_CROP: string;
        static RECOVERY_CROP: string;
        static CROP_TIME_OUTCOME: string;
        static FRUIT_TIME_OUTCOME: string;
        static SYNTHESIS_CROP: string;
        static PICK_FRUIT: string;
        static PICK_ALL_FRUIT: string;
        static CROP_INTERCHANGE: string;
        static APPLY_ADD_FRIEND: string;
        static FRIEND_LIST: string;
        static PLAYER_LIST: string;
        static FRIEND_ASK_LIST: string;
        static ENTER_FARM: string;
        static LEAVE_FARM: string;
    }
}
declare module uniLib {
    class Config {
        /**
         * 交互音效
         */
        static InteractiveSoundName: string;
        static readonly debug: boolean;
    }
}
declare module uniLib {
    /**
     * 初始化
     */
    class InitOptions {
        debug: boolean;
        standAlone: boolean;
        designWidth: number;
        designHeight: number;
        scaleMode: string;
        logLevel: LOGLEVEL;
        /**
         * 消息发出超时时间
         */
        msgTimeOutSec: number;
        wssMode: boolean;
        wxgameResourceRemoteUrl: string;
        gameName: string;
    }
    /**
     * 初始化
     */
    function init(param?: InitOptions): void;
    let getDefinitionByNameCache: any;
    function getDefinitionByName(name: string): any;
    function hasDefinition(name: string): boolean;
    function delDefinitionByName(name: string): any;
    function checkServerReturnCodeError(recv: any): boolean;
    function doServerReturnCodeError(recv: any): boolean;
}
declare module uniLib {
    class Global {
        static initOpt: InitOptions;
        static isInGame: boolean;
        static standAlone: boolean;
        /**
         * 屏幕高度
         */
        static screenHeight: number;
        /**
         * 屏幕宽度
         */
        static screenWidth: number;
        /**
         * 素材宽度
         */
        static designWidth: number;
        /**
         * 素材高度
         */
        static designHeight: number;
        static msgTimeOutSec: number;
        static gameConfig: any;
        /**
         * 微信平台 OpenId
         */
        static wxOpenId: string;
        /**
         * 平台名称
         */
        static platformName: string;
        static configUrl: string;
        static exportUrl: string;
        static locationUrl: string;
        static initGameConfig(): void;
        /**
         * 游戏进入后台
         */
        static pause(): void;
        /**
         * 游戏进入前台
         */
        static resume(): void;
        /**
         * 上报微信 openid 到阿拉丁
         */
        static reportAldOpenId(openid: string): void;
        /**
         * 上报阿拉丁事件数据
         */
        static reportAldEvent(eventName: string, eventParams?: any): void;
        /**
         * 上报阿拉丁游戏关卡开始
         */
        static reportAldStageStart(stageId: number, stageName?: string): void;
        /**
         * 上报阿拉丁游戏关卡成功
         */
        static reportAldStageEnd(stageId: number, stageName?: string): void;
        /**
         * 上报阿拉丁游戏关卡失败
         */
        static reportAldStageFail(stageId: number, stageName?: string): void;
        /**
         * 上报阿拉丁游戏关卡进行中奖励行为
         */
        static reportAldStageAward(stageId: number, stageName?: string, itemName?: string): void;
        /**
         * 上报阿拉丁游戏关卡进行中使用道具行为
         */
        static reportAldStageTools(stageId: number, stageName?: string, itemName?: string, itemCount?: number): void;
        /**
         * 上报友盟自定义事件数据
         */
        static reportUmaEvent(eventName: string): void;
        static readonly isDebug: boolean;
        static readonly isH5: boolean;
        static readonly isNative: boolean;
        static readonly isWxgame: boolean;
        static readonly isQQGame: boolean;
        static readonly isVivogame: boolean;
        static readonly isOppogame: boolean;
        static readonly isTTGame: boolean;
        static readonly isFastGame: boolean;
    }
}
declare module uniLib {
    class EventListener extends egret.EventDispatcher {
        private static _instance;
        constructor();
        static getInstance(): EventListener;
    }
}
declare module uniLib {
    class AdBanner {
        private adUnitId;
        private banner;
        private bannerLoading;
        private isShow;
        private createTimestamp;
        private showTime;
        private maxShowTime;
        private bannerWidth;
        constructor(unitId: string, bannerwidth: number);
        readonly id: string;
        readonly isLoaded: boolean;
        setShowTime(time: number): void;
        private createBannerAd();
        load(): void;
        private onBannerLoad();
        private onBannerResize(size);
        private onBannerError(err);
        show(force?: boolean): void;
        hide(): void;
        destroy(): void;
    }
}
declare module uniLib {
    /**
     * 数据请求操作
     */
    class DataRequestCommand extends Command {
        static GAME_DATA: string;
        static CONNECT_GAME_SERVER: string;
        static LOGIN_OUT: string;
        constructor();
        init(): void;
        private onEventHandle(evt);
        onRemove(): void;
    }
}
declare module uniLib {
    /**
     * 移除命令
     */
    class RemoveCommand extends Command {
        constructor();
        init(): void;
        private onEventHandle(evt);
        private removeController();
        private removeMediator();
        private removeProxy();
        onRemove(): void;
    }
}
declare module Cmd {
    function dispatch(cmd: string, obj?: any, type?: string): void;
    function trace(rev: any, str?: string): void;
    function OnSysMessageCmd_S(rev: Cmd.SysMessageCmd_S): void;
    function OnUserInfoSynCmd_S(rev: Cmd.UserInfoSynCmd_S): void;
    function OnUserInfoGetCmd_S(rev: Cmd.UserBaseInfo): void;
}
declare module uniLib {
    /**
     * 启动命令
     */
    class StartUpCommand extends Command {
        constructor();
        init(): void;
        destory(): void;
        private onEventHandle(evt);
        execute(notification: puremvc.INotification): void;
        private initController();
        private initMediator();
        private initProxy();
    }
}
declare module uniLib {
    /**
     * 网络图片加载器
     */
    class RemoteImageLoader {
        url: string;
        private loadImpl;
        private loadCallback;
        private thisObj;
        constructor();
        load(url: string, callback?: Function, thisObj?: any): void;
        destroy(): void;
        private onLoadCallbackHandler(evt);
    }
    /**
     * 资源管理器
     */
    class ResLoadMgr extends egret.EventDispatcher {
        private static _instance;
        /**
         * 加载进度界面
         */
        private _loadingClass;
        private _loadSucc;
        private _loadError;
        private _thisObj;
        private _autoHide;
        private _curLoadingId;
        /**
         * 当前正在加载的资源组
         */
        curLoadingGrp: string;
        private hasItemLoadErr;
        /**
         * 最后加载的资源组
         */
        private lastLoadGrp;
        private _backGroundLoadDic;
        private remoteImageLoaderList;
        private cacheTextureMap;
        constructor();
        static readonly instance: ResLoadMgr;
        private initLoadingUI();
        loadConfig(url: string, resRoot?: string, loadSucc?: Function, loadError?: Function, thisObj?: any): void;
        load(groupName: string, loadSucc?: Function, loadError?: Function, thisObj?: any, loadIngClass?: any, autoHideLoadUI?: boolean, isprocess?: boolean): Promise<void>;
        private onUniLibResLoadComplete(event);
        private onUniLibResLoadError(event);
        private onUniLibResProgress(event);
        private removeLoadDic(grpName);
        loadRemoteImage(url: string, callback?: Function, thisObj?: any): void;
        private getRemoteImageLoader(url);
        private destroyRemoteImageLoader(url);
        private onLoadRemoteImageCallback(url, texture);
        getCacheTexture(url: string): egret.Texture;
    }
}
declare module uniLib {
    class Scene extends egret.DisplayObjectContainer {
        backgroundLayer: egret.DisplayObjectContainer;
        gameLayer: egret.DisplayObjectContainer;
        effectLayer: egret.DisplayObjectContainer;
        uiLayer: egret.DisplayObjectContainer;
        topLayer: egret.DisplayObjectContainer;
        maskLayer: egret.DisplayObjectContainer;
        tipsLayer: egret.DisplayObjectContainer;
        params: any;
        constructor(params?: any);
        initBaseLayers(): void;
        /**
         * 场景构造完成
         */
        awake(): void;
        /**
         * 场景初始化完成并添加到舞台
         */
        start(e?: egret.Event): void;
        /**
         * 大小变化时
         */
        resize(): void;
        /**
        * 场景销毁时
        */
        destroy(): void;
        onEnter(): void;
        onExit(): void;
    }
}
declare module uniLib {
    class SceneManager {
        private static _instance;
        private sceneLayer;
        /**
         * 当前场景
         */
        private _currentScene;
        /**
         * 上一个场景
         */
        private _lastScene;
        constructor();
        static readonly instance: SceneManager;
        readonly currentScene: Scene;
        changeScene(sceneClass: any, params?: any): Scene;
        addUIToScene(ui: any): void;
    }
}
declare module uniLib {
    /**
     * 音效加载
     */
    class Sound {
        static soundGroupName: string;
        static bgMusic: string[];
        static callBack: Function;
        static thisobj: any;
        static delayedTimer: number;
        static loadSoundGroup(name: string, bmg?: string[], callBack?: Function, thisobj?: any): void;
        static loadingTimeOut(): void;
        static onLoadComplete(event: RES.ResourceEvent): void;
        static onResourceProgress(event: RES.ResourceEvent): void;
        private static onLoadError(event);
        static soundGroupLoadComplete(): void;
        static clearLoadSoundData(): void;
        static destroyLoadSound(): void;
    }
}
declare module uniLib {
    class MySoundChannel {
        isStopped: boolean;
        isMusic: boolean;
        name: string;
        position: number;
        egret_channel: egret.SoundChannel;
        res: egret.Sound;
        stop(): void;
    }
    /**
     * 音频管理
     */
    class SoundMgr {
        private static _instance;
        private static MUSIC_TOGGLE;
        private static SOUND_TOGGLE;
        private static MUSIC_VOLUME;
        private static SOUND_VOLUME;
        private currentMusicChanel;
        private soundRes;
        private activeSound;
        private loadTimeDic;
        private _bgMusics;
        private currentMusicIndex;
        private _musicOpen;
        private _soundOpen;
        private _soundPause;
        private _musicVolume;
        private _soundVolume;
        static readonly instance: SoundMgr;
        readonly bgMusics: Array<string>;
        musicOpen: boolean;
        soundOpen: boolean;
        musicVolume: number;
        soundVolume: number;
        play(soundName: string, loops?: number, position?: number, asyn?: Array<any>, isMusic?: boolean): egret.SoundChannel;
        private resetCurrentMusic(channel, musicName);
        private onMusicEnd(e);
        playBgMusic(musics: Array<string>, position?: number): void;
        playSound(soundName: string, allowMultiple?: boolean, loops?: number, position?: number, playEndBack?: Function, thisObj?: any): egret.SoundChannel;
        pauseBgMusic(): void;
        resumeBgMusic(): void;
        isPlayingBgMusic(): boolean;
        isSoundPlaying(soundName: string): boolean;
        stopBgMusic(mscName?: any): void;
        stopSound(soundName: string): void;
        stopSounds(): void;
    }
}
declare module uniLib {
    /**
     * UI管理
     */
    class UIMgr {
        private static _instance;
        private _commonLoadUI;
        private _tipsLoadUI;
        /**
        * ui字典
        */
        private _loadings;
        private _effects;
        constructor();
        static readonly instance: UIMgr;
        commonLoadUI: any;
        tipsLoadUI: any;
        showProcessBar(loadClass?: any, loaded?: any, total?: number, desc?: string, resourceName?: string, force?: boolean, container?: egret.DisplayObjectContainer): void;
        showLoadingTimeout(loadClass?: any, key?: string, timeout_msec?: number, desc?: string): void;
        hideLoading(loadClass?: any, uiName?: string, destroy?: boolean, rm_now?: boolean): void;
        private showLoading(loadClass?, loaded?, total?, desc?, resourceName?, force?, uiName?, container?, loadingParam?);
    }
}
declare module uniLib {
    class Facade extends MvcSender {
        private static _instance;
        private static _commandArr;
        private static _mediatorArr;
        private static _proxyArr;
        constructor();
        static getInstance(): Facade;
        initializeController(): void;
        /**
         * 启动PureMVC，在应用程序中调用此方法，并传递应用程序本身的引用
         * @param	rootView	-	PureMVC应用程序的根视图root，包含其它所有的View Componet
         */
        startUp(rootView: egret.DisplayObjectContainer): void;
        registerCommand(cmd: string, command: Command): void;
        removeCommand(cmd: string): void;
        registerMediator(mediator: Mediator): void;
        retrieveMediator(name: string): Mediator;
        removeMediator(name: string): void;
        registerProxy(proxy: Proxy): void;
        removeProxy(name: string): void;
    }
}
declare module uniLib {
    class Mediator extends MvcSender {
        private _name;
        private _viewComponent;
        constructor(name?: string, viewComponent?: any);
        private $addEventListener();
        readonly name: string;
        private onHandle(evt);
        listNotificationInterests(): Array<any>;
        handleNotification(evt: MvcData): void;
        onRemove(): void;
        getViewComponent(): any;
        setViewComponent(viewComponent: any): void;
    }
}
declare module uniLib {
    class MvcData {
        private _evt;
        constructor(evt: egret.Event);
        getName(): string;
        getBody(): any;
    }
}
declare module ui {
    class AdClickMisleadView extends ui.BaseUI {
        private continueBtn;
        private returnBtn;
        private adGroup;
        private timerHandler;
        private itemRenderList;
        private callback;
        private thisObj;
        private cbParams;
        private movieClip;
        private circle;
        private autoNavigateToMiniprogram;
        constructor(callback?: Function, thisObj?: any, params?: any, autoNavigateToMiniprogram?: boolean);
        destroy(): void;
        addUIListener(): void;
        removeUIListener(): void;
        private init();
        private onLoad();
        private onUpdateTime();
        private onReturn();
        randomNavigateToMiniProgram(): void;
        private onNavigateToMiniProgramCallback(result, userData);
        private onClickTap(e);
    }
}
declare module uniLib {
    class ViewConfig {
        static mainMediatorName: string;
        static mainMediator: any;
        static loginPanelName: string;
        constructor();
    }
}
declare module uniLib {
    class HttpClient {
        loginUrl: string;
        private loginCallBackFunction;
        private loginFailFunction;
        private loginCallBackObj;
        private gatewayUrl;
        constructor(url: string);
        /**
         * 平台登陆
         */
        platLogin(callBack?: Function, loginFail?: Function, thisObj?: any): void;
        /**
         * 登陆
         */
        private login(platInfo?);
        private initLogin(msg?);
        /**
         * 登陆成功回调
         */
        private loginSuccess(data?);
        /**
         * 缓存登陆信息
         */
        private cacheLoginInfo(info);
        /**
         * 选区
         */
        private selectZone(zoneId, callback?, thisObj?);
        /**
         * 发送数据
         */
        send(url: string, message: any, callback?: Function, thisObj?: any): void;
        /**
         * 发送数据
         */
        private sendTo(url, method, message, callback?, thisObj?);
        /**
         * HTTP 回调
         */
        private onHttpComplete(url, response, callback?, thisObj?);
        private onHttpError(url, response);
    }
}
declare module uniLib {
    class JsonSocket {
        private plat;
        private wsurl;
        private isConnected;
        private isConnecting;
        private needReconnect;
        private reconnectTimes;
        private maxCeconnectTimes;
        private lastRecvTime;
        private connectingTimeout;
        private socketLoginSuc;
        private socketLoginFail;
        private socketLoginObj;
        private socket;
        private sendCache;
        private timerActive;
        private timerPing;
        loginData: any;
        constructor(url: string, plat: Plat);
        getSocket(): WebSocket;
        login(onLogin?: Function, onLoginFail?: Function, thisObj?: any): void;
        private connect();
        private reConnect();
        private onCloseConnect();
        close(needreconnect?: boolean): void;
        sendPlat(message: any): void;
        send(message: any): void;
        private sockSend(data);
        private parseData(data);
        private dispatch(message);
        private sendPing();
        private onTickActive();
        private checkNeedReconnect();
        private onSocketOpen();
        private onReceiveMessage(event);
        private onSocketClose();
        private onSocketError();
    }
}
declare module uniLib {
    class Plat {
        private static _instance;
        static isCacheToken: boolean;
        static platInfo: Cmd.PlatInfo;
        static platTokenInfo: Cmd.PlatTokenLoginReturn;
        static gameId: number;
        static zoneId: number;
        static platId: number;
        static UID: number;
        static PlatKey: string;
        static PlatToken: string;
        static readonly instance: Plat;
        static setPlatToken(info: Cmd.PlatTokenLoginReturn): void;
        static getPlatToken(): Cmd.PlatTokenLoginReturn;
        static initPlatInfo(platInfo?: Cmd.PlatInfo): Cmd.PlatInfo;
        private loginUrl;
        private http;
        private ws;
        /**
         * 初始化平台网络
         */
        init(url: string, callBack?: Function, loginFail?: Function, thisObj?: any): void;
        initSocket(sockSucc?: Function, sockFail?: Function, thisObj?: any): void;
        closeSocket(): void;
        logout(kickoutMssage?: any): void;
        httpSend(message: any, callback?: Function, thisObj?: any): void;
        tcpSend(message: any): void;
    }
}
declare module uniLib {
    class AdConfig {
        static itemDataList: Array<AdItemData>;
        static firstEnterMisTouch: boolean;
        static checkBoxMistouch: boolean;
        static checkBoxProbabilitys: number[];
        static autoBannerShowTime: number;
        static autoBannerLimit: number;
        static gameConfig: any;
    }
}
declare module uniLib {
    class ServerProxy extends Proxy {
        private static _instance;
        static NAME: string;
        constructor();
        static getInstance(): ServerProxy;
        initServer(): void;
        loginOut(kickoutMssage?: any): void;
        /**
         * http平台登录完成
         */
        private onHttpInitSucc(obj);
        onHttpInitFail(rev: any): boolean;
        /**
         * socket连接完成
         */
        private onSockInitSucc();
        sendData(obj: any): void;
        onSockInitFail(): boolean;
        private onConnectFail();
        onRemove(): void;
        private onLoginServer();
        private onLogin(msg?);
    }
}
declare module uniLib {
    class PhysicsTool {
        private static _instance;
        static AUTO_INCREMENT_BODY_ID: number;
        private debugSprite;
        private DEBUG_COLOR_D_SLEEP;
        private DEBUG_COLOR_D_WAKE;
        private DEBUG_COLOR_K;
        private DEBUG_COLOR_S;
        private _world;
        static instance: PhysicsTool;
        static init(debugLayer?: egret.DisplayObjectContainer): p2.World;
        static destroy(): void;
        static world: p2.World;
        static measureVertices(vertices: number[][]): number[];
        constructor();
        init(debugLayer?: egret.DisplayObjectContainer): void;
        release(): void;
        createBody(options?: any): p2.Body;
        createPlanes(left?: number, right?: number, top?: number, bottom?: number): p2.Body[];
        createBoxBody(resName?: string, container?: egret.DisplayObjectContainer, options?: any, defaultWidth?: number, defaultHeight?: number, anchor?: number[], touchEnabled?: boolean): p2.Body;
        createCircleBody(resName?: string, container?: egret.DisplayObjectContainer, options?: any, defaultRadius?: number, anchor?: number[], touchEnabled?: boolean): p2.Body;
        createCapsuleBody(resName?: string, container?: egret.DisplayObjectContainer, options?: any, defaultRadius?: number, defaultLength?: number, anchor?: number[], touchEnabled?: boolean): p2.Body;
        createConvexBody(vertices: number[][], keyPoint: number[], resName?: string, container?: egret.DisplayObjectContainer, options?: any, touchEnabled?: boolean): p2.Body;
        createConvexBodies(verticesList: number[][][], keyPoint: number[], resName?: string, container?: egret.DisplayObjectContainer, options?: any, touchEnabled?: boolean, touchSize?: number): p2.Body;
        destroyBody(body: p2.Body): void;
        findBody(id: number): p2.Body;
        update(dt: number): void;
        draw(): void;
        private drawDebug();
        private drawDebugCircle(shape, b);
        private drawDebugCapsule(shape, b);
        private drawDebugLine(shape, b);
        private drawDebugParticle(shape, b);
        private drawDebugConvex(shape, b);
        private drawDebugPlane(shape, b);
        private drawDebugHeightfield(shape, b);
        private getDebugColor(b);
    }
}
declare module uniLib {
    class NativeObject {
        cmd: string;
        code: number;
        msg: string;
        data: any;
    }
    class NativeGameSdk {
        static SENDTONATIVE: string;
        static SENDTOJS: string;
        static INIT: string;
        static LOGIN: string;
        static LOGOUT: string;
        static SHARE: string;
        static EXITGAME: string;
        static OPENWEB: string;
        static NATIVECOPY: string;
        static GETNATIVEBOARD: string;
        static NETSTATE: string;
        static SHOW_INTERSTITIALAD: string;
        static CLOSE_INTERSTITIALAD: string;
        private static _callBacks;
        static isInited: boolean;
        static callNative(data: any): void;
        static onNativeMessage(value: string): void;
        static init(callback?: Function, thisObj?: any): void;
        static login(callback?: Function, thisObj?: any, loginData?: any): void;
        static logout(): void;
        static exit(): void;
        static getNaviveBoard(callback: Function, thisObj?: any): void;
        static nativeCopyStr(str: string): void;
        static openWeb(webUrl: string): void;
        static showInterstitialAd(action: number, callback?: Function, thisObj?: any): void;
    }
}
declare module uniLib {
    class NativePlatform implements Platform {
        init(callback?: Function, thisObj?: any): void;
        login(userData?: any, callback?: Function, thisObj?: any): void;
        logout(callback?: Function, thisObj?: any): void;
        openWeb(webUrl: string): void;
        showAutoBanner(callback?: Function, thisObj?: any): void;
        showBannerAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        hideBannerAdvertisement(userData?: any): void;
        showInterstitialAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        showNativeAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        showVideoAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        showAppBoxAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        downloadResource(url: string, name: string, callback?: Function, callbackProgress?: Function, thisObj?: any): void;
        clearResCache(): void;
        exitApp(): void;
        customInterface(funcName: string, userData?: any, callback?: Function, thisObj?: any): void;
    }
}
declare module uniLib {
    interface Platform {
        init(callback?: Function, thisObj?: any, userData?: any): any;
        login(userData?: any, callback?: Function, thisObj?: any): any;
        logout(callback?: Function, thisObj?: any): any;
        openWeb(webUrl: string): any;
        showAutoBanner(callback?: Function, thisObj?: any): any;
        showBannerAdvertisement(userData?: any, callback?: Function, thisObj?: any): any;
        hideBannerAdvertisement(userData?: any): any;
        showInterstitialAdvertisement(userData?: any, callback?: Function, thisObj?: any): any;
        showNativeAdvertisement(userData?: any, callback?: Function, thisObj?: any): any;
        showVideoAdvertisement(userData?: any, callback?: Function, thisObj?: any): any;
        showAppBoxAdvertisement(userData?: any, callback?: Function, thisObj?: any): any;
        downloadResource(url: string, name: string, callback?: Function, callbackProgress?: Function, thisObj?: any): any;
        clearResCache(): any;
        exitApp(): any;
        customInterface(funcName: string, userData?: any, callback?: Function, thisObj?: any): any;
    }
}
declare class SystemInfo {
    /** 手机品牌*/
    brand: string;
    /** 手机型号*/
    model: string;
    /**	设备像素比 */
    pixelRatio: number;
    /** 屏幕宽度*/
    screenWidth: number;
    /** 屏幕高度*/
    screenHeight: number;
    /** 可使用窗口宽度*/
    windowWidth: number;
    /** 可使用窗口高度*/
    windowHeight: number;
    /** 微信设置的语言*/
    language: string;
    /** 微信版本号*/
    version: string;
    /** 操作系统版本*/
    system: string;
    /** 客户端平台*/
    platform: string;
    /** 用户字体大小设置。以“我-设置 - 通用 - 字体大小”中的设置为准，单位 px。*/
    fontSizeSetting: number;
    /** 客户端基础库版本*/
    SDKVersion: string;
    /** 性能等级*/
    benchmarkLevel: number;
    /** 电量，范围 1 - 100*/
    battery: number;
    /** wifi 信号强度，范围 0 - 4 */
    wifiSignal: number;
}
interface OpenDataContext {
    /**
     * 向开放数据域发送消息
     */
    postMessage(message: {}): void;
}
declare const wx: {
    /**
     * 获取开放数据域
     */
    getOpenDataContext(): OpenDataContext;
    /**
     * 获取系统信息
     */
    getSystemInfoSync(): SystemInfo;
    /**
     * 创建 banner 广告组件
     */
    createBannerAd(object: {
        adUnitId: string;
        adIntervals: number;
        style: any;
    }): BannerAd;
    /**
     * 创建激励视频广告组件
     */
    createRewardedVideoAd(object: {
        adUnitId: string;
    }): RewardedVideoAd;
    /**
     * 创建插屏广告组件
     */
    createInterstitialAd(object: {
        adUnitId: string;
    }): InterstitialAd;
};
declare const tt: {
    getSystemInfoSync(): SystemInfo;
    /**
     * 创建 banner 广告组件
     */
    createBannerAd(object: {
        adUnitId: string;
        adIntervals: number;
        style: any;
    }): BannerAd;
    /**
     * 创建激励视频广告组件
     */
    createRewardedVideoAd(object: {
        adUnitId: string;
    }): RewardedVideoAd;
    /**
     * 创建插屏广告组件
     */
    createInterstitialAd(object: {
        adUnitId: string;
    }): InterstitialAd;
};
interface BannerAd {
    style: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    /**
     * 显示 banner 广告
     */
    show(): any;
    /**
     * 隐藏 banner 广告
     */
    hide(): any;
    /**
     * 销毁 banner 广告
     */
    destroy(): any;
    /**
     * 监听 banner 广告尺寸变化事件
     */
    onResize(callback?: any): any;
    /**
     * 取消监听 banner 广告尺寸变化事件
     */
    offResize(callback?: any): any;
    /**
     * 监听 banner 广告加载事件
     */
    onLoad(callback?: any): any;
    /**
     * 取消监听 banner 广告加载事件
     */
    offLoad(callback?: any): any;
    /**
     * 监听 banner 广告错误事件
     */
    onError(callback?: any): any;
    /**
     * 取消监听 banner 广告错误事件
     */
    offError(callback?: any): any;
}
interface RewardedVideoAd {
    /**
     * 加载激励视频广告
     */
    load(): any;
    /**
     * 销毁激励视频广告实例
     */
    destroy(): any;
    /**
     * 监听激励视频广告加载事件
     */
    onLoad(callback?: any): any;
    /**
     * 取消监听激励视频广告加载事件
     */
    offLoad(callback?: any): any;
    /**
     * 监听用户点击 关闭广告 按钮的事件
     */
    onClose(callback?: any): any;
    /**
     * 取消监听用户点击 关闭广告 按钮的事件
     */
    offClose(callback?: any): any;
    /**
     * 监听激励视频错误事件
     */
    onError(callback?: any): any;
    /**
     * 取消监听激励视频错误事件
     */
    offError(callback?: any): any;
    /**
     * 显示激励视频广告
     */
    show(): any;
}
interface InterstitialAd {
    /**
     * 显示插屏广告
     */
    show(): any;
    /**
     * 加载插屏广告
     */
    load(): any;
    /**
     * 销毁插屏广告实例
     */
    destroy(): any;
    /**
     * 监听插屏广告加载事件
     */
    onLoad(callback?: any): any;
    /**
     * 取消监听插屏广告加载事件
     */
    offLoad(callback?: any): any;
    /**
     * 监听插屏广告关闭事件
     */
    onClose(callback?: any): any;
    /**
     * 取消监听插屏广告关闭事件
     */
    offClose(callback?: any): any;
    /**
     * 监听插屏错误事件
     */
    onError(callback?: any): any;
    /**
     * 取消监听插屏错误事件
     */
    offError(callback?: any): any;
}
/**
 * 字节平台的录屏管理器
 */
interface GameRecorderManager {
    /**
     * 开始录屏
     */
    start(options: {
        duration: number;
    }): any;
    /**
     * 暂停录屏
     */
    pause(): any;
    /**
     * 停止录屏
     */
    stop(): any;
    /**
     * 暂停录屏
     */
    pause(): any;
    /**
     * 继续录屏
     */
    resume(): any;
    /**
     * 监听录屏开始事件
     */
    onStart(callback: Function): any;
    /**
     * 监听录屏结束事件，可以获得录屏地址。
     */
    onStop(callback: Function): any;
    /**
     * 监听录屏错误事件
     */
    onError(callback: Function): any;
}
declare let platform: uniLib.Platform;
interface Window {
    platform: uniLib.Platform;
}
declare module uniLib {
    class WebPlatform implements Platform {
        init(callback?: Function, thisObj?: any): void;
        login(userData?: any, callback?: Function, thisObj?: any): void;
        logout(callback?: Function, thisObj?: any): void;
        openWeb(webUrl: string): void;
        showAutoBanner(callback?: Function, thisObj?: any): void;
        showBannerAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        hideBannerAdvertisement(userData?: any): void;
        showInterstitialAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        showNativeAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        showVideoAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        showAppBoxAdvertisement(userData?: any, callback?: Function, thisObj?: any): void;
        downloadResource(url: string, name: string, callback?: Function, callbackProgress?: Function, thisObj?: any): void;
        clearResCache(): void;
        exitApp(): void;
        customInterface(funcName: string, userData?: any, callback?: Function, thisObj?: any): void;
    }
}
declare module uniLib {
    class BrowersUtils {
        static reload(): void;
        static redirect(url: string): void;
        /**
         * 是否在微信中打开
         */
        static isWechat(): boolean;
        static isAndroid(): boolean;
        static GetRequest(name: string, str?: string): any;
        static GetRequests(s?: string): any;
    }
}
declare module uniLib {
    enum LOGLEVEL {
        DEBUG = 0,
        INFO = 1,
        WARN = 2,
        ERROR = 3,
        OFF = 4,
    }
    class Console {
        static isDevMode: boolean;
        private static LOG_LEVEL_STR;
        /**
         * 日志级别
         */
        private static LogLevel;
        static setLogLevel(level: LOGLEVEL): void;
        static init(bDevMode: boolean, logLevel?: LOGLEVEL): void;
        static log(message?: any, ...params: any[]): void;
        static debug(message?: any, ...params: any[]): void;
        static info(message?: any, ...params: any[]): void;
        static warn(message?: any, ...params: any[]): void;
        static error(message?: any, ...params: any[]): void;
    }
}
declare module uniLib {
    /**
     * 计算类
    */
    class MathUtil {
        static pow(n?: number): number;
        static vectorRotation(p: egret.Point, n: number): egret.Point;
        static disTest(p1: egret.Point, n1: number, p2: egret.Point, n2?: number): boolean;
        /**
         * 两个整数间随机随机数
         * @min: 最小数
         * @max: 最大数
         */
        static random(min: number, max: number): number;
        /**
        * 两个整数间随机随机数,包含min和max
        * @min: 最小数
        * @max: 最大数
        */
        static RandomNumBoth(Min: any, Max: any): any;
        /**
         * 从probList概率表中抽取一个概率返回抽中的probList索引
         */
        static randomProbability(probList: number[]): number;
        static randArray(array: any): any;
        /**
         * 检测一个点是否在圆内
         * centerX centerY radius 圆心以及半径
         * x y需要判断的x y 坐标
         */
        static pointIsInRound(centerX: number, centerY: number, radius: number, x: number, y: number): boolean;
        /**
         * 二分法从数组中找数据 indexOf
         */
        static binary(find: number, arr: Array<number>, low: number, high: number): number;
        /**
        * 获取字符串实际长度
        */
        static getStrRealLength(str: string): number;
    }
}
declare class md5 {
    protected hexcase: number;
    protected b64pad: string;
    constructor();
    hex_md5(s: string): string;
    b64_md5(s: string): string;
    any_md5(s: string, e: string): string;
    hex_hmac_md5(k: string, d: string): string;
    b64_hmac_md5(k: string, d: string): string;
    any_hmac_md5(k: string, d: string, e: string): string;
    md5_vm_test(): boolean;
    protected rstr_md5(s: string): string;
    protected rstr_hmac_md5(key: string, data: string): string;
    protected rstr2hex(input: string): string;
    protected rstr2b64(input: string): string;
    protected rstr2any(input: string, encoding: string): string;
    protected str2rstr_utf8(input: string): string;
    protected str2rstr_utf16le(input: string): string;
    protected str2rstr_utf16be(input: any): string;
    protected rstr2binl(input: string): Array<number>;
    protected binl2rstr(input: Array<number>): string;
    protected binl_md5(x: any, len: number): Array<number>;
    protected md5_cmn(q: number, a: number, b: number, x: number, s: number, t: number): number;
    protected md5_ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number;
    protected md5_gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number;
    protected md5_hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number;
    protected md5_ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number;
    protected safe_add(x: number, y: number): number;
    protected bit_rol(num: number, cnt: number): number;
}
declare module uniLib {
    /**
     * 屏幕工具类
     */
    class ScreenUtils {
        private static scaleMode;
        static scaleFactor: number;
        static landscape: boolean;
        static init(scale: string): void;
        static onResizeNotify(): void;
        static resetScaleMode(): void;
    }
}
declare module uniLib {
    class ShakeTool {
        private static _instance;
        static readonly instance: ShakeTool;
        private checkForMinimumValues;
        private minShakeValue;
        private minRotationValue;
        /**
         * 屏幕震动
         * @param camera 震动对象
         * @param numberOfShakes 震动次数
         * @param seed   x,y轴的震动系数[-1,1]
         * @param shakeAmount  x,y轴的震动量级
         * @param rotationAmount  旋转量级  如果小于0表示:不旋转
         * @param distance   震动x.y轴的最大偏移量
         * @param speed 如果速度越快，则振幅越剧烈
         * @param decay 振幅的递减系数
         * @param endCallBack 结束回调
         *
         */
        shakeScreen(camera: egret.DisplayObject, numberOfShakes?: number, seed?: egret.Point, shakeAmount?: egret.Point, rotationAmount?: number, distance?: number, speed?: number, decay?: number): void;
        /**
         * 屏幕震动
         * @param camera 震动对象
         * @param numberOfShakes 震动次数
         * @param seed   x,y轴的震动系数[-1,1]
         * @param shakeAmount  x,y轴的震动量级
         * @param rotationAmount  旋转量级  如果小于0表示:不旋转
         * @param distance   震动x.y轴的最大偏移量
         * @param speed 如果速度越快，则振幅越剧烈
         * @param decay 振幅的递减系数
         * @param endCallBack 结束回调
         *
         */
        doShake_Internal(cam: egret.DisplayObject, numberOfShakes: number, seed: egret.Point, shakeAmount: egret.Point, rotationAmount: number, distance: number, speed: number, decay: number, endCallBack?: Function): void;
    }
}
declare module uniLib {
    class Utils {
        static stringIsNullOrEmpty(value: string): boolean;
        static MD5(message: string): string;
        static ltrim(s: string): string;
        static rtrim(s: string): string;
        static trim(s: string): string;
        static sTrim(str: string): string;
        /**
         * 是否网络地址
         */
        static isNetUrl(url: string): boolean;
        static checkPhone(tel: string): boolean;
        static checkEmail(email: string): boolean;
        static setLocalStorage(key: string, value: string): void;
        static getLocalStorage(key: string, defaultValue?: string): string;
        static clearLocalStorage(key: string): void;
        /**
         * 创建影片剪辑
         */
        static creatMovieClip(jsonStr: string, pngStr: string, action?: string, frameRate?: number): egret.MovieClip;
        static lerp(fromNum: number, toNum: number, prop: number): number;
        static scrollNumber(label: {
            text: string;
            scaleX: number;
            scaleY: number;
            alpha: number;
        }, fromNum: number, toNum: number, totalTm: number, isThousandFormat?: boolean, scaleProp?: number, cb?: any, intervalTime?: number, delayCBTime?: number): {
            stopCB: () => void;
        };
    }
}
