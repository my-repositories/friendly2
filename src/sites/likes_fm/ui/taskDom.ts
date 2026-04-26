import { getRandomDelay, waitFor, waitForElement } from "src/utils";

export async function getTaskLinkForType(type: string): Promise<{ selector: string; taskLink: HTMLAnchorElement | null }> {
  const selector = `.module.page_list_module[type="${type}"]:not(.empty)`;
  const moduleElement = (await waitForElement(selector, { timeout: 3000 })) as HTMLElement | undefined;
  const taskLink = moduleElement?.querySelector("a.open_offer") as HTMLAnchorElement | null;
  return { selector, taskLink };
}

export async function verifyTask(selector: string): Promise<void> {
  (document.querySelector(`${selector} span.do_offer`) as HTMLElement | null)?.click();
  await waitFor(getRandomDelay(2000, 4000));
  closePopup();
}

export function skipTask(selector: string): void {
  (document.querySelector(`${selector} div.x_button`) as HTMLElement | null)?.click();
}

export function closePopup(): void {
  (document.querySelector(".popup_box_container .close") as HTMLElement | null)?.click();
}

export function isTaskStillPresent(selector: string, href: string): boolean {
  const block = document.querySelector(selector);
  return Boolean(block?.querySelector(`a.open_offer[href="${href}"]`));
}
