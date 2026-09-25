import { defineConfig } from 'vitest/config';

// Unit tests cover the DOM-free logic modules (compute.ts, schema.ts, the
// localization files); anything touching lit or HA components is exercised
// by the browser smoke test instead, so plain Node is enough here.
export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        // A DST-observing zone so the date math tests exercise the 23/25-hour
        // day transitions.
        env: { TZ: 'America/Los_Angeles' },
    },
});
