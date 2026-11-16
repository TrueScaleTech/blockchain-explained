import type { WIDGETS } from '../../content.config';
import AttackChart from './AttackChart.astro';
import ChainDemo from './ChainDemo.astro';
import HashPlayground from './HashPlayground.astro';
import MerkleBuilder from './MerkleBuilder.astro';
import MiningDemo from './MiningDemo.astro';
import SignatureDemo from './SignatureDemo.astro';

/** The widget each lesson names in its frontmatter. */
export const WIDGET_COMPONENTS: Record<(typeof WIDGETS)[number], typeof HashPlayground> = {
  hash: HashPlayground,
  chain: ChainDemo,
  mining: MiningDemo,
  merkle: MerkleBuilder,
  signature: SignatureDemo,
  attack: AttackChart,
};
