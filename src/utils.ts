import elementReady, { type Options } from "element-ready";

export function $<T extends Element>(selector: string) {
	return document.querySelector<T>(selector);
}

export function $$<T extends Element>(selector: string) {
	return document.querySelectorAll<T>(selector);
}

export const waitFor = async (duration = 1000) =>
	new Promise((resolve) => setTimeout(resolve, duration));

export const waitForElement = async (selector: string, options?: Options) => {
	return elementReady(selector, {
		stopOnDomReady: false,
		...options,
	});
};

export const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
};

/**
 * convenient method for chrome.storage
 */
export const storage = {
	set: async (key: string, value: unknown) => {
		return chrome.storage.sync
			.set({ [key]: value })
			.then(() => value)
			.catch(console.log);
	},
	get: async (key: string) => {
		return chrome.storage.sync
			.get(key)
			.then((result) => result[key])
			.catch(console.log);
	},
};

export function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function humanClick(element: HTMLElement): Promise<void> {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  // Рандомизируем точку клика (не ровно в угол +5, а в случайное место внутри элемента)
  const x = rect.left + Math.random() * (rect.width * 0.8);
  const y = rect.top + Math.random() * (rect.height * 0.8);

  const commonConfig = {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    buttons: 1
  };

  // 1. Имитируем наведение
  element.dispatchEvent(new MouseEvent('mouseenter', commonConfig));
  element.dispatchEvent(new MouseEvent('mouseover', commonConfig));

  // 2. Нажатие (Pointer + Mouse)
  element.dispatchEvent(new PointerEvent('pointerdown', { ...commonConfig, isPrimary: true }));
  element.dispatchEvent(new MouseEvent('mousedown', commonConfig));

  // Фокусируем элемент, как это делает браузер
  element.focus();

  // 3. Небольшая задержка "зажатия" кнопки (от 50 до 150 мс)
  await waitFor(getRandomDelay(50, 150));

  // 4. Отпускание
  element.dispatchEvent(new PointerEvent('pointerup', { ...commonConfig, isPrimary: true }));
  element.dispatchEvent(new MouseEvent('mouseup', commonConfig));

  // 5. Финальный клик
  element.dispatchEvent(new MouseEvent('click', { ...commonConfig, detail: 1 }));
}
