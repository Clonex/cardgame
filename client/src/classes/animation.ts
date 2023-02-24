import { clamp } from '../utils';

/**
 * Uses requestAnimationFrame to animate stuff.
 */
export default class Animation {
	_job = (delta: number, time: number) => true;
	_reqID = -1;
	_start?: number;

	/**
	 *
	 * @param (elapsed:number, animation:Animation)=>void job
	 * @param boolean autostart
	 */
	constructor(job?: Animation['_job'], autostart = false) {
		if (job) {
			this._job = job;
		}
		if (autostart) {
			this.start();
		}
	}

	pause() {
		cancelAnimationFrame(this._reqID);
		this._reqID = -1;
	}

	/**
	 * Stops the animation.
	 */
	stop() {
		this.pause();
		this._job = (delta: number, time: number) => true;
		this._start = undefined;
	}

	/**
	 * Restarts the animation.
	 */
	restart() {
		this._start = undefined;
	}

	/**
	 * Starts the animation.
	 */
	start() {
		this._reqID = requestAnimationFrame((d) => this._loop(d));
	}

	_loop(time: number) {
		if (this._reqID >= 0 && this._job) {
			if (!this._start) {
				this._start = time;
			}
			const delta = time - this._start;
			if (this._job(delta, time)) {
				this.stop();
			} else {
				this._reqID = requestAnimationFrame((d) => this._loop(d));
			}
		}
	}
}

/**
 * A animation which reverses when reaching the animationTime.
 */
export class ReversingAnimation extends Animation {
	_animationTime = 0;
	_revJob: (
		progress: number,
		dir: number
	) => {
		//
	};

	last = 0;
	dir = 0;

	/**
	 * @param {(0-1) => void} job
	 * @param {number} animationTime
	 */
	constructor(job: ReversingAnimation['_revJob'], animationTime: number) {
		super();
		this._job = this._animationLoop;

		this._animationTime = animationTime;
		this._revJob = job;

		this.start();
	}

	_animationLoop(delta: number) {
		const fixedDelta = delta - this.last;
		let progress = clamp(fixedDelta / this._animationTime, 0, 1);
		if (this.dir === 1) {
			// Reverse
			progress = 1 - progress;
		}

		if (progress === 1 || progress === 0) {
			this.dir = this.dir === 1 ? 0 : 1;
			this.last = delta;
		}

		this._revJob(progress, this.dir);
		return false;
	}
}

/**
 * A timed animation, which automaticly stops after the given time.
 */
export class TimedAnimation extends Animation {
	_time = 0;
	_timedJob;

	constructor(job: (progress: number, c: 0) => void, time: number) {
		super();
		this._job = this._animationLoop;

		this._timedJob = job;
		this._time = time;

		this.start();
	}

	_animationLoop(d: number) {
		const progress = Math.min(d / this._time, 1);
		this._timedJob(progress, 0);

		if (progress === 1) {
			return true;
		}
		return false;
	}

	static run(job: (progress: number, c?: 0) => void, time: number) {
		return new TimedAnimation(job, time);
	}
}
