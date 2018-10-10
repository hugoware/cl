
import ZoneMap from '../src/client/app/zone-map';

const SAMPLE_1 = `
AAAAAAAAAA
BBBBBBBBBB
CCCAAAACCC
DD112211DD
EEEEEEEEEE`;

describe('ZoneMap', () => {

  it('should collapse a single zone', () => {

		const map = new ZoneMap();
		map.load(SAMPLE_1.trim(), {
			mid: {
				start: { row: 3, col: 4 },
				end: { row: 3, col: 8 }
			}
		});

		map.collapse('mid');
		expect(map.zones.mid.content).toBe('AAAA');

  });

  it('should collapse a nested zone', () => {

		const map = new ZoneMap();
		map.load(SAMPLE_1.trim(), {
			out: {
				start: { row: 4, col: 3 },
				end: { row: 4, col: 9 }
			},

			in: {
				start: { row: 4, col: 5 },
				end: { row: 4, col: 7 }
			}
		});

		map.collapse('out');

		// console.log(map.zones.out.content);
		expect(map.zones.out.content).toBe('1111');
		expect(map.zones.in.content).toBe('22');

	});
	
	// it('should allow nested zones', () => {

	// });

});