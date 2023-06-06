module game 
{
    export class SiginView extends ui.BaseUI
    {
        private closeLayer:eui.Group;

        private totalSinginLabel:eui.Label;

        private closeBtn:eui.Button;
        private doubleReceiveBtn:eui.Button;
        private receiveBtn:eui.Button;

        private isVideoShowed:boolean = false;
        private showVideoTimeout:number;

        private misTouchLayer:eui.Group;
        private misTouchLayerInitVertical:number;
        private isStartMisTouching:boolean = false;

        private closeCallback:Function;
        private closeCallbackTarget:any;

        public constructor(callback?:Function, callbackTarget?:any) 
        {
            super();
            this.skinName = new SiginViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            this.closeCallback = callback;
            this.closeCallbackTarget = callbackTarget;
            if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
            this.init();
        }

        public destroy(): void 
        {
            if(uniLib.Global.isVivogame) window.platform.showNativeAdvertisement();
            this.isStartMisTouching = false;
            ui.AdMisTouchManager.instance.stopMisTouchPos(this.misTouchLayer);

            if(this.closeCallback)
            {
                this.closeCallback.call(this.closeCallbackTarget);
                this.closeCallback = null;
                this.closeCallbackTarget = null;
            }

            super.destroy();
            
        }

        //-----------------------------------------------------------------------------
        addUIListener(): void 
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }
        removeUIListener(): void 
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        //-----------------------------------------------------------------------------
        private init()
        {
            let querySignResult:boolean = GameInfo.instance.querySigninTime(); // true 今天未签到 , false 今天已签到

            this.receiveBtn.visible = querySignResult;
            this.doubleReceiveBtn.visible = querySignResult;

            if(querySignResult)
            {
                this.misTouchLayer.visible = true;
                this.startMisTouchPos();
            }
            else
            {
                uniLib.AdPlat.instance.showBanner();
                this.misTouchLayer.visible = true;
                this.misTouchLayer.touchEnabled = false;
                this.misTouchLayer.alpha = 0;
                let self = this;
                egret.Tween.get(this.misTouchLayer).wait(2000).to({alpha:1},250).call(()=>{
                    self.misTouchLayer.touchEnabled = true;
                }, this);
            }

            this.totalSinginLabel.text = "已累计签到" + GameInfo.instance.totalSigninDays.toString() + "天";

            let signinRewards:any[] = GameInfo.instance.signinRewards;

            let isShowSelectedFrame:boolean = false;

            for(let i = 0; i < 6; i++)
            {
                let day = i+1;
                let name = "signDayBtn" + day;
                let button:eui.Button = this.skin[name];

                let data:number[] = signinRewards[i];

                button.skin["dayImage"].source = "di" + day + "tian";
                button.skin["markRect"].visible = false;
                button.skin["finished"].visible = false;

                let valueLabel:eui.BitmapLabel = button.skin["valueLabel"];
                let iconImage:eui.Image = button.skin["icon"];

                if(GameInfo.instance.signinDays >= day)
                {
                    button.skin["markRect"].visible = true;
                    button.skin["finished"].visible = true;
                    // GX.setGray(button);
                }
                else
                {
                    if(querySignResult && !isShowSelectedFrame)
                    {
                        // 今天未签到
                        isShowSelectedFrame = true;
                    }
                }
                
                if(data[0] == 1)
                {
                    // 金币
                    valueLabel.text = "x" + data[1];
                    iconImage.source = "gold";
                }
            }
        }

        //-----------------------------------------------------------------------------
        private onClickTap(e: egret.TouchEvent)
        {
            if (e.target == this.closeBtn || e.target == this.closeLayer) 
            {
                GX.PopUpManager.removePopUp(this);
            }
            else if (e.target == this.receiveBtn || e.target == this.misTouchLayer) 
            {
                if(this.isStartMisTouching) return;
                this.receiveRewards(1);
            }
            else if (e.target == this.doubleReceiveBtn) 
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
                GX.Tips.showTips("获取奖励失败");
            }
            else
            {
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        }

        //-----------------------------------------------------------------------------
        private receiveRewards(chipsMultiple:number)
        {
            let reward:number[] = GameInfo.instance.signinRewards[GameInfo.instance.signinDays];
            
            GameInfo.instance.updateSigninTime();

            let rewardChips:number = 0;
            let rewardKeys:number = 0;

            if(reward[0] == 1)
            {
                rewardChips = reward[1] * chipsMultiple;
                GameInfo.instance.curChips = GameInfo.instance.curChips + rewardChips;
            }
            else if(reward[0] == 3)
            {
                // 7日大礼包
                rewardChips = reward[1] * chipsMultiple;
                GameInfo.instance.curChips = GameInfo.instance.curChips + rewardChips;
            }

            uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);

            GameInfo.save();

            GX.PopUpManager.removePopUp(this);
        }

        //-----------------------------------------------------------------------------
        private startMisTouchPos()
        {
            this.isStartMisTouching = false;

            if(ui.AdMisTouchManager.instance.startMisTouchPos(this.misTouchLayer, this.onStopMisTouchPos, this))
            {
                this.isStartMisTouching = true;
                this.misTouchLayerInitVertical = this.misTouchLayer.verticalCenter;
                this.misTouchLayer.verticalCenter = uniLib.Global.screenHeight * 0.5 - this.misTouchLayer.height - 80;
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

    }

}