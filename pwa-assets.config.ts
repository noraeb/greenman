import {
  defineConfig,
  minimalPreset as preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset: {
    ...preset,
    maskable: {
      sizes: [512],
      padding: 0.3,
    },
    apple: {
      sizes: [180],
      padding: 0.3,
    },
  },
  images: ['public/greenman.png'],
});
