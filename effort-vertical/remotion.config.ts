import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Heavy SVG scenes: give each frame enough time on slower machines.
Config.setDelayRenderTimeoutInMilliseconds(60000);

// Optional: use an already-installed Chromium instead of downloading
// Chrome Headless Shell (handy in sandboxes / CI without internet egress).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
	Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
