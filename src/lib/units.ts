const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function kgToLbs(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

/** Whole feet + whole inches, rounded to the nearest inch — e.g. 170cm -> { feet: 5, inches: 7 }. */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = Math.round(cmToInches(cm));
  return { feet: Math.floor(totalInches / 12), inches: totalInches % 12 };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return inchesToCm(feet * 12 + inches);
}

/** Rounded to 1 decimal place — kg values in this app are typically e.g. 65 or 65.5. */
export function kgToLbsRounded(kg: number): number {
  return Math.round(kgToLbs(kg) * 10) / 10;
}
