import { Composition } from 'remotion';
import { DemoVideo } from './DemoVideo';

export const MyComposition = () => {
  return (
    <Composition
      id="ShaadiInvitesDemo"
      component={DemoVideo}
      durationInFrames={2880}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
