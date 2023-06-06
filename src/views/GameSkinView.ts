module game 
{
    export class GameSkinView extends ui.BaseUI
    {
        private closeBtn:eui.Button;
        private chipsGetBtn:eui.Button;
        private freeGetBtn:eui.Button;

        private bgStateOpenBtn:eui.Button;
        private skinStateCloseBtn:eui.Button;
        private bgScroller:eui.Scroller;
        private bgList:eui.List;
        private bgItemListArrayCollection: eui.ArrayCollection;

        private bgStateCloseBtn:eui.Button;
        private skinStateOpenBtn:eui.Button;
        private mantleScroller:eui.Scroller;
        private mantleList:eui.List;
        private mantleItemListArrayCollection: eui.ArrayCollection;

        private curPage:number = 0; // 1:背景页面， 2：皮肤页面
        private curSelectedBgId:number = 0;
        private curSelectedMantleId:number = 0;

        private isVideoShowed:boolean = false;
        private showVideoTimeout:number;

        private checkBoxGroup:eui.Group;
        private videoCheckBox: eui.CheckBox;
        private clickCheckBoxTimes:number;

        constructor()
        {
            super();
            this.skinName = new GameSkinViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            uniLib.AdPlat.instance.showBanner();
            this.init();
        }

        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.bgList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedBgItem, this);
            this.mantleList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedMantleItem, this);
            uniLib.EventListener.getInstance().addEventListener("event_notify_bgitem_selected", this.notifySelectedBgItem, this);
            uniLib.EventListener.getInstance().addEventListener("event_notify_mantleitem_selected", this.notifySelectedMantleItem, this);
        }

        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            this.bgList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedBgItem, this);
            this.mantleList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onSelectedMantleItem, this);
            uniLib.EventListener.getInstance().removeEventListener("removeEventListener", this.notifySelectedBgItem, this);
            uniLib.EventListener.getInstance().removeEventListener("event_notify_mantleitem_selected", this.notifySelectedMantleItem, this);
        }

        destroy() 
        {
            uniLib.AdPlat.instance.hideBanner();
            super.destroy();
        }

        //-----------------------------------------------------------------------------
        private init()
        {
            this.clickCheckBoxTimes = 0;
            this.videoCheckBox.currentState = "up";
            this.videoCheckBox.skin["checkImage"].visible = true;
            this.checkBoxGroup.visible = true;

            this.bgItemListArrayCollection = new eui.ArrayCollection([]);
            this.bgItemListArrayCollection.replaceAll(TableData.tableBackgroundConfig);
            this.bgList.dataProvider = this.bgItemListArrayCollection;
            this.bgList.itemRenderer = BgItemRender;

            this.mantleItemListArrayCollection = new eui.ArrayCollection([]);
            this.mantleItemListArrayCollection.replaceAll(TableData.tableSkinConfig);
            this.mantleList.dataProvider = this.mantleItemListArrayCollection;
            this.mantleList.itemRenderer = MantleItemRender;

            this.chipsGetBtn.visible = false;
            this.freeGetBtn.visible = true;

            this.chipsGetBtn.skin["chipsLabel"].text = "200";

            this.switchPage(2);
        }

        //-----------------------------------------------------------------------------
        private switchPage(page:number)
        {
            this.bgStateOpenBtn.visible = false;
            this.skinStateCloseBtn.visible = false;
            this.bgScroller.visible = false;
            this.bgStateOpenBtn.touchEnabled = false;
            this.skinStateCloseBtn.touchEnabled = false;

            this.bgStateCloseBtn.visible = false;
            this.skinStateOpenBtn.visible = false;
            this.mantleScroller.visible = false;
            this.bgStateCloseBtn.touchEnabled = false;
            this.skinStateOpenBtn.touchEnabled = false;

            this.curPage = page;

            if(page == 1)
            {
                this.bgStateOpenBtn.visible = true;
                this.skinStateCloseBtn.visible = true;
                this.bgScroller.visible = true;
                this.skinStateCloseBtn.touchEnabled = true;

                let lockList = GameInfo.instance.getLockBackgroundList();
                if(lockList.length > 0)
                {
                    this.clickCheckBoxTimes = 0;
                    this.videoCheckBox.currentState = "up";
                    this.videoCheckBox.skin["checkImage"].visible = true;
                    this.checkBoxGroup.visible = true;
                    this.freeGetBtn.visible = true;
                }
                else
                {
                    this.checkBoxGroup.visible = false;
                    this.freeGetBtn.visible = false;
                }
            }
            else if(page == 2)
            {
                this.bgStateCloseBtn.visible = true;
                this.skinStateOpenBtn.visible = true;
                this.mantleScroller.visible = true;
                this.bgStateCloseBtn.touchEnabled = true;

                let lockList = GameInfo.instance.getLockSkinList();
                if(lockList.length > 0)
                {
                    this.clickCheckBoxTimes = 0;
                    this.videoCheckBox.currentState = "up";
                    this.videoCheckBox.skin["checkImage"].visible = true;
                    this.checkBoxGroup.visible = true;
                    this.freeGetBtn.visible = true;
                }
                else
                {
                    this.checkBoxGroup.visible = false;
                    this.freeGetBtn.visible = false;
                }
            }
        }

        private setInvalidCheckBox()
        {
            console.log("setInvalidCheckBox", uniLib.AdConfig.checkBoxMistouch, uniLib.AdConfig.checkBoxProbabilitys, this.clickCheckBoxTimes);
            if(uniLib.AdConfig.checkBoxMistouch)
            {
                if(this.videoCheckBox.currentState == "down")
                {
                    this.clickCheckBoxTimes = 0;
                    this.videoCheckBox.currentState = "up"; // 选中
                    this.videoCheckBox.skin["checkImage"].visible = true;

                    this.freeGetBtn.visible = true;
                    this.chipsGetBtn.visible = false;
                }
                else
                {
                    let resultIndex:number = uniLib.MathUtil.randomProbability(uniLib.AdConfig.checkBoxProbabilitys);
                    if(resultIndex == this.clickCheckBoxTimes)
                    {
                        this.clickCheckBoxTimes = 0;
                        this.videoCheckBox.currentState = "down"; // 取消选中
                        this.videoCheckBox.skin["checkImage"].visible = false;

                        this.freeGetBtn.visible = false;
                        this.chipsGetBtn.visible = true;

                        if(uniLib.AdConfig["checkBoxForceAd"])
                        {
                            let self = this;
                            if (!this.isVideoShowed) {
                                this.clickCheckBoxTimes = 0;
                                this.isVideoShowed = true;
                                uniLib.SoundMgr.instance.pauseBgMusic();
                                if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                                else uniLib.AdPlat.instance.showRewardedVideo(this.onVideoAdCallback, this);
                                this.showVideoTimeout = egret.setTimeout(() => {
                                    self.isVideoShowed = false;
                                    if (self.showVideoTimeout) 
                                    {
                                        egret.clearTimeout(self.showVideoTimeout);
                                        self.showVideoTimeout = null;
                                    }
                                }, this, 3000);
                            }
                        }
                        return;
                    }

                    ++this.clickCheckBoxTimes;

                }
            }
            else
            {
                this.clickCheckBoxTimes = 0;
                if(this.videoCheckBox.currentState == "up")
                {
                    this.videoCheckBox.currentState = "down";
                    this.videoCheckBox.skin["checkImage"].visible = false;
                    this.freeGetBtn.visible = false;
                    this.chipsGetBtn.visible = true;
                }
                else
                {
                    this.videoCheckBox.currentState = "up";
                    this.videoCheckBox.skin["checkImage"].visible = true;
                    this.freeGetBtn.visible = true;
                    this.chipsGetBtn.visible = false;
                }
            }
        }

        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.closeBtn || e.target == this.skin["touchLayer"])
            {
                GX.PopUpManager.removePopUp(this);
            }
            else if(e.target == this.skinStateCloseBtn)
            {
                this.switchPage(2);

                for (let i = 0; i < this.mantleList.numElements; i++) 
                {
                    let element: MantleItemRender = this.mantleList.getElementAt(i) as MantleItemRender;
                    if (element && element.data.id == this.curSelectedMantleId) 
                    {
                        element.setSelected(true);
                        break;
                    }
                }
            }
            else if(e.target == this.bgStateCloseBtn)
            {
                this.switchPage(1);

                for (let i = 0; i < this.bgList.numElements; i++) 
                {
                    let element: BgItemRender = this.bgList.getElementAt(i) as BgItemRender;
                    if (element && element.data.id == this.curSelectedBgId) 
                    {
                        element.setSelected(true);
                        break;
                    }
                }
            }
            // else if(e.target == this.applyBtn)
            // {
            //     // 应用皮肤
            //     if(this.curPage == 1)
            //     {
            //         this.onApplyBackgroundSkin();
            //     }
            //     else if(this.curPage == 2)
            //     {
            //         this.onApplyMantleSkin();
            //     }
            // }
            else if(e.target == this.chipsGetBtn)
            {
                // 金币获得皮肤
                let self = this;
                if(this.curPage == 1)
                {
                    let lockList = GameInfo.instance.getLockBackgroundList();

                    if(lockList.length > 0)
                    {
                        uniLib.MathUtil.randArray(lockList);

                        this.curSelectedBgId = lockList[0];

                        let config:table.TableBackgroundConfig = TableData.getBackgroundConfig(this.curSelectedBgId);

                        if(config && config.unlockType == 1 && config.unlockValue > 0)
                        {
                            let needChips = config.unlockValue;
                            needChips = 200;

                            if(needChips > GameInfo.instance.curChips)
                            {
                                GX.Tips.showPopup("当前金币不足，是否确定观看一段视频免费获得皮肤？", ()=>{
                                    if (!self.isVideoShowed) {
                                        self.clickCheckBoxTimes = 0;
                                        self.isVideoShowed = true;
                                        uniLib.SoundMgr.instance.pauseBgMusic();
                                        if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                                        else uniLib.AdPlat.instance.showRewardedVideo(self.onVideoAdCallback, self);
                                        self.showVideoTimeout = egret.setTimeout(() => {
                                            self.isVideoShowed = false;
                                            if (self.showVideoTimeout) {
                                                egret.clearTimeout(self.showVideoTimeout);
                                                self.showVideoTimeout = null;
                                            }
                                        }, self, 3000);
                                    }
                                }, ()=>{}, this, true);
                                return;
                            }

                            GameInfo.instance.curChips = GameInfo.instance.curChips - needChips;
                            if(GameInfo.instance.curChips < 0) GameInfo.instance.curChips = 0;
                            GameInfo.save();
                            uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                            this.onGetBackgroundSkin();
                        }
                    }
                }
                else if(this.curPage == 2)
                {
                    let lockList = GameInfo.instance.getLockSkinList();

                    if(lockList.length > 0)
                    {
                        uniLib.MathUtil.randArray(lockList);

                        this.curSelectedMantleId = lockList[0];

                        let config:table.TableSkinConfig = TableData.getSkinConfig(this.curSelectedMantleId);

                        if(config && config.unlockType == 1 && config.unlockValue > 0)
                        {
                            let needChips = config.unlockValue;

                            if(needChips > GameInfo.instance.curChips)
                            {
                                GX.Tips.showPopup("当前金币不足，是否确定观看一段视频免费获得皮肤？", ()=>{
                                    if (!self.isVideoShowed) {
                                        self.clickCheckBoxTimes = 0;
                                        self.isVideoShowed = true;
                                        uniLib.SoundMgr.instance.pauseBgMusic();
                                        if(uniLib.Global.isVivogame) window.platform.showVideoAdvertisement(null, this.onVideoAdCallback, this);
                                        else uniLib.AdPlat.instance.showRewardedVideo(self.onVideoAdCallback, self);
                                        self.showVideoTimeout = egret.setTimeout(() => {
                                            self.isVideoShowed = false;
                                            if (self.showVideoTimeout) {
                                                egret.clearTimeout(self.showVideoTimeout);
                                                self.showVideoTimeout = null;
                                            }
                                        }, self, 3000);
                                    }
                                }, ()=>{}, this, true);
                                return;
                            }

                            GameInfo.instance.curChips = GameInfo.instance.curChips - needChips;
                            if(GameInfo.instance.curChips < 0) GameInfo.instance.curChips = 0;
                            GameInfo.save();
                            uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_GAME_INFO);
                            this.onGetMantleSkin();
                        }
                    }

                    
                }
                
            }
            else if(e.target == this.freeGetBtn)
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
            else if (e.target == this.checkBoxGroup || e.target == this.videoCheckBox) 
            {
                this.setInvalidCheckBox();
            }
        }

        //-----------------------------------------------------------------------------
        private onSelectedBgItem(e: eui.ItemTapEvent)
        {
            let index:number = e.itemIndex;

            let unlockSkin = false;

            for(let i = 0; i < TableData.tableBackgroundConfig.length; i++)
            {
                if(i == index)
                {
                    let config = TableData.tableBackgroundConfig[i];

                    for(let j = 0; j < GameInfo.instance.openBackgroundIdList.length; j++)
                    {
                        if(GameInfo.instance.openBackgroundIdList[j] == config.id)
                        {
                            unlockSkin = true;
                            break;
                        }
                    }
                }
                
            }

            if(unlockSkin)
            {
                this.selectedBgByIndex(index);
            }

            
        }

        //-----------------------------------------------------------------------------
        private selectedBgByIndex(index:number)
        {
            let itemRender:BgItemRender = this.bgList.getElementAt(index) as BgItemRender;

            if(itemRender)
            {
                for(let i = 0; i < this.bgList.numElements; i++)
                {
                    let element:BgItemRender = this.bgList.getElementAt(i) as BgItemRender;
                    if(element)
                    {
                        element.setSelected(false);
                    }
                }
                itemRender.setSelected(true);
            }
        }

        //-----------------------------------------------------------------------------
        private onSelectedMantleItem(e: eui.ItemTapEvent)
        {
            let index:number = e.itemIndex;

            let unlockSkin = false;

            for(let i = 0; i < TableData.tableSkinConfig.length; i++)
            {
                if(i == index)
                {
                    let config = TableData.tableSkinConfig[i];

                    for(let j = 0; j < GameInfo.instance.openSkinIdList.length; j++)
                    {
                        if(GameInfo.instance.openSkinIdList[j] == config.id)
                        {
                            unlockSkin = true;
                            break;
                        }
                    }
                }
                
            }

            if(unlockSkin)
            {
                this.selectedMantleByIndex(index);
            }

        }

        //-----------------------------------------------------------------------------
        private selectedMantleByIndex(index:number)
        {
            let itemRender:MantleItemRender = this.mantleList.getElementAt(index) as MantleItemRender;

            if(itemRender)
            {
                for(let i = 0; i < this.mantleList.numElements; i++)
                {
                    let element:MantleItemRender = this.mantleList.getElementAt(i) as MantleItemRender;
                    if(element)
                    {
                        element.setSelected(false);
                    }
                }
                itemRender.setSelected(true);
            }
        }

        //-----------------------------------------------------------------------------
        private notifySelectedBgItem(evt: egret.Event)
        {
            let config:table.TableBackgroundConfig = evt.data;
            this.curSelectedBgId = config.id;
            this.onApplyBackgroundSkin();
        }

        //-----------------------------------------------------------------------------
        private notifySelectedMantleItem(evt: egret.Event)
        {
            let config:table.TableSkinConfig = evt.data;
            this.curSelectedMantleId = config.id;
            this.onApplyMantleSkin();
        }

        //-----------------------------------------------------------------------------
        private onGetBackgroundSkin()
        {
            if(this.curSelectedBgId <= 0) return;

            let index:number = -1;

            GameInfo.instance.unlockBackgroundId(this.curSelectedBgId, true);

            for(let i = 0; i < TableData.tableBackgroundConfig.length; i++)
            {
                if(TableData.tableBackgroundConfig[i].id == this.curSelectedBgId)
                {
                    index = i;
                    break;
                }
            }

            if(index != -1)
            {
                this.selectedBgByIndex(index);
            }
        }

        //-----------------------------------------------------------------------------
        private onGetMantleSkin()
        {
            if(this.curSelectedMantleId <= 0) return;

            let index:number = -1;

            GameInfo.instance.unlockSkinId(this.curSelectedMantleId, true);

            for(let i = 0; i < TableData.tableSkinConfig.length; i++)
            {
                if(TableData.tableSkinConfig[i].id == this.curSelectedMantleId)
                {
                    index = i;
                    break;
                }
            }

            if(index != -1)
            {
                this.selectedMantleByIndex(index);
            }
        }

        //-----------------------------------------------------------------------------
        private onApplyBackgroundSkin() 
        {
            if(this.curSelectedBgId <= 0) return;

            GameInfo.instance.backgroundId = this.curSelectedBgId;

            uniLib.EventListener.getInstance().dispatchEventWith(EventConsts.EVENT_UPDATE_SKIN);

            GameInfo.save();

            let index:number = -1;

            for(let i = 0; i < TableData.tableBackgroundConfig.length; i++)
            {
                if(TableData.tableBackgroundConfig[i].id == this.curSelectedBgId)
                {
                    index = i;
                    break;
                }
            }

            // if(index != -1)
            // {
            //     this.selectedBgByIndex(index);
            // }
        }

        //-----------------------------------------------------------------------------
        private onApplyMantleSkin() 
        {
            if(this.curSelectedMantleId <= 0) return;

            GameInfo.instance.skinId = this.curSelectedMantleId;

            GameInfo.save();

            let index:number = -1;

            for(let i = 0; i < TableData.tableSkinConfig.length; i++)
            {
                if(TableData.tableSkinConfig[i].id == this.curSelectedMantleId)
                {
                    index = i;
                    break;
                }
            }

            // if(index != -1)
            // {
            //     this.selectedMantleByIndex(index);
            // }
        }

        //-----------------------------------------------------------------------------
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
                if(this.curPage == 1)
                {
                    uniLib.Global.reportAldEvent("获得背景-全程看完激励视频");

                    let lockList = GameInfo.instance.getLockBackgroundList();
                    if(lockList.length > 0)
                    {
                        uniLib.MathUtil.randArray(lockList);

                        this.curSelectedBgId = lockList[0];

                        this.onGetBackgroundSkin();
                    }

                }
                else if(this.curPage == 2)
                {
                    uniLib.Global.reportAldEvent("获得皮肤-全程看完激励视频");

                    let lockList = GameInfo.instance.getLockSkinList();
                    if(lockList.length > 0)
                    {
                        uniLib.MathUtil.randArray(lockList);

                        this.curSelectedMantleId = lockList[0];

                        this.onGetMantleSkin();
                    }
                }
                
            }
            else if(status == 0)
            {
                // 视频未看完
                GX.Tips.showTips("全程看完视频才能获得");
            }
            else
            {
                // GameInfo.sendAldEvent("激励视频加载失败");
                GX.Tips.showTips("获取视频广告失败:" + status);
            }
        }
    }


    /**
     * 背景皮肤 item render
     */
    class BgItemRender extends ui.ItemRenderer 
    {
        constructor() 
        {
            super();
        }
        public destroy() 
        {
            super.destroy();
        }
        protected dataChanged() 
        {
        }

        setSelected(selected:boolean)
        {

        }
    
    }

    /**
     * 皮肤 item render
     */
    class MantleItemRender extends ui.ItemRenderer 
    {
        private bgImage:eui.Image;
        private blockImage:eui.Image;
        private selecteImage:eui.Image;
        private maskImage:eui.Image;
        private lockImage:eui.Image;

        constructor() 
        {
            super();
            // this.interactive = ui.UIInteractive.Bright;
        }
        public destroy() 
        {
            super.destroy();
        }
        protected dataChanged() 
        {
            let config:table.TableSkinConfig = this.data;

            if (config.id == GameInfo.instance.skinId) 
            {
                this.setSelected(true);
            }
            else 
            {
                this.setSelected(false);
            }
        }

        setSelected(selected:boolean)
        {
            let config:table.TableSkinConfig = this.data;

            let unlockSkin = false;

            for(let i = 0; i < GameInfo.instance.openSkinIdList.length; i++)
            {
                if(GameInfo.instance.openSkinIdList[i] == config.id)
                {
                    unlockSkin = true;
                    break;
                }
            }

            if(unlockSkin)
            {
                this.maskImage.visible = false;
                this.lockImage.visible = false;
                this.selecteImage.visible = selected; 
            }
            else
            {
                this.maskImage.visible = true;
                this.lockImage.visible = true;
                this.selecteImage.visible = false;
            }

            this.blockImage.source = "block_" + config.id + "_1";

            if(selected)
            {
                uniLib.EventListener.getInstance().dispatchEventWith("event_notify_mantleitem_selected", false, this.data);
            }
        }
    
    }
}