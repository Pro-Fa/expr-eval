import assert from 'assert';
import { Parser } from '../../index';

describe('String Functions TypeScript Test', function () {
  describe('length(str)', function () {
    it('should return the length of a string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('length("hello")'), 5);
      assert.strictEqual(parser.evaluate('length("")'), 0);
      assert.strictEqual(parser.evaluate('length("a")'), 1);
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('length(undefined)'), undefined);
    });

    // Note: length(123) returns 3 (number of digits) because there's also a unary operator
    // that handles numbers, so we don't test the error case for non-string argument
  });

  describe('isEmpty(str)', function () {
    it('should return true for empty strings', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isEmpty("")'), true);
    });

    it('should return true for null values', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isEmpty(null)'), true);
    });

    it('should return false for non-empty strings', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isEmpty("hello")'), false);
      assert.strictEqual(parser.evaluate('isEmpty(" ")'), false);
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('isEmpty(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('isEmpty(0)'), /must be a string/);
    });
  });

  describe('contains(str, substring)', function () {
    it('should check if string contains substring', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('contains("hello world", "world")'), true);
      assert.strictEqual(parser.evaluate('contains("hello world", "foo")'), false);
      assert.strictEqual(parser.evaluate('contains("test", "")'), true);
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('contains(undefined, "test")'), undefined);
      assert.strictEqual(parser.evaluate('contains("test", undefined)'), undefined);
    });

    it('should throw error for non-string arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('contains(123, "test")'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('contains("test", 123)'), /Second argument.*must be a string/);
    });
  });

  describe('startsWith(str, substring)', function () {
    it('should check if string starts with substring', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('startsWith("hello world", "hello")'), true);
      assert.strictEqual(parser.evaluate('startsWith("hello world", "world")'), false);
      assert.strictEqual(parser.evaluate('startsWith("test", "")'), true);
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('startsWith(undefined, "test")'), undefined);
      assert.strictEqual(parser.evaluate('startsWith("test", undefined)'), undefined);
    });

    it('should throw error for non-string arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('startsWith(123, "test")'), /First argument.*must be a string/);
    });
  });

  describe('endsWith(str, substring)', function () {
    it('should check if string ends with substring', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('endsWith("hello world", "world")'), true);
      assert.strictEqual(parser.evaluate('endsWith("hello world", "hello")'), false);
      assert.strictEqual(parser.evaluate('endsWith("test", "")'), true);
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('endsWith(undefined, "test")'), undefined);
      assert.strictEqual(parser.evaluate('endsWith("test", undefined)'), undefined);
    });

    it('should throw error for non-string arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('endsWith(123, "test")'), /First argument.*must be a string/);
    });
  });

  describe('searchCount(text, substring)', function () {
    it('should count non-overlapping occurrences of substring', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('searchCount("hello world hello", "hello")'), 2);
      assert.strictEqual(parser.evaluate('searchCount("aaa", "aa")'), 1);
      assert.strictEqual(parser.evaluate('searchCount("test", "x")'), 0);
    });

    it('should return 0 for empty substring', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('searchCount("test", "")'), 0);
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('searchCount(undefined, "test")'), undefined);
      assert.strictEqual(parser.evaluate('searchCount("test", undefined)'), undefined);
    });

    it('should throw error for non-string arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('searchCount(123, "test")'), /First argument.*must be a string/);
    });
  });

  describe('trim(str, chars?)', function () {
    it('should remove whitespace from both ends', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('trim("  hello  ")'), 'hello');
      assert.strictEqual(parser.evaluate('trim("\\n\\ttest\\n")'), 'test');
      assert.strictEqual(parser.evaluate('trim("test")'), 'test');
    });

    it('should remove specified characters from both ends', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('trim("**hello**", "*")'), 'hello');
      assert.strictEqual(parser.evaluate('trim("---test---", "-")'), 'test');
      assert.strictEqual(parser.evaluate('trim("abchelloabc", "abc")'), 'hello');
    });

    it('should handle mixed characters to trim', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('trim("*-hello-*", "*-")'), 'hello');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('trim(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('trim(123)'), /First argument.*must be a string/);
    });

    it('should throw error for non-string second argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('trim("test", 123)'), /Second argument.*must be a string/);
    });
  });

  describe('toUpper(str)', function () {
    it('should convert string to uppercase', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toUpper("hello")'), 'HELLO');
      assert.strictEqual(parser.evaluate('toUpper("HeLLo")'), 'HELLO');
      assert.strictEqual(parser.evaluate('toUpper("")'), '');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toUpper(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('toUpper(123)'), /must be a string/);
    });
  });

  describe('toLower(str)', function () {
    it('should convert string to lowercase', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toLower("HELLO")'), 'hello');
      assert.strictEqual(parser.evaluate('toLower("HeLLo")'), 'hello');
      assert.strictEqual(parser.evaluate('toLower("")'), '');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toLower(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('toLower(123)'), /must be a string/);
    });
  });

  describe('toTitle(str)', function () {
    it('should convert string to title case', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toTitle("hello world")'), 'Hello World');
      assert.strictEqual(parser.evaluate('toTitle("HELLO WORLD")'), 'HELLO WORLD');
      assert.strictEqual(parser.evaluate('toTitle("hello-world-test")'), 'Hello-World-Test');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toTitle(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('toTitle(123)'), /must be a string/);
    });
  });

  describe('split(str, delimiter)', function () {
    it('should split string by delimiter', function () {
      const parser = new Parser();
      assert.deepStrictEqual(parser.evaluate('split("a,b,c", ",")'), ['a', 'b', 'c']);
      assert.deepStrictEqual(parser.evaluate('split("hello world", " ")'), ['hello', 'world']);
      assert.deepStrictEqual(parser.evaluate('split("test", "")'), ['t', 'e', 's', 't']);
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('split(undefined, ",")'), undefined);
      assert.strictEqual(parser.evaluate('split("test", undefined)'), undefined);
    });

    it('should throw error for non-string arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('split(123, ",")'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('split("test", 123)'), /Second argument.*must be a string/);
    });
  });

  describe('repeat(str, times)', function () {
    it('should repeat string specified times', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('repeat("ha", 3)'), 'hahaha');
      assert.strictEqual(parser.evaluate('repeat("test", 0)'), '');
      assert.strictEqual(parser.evaluate('repeat("x", 1)'), 'x');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('repeat(undefined, 3)'), undefined);
      assert.strictEqual(parser.evaluate('repeat("test", undefined)'), undefined);
    });

    it('should throw error for negative or non-integer times', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('repeat("test", -1)'), /non-negative integer/);
      assert.throws(() => parser.evaluate('repeat("test", 2.5)'), /non-negative integer/);
    });

    it('should throw error for non-string or non-number arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('repeat(123, 3)'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('repeat("test", "3")'), /Second argument.*must be a number/);
    });
  });

  describe('reverse(str)', function () {
    it('should reverse a string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('reverse("hello")'), 'olleh');
      assert.strictEqual(parser.evaluate('reverse("a")'), 'a');
      assert.strictEqual(parser.evaluate('reverse("")'), '');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('reverse(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('reverse(123)'), /must be a string/);
    });
  });

  describe('left(str, count)', function () {
    it('should return leftmost characters', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('left("hello", 3)'), 'hel');
      assert.strictEqual(parser.evaluate('left("hello", 0)'), '');
      assert.strictEqual(parser.evaluate('left("hello", 10)'), 'hello');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('left(undefined, 3)'), undefined);
      assert.strictEqual(parser.evaluate('left("test", undefined)'), undefined);
    });

    it('should throw error for negative count', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('left("test", -1)'), /non-negative/);
    });

    it('should throw error for non-string or non-number arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('left(123, 3)'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('left("test", "3")'), /Second argument.*must be a number/);
    });
  });

  describe('right(str, count)', function () {
    it('should return rightmost characters', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('right("hello", 3)'), 'llo');
      assert.strictEqual(parser.evaluate('right("hello", 0)'), '');
      assert.strictEqual(parser.evaluate('right("hello", 10)'), 'hello');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('right(undefined, 3)'), undefined);
      assert.strictEqual(parser.evaluate('right("test", undefined)'), undefined);
    });

    it('should throw error for negative count', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('right("test", -1)'), /non-negative/);
    });

    it('should throw error for non-string or non-number arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('right(123, 3)'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('right("test", "3")'), /Second argument.*must be a number/);
    });
  });

  describe('replace(str, oldValue, newValue)', function () {
    it('should replace all occurrences', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('replace("hello world hello", "hello", "hi")'), 'hi world hi');
      assert.strictEqual(parser.evaluate('replace("test", "x", "y")'), 'test');
      assert.strictEqual(parser.evaluate('replace("aaa", "a", "b")'), 'bbb');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('replace(undefined, "old", "new")'), undefined);
      assert.strictEqual(parser.evaluate('replace("test", undefined, "new")'), undefined);
      assert.strictEqual(parser.evaluate('replace("test", "old", undefined)'), undefined);
    });

    it('should throw error for non-string arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('replace(123, "old", "new")'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('replace("test", 123, "new")'), /Second argument.*must be a string/);
      assert.throws(() => parser.evaluate('replace("test", "old", 123)'), /Third argument.*must be a string/);
    });
  });

  describe('replaceFirst(str, oldValue, newValue)', function () {
    it('should replace only first occurrence', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('replaceFirst("hello world hello", "hello", "hi")'), 'hi world hello');
      assert.strictEqual(parser.evaluate('replaceFirst("test", "x", "y")'), 'test');
      assert.strictEqual(parser.evaluate('replaceFirst("aaa", "a", "b")'), 'baa');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('replaceFirst(undefined, "old", "new")'), undefined);
      assert.strictEqual(parser.evaluate('replaceFirst("test", undefined, "new")'), undefined);
      assert.strictEqual(parser.evaluate('replaceFirst("test", "old", undefined)'), undefined);
    });

    it('should throw error for non-string arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('replaceFirst(123, "old", "new")'), /First argument.*must be a string/);
    });
  });

  describe('naturalSort(arr)', function () {
    it('should sort strings naturally', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('naturalSort(["file10.txt", "file2.txt", "file1.txt"])'),
        ['file1.txt', 'file2.txt', 'file10.txt']
      );
      assert.deepStrictEqual(
        parser.evaluate('naturalSort(["z", "a", "m"])'),
        ['a', 'm', 'z']
      );
    });

    it('should handle mixed alphanumeric content', function () {
      const parser = new Parser();
      assert.deepStrictEqual(
        parser.evaluate('naturalSort(["item100", "item20", "item3"])'),
        ['item3', 'item20', 'item100']
      );
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('naturalSort(undefined)'), undefined);
    });

    it('should throw error for non-array argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('naturalSort("test")'), /must be an array/);
    });
  });

  describe('toNumber(str)', function () {
    it('should convert valid string to number', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toNumber("123")'), 123);
      assert.strictEqual(parser.evaluate('toNumber("-45.67")'), -45.67);
      assert.strictEqual(parser.evaluate('toNumber("0")'), 0);
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toNumber(undefined)'), undefined);
    });

    it('should throw error for invalid number strings', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('toNumber("abc")'), /Cannot convert.*to a number/);
      assert.throws(() => parser.evaluate('toNumber("12abc")'), /Cannot convert.*to a number/);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('toNumber(123)'), /must be a string/);
    });
  });

  describe('toBoolean(str)', function () {
    it('should convert truthy strings to true', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toBoolean("true")'), true);
      assert.strictEqual(parser.evaluate('toBoolean("TRUE")'), true);
      assert.strictEqual(parser.evaluate('toBoolean("1")'), true);
      assert.strictEqual(parser.evaluate('toBoolean("yes")'), true);
      assert.strictEqual(parser.evaluate('toBoolean("on")'), true);
    });

    it('should convert falsy strings to false', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toBoolean("false")'), false);
      assert.strictEqual(parser.evaluate('toBoolean("FALSE")'), false);
      assert.strictEqual(parser.evaluate('toBoolean("0")'), false);
      assert.strictEqual(parser.evaluate('toBoolean("no")'), false);
      assert.strictEqual(parser.evaluate('toBoolean("off")'), false);
      assert.strictEqual(parser.evaluate('toBoolean("")'), false);
    });

    it('should handle whitespace', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toBoolean("  true  ")'), true);
      assert.strictEqual(parser.evaluate('toBoolean("  false  ")'), false);
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('toBoolean(undefined)'), undefined);
    });

    it('should throw error for invalid boolean strings', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('toBoolean("maybe")'), /Cannot convert.*to a boolean/);
      assert.throws(() => parser.evaluate('toBoolean("2")'), /Cannot convert.*to a boolean/);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('toBoolean(1)'), /must be a string/);
    });
  });

  describe('padLeft(str, targetLength, padChar?)', function () {
    it('should pad string on the left with spaces by default', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padLeft("5", 3)'), '  5');
      assert.strictEqual(parser.evaluate('padLeft("test", 10)'), '      test');
    });

    it('should pad string on the left with custom padding character', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padLeft("5", 3, "0")'), '005');
      assert.strictEqual(parser.evaluate('padLeft("test", 10, "-")'), '------test');
    });

    it('should handle multi-character padding string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padLeft("5", 6, "ab")'), 'ababa5');
    });

    it('should not pad if string is already at target length', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padLeft("hello", 5)'), 'hello');
      assert.strictEqual(parser.evaluate('padLeft("hello", 3)'), 'hello');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padLeft(undefined, 5)'), undefined);
      assert.strictEqual(parser.evaluate('padLeft("test", undefined)'), undefined);
    });

    it('should throw error for negative or non-integer target length', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padLeft("test", -1)'), /non-negative integer/);
      assert.throws(() => parser.evaluate('padLeft("test", 2.5)'), /non-negative integer/);
    });

    it('should throw error for non-string or non-number arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padLeft(123, 5)'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('padLeft("test", "5")'), /Second argument.*must be a number/);
    });

    it('should throw error for non-string padding character', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padLeft("test", 5, 0)'), /Third argument.*must be a string/);
    });
  });

  describe('padRight(str, targetLength, padChar?)', function () {
    it('should pad string on the right with spaces by default', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padRight("5", 3)'), '5  ');
      assert.strictEqual(parser.evaluate('padRight("test", 10)'), 'test      ');
    });

    it('should pad string on the right with custom padding character', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padRight("5", 3, "0")'), '500');
      assert.strictEqual(parser.evaluate('padRight("test", 10, "-")'), 'test------');
    });

    it('should handle multi-character padding string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padRight("5", 6, "ab")'), '5ababa');
    });

    it('should not pad if string is already at target length', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padRight("hello", 5)'), 'hello');
      assert.strictEqual(parser.evaluate('padRight("hello", 3)'), 'hello');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padRight(undefined, 5)'), undefined);
      assert.strictEqual(parser.evaluate('padRight("test", undefined)'), undefined);
    });

    it('should throw error for negative or non-integer target length', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padRight("test", -1)'), /non-negative integer/);
      assert.throws(() => parser.evaluate('padRight("test", 2.5)'), /non-negative integer/);
    });

    it('should throw error for non-string or non-number arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padRight(123, 5)'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('padRight("test", "5")'), /Second argument.*must be a number/);
    });

    it('should throw error for non-string padding character', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padRight("test", 5, 0)'), /Third argument.*must be a string/);
    });
  });

  describe('padBoth(str, targetLength, padChar?)', function () {
    it('should pad string on both sides with spaces by default', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padBoth("hi", 6)'), '  hi  ');
      assert.strictEqual(parser.evaluate('padBoth("test", 10)'), '   test   ');
    });

    it('should pad string on both sides with custom padding character', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padBoth("hi", 6, "-")'), '--hi--');
      assert.strictEqual(parser.evaluate('padBoth("test", 10, "*")'), '***test***');
    });

    it('should add extra padding on the right when odd number of padding characters needed', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padBoth("hi", 5)'), ' hi  ');
      assert.strictEqual(parser.evaluate('padBoth("x", 4)'), ' x  ');
    });

    it('should handle multi-character padding string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padBoth("x", 5, "ab")'), 'abxab');
    });

    it('should not pad if string is already at target length', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padBoth("hello", 5)'), 'hello');
      assert.strictEqual(parser.evaluate('padBoth("hello", 3)'), 'hello');
    });

    it('should return undefined if any argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('padBoth(undefined, 5)'), undefined);
      assert.strictEqual(parser.evaluate('padBoth("test", undefined)'), undefined);
    });

    it('should throw error for negative or non-integer target length', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padBoth("test", -1)'), /non-negative integer/);
      assert.throws(() => parser.evaluate('padBoth("test", 2.5)'), /non-negative integer/);
    });

    it('should throw error for non-string or non-number arguments', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padBoth(123, 5)'), /First argument.*must be a string/);
      assert.throws(() => parser.evaluate('padBoth("test", "5")'), /Second argument.*must be a number/);
    });

    it('should throw error for non-string padding character', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('padBoth("test", 5, 0)'), /Third argument.*must be a string/);
    });
  });

  describe('slice(s, start, end?)', function () {
    describe('with strings', function () {
      it('should extract a portion of a string', function () {
        const parser = new Parser();
        assert.strictEqual(parser.evaluate('slice("hello world", 0, 5)'), 'hello');
        assert.strictEqual(parser.evaluate('slice("hello world", 6, 11)'), 'world');
        assert.strictEqual(parser.evaluate('slice("hello world", 6)'), 'world');
      });

      it('should handle negative indices', function () {
        const parser = new Parser();
        assert.strictEqual(parser.evaluate('slice("hello world", -5)'), 'world');
        assert.strictEqual(parser.evaluate('slice("hello world", -5, -1)'), 'worl');
        assert.strictEqual(parser.evaluate('slice("hello world", 0, -6)'), 'hello');
      });

      it('should return empty string when start >= end', function () {
        const parser = new Parser();
        assert.strictEqual(parser.evaluate('slice("hello", 3, 2)'), '');
        assert.strictEqual(parser.evaluate('slice("hello", 5, 5)'), '');
      });

      it('should return undefined if string is undefined', function () {
        const parser = new Parser();
        assert.strictEqual(parser.evaluate('slice(undefined, 0, 5)'), undefined);
      });

      it('should return undefined if start is undefined', function () {
        const parser = new Parser();
        assert.strictEqual(parser.evaluate('slice("hello", undefined)'), undefined);
      });

      it('should throw error for non-string and non-array first argument', function () {
        const parser = new Parser();
        assert.throws(() => parser.evaluate('slice(123, 0, 5)'), /First argument.*must be a string or array/);
      });

      it('should throw error for non-number start', function () {
        const parser = new Parser();
        assert.throws(() => parser.evaluate('slice("hello", "0", 5)'), /Second argument.*must be a number/);
      });

      it('should throw error for non-number end', function () {
        const parser = new Parser();
        assert.throws(() => parser.evaluate('slice("hello", 0, "5")'), /Third argument.*must be a number/);
      });
    });

    describe('with arrays', function () {
      it('should extract a portion of an array', function () {
        const parser = new Parser();
        assert.deepStrictEqual(parser.evaluate('slice([1,2,3,4,5], 0, 3)'), [1, 2, 3]);
        assert.deepStrictEqual(parser.evaluate('slice([1,2,3,4,5], 2)'), [3, 4, 5]);
      });

      it('should handle negative indices with arrays', function () {
        const parser = new Parser();
        assert.deepStrictEqual(parser.evaluate('slice([1,2,3,4,5], -2)'), [4, 5]);
        assert.deepStrictEqual(parser.evaluate('slice([1,2,3,4,5], -3, -1)'), [3, 4]);
      });

      it('should return empty array when start >= end', function () {
        const parser = new Parser();
        assert.deepStrictEqual(parser.evaluate('slice([1,2,3], 2, 1)'), []);
      });
    });
  });

  describe('urlEncode(str)', function () {
    it('should URL-encode a string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('urlEncode("hello world")'), 'hello%20world');
      assert.strictEqual(parser.evaluate('urlEncode("foo=bar&baz=qux")'), 'foo%3Dbar%26baz%3Dqux');
      assert.strictEqual(parser.evaluate('urlEncode("test")'), 'test');
    });

    it('should handle special characters', function () {
      const parser = new Parser();
      // encodeURIComponent encodes @, #, $, %, ^, &, but not !, *, (, )
      assert.strictEqual(parser.evaluate('urlEncode("!@#$%^&*()")'), '!%40%23%24%25%5E%26*()');
      assert.strictEqual(parser.evaluate('urlEncode("a/b/c")'), 'a%2Fb%2Fc');
    });

    it('should return empty string for empty input', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('urlEncode("")'), '');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('urlEncode(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('urlEncode(123)'), /must be a string/);
    });
  });

  describe('base64Encode(str)', function () {
    it('should Base64-encode a string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Encode("hello")'), 'aGVsbG8=');
      assert.strictEqual(parser.evaluate('base64Encode("Hello World")'), 'SGVsbG8gV29ybGQ=');
      assert.strictEqual(parser.evaluate('base64Encode("test")'), 'dGVzdA==');
    });

    it('should handle empty string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Encode("")'), '');
    });

    it('should handle UTF-8 characters', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Encode("héllo")'), 'aMOpbGxv');
      assert.strictEqual(parser.evaluate('base64Encode("日本語")'), '5pel5pys6Kqe');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Encode(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('base64Encode(123)'), /must be a string/);
    });
  });

  describe('base64Decode(str)', function () {
    it('should Base64-decode a string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Decode("aGVsbG8=")'), 'hello');
      assert.strictEqual(parser.evaluate('base64Decode("SGVsbG8gV29ybGQ=")'), 'Hello World');
      assert.strictEqual(parser.evaluate('base64Decode("dGVzdA==")'), 'test');
    });

    it('should handle empty string', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Decode("")'), '');
    });

    it('should handle UTF-8 characters', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Decode("aMOpbGxv")'), 'héllo');
      assert.strictEqual(parser.evaluate('base64Decode("5pel5pys6Kqe")'), '日本語');
    });

    it('should return undefined if argument is undefined', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Decode(undefined)'), undefined);
    });

    it('should throw error for non-string argument', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('base64Decode(123)'), /must be a string/);
    });

    it('should throw error for invalid base64 string', function () {
      const parser = new Parser();
      assert.throws(() => parser.evaluate('base64Decode("!!invalid!!")'), /Invalid base64 string/);
    });

    it('should roundtrip with base64Encode', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('base64Decode(base64Encode("hello"))'), 'hello');
      assert.strictEqual(parser.evaluate('base64Decode(base64Encode("日本語"))'), '日本語');
    });
  });

  describe('coalesce(a, b, ...)', function () {
    it('should return the first non-null, non-empty string value', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('coalesce("hello", "world")'), 'hello');
      assert.strictEqual(parser.evaluate('coalesce("", "world")'), 'world');
      assert.strictEqual(parser.evaluate('coalesce(null, "world")'), 'world');
      assert.strictEqual(parser.evaluate('coalesce(undefined, "world")'), 'world');
    });

    it('should work with multiple arguments', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('coalesce("", null, undefined, "found")'), 'found');
      assert.strictEqual(parser.evaluate('coalesce(null, null, null, "last")'), 'last');
    });

    it('should return non-string values if they are first non-null/non-empty', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('coalesce(null, 42)'), 42);
      assert.strictEqual(parser.evaluate('coalesce("", true)'), true);
      assert.deepStrictEqual(parser.evaluate('coalesce(null, [1,2,3])'), [1, 2, 3]);
    });

    it('should return 0 as a valid value (not empty)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('coalesce(0, 42)'), 0);
      assert.strictEqual(parser.evaluate('coalesce(null, 0, 42)'), 0);
    });

    it('should return false as a valid value (not empty)', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('coalesce(false, true)'), false);
      assert.strictEqual(parser.evaluate('coalesce(null, false, true)'), false);
    });

    it('should return last value if all are null/undefined/empty', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('coalesce(null, undefined, "")'), '');
      assert.strictEqual(parser.evaluate('coalesce("", "", "")'), '');
      assert.strictEqual(parser.evaluate('coalesce(null, null, null)'), null);
    });

    it('should handle single argument', function () {
      const parser = new Parser();
      assert.strictEqual(parser.evaluate('coalesce("hello")'), 'hello');
      assert.strictEqual(parser.evaluate('coalesce(null)'), null);
      assert.strictEqual(parser.evaluate('coalesce("")'), '');
    });
  });
});
