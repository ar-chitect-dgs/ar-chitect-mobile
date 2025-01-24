import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef, useMemo, useState } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import LightsPanel from '../panels/lightsPanel/LightsPanel';
import ModelPanel from '../panels/modelPanel/ModelPanel';
import ScenePanel from '../panels/scenePanel/ScenePanel';
import { purple2 } from '../styles/colors';
import FormattedText from '../components/FormattedText';

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

  const renderTabBar = (props: any): JSX.Element => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      renderLabel={({
        route,
        color,
      }: {
        route: { key: string; title: string };
        color: string;
      }) => (
        <FormattedText style={[styles.label, { color }]}>
          {route.title}
        </FormattedText>
      )}
    />
  );

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
        renderTabBar={renderTabBar}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: purple2,
  },
  indicator: {
    backgroundColor: 'white',
  },
  label: {
    fontWeight: 'bold',
  },
});

export default BottomPanel;
