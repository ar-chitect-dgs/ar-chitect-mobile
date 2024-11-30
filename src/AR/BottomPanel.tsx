import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { TabView } from 'react-native-tab-view';
import LightsPanel from '../lightsPanel/LightsPanel';
import ModelPanel from '../modelPanel/ModelPanel';

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
    default:
      return <></>;
  }
};

const routes = [
  { key: 'lights', title: 'Lights' },
  { key: 'models', title: 'Models' },
];

const BottomPanel = (): JSX.Element => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], []);
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
