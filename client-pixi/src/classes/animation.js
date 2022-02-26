/**
 * Uses requestAnimationFrame to animate stuff.
 */
export default class Animation {
    _job = false;
    _reqID = false;
    _start;

    /**
     * 
     * @param (elapsed:number, animation:Animation)=>void job 
     * @param boolean autostart 
     */
    constructor(job, autostart = false)
    {
        this._job = job;
        if(autostart)
        {
            this.start();
        }
    }

    pause()
    {
        cancelAnimationFrame(this._reqID);
        this._reqID = false;
    }

    /**
     * Stops the animation.
     */
    stop()
    {
        this.pause();
        this._job = false;
        this._start = false;
    }

    /**
     * Restarts the animation.
     */
    restart()
    {
        this._start = false;
    }

    /**
     * Starts the animation.
     */
    start()
    {
        this._reqID = requestAnimationFrame(d => this._loop(d));
    }

    _loop(time)
    {
        if(this._reqID && this._job)
        {
            if(!this._start)
            {
                this._start = time;
            }
            const delta = time - this._start;
            if(this._job(delta, time))
            {
                this.stop();
            }else{
                this._reqID = requestAnimationFrame(d => this._loop(d));
            }
        }
    }
}


/**
 * A animation which reverses when reaching the animationTime.
 */
export class ReversingAnimation extends Animation {
    _animationTime = 0;
    _revJob;
    
    last = 0;
    dir = 0;

    /**
     * @param {(0-1) => void} job 
     * @param {number} animationTime 
     */
    constructor(job = () => {}, animationTime)
    {
        super();
        this._job = this._animationLoop;

        this._animationTime = animationTime;
        this._revJob = job;

        this.start();
    }

    _animationLoop(delta)
    {
        const fixedDelta = delta - this.last;
        let progress = Math.clamp(fixedDelta / this._animationTime, 0, 1);
        if(this.dir === 1) // Reverse
        {
            progress = 1 - progress;
        }

        if(progress === 1 || progress === 0)
        {
            this.dir = this.dir === 1 ? 0 : 1;
            this.last = delta;
        }

        this._revJob(progress, this.dir);
    }
}

/**
 * A timed animation, which automaticly stops after the given time.
 */
export class TimedAnimation extends Animation {
    _time = 0;
    _timedJob = false;

    constructor(job, time)
    {
        super();
        this._job = this._animationLoop;

        this._timedJob = job;
        this._time = time;

        this.start();
    }

    _animationLoop(d)
    {
        const progress = Math.min(d / this._time, 1);
        this._timedJob(progress);
        
        if(progress === 1)
        {
            this.stop();
        }
    }

    static run(job, time)
    {
        return new TimedAnimation(job, time);
    }
}
