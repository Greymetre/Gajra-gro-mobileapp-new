import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size: number;
  teeth: number;
  color: string;
  /** Radius of the hole in the middle, as a fraction of the gear radius (0 = solid). */
  holeRatio?: number;
  /** How far the teeth stick out, as a fraction of the gear radius. */
  toothDepth?: number;
}

/**
 * A flat gear drawn with SVG: trapezoid teeth around a ring, like the gear in
 * the Gajra Gears logo. The path is built once from the props.
 */
const GearShape = ({ size, teeth, color, holeRatio = 0.62, toothDepth = 0.16 }: Props) => {
  const c = size / 2;
  const outer = c;
  const root = c * (1 - toothDepth);
  const hole = c * holeRatio;
  const step = (Math.PI * 2) / teeth;

  const point = (r: number, a: number) =>
    `${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`;

  // Each tooth: flat top ~40% of the pitch, sloped flanks, gap on the root circle.
  let d = '';
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const p = [
      point(root, a),
      point(outer, a + step * 0.12),
      point(outer, a + step * 0.42),
      point(root, a + step * 0.54),
    ];
    d += (i === 0 ? `M${p[0]}` : ` L${p[0]}`) + ` L${p[1]} L${p[2]} L${p[3]}`;
  }
  d += ' Z';

  if (hole > 0) {
    // Inner circle drawn as two arcs; evenodd turns it into a hole.
    d += ` M${c - hole},${c} a${hole},${hole} 0 1,0 ${hole * 2},0 a${hole},${hole} 0 1,0 ${-hole * 2},0 Z`;
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Path d={d} fill={color} fillRule="evenodd" />
    </Svg>
  );
};

export default GearShape;
