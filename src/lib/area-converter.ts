export const AREA_UNITS = {
  sqyd: {
    label: "Sq. Yard",
    toSqYard: 1,
  },

  sqft: {
    label: "Sq. Ft.",
    toSqYard: 1 / 9,
  },

  guntha: {
    label: "Guntha",
    toSqYard: 121,
  },

  acre: {
    label: "Acre",
    toSqYard: 4840,
  },

  bigha: {
    label: "Bigha",
    toSqYard: 17424,
  },
} as const;

export type AreaUnit = keyof typeof AREA_UNITS;

export function convertArea(
  value: number,
  from: AreaUnit,
  to: AreaUnit
) {
  const sqYardValue =
    value * AREA_UNITS[from].toSqYard;

  return (
    sqYardValue /
    AREA_UNITS[to].toSqYard
  );
}