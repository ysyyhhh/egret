module game 
{
    export class Track extends particle.GravityParticleSystem
    {
        private p0:egret.Point;
        private p1:egret.Point;
        private p2:egret.Point;
        public target:RoundItem;

        public score:number;

        constructor(roundItem:RoundItem, score:number, x:number, y:number)
        {
            let name:string = "track_effect_" + roundItem.colorValue + "_png";
            let texture:egret.Texture = RES.getRes(name);
            let config = RES.getRes("tracks_json");

            super(texture, config);

            this.target = roundItem;
            this.score = score;
            this.p0 = new egret.Point(x, y);
            this.p1 = new egret.Point();
            this.p2 = new egret.Point();
            this.target.localToGlobal(roundItem.width*0.5, roundItem.height*0.5, this.p2);

            this.p1.x = this.p0.x;
            this.p1.y = this.p2.y - 150;

            this.emitterX = x;
            this.emitterY = y;

            super.start();
        }

        //------------------------------------------------------------------------------
        destroy()
        {
            this.stop(true);
            if (this.parent) 
            {
                this.parent.removeChild(this);
            }
            this.target = null;
        }

        //------------------------------------------------------------------------------
        startTrack(callback:Function, thisObj:any)
        {
            let self = this;
            
            egret.Tween.get(this).to({ factor: 1 }, 500).call(() => {
                callback.call(thisObj, self, this.score);
            });
        }

        //------------------------------------------------------------------------------
        public get factor(): number 
        {
            return 0;
        }

        //------------------------------------------------------------------------------
        public set factor(t: number) 
        {
            this.emitterX = (1 - t) * (1 - t) * this.p0.x + 2 * t * (1 - t) * this.p1.x + t * t * this.p2.x;
            this.emitterY = (1 - t) * (1 - t) * this.p0.y + 2 * t * (1 - t) * this.p1.y + t * t * this.p2.y;
        }
    }

}