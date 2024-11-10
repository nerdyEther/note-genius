import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';

describe('Hello World worker', () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('responds with Hello World!', async () => {
		const response = await worker.fetch();
		if (response) {
			expect(await response.text()).toBe('Hello World!');
		} else {
			throw new Error('Response is undefined');
		}
	});

	it('responds with Hello World! (integration style)', async () => {
		const response = await worker.fetch('https://example.com');
		if (response) {
			expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
		} else {
			throw new Error('Response is undefined');
		}
	});
});