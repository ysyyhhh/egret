module game 
{
    /**
     * 误触
     */
    export class MisTouchGifBox extends ui.AdMisTouchGifBox 
    {
        private goBtn:eui.Button;

        private progressBarGroup:eui.Group;

        private thumb: eui.Image;
        private maskRect: eui.Rect;

        public constructor()
        {
            super();
            this.skinName = new MisTouchGifBoxSkin();
            this.adaptationWidth();
            this.adaptationHeight();
            this.init();
        }

        public destroy()
        {
            console.log("----destroy MisTouchGifBox----");
            uniLib.AdPlat.instance.hideBanner();
            super.destroy();
        }

        addUIListener() 
        {
            console.log("---MisTouchGifBox----");
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        removeUIListener() 
        {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickTap, this);
        }

        private onClickTap(e: egret.TouchEvent) 
        {
            if(e.target == this.goBtn)
            {
                this.curValue += 10;
            }
        }

        private init()
        {
            this.thumb.mask = this.maskRect;
            this.maskRect.height = 0;
        }

        reward(clickedBanner:boolean)
        {
            GX.PopUpManager.addPopUp(new RewardView(2, null, null, true), true, 0.8, GX.PopUpEffect.CENTER);
        }

        setProgress(loaded: number, total: number): void 
        {
            let cur = loaded * 100 / total;
            cur = cur < 1 ? 1 : cur;
            cur = Math.floor(cur);
            if (total == 100) 
            {
                cur = loaded;
            }
            this.maskRect.width = this.progressBarGroup.width / 100 * cur;
        }

    }
}