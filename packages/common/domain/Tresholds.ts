export type Tresholds = {
  '3': number;
  '3.5': number;
  '4': number;
  '4.5': number;
  '5': number;
};

/**
 * Gets grade by switching over Tresholds
 *
 * Works for percentage and points
 *
 * @param points -- points or percentage
 * @param tresholds -- tresholds dict
 */
export function getGradeFromTresholds(points: number, tresholds: Tresholds) {
  switch (true) {
    case points >= tresholds['5']:
      return 5;
    case points >= tresholds['4.5']:
      return 4.5;
    case points >= tresholds['4']:
      return 4;
    case points >= tresholds['3.5']:
      return 3.5;
    case points >= tresholds['3']:
      return 3;
    default:
      return 2;
  }
}
