import { test, expect } from '@playwright/test';
import { sendTemplateMessage } from '../utils/twilio-utils';

// Inside your test

test('has available dates', async ({ page }) => {
  await page.goto('https://www.gub.uy/tramites/inscripcion-partidas-extranjeras');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Inscripción de Partidas Extranjeras | Trámites/);
  await page.getByRole('link', { name: 'Iniciar Trámite en Línea' }).click();
  //await page.getByRole('link', {name: 'Iniciar Trámite en Línea'}).dispatchEvent('click');
  //await page.getByLabel('Elegir día y hora').click();

  var elegirHoraBtnLocator = page.locator('input[type=submit]');
  await expect(elegirHoraBtnLocator).toContainText('Elegir');
  await expect(async () => {
    await elegirHoraBtnLocator.click();
    await expect(page.locator('.ui-messages-warn-title'))
      .not.toContainText('En la oficina seleccionada no hay cupos disponibles');
  }).toPass({
    intervals: [1_000, 5_000, 10_000],
    timeout: 180_000
  });

  await sendTemplateMessage({"1": "12/1", "2": "Si hay turno!"});

});
