// tinacms' <Prism> uses prism-react-renderer's bundled Prism, which doesn't ship bash. The
// prismjs language components register themselves onto a global `Prism`, so expose that one first.
// N.B. Kept in its own module so this runs before the language import below is evaluated.
import { Prism } from 'prism-react-renderer';

(globalThis as typeof globalThis & { Prism: typeof Prism }).Prism = Prism;
