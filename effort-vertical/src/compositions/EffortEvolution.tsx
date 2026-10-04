import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SoundLayer} from '../audio/SoundLayer';
import {EffortBadge} from '../components/EffortBadge';
import {EffortMenu} from '../components/EffortMenu';
import {GROUND_Y, GroundLine, PencilShadow} from '../components/Ground';
import {PaperBackground} from '../components/PaperBackground';
import {RobotBase} from '../components/RobotBase';
import {applyHigh, ChessDesk} from '../components/RobotHigh';
import {applyLow, Laptop, LowFaceGlow} from '../components/RobotLow';
import {applyMax, MaxArmor, MaxBoots, MaxEnergy, MaxHud} from '../components/RobotMax';
import {applyMedium, ForeheadDisplay, Headset} from '../components/RobotMedium';
import {applyUltraCode, UltraCodeAura} from '../components/RobotUltraCode';
import {applyUltraThink, UltraThinkBack, UltraThinkFront, UltraThinkGlow} from '../components/RobotUltraThink';
import {
	applyXHigh,
	CablePlugs,
	CablesBack,
	CablesFront,
	Flask,
	Glasses,
	TeslaCoils,
	ThoughtBubbles,
	XHighElectricity,
} from '../components/RobotXHigh';
import {CloneArmy} from '../effects/CloneArmy';
import {SceneFilters} from '../effects/Filters';
import {Flash} from '../effects/Flash';
import {Grain} from '../effects/Grain';
import {HEIGHT, WIDTH} from '../utils/timing';
import {getSceneState} from './director';

export const effortSchemaDefaults = {withAudio: false};

// Order matters: later levels can override earlier ones during overlaps.
const APPLIERS = [applyLow, applyMedium, applyHigh, applyXHigh, applyMax, applyUltraCode, applyUltraThink];

const RX = 540;

export const EffortEvolution: React.FC<typeof effortSchemaDefaults> = ({withAudio}) => {
	const frame = useCurrentFrame();
	const s = getSceneState(frame, APPLIERS);
	const {pose, look, camera: cam} = s;
	const camT = `translate(${(cam.originX + cam.x).toFixed(2)} ${(cam.originY + cam.y).toFixed(2)}) rotate(${cam.rot.toFixed(3)}) scale(${cam.scale.toFixed(4)}) translate(${-cam.originX} ${-cam.originY})`;
	const lift = pose.lift;
	const bob = pose.bob;
	return (
		<AbsoluteFill>
			<PaperBackground />
			<AbsoluteFill>
				<svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{overflow: 'visible'}}>
					<SceneFilters />
					<g transform={camT}>
						{/* ---- back layers ---- */}
						<GroundLine />
						<UltraThinkBack lift={lift} bob={bob} />
						<CloneArmy />
						<ThoughtBubbles lift={lift} />
						<TeslaCoils />
						<CablesBack lift={lift} bob={bob} />
						<PencilShadow
							cx={RX}
							cy={GROUND_Y + 2}
							rx={300 * s.shadow.scale}
							ry={12 * s.shadow.scale}
							opacity={s.shadow.opacity}
							rainbow={s.shadow.rainbow}
						/>
						{/* ---- hero ---- */}
						<RobotBase
							x={RX}
							y={GROUND_Y}
							pose={pose}
							look={look}
							uid="hero"
							opacity={s.robotOpacity}
							underLayer={<UltraCodeAura />}
							backLayer={<UltraThinkGlow />}
							faceLayer={
								<>
									<LowFaceGlow />
									<Headset />
									<ForeheadDisplay />
									<Glasses pose={pose} />
									<CablePlugs />
									<MaxArmor boil={look.boil} />
								</>
							}
							feetLayer={<MaxBoots boil={look.boil} />}
						/>
						{/* ---- front layers ---- */}
						<Laptop x={RX} y={GROUND_Y} />
						<ChessDesk x={RX} y={GROUND_Y} pose={pose} look={look} />
						<CablesFront lift={lift} bob={bob} />
						<Flask />
						<MaxEnergy cx={RX} cy={GROUND_Y - 201} />
						<MaxHud />
						<XHighElectricity lift={lift} bob={bob} />
						<UltraThinkFront lift={lift} bob={bob} />
					</g>
				</svg>
			</AbsoluteFill>
			<Flash color={s.flash.color} opacity={s.flash.opacity} cy={GROUND_Y - 200 - lift} />
			<Grain />
			<EffortMenu />
			<EffortBadge />
			{withAudio && <SoundLayer />}
		</AbsoluteFill>
	);
};
