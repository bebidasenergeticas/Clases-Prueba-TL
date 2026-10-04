// The "director": turns an absolute frame into the robot's pose/look, the
// camera and global effects. Each effort level contributes through its own
// `apply*` function (co-located with that level's component).
import {defaultLook, defaultPose, RobotLook, RobotPose} from '../components/RobotBase';
import {blink, boilIndex, breathe} from '../utils/animation';
import {noise1} from '../utils/random';

export type Camera = {
	scale: number;
	x: number;
	y: number;
	rot: number;
	originX: number;
	originY: number;
};

export type SceneState = {
	frame: number;
	pose: RobotPose;
	look: RobotLook;
	camera: Camera;
	shadow: {opacity: number; scale: number; rainbow: number};
	flash: {color: string; opacity: number};
	robotOpacity: number;
};

/** Idle life: breathing, blinks, micro eye drift, arm sway, leg fidget. */
export const idle = (frame: number): SceneState => {
	const pose = defaultPose();
	pose.bob = breathe(frame, 3.2, 140);
	pose.squash = breathe(frame, 0.006, 140, 5);
	pose.eyeOpen = blink(frame, 7);
	pose.eyeDx = noise1(frame / 75, 21) * 3.5;
	pose.eyeDy = noise1(frame / 95, 22) * 2;
	pose.armL.rot = noise1(frame / 60, 31) * 2.5;
	pose.armR.rot = -noise1(frame / 64, 32) * 2.5;
	pose.armL.dy = breathe(frame + 20, 1.2, 140);
	pose.armR.dy = breathe(frame + 30, 1.2, 140);
	const look = defaultLook();
	look.boil = boilIndex(frame, 6);
	return {
		frame,
		pose,
		look,
		camera: {scale: 1, x: 0, y: 0, rot: 0, originX: 540, originY: 1150},
		shadow: {opacity: 1, scale: 1, rainbow: 0},
		flash: {color: '#FFFFFF', opacity: 0},
		robotOpacity: 1,
	};
};

export type Applier = (frame: number, s: SceneState) => void;

/** Base idle state, then each level layers its own contribution on top. */
export const getSceneState = (frame: number, appliers: Applier[]): SceneState => {
	const s = idle(frame);
	for (const fn of appliers) fn(frame, s);
	return s;
};
