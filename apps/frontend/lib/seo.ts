/**
 * SEO segédfüggvények és alapértelmezett leírás
 * Magyar: Minimalista eszközök oldal címek és leírás kezeléséhez.
 */

/**
 * Alapértelmezett rövid leírás, újrafelhasználható meta description-höz.
 */
export const defaultDescription =
  "Focipedia – futball adatok és tudástár. Böngéssz ligákat, csapatokat és statisztikákat.";

/**
 * pageTitle
 * Magyar: Oldal címet képez a megadott utótagból.
 * Példa: pageTitle("Irányítópult") => "Focipedia – Irányítópult"
 */
export function pageTitle(suffix: string): string {
  return `Focipedia – ${suffix}`;
}