import { describe, expect, it } from 'vitest';
import { cashForecast, impactFor, orderTotals } from '@/pages/os/OsPilotStations2';

describe('OS pilot sample math', () => {
  it('two lattes and a bag of beans total $27 plus tax and earn 270 points', () => {
    const t = orderTotals([2, 0, 0, 1]);
    expect(t.subtotal).toBe(27);
    expect(t.tax).toBe(2.77);
    expect(t.points).toBe(270);
  });
  it('cash forecast drops $2,800 a month at $28,400 sales from $18,400', () => {
    expect(cashForecast(28400, 2)).toEqual([15600, 12800]);
  });
  it('68% of $10,000 stays local', () => {
    expect(impactFor(10000)).toEqual({ local: 6800, yearly: 81600 });
  });
});
