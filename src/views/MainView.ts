module game 
{
    export class MainView extends ui.BaseUI
    {
        private menuLayer:eui.Group;
        private menuBar:MenuBar;

        private startBtn:eui.Button;
        private shopBtn:eui.Button;
        private shareBtn:eui.Button;
        private rankBtn:eui.Button;

        private adScrollView:ui.AdScrollView;
        private adScrollViewEx:ui.AdScrollView;

        constructor()
        {
            super();
            this.skinName = new MainViewSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            if(uniLib.Global.isVivogame) window.platform.showBannerAdvertisement();
            this.init();
        }

        //------------------------------------------------------------------------------
        addUIListener(): void
        {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().addEventListener(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED, this.onLoadAds, this);
        }

        //------------------------------------------------------------------------------
        removeUIListener(): void
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
            uniLib.EventListener.getInstance().removeEventListener(uniLib.FacadeConsts.ADPLAT_INIT_COMPLETED, this.onLoadAds, this);
        }

        //------------------------------------------------------------------------------
        public destroy()
        {
            if(null != this.adScrollView)
            {
                this.adScrollView.unload();
                this.adScrollView = null;
            }

            if(null != this.adScrollViewEx)
            {
                this.adScrollViewEx.unload();
                this.adScrollViewEx = null;
            }
            super.destroy();
        }

        //------------------------------------------------------------------------------
        private init()
        {
            this.menuBar = new MenuBar();
            this.menuLayer.addChild(this.menuBar);
            if(GameConsts.is_iPhoneX) this.menuLayer.top = 80;
            else this.menuLayer.top = 20;

            if(uniLib.Global.isVivogame)
            {
                this.shopBtn.parent.removeChild(this.shopBtn);
                this.shareBtn.parent.removeChild(this.shareBtn);
                this.shopBtn = null;
                this.shareBtn = null;
            }

            this.skin["adScrollGroup"].visible = false;
            this.skin["adScrollGroupEx"].visible = false;

            this.onLoadAds();
            
        }

        //------------------------------------------------------------------------------
        private onLoadAds()
        {
            if(this.skin["adScrollGroupEx"].visible == true || this.skin["adScrollGroup"].visible == true) return;

            if(uniLib.AdConfig.itemDataList && uniLib.AdConfig.itemDataList.length > 0)
            {
                if(GameConsts.is_iPhoneX) 
                {
                    this.skin["adScrollGroupEx"].visible = true;
                    this.adScrollViewEx.load(1, true, 0, "AdResultItemSkin", true, true);
                }
                else
                {
                    this.skin["adScrollGroup"].visible = true;
                    this.adScrollView.load(1, false, 0, "AdItemNotTitleSkin", true, true);
                }
            }
        }

        //------------------------------------------------------------------------------
        private onClickTap(e: egret.TouchEvent)
        {
            if(e.target == this.startBtn)
            {
                let maxSceneLevel = GameInfo.instance.maxSceneLevel;
                Main.instance.loadGameScene(maxSceneLevel+1);
            }
            else if(e.target == this.shopBtn)
            {
                GX.PopUpManager.addPopUp(new GameSkinView(), true, 0.8, GX.PopUpEffect.CENTER);
            }
            else if(e.target == this.rankBtn)
            {
                if(uniLib.Global.isVivogame)
                {
                    GX.PopUpManager.addPopUp(new SiginView(), true, 0.8, GX.PopUpEffect.CENTER);
                }
                else
                {
                    GX.PopUpManager.addPopUp(new GameRankView(), true, 0.8, GX.PopUpEffect.CENTER);
                }
                
            }
            else if(e.target == this.shareBtn)
            {
                uniLib.AdPlat.instance.share();
            }
        }
    }
}