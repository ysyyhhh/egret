module game 
{
    export class RewardView extends ui.BaseUI
    {
        private bg:eui.Image;

        private closeLayer:eui.Button;

        private chipsIcon:eui.Image;

        private chipsLabel:eui.BitmapLabel;

        private winChips:number;

        private eventName:string;
        private delayTime:number;
        private timeout:number;

        private isShowReceiveBtn:boolean;
        private receiveBtn:eui.Button;
        private doubleReceiveBtn:eui.Button;
        private misTouchLayer:eui.Group;
        private misTouchLayerInitVertical:number;
        private isStartMisTouching:boolean = false;

        private isVideoShowed:boolean = false;
        private showVideoTimeout:number;

        private closedCallback:Function;
        private closedCallbackTarget:any;
        private closedCallbackParmas:any;

        constructor(winChips:number, eventname?:string, delay?:number, isShowReceiveBtn?:boolean)
        {
            super();
            this.skinName = new RewardViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();

            this.winChips = winChips;

            this.isShowReceiveBtn = isShowReceiveBtn ? true : false;

            if(null == eventname) eventname = "close";
            if(null == delay) delay = 3000;

            if(this.isShowReceiveBtn) 
            {
                delay = 0;
                this.misTouchLayer.visible = true;
                this.doubleReceiveBtn.visible = true;
                this.startMisTouchPos();
            }
            else
            {
                this.misTouchLayer.visible = false;
                this.doubleReceiveBtn.visible = false;
                uniLib.AdPlat.instance.showBanner();
            }

            this.eventName = eventname;
            this.delayTime = delay;

            this.init();
        }

        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        public setCloseCallback(callback:Function, thisObj?:any, params?:any)
        {
            this.closedCallback = callback;
            this.closedCallbackTarget = thisObj;
            this.closedCallbackParmas = params;
        }

        private init()
        {
            this.chipsIcon.visible = false;
            this.chipsLabel.visible = false;

            if(this.winChips > 0)
            {
                this.chipsIcon.visible = true;
                this.chipsLabel.visible = true;
                this.chipsLabel.text = "x" + this.winChips.toString();
            }

            egret.Tween.get(this.bg, {loop:true}).to({rotation:360}, 3000);

            if(this.delayTime > 0)
            {
                this.timeout = egret.setTimeout(this.doEvent, this, this.delayTime);
            }
        }

        public destroy()
        {
            this.isStartMisTouching = false;
            ui.AdMisTouchManager.instance.stopMisTouchPos(this.misTouchLayer);
            egret.Tween.removeTweens(this.bg);
            uniLib.AdPlat.instance.hideBanner();
            super.destroy();
        }

        private doEvent(forceClose?:boolean)
        {
            if(this.timeout)
            {
                egret.clearTimeout(this.timeout);
                this.timeout = null;
            }
            
            if(this.eventName == "close")
            {
                if(forceClose)
                {
                    if(this.closedCallback)
                    {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
                else if(!this.isShowReceiveBtn)
                {
                    if(this.closedCallback)
                    {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
            }
            else if(this.eventName == "enterNextScene")
            {
                if (this.closedCallback) 
                {
                    this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                }
                this.closedCallback = null;
                this.closedCallbackTarget = null;
                this.closedCallbackParmas = null;
                GX.PopUpManager.removePopUp(this);

                let gameScene:GameScene = uniLib.SceneManager.instance.currentScene as GameScene;
                gameScene.loadNextSceneLevel();
                
            }
            else
            {
                if(forceClose)
                {
                    if(this.closedCallback)
                    {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
                else if(!this.isShowReceiveBtn)
                {
                    if(this.closedCallback)
                    {
                        this.closedCallback.call(this.closedCallbackTarget, this.closedCallbackParmas);
                    }
                    this.closedCallback = null;
                    this.closedCallbackTarget = null;
                    this.closedCallbackParmas = null;
                    GX.PopUpManager.removePopUp(this, GX.PopUpEffect.CENTER);
                }
            }
        }

        private receiveRewards(chipsMultiple:number)
        {
            this.winChips = this.winChips * chipsMultiple;

            GameInfo.instance.curChips = GameInfo.instance.curChips + this.winChips;
            GameInfo.save();
            uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);

            this.doEvent(true);
            
        }

        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.closeLayer)
            {
                this.doEvent();
            }
            else if(e.target == this.doubleReceiveBtn)
            {
                let self = this;
                if (!this.isVideoShowed) {
                    this.isVideoShowed = true;
                    uniLib.SoundMgr.instance.pauseBgMusic();
                    if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                    else uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                    this.showVideoTimeout = egret.setTimeout(() => {
                        self.isVideoShowed = false;
                        if (self.showVideoTimeout) {
                            egret.clearTimeout(self.showVideoTimeout);
                            self.showVideoTimeout = null;
                        }
                    }, this, 3000);
                }
            }
            else if(e.target == this.receiveBtn)
            {
                if(this.isStartMisTouching) return;
                this.receiveRewards(1);
            }
            else
            {
                if(!this.isShowReceiveBtn)
                {
                    this.doEvent();
                }
            }
        }



        private startMisTouchPos()
        {
            this.isStartMisTouching = false;

            if(ui.AdMisTouchManager.instance.startMisTouchPos(this.misTouchLayer, this.onStopMisTouchPos, this))
            {
                this.isStartMisTouching = true;
                this.misTouchLayerInitVertical = this.misTouchLayer.verticalCenter;
                this.misTouchLayer.verticalCenter = uniLib.Global.screenHeight * 0.5 - this.misTouchLayer.height - 80;
            }
            else
            {
                uniLib.AdPlat.instance.showBanner();
                this.misTouchLayer.visible = true;
                this.misTouchLayer.touchChildren = false;
                this.misTouchLayer.alpha = 0;
                let self = this;
                egret.Tween.get(this.misTouchLayer).wait(2000).to({alpha:1},250).call(()=>{
                    self.misTouchLayer.touchChildren = true;
                }, this);
            }
        }

        private onStopMisTouchPos(result:boolean)
        {
            let self = this;
            if(result)
            {
                egret.Tween.get(this.misTouchLayer).to({verticalCenter:this.misTouchLayerInitVertical}, 500).call(()=>{
                    self.isStartMisTouching = false;
                }, this);
            }
        }

        private onVideoAdCallback(status:number)
        {
            uniLib.SoundMgr.instance.resumeBgMusic();
            if(this.showVideoTimeout)
            {
                egret.clearTimeout(this.showVideoTimeout);
                this.showVideoTimeout = null;
            }
            this.isVideoShowed = false;
            if(status == 1)
            {
                this.receiveRewards(2);
            }
            else if(status == 0)
            {
                // 视频未看完
                GX.Tips.showTips("看完视频才能领取");
            }
            else
            {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        }

    }
}