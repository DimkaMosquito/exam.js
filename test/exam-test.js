'use strict';
describe('Parser', function() {
    var parser;
    beforeEach(function() {
        parser = new Parser();
    });

    it('should parse spesial blocks from text', function() {
        var result = parser._parseSyntaxBlocks('Text text {{special}} text text');
        expect(result[0]).toBe('{{special}}');
    });

    it('should create an instance of Parser even Parser was called as a function', function() {
        var parser1 = Parser();
        var result = parser1._parseSyntaxBlocks('Text text {{special}} text text');
        expect(result[0]).toBe('{{special}}');
    });

    it('should throw an error if try to extract object from empty special block', function() {
        expect(function() {
            parser._extractObjects(['{{}}']);
        }).toThrow(
            new ParsingError('Cannot parse empty block: {{}}')
        );
    });

    it('should extract List from syntax block with list', function() {
        var result = parser._extractList('{{1,2,3,4}}');

        expect(result.items.length).toBe(4);
    });

    it('should extract List from syntax block with list and trim all spaces', function() {
        var result = parser._extractList('{{ 1,   2,    3,    4 }}');

        expect(result.items[0]).toBe('1');
        expect(result.items[1]).toBe('2');
        expect(result.items[2]).toBe('3');
        expect(result.items[3]).toBe('4');
    });

    it('should trim elements in list but keep spaces between words in elements', function() {
        var result = parser._extractList('{{test1 test1, test2 test2,  test3 test3  ,test4 test4}}');

        expect(result.items[0]).toBe('test1 test1');
        expect(result.items[1]).toBe('test2 test2');
        expect(result.items[2]).toBe('test3 test3');
        expect(result.items[3]).toBe('test4 test4');
    });

});
