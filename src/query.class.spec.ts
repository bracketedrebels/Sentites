import 'jasmine';

import { Manager } from './manager.class';
import { Query } from './query.class';
import { QueryTypes } from './query.enums';



describe(`Query`, () => {
    const TAG1 = Manager.createTag(() => 1);
    const TAG2 = Manager.createTag(() => 2);
    const TAG3 = Manager.createTag(() => 3);

    it(`should pass correct queries validation`, () => {
        expect(new Query(QueryTypes.all, [])).toBeTruthy();
        expect(new Query(QueryTypes.none, [])).toBeTruthy();
        expect(new Query(QueryTypes.and, [TAG1, TAG2])).toBeTruthy();
        expect(new Query(QueryTypes.and, [TAG1, TAG2, TAG3])).toBeTruthy();
        expect(new Query(QueryTypes.or, [TAG1, TAG2])).toBeTruthy();
        expect(new Query(QueryTypes.or, [TAG1, TAG2, TAG3])).toBeTruthy();
        expect(new Query(QueryTypes.not, [TAG1])).toBeTruthy();
    });
    it(`should not pass incorrect queries validation`, () => {
        expect(() => new Query(QueryTypes.all, [TAG1])).toThrowError();
        expect(() => new Query(QueryTypes.none, [TAG1])).toThrowError();
        expect(() => new Query(QueryTypes.and, [TAG1])).toThrowError();
        expect(() => new Query(QueryTypes.and, [])).toThrowError();
        expect(() => new Query(QueryTypes.or, [TAG1])).toThrowError();
        expect(() => new Query(QueryTypes.or, [])).toThrowError();
        expect(() => new Query(QueryTypes.not, [TAG1, TAG2])).toThrowError();
        expect(() => new Query(QueryTypes.not, [])).toThrowError();
    });
    it(`should be correctly serializable`, () => {
        let [all, none, not, and, or] = [ QueryTypes.all, QueryTypes.none, QueryTypes.not, QueryTypes.and, QueryTypes.or ];
        let [t1, t2] = [ TAG1.toString(), TAG2.toString() ];

        expect((new Query(all, [])).toString())
            .toBe(`{"type":${all},"args":[]}`);
        expect((new Query(none, [])).toString())
            .toBe(`{"type":${none},"args":[]}`);
        expect((new Query(not, [TAG1])).toString())
            .toBe(`{"type":${not},"args":["${t1}"]}`);
        expect((new Query(and, [TAG1, TAG2])).toString())
            .toBe(`{"type":${and},"args":["${t1}","${t2}"]}`);
        expect((new Query(or, [TAG1, TAG2])).toString())
            .toBe(`{"type":${or},"args":["${t1}","${t2}"]}`);
        expect((new Query(or, [TAG1, new Query(not, [TAG2])])).toString())
            .toBe(`{"type":${or},"args":[{"type":${not},"args":["${t2}"]},"${t1}"]}`);
    });
});
