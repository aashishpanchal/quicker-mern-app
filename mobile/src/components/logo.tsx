import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  size?: number;
};

export function Logo({size = 40}: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 511.207 511.207">
      <Path
        d="M149.06 7.454L7.167 18.468l313.539 315.537 76.475-76.474zM374.175 191.75L374.339.026l-95.568 95.568zm30.19-73.983l99.675-18.091L404.365 0zM164.942 219.81l-21.437 291.397 155.988-155.988z"
        data-original="#000000"
      />
    </Svg>
  );
}
