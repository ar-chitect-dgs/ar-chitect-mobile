import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import LightsPanel from '../lightsPanel/LightsPanel';
import ModelPanel from '../modelPanel/ModelPanel';
import ScenePanel from '../scenePanel/ScenePanel';

const renderScene = ({
  route,
  snapPoint,
}: {
  route: { key: string; title: string };
  snapPoint: string;
}): JSX.Element => {
  switch (route.key) {
    case 'lights':
      return <LightsPanel snapPoint={snapPoint} />;
    case 'models':
      return <ModelPanel snapPoint={snapPoint} />;
    case 'scene':
      return <ScenePanel snapPoint={snapPoint} />;
    default:
      return <></>;
  }
};

const routes = [
  { key: 'lights', title: 'Lights' },
  { key: 'models', title: 'Models' },
  { key: 'scene', title: 'Scene' },
];

const BottomPanel = (): JSX.Element => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(
    () => ['5%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%'],
    [],
  );
  const layout = useWindowDimensions();

  const [snapPoint, setSnapPoint] = useState<string>(snapPoints[0]);

  const [index, setIndex] = useState(0);

  const handleSheetChange = (index: number): void => {
    setSnapPoint(snapPoints[index]);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={(props): JSX.Element =>
          renderScene({ ...props, snapPoint })
        }
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </BottomSheet>
  );
};

export default BottomPanel;
