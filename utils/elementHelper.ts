import { ElementHandle,expect, Page } from '@playwright/test';
import { CommonHelper } from './commonHelper';

export class ElementHelper {


  static async hoverOverMenu(page: Page, menuLocatorSelector: string, retries: number = 3): Promise<void> {
    const menuItem = page.locator(menuLocatorSelector);
    let attempt = 0;
    while (attempt < retries) {
      try {
        console.log(`Hovering over menu item with selector: ${menuLocatorSelector}`);
        await menuItem.hover();
        return;
      } catch {
        attempt++;
      }
    }
    console.error(`Failed to hover after ${retries} attempts: ${menuLocatorSelector}`);
  }
  
  
  static async clickElement(page: any, selector: any, timeout = 5000) {
      await page.waitForSelector(selector, { state: 'visible', timeout });
      await page.click(selector, { force: true });
      console.log(`Clicked on element: ${selector}`);
  }

  static async clearTextField(page: Page, locatorValue: string): Promise<void> {
    console.log(`Clear value from "${locatorValue}" text field`);
    const element = await page.waitForSelector(locatorValue);
    await element.fill('');
  }

  static async clearAndEnterInTextField(page: Page, locatorValue: string, textToEnter: string): Promise<void> {
    console.log(`Clear value from "${locatorValue}" text field and enter text "${textToEnter}"`);
    const element = await page.waitForSelector(locatorValue);
    await element.fill(''); // Clears the text field.
    await element.fill(textToEnter); // Enters the specified text.
  }
  static async clickElementWithRetry(page: Page, selector: string, retries: number = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await page.locator(selector).click();
        return;
      } catch (error) {
        if (i === retries - 1) {
          throw error; // Re-throw error after max retries
        }
      }
    }
  }

  static async getAttributeValue(page: Page, locatorValue: string, attributeName: string): Promise<string | null> {
    const element = await page.locator(locatorValue);
    const attributeValue = await element.getAttribute(attributeName);
    console.log(`Attribute "${attributeName}" value is: ${attributeValue}`);
    return attributeValue;
  }

  static async selectOptionByValue(page: Page, locatorValue: string, value: string): Promise<void> {
    const dropdown = await page.locator(locatorValue);
    await dropdown.selectOption({ value });
    console.log(`INFO: Selected "${value}" from dropdown.`);
  }

  static async selectOptionByIndex(page: Page, locatorValue: string, index: number): Promise<void> {
    const dropdown = await page.locator(locatorValue);
    await dropdown.selectOption({ index });
    console.log(`INFO: Selected option at index "${index}" from dropdown.`);
  }

  static async selectOptionByVisibleText(page: Page, locatorValue: string, visibleText: string): Promise<void> {
    const dropdown = await page.locator(locatorValue);
    await dropdown.selectOption({ label: visibleText });
    console.log(`INFO: Selected "${visibleText}" from dropdown.`);
  }

  static async scrollToElement(page: Page, locatorValue: string): Promise<void> {
    const element = await page.locator(locatorValue);
    await element.scrollIntoViewIfNeeded();
    console.log(`Scrolled to element with locator: "${locatorValue}"`);
  }

  static async scrollByAmount(page: Page, x: number, y: number): Promise<void> {
    await page.evaluate(([scrollX, scrollY]) => {
      window.scrollBy(scrollX, scrollY);
    }, [x, y]);
    console.log(`Scrolled by amount x: ${x}, y: ${y}`);
  }

  static async getTextFromElement(page: Page, locator: string): Promise<string | null> {
    const element = await page.locator(locator);
    return await element.textContent();
  }

  static async isElementDisplayed(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return await element.isVisible();
  }

  static async isElementEnabled(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return await element.isEnabled();
  }

  static async getElementAttribute(page: Page, locator: string, attribute: string): Promise<string | null> {
    const element = await page.locator(locator);
    return await element.getAttribute(attribute);
  }

  static async waitForElementVisible(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.waitFor({ state: 'visible' });
  }

  static async waitForElementClickable(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.waitFor({ state: 'attached' });
    await element.waitFor({ state: 'visible' });
  }

  static async doubleClickElement(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.dblclick();
  }

  static async rightClickElement(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.click({ button: 'right' });
  }

  static async getElementTagName(page: Page, locator: string): Promise<string> {
    const element = await page.locator(locator);
    const tagName = await element.evaluate(el => el.tagName.toLowerCase());
    return tagName;
  }

  static async getElementPosition(page: Page, locator: string): Promise<{ x: number, y: number }> {
    const element = await page.locator(locator);
    const box = await element.boundingBox();
    return { x: box?.x || 0, y: box?.y || 0 };
  }

  static async isElementPresent(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return await element.count() > 0;
  }

  static async isElementInvisible(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return !(await element.isVisible());
  }

  static async waitForElementToDisappear(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.waitFor({ state: 'detached' });
  }

  static async getElementTextLength(page: Page, locator: string): Promise<number> {
    const element = await page.locator(locator);
    const text = await element.textContent();
    return text ? text.length : 0;
  }

  static async setElementFocus(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.focus();
  }

  static async isElementFocused(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    return await element.evaluate(el => el === document.activeElement);
  }

  static async getElementValue(page: Page, locator: string): Promise<string> {
    const element = await page.locator(locator);
    return await element.inputValue();
  }

  static async dragAndDropElement(page: Page, sourceLocator: string, targetLocator: string): Promise<void> {
    const source = await page.locator(sourceLocator);
    const target = await page.locator(targetLocator);
    await source.dragTo(target);
  }

  static async highlightElement(page: Page, locator: string): Promise<void> {
    const element = await page.locator(locator);
    await element.evaluate(el => {
      el.style.border = '2px solid red';
    });
  }

  static async acceptAlert(page: Page): Promise<void> {
    const alert = await page.on('dialog', async dialog => {
      if (dialog.type() === 'alert') {
        await dialog.accept();
        console.log('Alert accepted');
      }
    });
  }

  static async dismissAlert(page: Page): Promise<void> {
    const alert = await page.on('dialog', async dialog => {
      if (dialog.type() === 'alert') {
        await dialog.dismiss();
        console.log('Alert dismissed');
      }
    });

  }
  static async getElementText(page: any, locator: any): Promise<string> {
    const element = await page.locator(locator); // Locate the element
    const text = await element.textContent(); // Retrieve the text content
    return text?.trim() || ''; // Return the text, trim any whitespace
  }
  static async isElementDraggable(page: Page, selector: string): Promise<boolean> {
    const element = await page.locator(selector);
    return await element.isVisible(); // Assumes visibility means it's draggable.
  }
  static async isContextMenuVisible(page: Page, selector: string): Promise<boolean> {
    await page.locator(selector).click({ button: 'right' });
    return await page.locator('css=div.context-menu').isVisible(); // Replace with your context menu locator
  }

  // Context Menu Item Count
  static async getContextMenuItemCount(page: Page): Promise<number> {
    return await page.locator('css=div.context-menu-item').count(); // Replace with your context menu item locator
  }
  static async findElements(page: Page, locatorValue: string): Promise<ElementHandle[]> {
    const elements = await page.locator(locatorValue).elementHandles();
    console.log(`INFO: Found ${elements.length} elements with locator: "${locatorValue}"`);
    return elements;
  }

  static async isElementDisabled(page: Page, locator: string): Promise<boolean> {
    const element = await page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 30000 });
    return !(await element.isEnabled());
}
}
