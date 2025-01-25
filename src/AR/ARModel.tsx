import React, { useState } from 'react';
import {
  Viro3DObject,
  ViroNode,
  ViroBox,
  ViroMaterials,
} from '@reactvision/react-viro';
import { type Vector3D } from './Interfaces';
import { type ViroClickState } from '@reactvision/react-viro/dist/components/Types/ViroEvents';
import { useDispatch } from 'react-redux';
import { setUnsavedChanges } from '../store/actions';

const arrowUlr =
  'https://firebasestorage.googleapis.com/v0/b/ar-chitect-a0b25.appspot.com/o/models%2Farrow.glb?alt=media&token=492d09d9-56cd-49f5-a49d-5bbcf872dec9';

ViroMaterials.createMaterials({
  arrowMaterial: {
    diffuseColor: '#FF0000',
    lightingModel: 'Blinn',
    shininess: 2.0,
  },
});

interface ARModelProps {
  url: string;
  position: Vector3D;
  rotation: Vector3D;
  scale: number;
  selected: boolean;
  onSelect: (isSelected: boolean) => void;
  onDrag: (dragToPos: any, height: number) => void;
}

const ARModel: React.FC<ARModelProps> = ({
  url,
  position,
  rotation,
  scale,
  selected,
  onSelect,
  onDrag,
}) => {
  const dispatch = useDispatch();

  const [height, setHeight] = useState(3);

  const handleTouch = (state: ViroClickState): void => {
    if (state === 3) {
      dispatch(setUnsavedChanges(true));
    }
  };

  const onClick = (): void => {
    if (selected) {
      onSelect(false);
    } else {
      onSelect(true);
    }
  };

  const handleArrowDrag = (dragToPos: [number, number, number]): void => {
    onDrag(dragToPos, height);
  };

  const modelRef = React.useRef<Viro3DObject>(null);

  const handleLoad = async (): Promise<void> => {
    if (modelRef.current) {
      try {
        const result = await modelRef.current.getBoundingBoxAsync();
        const boundingBox = result.boundingBox;
        const height = boundingBox.maxY - boundingBox.minY;
        setHeight(height);
      } catch (error) {
        console.error('Błąd podczas pobierania BoundingBox:', error);
      }
    }
  };

  return (
    <ViroNode>
      <Viro3DObject
        ref={modelRef}
        source={{ uri: url }}
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
        scale={[scale, scale, scale]}
        type="GLB"
        opacity={selected || selected ? 0.5 : 1}
        onClick={onClick}
        onLoadEnd={handleLoad}
      />

      {selected && (
        <ViroNode position={[position.x, position.y, position.z]}>
          {/* <ViroBox
            position={[0, height + scale, 0]}
            scale={[0.1, 0.1, 0.1]}
            materials="arrowMaterial"
            onDrag={(dragToPos) => {
              handleArrowDrag(dragToPos);
            }}
            onClickState={handleTouch}
          /> */}
          <Viro3DObject
            source={{ uri: arrowUlr }}
            position={[0, height + scale, 0]}
            onDrag={(dragToPos) => {
              handleArrowDrag(dragToPos);
            }}
            onClickState={handleTouch}
            type="GLB"
          />
        </ViroNode>
      )}
    </ViroNode>
  );
};

export default ARModel;
