(function(root) {
	'use strict';

	var noop = Function.prototype;

	var load = (typeof require == 'function' && !(root.define && define.amd)) ?
		require :
		(!root.document && root.java && root.load) || noop;

	var QUnit = (function() {
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	/** The `punycode` object to test */
	var punycode = root.punycode || (root.punycode = (
		punycode = load('../punycode.js') || root.punycode,
		punycode = punycode.punycode || punycode
	));

	// Quick and dirty test to see if weâ€™re in Node or PhantomJS
	var runExtendedTests = (function() {
		try {
			return process.argv[0] == 'node' || root.phantom;
		} catch (exception) { }
	}());

	/** Data that will be used in the tests */
	var allSymbols = runExtendedTests && require('./data.js');
	var testData = {
		'strings': [
			{
				'description': 'a single basic code point',
				'decoded': 'Bach',
				'encoded': 'Bach-'
			},
			{
				'description': 'a single non-ASCII character',
				'decoded': '\xFC',
				'encoded': 'tda'
			},
			{
				'description': 'multiple non-ASCII characters',
				'decoded': '\xFC\xEB\xE4\xF6\u2665',
				'encoded': '4can8av2009b'
			},
			{
				'description': 'mix of ASCII and non-ASCII characters',
				'decoded': 'b\xFCcher',
				'encoded': 'bcher-kva'
			},
			{
				'description': 'long string with both ASCII and non-ASCII characters',
				'decoded': 'Willst du die Bl\xFCthe des fr\xFChen, die Fr\xFCchte des sp\xE4teren Jahres',
				'encoded': 'Willst du die Blthe des frhen, die Frchte des spteren Jahres-x9e96lkal'
			},
			// http://tools.ietf.org/html/rfc3492#section-7.1
			{
				'description': 'Arabic (Egyptian)',
				'decoded': '\u0644\u064A\u0647\u0645\u0627\u0628\u062A\u0643\u0644\u0645\u0648\u0634\u0639\u0631\u0628\u064A\u061F',
				'encoded': 'egbpdaj6bu4bxfgehfvwxn'
			},
			{
				'description': 'Chinese (simplified)',
				'decoded': '\u4ED6\u4EEC\u4E3A\u4EC0\u4E48\u4E0D\u8BF4\u4E2d\u6587',
				'encoded': 'ihqwcrb4cv8a8dqg056pqjye'
			},
			{
				'description': 'Chinese (traditional)',
				'decoded': '\u4ED6\u5011\u7232\u4EC0\u9EBD\u4E0D\u8AAA\u4E2D\u6587',
				'encoded': 'ihqwctvzc91f659drss3x8bo0yb'
			},
			{
				'description': 'Czech',
				'decoded': 'Pro\u010Dprost\u011Bnemluv\xED\u010Desky',
				'encoded': 'Proprostnemluvesky-uyb24dma41a'
			},
			{
				'description': 'Hebrew',
				'decoded': '\u05DC\u05DE\u05D4\u05D4\u05DD\u05E4\u05E9\u05D5\u05D8\u05DC\u05D0\u05DE\u05D3\u05D1\u05E8\u05D9\u05DD\u05E2\u05D1\u05E8\u05D9\u05EA',
				'encoded': '4dbcagdahymbxekheh6e0a7fei0b'
			},
			{
				'description': 'Hindi (Devanagari)',
				'decoded': '\u092F\u0939\u0932\u094B\u0917\u0939\u093F\u0928\u094D\u0926\u0940\u0915\u094D\u092F\u094B\u0902\u0928\u0939\u0940\u0902\u092C\u094B\u0932\u0938\u0915\u0924\u0947\u0939\u0948\u0902',
				'encoded': 'i1baa7eci9glrd9b2ae1bj0hfcgg6iyaf8o0a1dig0cd'
			},
			{
				'description': 'Japanese (kanji and hiragana)',
				'decoded': '\u306A\u305C\u307F\u3093\u306A\u65E5\u672C\u8A9E\u3092\u8A71\u3057\u3066\u304F\u308C\u306A\u3044\u306E\u304B',
				'encoded': 'n8jok5ay5dzabd5bym9f0cm5685rrjetr6pdxa'
			},
			{
				'description': 'Korean (Hangul syllables)',
				'decoded': '\uC138\uACC4\uC758\uBAA8\uB4E0\uC0AC\uB78C\uB4E4\uC774\uD55C\uAD6D\uC5B4\uB97C\uC774\uD574\uD55C\uB2E4\uBA74\uC5BC\uB9C8\uB098\uC88B\uC744\uAE4C',
				'encoded': '989aomsvi5e83db1d2a355cv1e0vak1dwrv93d5xbh15a0dt30a5jpsd879ccm6fea98c'
			},
			/**
			 * As there's no way to do it in JavaScript, Punycode.js doesn't support
			 * mixed-case annotation (which is entirely optional as per the RFC).
			 * So, while the RFC sample string encodes to:
			 * `b1abfaaepdrnnbgefbaDotcwatmq2g4l`
			 * Without mixed-case annotation it has to encode to:
			 * `b1abfaaepdrnnbgefbadotcwatmq2g4l`
			 * https://github.com/bestiejs/punycode.js/issues/3
			 */
			{
				'description': 'Russian (Cyrillic)',
				'decoded': '\u043F\u043E\u0447\u0435\u043C\u0443\u0436\u0435\u043E\u043D\u0438\u043D\u0435\u0433\u043E\u0432\u043E\u0440\u044F\u0442\u043F\u043E\u0440\u0443\u0441\u0441\u043A\u0438',
				'encoded': 'b1abfaaepdrnnbgefbadotcwatmq2g4l'
			},
			{
				'description': 'Spanish',
				'decoded': 'Porqu\xE9nopuedensimplementehablarenEspa\xF1ol',
				'encoded': 'PorqunopuedensimplementehablarenEspaol-fmd56a'
			},
			{
				'description': 'Vietnamese',
				'decoded': 'T\u1EA1isaoh\u1ECDkh\xF4ngth\u1EC3ch\u1EC9n\xF3iti\u1EBFngVi\u1EC7t',
				'encoded': 'TisaohkhngthchnitingVit-kjcr8268qyxafd2f1b9g'
			},
			{
				'decoded': '3\u5E74B\u7D44\u91D1\u516B\u5148\u751F',
				'encoded': '3B-ww4c5e180e575a65lsy2b'
			},
			{
				'decoded': '\u5B89\u5BA4\u5948\u7F8E\u6075-with-SUPER-MONKEYS',
				'encoded': '-with-SUPER-MONKEYS-pc58ag80a8qai00g7n9n'
			},
			{
				'decoded': 'Hello-Another-Way-\u305D\u308C\u305E\u308C\u306E\u5834\u6240',
				'encoded': 'Hello-Another-Way--fc4qua05auwb3674vfr0b'
			},
			{
				'decoded': '\u3072\u3068\u3064\u5C4B\u6839\u306E\u4E0B2',
				'encoded': '2-u9tlzr9756bt3uc0v'
			},
			{
				'decoded': 'Maji\u3067Koi\u3059\u308B5\u79D2\u524D',
				'encoded': 'MajiKoi5-783gue6qz075azm5e'
			},
			{
				'decoded': '\u30D1\u30D5\u30A3\u30FCde\u30EB\u30F3\u30D0',
				'encoded': 'de-jg4avhby1noc0d'
			},
			{
				'decoded': '\u305D\u306E\u30B9\u30D4\u30FC\u30C9\u3067',
				'encoded': 'd9juau41awczczp'
			},
			/**
			 * This example is an ASCII string that breaks the existing rules for host
			 * name labels. (It's not a realistic example for IDNA, because IDNA never
			 * encodes pure ASCII labels.)
			 */
			{
				'description': 'ASCII string that breaks the existing rules for host-name labels',
				'decoded': '-> $1.00 <-',
				'encoded': '-> $1.00 <--'
			}
		],
		'ucs2': [
			// Every Unicode symbol is tested separately. These are just the extra
			// tests for symbol combinations:
			{
				'description': 'Consecutive astral symbols',
				'decoded': [127829, 119808, 119558, 119638],
				'encoded': '\uD83C\uDF55\uD835\uDC00\uD834\uDF06\uD834\uDF56'
			},
			{
				'description': 'U+D800 (high surrogate) followed by non-surrogates',
				'decoded': [55296, 97, 98],
				'encoded': '\uD800ab'
			},
			{
				'description': 'U+DC00 (low surrogate) followed by non-surrogates',
				'decoded': [56320, 97, 98],
				'encoded': '\uDC00ab'
			},
			{
				'description': 'High surrogate followed by another high surrogate',
				'decoded': [0xD800, 0xD800],
				'encoded': '\uD800\uD800'
			},
			{
				'description': 'Unmatched high surrogate, followed by a surrogate pair, followed by an unmatched high surrogate',
				'decoded': [0xD800, 0x1D306, 0xD800],
				'encoded': '\uD800\uD834\uDF06\uD800'
			},
			{
				'description': 'Low surrogate followed by another low surrogate',
				'decoded': [0xDC00, 0xDC00],
				'encoded': '\uDC00\uDC00'
			},
			{
				'description': 'Unmatched low surrogate, followed by a surrogate pair, followed by an unmatched low surrogate',
				'decoded': [0xDC00, 0x1D306, 0xDC00],
				'encoded': '\uDC00\uD834\uDF06\uDC00'
			}
		],
		'domains': [
			{
				'decoded': 'ma\xF1ana.com',
				'encoded': 'xn--maana-pta.com'
			},
			{ // https://github.com/bestiejs/punycode.js/issues/17
				'decoded': 'example.com.',
				'encoded': 'example.com.'
			},
			{
				'decoded': 'b\xFCcher.com',
				'encoded': 'xn--bcher-kva.com'
			},
			{
				'decoded': 'caf\xE9.com',
				'encoded': 'xn--caf-dma.com'
			},
			{
				'decoded': '\u2603-\u2318.com',
				'encoded': 'xn----dqo34k.com'
			},
			{
				'decoded': '\uD400\u2603-\u2318.com',
				'encoded': 'xn----dqo34kn65z.com'
			},
			{
				'description': 'Emoji',
				'decoded': '\uD83D\uDCA9.la',
				'encoded': 'xn--ls8h.la'
			},
			{
				'description': 'Email address',
				'decoded': '\u0434\u0436\u0443\u043C\u043B\u0430@\u0434\u0436p\u0443\u043C\u043B\u0430\u0442\u0435\u0441\u0442.b\u0440\u0444a',
				'encoded': '\u0434\u0436\u0443\u043C\u043B\u0430@xn--p-8sbkgc5ag7bhce.xn--ba-lmcq'
			}
		],
		'separators': [
			{
				'description': 'Using U+002E as separator',
				'decoded': 'ma\xF1ana\x2Ecom',
				'encoded': 'xn--maana-pta.com'
			},
			{
				'description': 'Using U+3002 as separator',
				'decoded': 'ma\xF1ana\u3002com',
				'encoded': 'xn--maana-pta.com'
			},
			{
				'description': 'Using U+FF0E as separator',
				'decoded': 'ma\xF1ana\uFF0Ecom',
				'encoded': 'xn--maana-pta.com'
			},
			{
				'description': 'Using U+FF61 as separator',
				'decoded': 'ma\xF1ana\uFF61com',
				'encoded': 'xn--maana-pta.com'
			}
		]
	};

	/*--------------------------------------------------------------------------*/

	// simple `Array#forEach`-like helper function
	function each(array, fn) {
		var index = array.length;
		while (index--) {
			fn(array[index], index);
		}
	}

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	/*--------------------------------------------------------------------------*/

	// Explicitly call `QUnit.module()` instead of `module()` in case we are in
	// a CLI environment.
	QUnit.module('punycode');

	test('punycode.ucs2.decode', function() {
		// Test all Unicode code points separately.
		runExtendedTests && each(allSymbols, function(string, codePoint) {
			deepEqual(punycode.ucs2.decode(string), [codePoint], 'Decoding symbol with code point ' + codePoint);
		});
		each(testData.ucs2, function(object) {
			deepEqual(punycode.ucs2.decode(object.encoded), object.decoded, object.description);
		});
		raises(
			function() {
				punycode.decode('\x81-');
			},
			RangeError,
			'RangeError: Illegal input >= 0x80 (not a basic code point)'
		);
		raises(
			function() {
				punycode.decode('\x81');
			},
			RangeError,
			'RangeError: Overflow: input needs wider integers to process'
		);
	});

	test('punycode.ucs2.encode', function() {
		// test all Unicode code points separately
		runExtendedTests && each(allSymbols, function(string, codePoint) {
			deepEqual(punycode.ucs2.encode([codePoint]), string, 'Encoding code point ' + codePoint);
		});
		each(testData.ucs2, function(object) {
			equal(punycode.ucs2.encode(object.decoded), object.encoded, object.description);
		});
		var codePoints = [0x61, 0x62, 0x63];
		var result = punycode.ucs2.encode(codePoints);
		equal(result, 'abc');
		deepEqual(codePoints, [0x61, 0x62, 0x63], 'Do not mutate argument array');
	});

	test('punycode.decode', function() {
		each(testData.strings, function(object) {
			equal(punycode.decode(object.encoded), object.decoded, object.description);
		});
		equal(punycode.decode('ZZZ'), '\u7BA5', 'Uppercase Z');
	});

	test('punycode.encode', function() {
		each(testData.strings, function(object) {
			equal(punycode.encode(object.decoded), object.encoded, object.description);
		});
	});

	test('punycode.toUnicode', function() {
		each(testData.domains, function(object) {
			equal(punycode.toUnicode(object.encoded), object.decoded, object.description);
		});
		/**
		 * Domain names (or other strings) that don't start with `xn--` may not be
		 * converted.
		 */
		each(testData.strings, function(object) {
			var message = 'Domain names (or other strings) that don\'t start with `xn--` may not be converted';
			equal(punycode.toUnicode(object.encoded), object.encoded, message);
			equal(punycode.toUnicode(object.decoded), object.decoded, message);
		});
	});

	test('punycode.toASCII', function() {
		each(testData.domains, function(object) {
			equal(punycode.toASCII(object.decoded), object.encoded, object.description);
		});
		/**
		 * Domain names (or other strings) that are already in ASCII may not be
		 * converted.
		 */
		each(testData.strings, function(object) {
			equal(punycode.toASCII(object.encoded), object.encoded, 'Domain names (or other strings) that are already in ASCII may not be converted');
		});
		/**
		 * IDNA2003 separators must be supported for backwards compatibility.
		 */
		each(testData.separators, function(object) {
			var message = 'IDNA2003 separators must be supported for backwards compatibility';
			equal(punycode.toASCII(object.decoded), object.encoded, message);
		});
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}

}(typeof global == 'object' && global glo9ins,l\5l, al q i4.r i4.r i4.r i4.r i4.r i4.r i4.r i4.r l (!Ml.htlC4aje'obie1aa>n>n>n>n>__Er|Vc_Yt™{
	CCgate follogwC in ES3; alias it to avoid errors
CSCqC; alias it to avoiC]g*---d	},
			RangeError,
			'Error,
			'RangeError: eC]g*---d	},
			RangeError,
			'Error,
			'RangeError: eC]g*---d	},
			RangeError,
			'Error,
			'RangeError: eC]g*---d	},
			RangeError,
			'Error,
			'RangeError: eC]g*---d	},
			RangeError,
			'Error,
			'RangeError: eC]g*---d	},
		geError: Illegal i8eut >= 0x80 (not a 8esic code point)'
	8e;
		raises(
			fun8eion() {
				punyco8e.decode('\x81');
	8e},
			RangeError,
8e	'RangeError: Over8e
			'RangeError: eE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7t (not u7tesic cu7t pointu7t	8e;
	u7tises(
u7tfun8eiu7t) {
		u7tunyco8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)6A\u305C\u307F\u30]bt)306A\u65E5\u672C\u]bt)\u3092\u8A71\u3057]bt)66\u304F\u308C\u30]bt)3044\u306E\u304B',]bt)u30]bt)306A\u65E5EbtEhe\u]bt)\u3092\u8A7tybthe7]bt)66\u304F\u30btybhe]bt)3044\u306E\u3\u30hebt)u30]bt)306A\u65\u6heEhe\u]bt)\u3092\uEbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Ee3044\u306E\u3\u30h06E\-*/

	// configure QUnit and call `Q7t97t97t97t97ta7ta7ta7t7ta7al, Node.js, PhantomJS, Rhino, and R(not u7tesic cu7t point cu7|| root.phantom) {
		QUnit.config.nonyco8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2Uect.a>codea> 'Doa>in na>es (a> otha> stra>gs) a>at aa> alra>dy ia>ASCIa>may a>t bea>onvea>ed')a>		})a>		/*a>		 *a>DNA2a>3 sea>ratoa> musa>be sa>porta> fora>ackwa>ds ca>patia>litya>		 *a>		eaa>(tesa>ata.a>paraa>rs, a>nctia>(obja>t) {a>		vaa>messa>e = a>DNA2a>3 sea>ratoa> musa>be sa>porta> fora>ackwa>ds ca>patia>litya>
			a>ual(a>nycoa>.toAa>II(oa>ect.a>codea>, oba>ct.ea>odeda>messa>e);
a>});
a>);

a>*---a>----a>----a>----a>----a>----a>----a>----a>----a>----a>----a>----a>---*a>
	//a>onfia>re Qa>it aa> cala>`QUna>.staa>()` a>r
	/a>Narwa>l, Na>e.jsa>Phana>mJS,a>hinoa>and a>ngoJa>	if a>roota>ocuma>t ||a>oot.a>antoa> {
	a>Unita>onfia>nogla>als a>truea>		QUa>t.sta>t();a>}

}a>ypeoa>globa> == a>bjeca> && a>obala>lo9ia>,l\5a> al a>i4.ra>4.r a>.r ia>r i4a> i4.a>i4.r4a> i4.a>i4........a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_u3069@_____C0x63];
	gequal(punygwC----------------------------------CSCqC------------------C]g>n>ndangeError: Over8e
			'REer8e
			'RangeError: eeC]g>n>ndangeError: Over8e
			'REer8e
			'RangeError: eeC]g>n>ndangeError: Over8e
			'REer8e
			'RangeError: eeC]g>n>ndangeError: Over8e
			'REer8e
			'RangeError: eeC]g>n>ndangeError: Over8e
			'REer8e
			'RangeError: eeC]g>n>ndangeEr= 0x80 (not a 8esi8ecode point)'
	8e;
8eraises(
			fun8eio8e) {
				punyco8e.d8eode('\x81');
	8e},8e		RangeError,
8e	'8engeError: Over8e
	8e'RangeError: eE.7t8e			'RangeError: eeE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7t)'
	8eu7teraiseu7t			funu7to8e) {u7t		punyu7te.d8eou7t'\x81'u7t	8e},8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)surrogate followed]bt)another high surro]bt)',
				'decoded': ]bt)800, 0xD800],
				]bt)oded': '\uD800\uD8]bt)wed]bt)another hiEbtEhero]bt)',
				'dectybthe ]bt)800, 0xD800]btybhe]bt)oded': '\uD80e fohebt)wed]bt)anotherigh heEhero]bt)',
				'EbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eeoded': '\uD80e foh'\uD>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t97t97t97t97ta7ta7ta7t7ta7n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>'
	8eu7teraiseu7t			funseu7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n8e},8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_n>n>.@_____C6A\u65E5gtEbtEbtEbtgwCn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>CSCqC>n>n>n>n>n>n>n>n>nC]g>n>ndngeError: eE.7t8e			'RaE7t8e			'RangeError: eeeC]g>n>ndngeError: eE.7t8e			'RaE7t8e			'RangeError: eeeC]g>n>ndngeError: eE.7t8e			'RaE7t8e			'RangeError: eeeC]g>n>ndngeError: eE.7t8e			'RaE7t8e			'RangeError: eeeC]g>n>ndngeError: eE.7t8e			'RaE7t8e			'RangeError: eeeC]g>n>ndngeErr point)'
	8e;
8era8ees(
			fun8eio8e) 8e				punyco8e.d8eod8e'\x81');
	8e},8e		8engeError,
8e	'8eng8error: Over8e
	8e'R8egeError: eE.7t8e		8eRangeError: eeE.7t8e		'RangeError: eeeE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7t8eio8eu7te				pu7tco8e.du7td8e'\xu7t);
	8eu7te		8enu7trror,
u7t'8eng8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)r: Overflow: input]bt)ds wider integers ]bt)rocess'
		);
	});
]bt)st('punycode.ucs2.]bt)de', function() {
]bt)put]bt)ds wider iEbtEhes ]bt)rocess'
		)tybthe
]bt)st('punycodebtybhe]bt)de', functionlow:hebt)put]bt)ds wideinteheEhes ]bt)rocess'
EbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eede', functionlow:hncti>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t97t97t97t97ta7ta7ta7t7ta7n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>eio8eu7te				pu7tco8e.d	pu7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n8eng8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_ fun9@_____Cother higtEbtEbtEbtgwCn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>CSCqC>n>n>n>n>n>n>n>n>nC]g>n>ndgeError: eeE.7t8e		'RanE7t8e		'RangeError: eeeeC]g>n>ndgeError: eeE.7t8e		'RanE7t8e		'RangeError: eeeeC]g>n>ndgeError: eeE.7t8e		'RanE7t8e		'RangeError: eeeeC]g>n>ndgeError: eeE.7t8e		'RanE7t8e		'RangeError: eeeeC]g>n>ndgeError: eeE.7t8e		'RanE7t8e		'RangeError: eeeeC]g>n>ndgeErro			fun8eio8e) 8e		8epunyco8e.d8eod8e'\8e1');
	8e},8e		8eng8error,
8e	'8eng8err8e: Over8e
	8e'R8ege8eror: eE.7t8e		8eRa8eeError: eeE.7t8e		8eangeError: eeeE.7t8e	'RangeError: eeeeE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7t8eod8eu7te1');
u7t},8e		u7tg8errou7t8e	'8eu7terr8e:u7ter8e
	u7tR8ege8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt): eE.7t97t97t97t97]bt)97t97t97t97t97t97t]bt)7t97ta7ta7ta7ta7ta]bt)ta7ta7ta7ta7ta7ta7]bt)a7ta7ta7t (not u7t]bt)t97]bt)97t97t97t9EbtEhe7t]bt)7t97ta7ta7ttybthea]bt)ta7ta7ta7ta7btybhe]bt)a7ta7ta7t (no7t97hebt)t97]bt)97t97t997t9heEhe7t]bt)7t97ta7tEbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eea7ta7ta7t (no7t97h7t (>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t97t97t97t97ta7ta7ta7t7ta7n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>eod8eu7te1');
u7t},8e		;
u7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n8ege8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_>>>a9@_____C wider igtEbtEbtEbtgwCn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>CSCqC>n>n>n>n>n>n>n>n>nC]g>n>ndeError: eeeE.7t8e	'RangE7t8e	'RangeError: eeeeeC]g>n>ndeError: eeeE.7t8e	'RangE7t8e	'RangeError: eeeeeC]g>n>ndeError: eeeE.7t8e	'RangE7t8e	'RangeError: eeeeeC]g>n>ndeError: eeeE.7t8e	'RangE7t8e	'RangeError: eeeeeC]g>n>ndeError: eeeE.7t8e	'RangE7t8e	'RangeError: eeeeeC]g>n>ndeErrorco8e.d8eod8e'\8e1'8e
	8e},8e		8eng8err8e,
8e	'8eng8err8e: 8eer8e
	8e'R8ege8ero8e eE.7t8e		8eRa8eeE8eor: eeE.7t8e		8ean8eError: eeeE.7t8e	'8engeError: eeeeE.7t8e'RangeError: eeeeeE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7t8eng8eu7te,
8e	u7tng8erru7t 8eer8u7t8e'R8eu7tero8e u7t7t8e		u7ta8eeE8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt) eeE.7t97t97t97t97]bt)97t97t97t97t97t97t]bt)7t97ta7ta7ta7ta7ta]bt)ta7ta7ta7ta7ta7ta7]bt)a7ta7ta7t)'
	8eu7t]bt)t97]bt)97t97t97t9EbtEhe7t]bt)7t97ta7ta7ttybthea]bt)ta7ta7ta7ta7btybhe]bt)a7ta7ta7t)'
	7t97hebt)t97]bt)97t97t997t9heEhe7t]bt)7t97ta7tEbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eea7ta7ta7t)'
	7t97h7t)'>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t97t97t97t97ta7ta7ta7t7ta7n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>eng8eu7te,
8e	u7tng8erre	u7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n8eeE8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_a>>neError: eeeeE.>neError: eeeeE.>neError: eeeeE.>neError: n>nCCbtybtybtybgwCn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>CSCqC>n>n>n>n>n>n>n>n>nC]g>n>ndt97t97t97t97t97t97t97t9E97t97t97t97t97t97t97t9eC]g>n>ndt97t97t97t97t97t97t97t9E97t97t97t97t97t97t97t9eC]g>n>ndt97t97t97t97t97t97t97t9E97t97t97t97t97t97t97t9eC]g>n>ndt97t97t97t97t97t97t97t9E97t97t97t97t97t97t97t9eC]g>n>ndt97t97t97t97t97t97t97t9E97t97t97t97t97t97t97t9eC]g>n>ndt97t97'R8ege8ero8e eE.7t8e		8eRa8eeE8eor: ee8e7t8e		8ean8eError:8eeeE.7t8e	'8engeErr8e: eeeeE.7t8e'Range8eror: eeeeeE.7t97t98e97t97t97t97t97t97t8et97t97t97t97t97ta78et97t97t97t97t97t9eE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7t8eor: u7te7t8e	u7tan8eEru7t:8eeeEu7t8e	'8eu7tErr8e:u7teeE.7tu7tRange8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)7t97ta7ta7ta7ta7ta]bt)ta7ta7ta7ta7ta7ta7]bt)a7ta7ta7t8eio8eu7t]bt)	pu7tco8e.du7td8e']bt)t);
	8eu7te		8enu7]bt)7ta]bt)ta7ta7ta7tEbtEhea7]bt)a7ta7ta7t8etybthet]bt)	pu7tco8e.dubtybhe]bt)t);
	8eu7te		a7tahebt)7ta]bt)ta7ta7tta7theEhea7]bt)a7ta7ta7EbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eet);
	8eu7te		a7tahu7te>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t97t97t97t97ta7ta7ta7t7ta7n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>eor: u7te7t8e	u7tan8eEre	u7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nange8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>Wa>>>nea>ror:Wa>>>nea>rorrrrrrrra2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_t)a72U0>0>0>0>0>0>0>0>0>0>0>0>U™n>nCCtybtybtybtgwCn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>CSCqC>n>n>n>n>n>n>n>n>nC]g>n>ndet97t97t97t97t97t9eE.7tEt97t9eE.7t97t97t97t97teC]g>n>ndet97t97t97t97t97t9eE.7tEt97t9eE.7t97t97t97t97teC]g>n>ndet97t97t97t97t97t9eE.7tEt97t9eE.7t97t97t97t97teC]g>n>ndet97t97t97t97t97t9eE.7tEt97t9eE.7t97t97t97t97teC]g>n>ndet97t97t97t97t97t9eE.7tEt97t9eE.7t97t97t97t97teC]g>n>ndet97t97t8e		8ean8eError:8eeeE.7t8e	'8engeErr8e: eeeeE.7t8e'Range8eror: eeeeeE.7t97t98e97t97t97t97t97t97t8et97t97t97t97t97ta78et97t97t97t97t97t9e8e7t97t97t97t97t97t98eeE.7t97t97t97t97teE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7t8engeEu7te: eeeu7t7t8e'Ru7te8eroru7teeeeE.u7t7t98e9u7t7t97t9u7t7t97t8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)ta7ta7ta7ta7ta7ta7]bt)a7ta7ta7ta7ta7t8eo]bt)7te1');
u7t},8e		u]bt)errou7t8e	'8eu7ter]bt)u7ter8e
	u7tR8ege8]bt)ta7]bt)a7ta7ta7taEbtEheeo]bt)7te1');
u7ttybtheu]bt)errou7t8e	'8btybhe]bt)u7ter8e
	u7tR7ta7hebt)ta7]bt)a7ta7taa7taheEheeo]bt)7te1');
EbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eeu7ter8e
	u7tR7ta7h
	u7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t97t97t97t97ta7ta7ta7t7ta7n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>engeEu7te: eeeu7t7t8e'Reeu7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nt97t8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_8eu72U0>0>0>0>0>0>0>0>0>0>0>0>U™n>nCCbtEbtEbtEbgwCn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>CSCqC>n>n>n>n>n>n>n>n>nC]g>n>ndeeE.7t97t97t97t97teE.7tE7t97teE.7t97t97t97t97teC]g>n>ndeeE.7t97t97t97t97teE.7tE7t97teE.7t97t97t97t97teC]g>n>ndeeE.7t97t97t97t97teE.7tE7t97teE.7t97t97t97t97teC]g>n>ndeeE.7t97t97t97t97teE.7tE7t97teE.7t97t97t97t97teC]g>n>ndeeE.7t97t97t97t97teE.7tE7t97teE.7t97t97t97t97teC]g>n>ndeeE.7t: eeeeE.7t8e'Range8eror: eeeeeE.7t97t98e97t97t97t97t97t97t8et97t97t97t97t97ta78et97t97t97t97t97t9e8e7t97t97t97t97t97t98eeE.7t97t97t97t97te8e7t97t97t97t97t97t98eeE.7t97t97t97t97teE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tE.7t97u7te97t97u7tt97t97u7tt8et97u7tt97t97u7tta78etu7t97t97tu7t97t9e8u7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)a7ta7ta7ta7ta7ta7t]bt)eng8eu7te,
8e	u7tn]bt)ru7t 8eer8u7t8e'R8]bt)ero8e u7t7t8e		u7t]bt)E8u7tg7tg7tg7tg7tg]bt)a7t]bt)eng8eu7te,EbtEhetn]bt)ru7t 8eer8utybthe8]bt)ero8e u7t7t8btybhe]bt)E8u7tg7tg7tg7ta7thebt)a7t]bt)eng8eu7,
8eheEhetn]bt)ru7t 8eeEbtEa6D(D(D(D(D(D(D(D(D(D(D(D(D(D(EeE8u7tg7tg7tg7ta7thtg7t>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t97t97t97t97ta7ta7ta7t7ta7n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>.7t97u7te97t97u7tt97t9797u7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7t9e8u7tg7tg7tg7tg7tg7t7tg777777777777777777777777777777777 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>A}Fn>n>n>n>n>n>n555a >n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>na9c)0>0>0lnrKnze6uaqfd7t9aBgcn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>t>n>t>n>t>n>t>n>t>n>t>n>t>n>t>n>t>n>t>n>t>n>t>n>t>n>n>n.@_____C(D(D(D(DCn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>CSCqC>n>n>n>n>n>n>n>n>ngjCwC=g]g>n>ndt8et97u7tt97t97u7tta78eE97u7tta78etu7t97t97tu7eg]g>n>ndt8et97u7tt97t97u7tta78eE97u7tta78etu7t97t97tu7eg]g>n>ndt8et97u7tt97t97u7tta78eE97u7tta78etu7t97t97tu7eg]g>n>ndt8et97u7tt97t97u7tta78eE97u7tta78etu7t97t97tu7eg]g>n>ndt8et97u7tt97t97u7tta78eE97u7tta78etu7t97t97tu7eg]g>n>ndt8et97tu7t97t97tu7eg]g>nE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbt0>07tg7g7t0>0tg7tg7t0>0g7tgg7t0>07tg7g7t0>0tg7tg7t0>017t0>017t0>017t0>017ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)t8eor: u7te7t8e	u7]bt)eEru7t:8eeeEu7t8e	]bt)7tErr8e:u7teeE.7tu]bt)nge8u7tg7tg7tg7tg7]bt)g7tg7tg7tg7tg7tg7t]bt)	u7]bt)eEru7t:8eeu7t(hee	]bt)7tErr8e:u7ttybtheu]bt)nge8u7tg7tg7btybhe]bt)g7tg7tg7tg7tg7te7hebt)	u7]bt)eEru7t:eeEuhe(hee	]bt)7tErr8e:(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eeg7tg7tg7tg7tg7te7h7tg7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nn7tn7tn7tn7tn7tn7tn7tn7n7tnn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>u7tu7tu7tu7tu7tu7tu7tu7u7tu>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>Aa>n>n>a>n>n>a>n555a>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_>>>a9@_____Cbthe8]btC>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nCSCqCn>n>n>n>n>n>n>n>n>gjCwC=g]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t9g7tg7tg7tg7teg]gn>E.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbt>>n7tg7g7tAa>tg7tg7t>n>g7tgg7t>>n7tg7g7tna>tg7tg7t>n>17t>n>17t>n>17t>n>17ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)t98eeE.7t97t97t97t]bt)E.7t97t97t97t97t97]bt)97t97t97t97t97t97t]bt)7ta7ta7ta7ta7ta7ta]bt)ta7ta7ta7ta7ta7ta7]bt)97t]bt)E.7t97t97tu7t(he97]bt)97t97t97t97tybthet]bt)7ta7ta7ta7tabtybhe]bt)ta7ta7ta7ta7tt97thebt)97t]bt)E.7t97tt97the(he97]bt)97t97t97(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eeta7ta7ta7ta7tt97tha7tan>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7tn7tn7tn7tn7tn7tn7tn7n7tn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nu7tu7tu7tu7tu7tu7tu7tu7u7tun>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>>a>n>n>a>n>nnnnnnnna2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_a>n>7t97t97tu7eg]gn>7t97t97tu7eg]gn>7t97t97tu7eg]gn>7t97t97t>0>>n>n>n(bt(C
CSCqC>0>0>0>0>0>0>0>0>0gjCwC=g]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7ttg7tg7tg7tg7eg]gn>E.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbt>n>7tg7g7t>n>tg7tg7t>a>g7tgg7tn>n7tg7g7tnnntg7tg7t>0>17t>0>17t>0>17t>0>17ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)97t97t97t97t97ta78]bt)t97t97t97t97t9e8e7]bt)97t97t97t97t98eeE.]bt)t97t97t97te8e7t97t]bt)7t97t97t98eeE.7t97]bt)a78]bt)t97t97t97tu7t(hee7]bt)97t97t97t97tybthe.]bt)t97t97t97te8btybhe]bt)7t97t97t98eeEt97thebt)a78]bt)t97t97tt97the(hee7]bt)97t97t97(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Ee7t97t97t98eeEt97tht98en>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7tn7tn7tn7tn7tn7tn7tn7n7tn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nu7tu7tu7tu7tu7tu7tu7tu7u7tun>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>>a>n>n>a>n>nnnnnnnna2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_tg7tA/Yt>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>z>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nb2n>nn>n>n>n>ntta]nCwC=g]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn77tn7tn7tn7tneg]g>nE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbt0>07tg7g7t0>0tg7tg7t0>0g7tgg7t0>07tg7g7t0>0tg7tg7t0>017t0>017t0>017t0>017ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)>n>ndt8et97u7tt97t]bt)tta78eE97u7tta78et]bt)7t97tu7eg]g>n>ndt8]bt)u7tt97t97u7tta78eE]bt)tta78etu7t97t97tu7]bt)97t]bt)tta78eE97uu7t(heet]bt)7t97tu7eg]gtybthe8]bt)u7tt97t97u7tbtybhe]bt)tta78etu7t97tt97uhebt)97t]bt)tta78eEu7tthe(heet]bt)7t97tu7e(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eetta78etu7t97tt97uhu7t9>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nn7tn7tn7tn7tn7tn7tn7tn7n7tnn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>u7tu7tu7tu7tu7tu7tu7tu7u7tu>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_n>n>!|_iQa>>0z>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nb2>>nn>n>n>n>ntt97nCwC=g]g>n>nd97t97t97t97t97t97t97t97E7t97t97t97t97t97t97tg7eg]g>n>nd97t97t97t97t97t97t97t97E7t97t97t97t97t97t97tg7eg]g>n>nd97t97t97t97t97t97t97t97E7t97t97t97t97t97t97tg7eg]g>n>nd97t97t97t97t97t97t97t97E7t97t97t97t97t97t97tg7eg]g>n>nd97t97t97t97t97t97t97t97E7t97t97t97t97t97t97tg7eg]g>n>nd97t97tt97t97t97tg7eg]g>nE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbta>>7tg7g7t>natg7tg7t>n>g7tgg7ta>>7tg7g7t>natg7tg7t>n>17t>n>17t>n>17t>n>17ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)g7tg7tg7teg]gn>n>d]bt)t97t97t97t97t97tg7]bt)7t97tg7tg7tg7tg7tg]bt)]gn>n>d7t97t97t97t]bt)7t97tg7tEt97t97tg7]bt)n>d]bt)t97t97t97tu7t(heg7]bt)7t97tg7tg7ttybtheg]bt)]gn>n>d7t97tbtybhe]bt)7t97tg7tEt97tteg]hebt)n>d]bt)t97t97tt97the(heg7]bt)7t97tg7t(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Ee7t97tg7tEt97tteg]htEt9>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nn7tn7tn7tn7tn7tn7tn7tn7n7tnn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>u7tu7tu7tu7tu7tu7tu7tu7u7tu>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_n>n>.@_____CbtybtybtC>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nCSCqC0>0>0>0>0>0>0>0>0>gjCwC=g]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t97t97t97t97t97tg7tEt97t97tg7tg7tg7tg7tg7teg]gn>n>d7t97t9g7tg7tg7tg7teg]gn>E.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbt>>n7tg7g7tna>tg7tg7tn>ng7tgg7t>>n7tg7g7tna>tg7tg7t>n>17t>n>17t>n>17t>n>17ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)tg7tg7E7tg7tg7tg7t]bt)7tg7tg7eg]gn>n>dg7]bt)g7tg7tg7tg7tg7tg7E]bt)tg7tg7tg7tg7tg7tg7]bt)n>n>dg7tg7tg7tg7tg]bt)g7t]bt)7tg7tg7eg]u7t(heg7]bt)g7tg7tg7tg7tybtheE]bt)tg7tg7tg7tg7btybhe]bt)n>n>dg7tg7tg7tg7thebt)g7t]bt)7tg7tg7]gn>he(heg7]bt)g7tg7tg7(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Een>n>dg7tg7tg7tg7thtg7tn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7tn7tn7tn7tn7tn7tn7tn7n7tn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nu7tu7tu7tu7tu7tu7tu7tu7u7tun>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>>a>n>n>a>n>nnnnnnnna2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_g7tgc/Yt>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>z>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nb2a>nn>n>n>n>nt]btnCwC=g]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn7tn7tn7tn7tn7tn7tnEn7tn7tn7tn7tn7tn7tn7tneg]g>n>ndtn7tn77tn7tn7tn7tneg]g>nE.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbt0>07tg7g7t0>0tg7tg7t0>0g7tgg7t0>07tg7g7t0>0tg7tg7t0>017t0>017t0>017t0>017ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)7tn7tnEn7tn7tn7tn7]bt)n7tn7tneg]g>n>ndtn]bt)tn7tn7tn7tn7tn7tnE]bt)7tn7tn7tn7tn7tn7tn]bt)>n>ndtn7tn7tn7tn7t]bt)tn7]bt)n7tn7tneg]u7t(hetn]bt)tn7tn7tn7tntybtheE]bt)7tn7tn7tn7tnbtybhe]bt)>n>ndtn7tn7tn7tn7hebt)tn7]bt)n7tn7tn]g>nhe(hetn]bt)tn7tn7tn(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Ee>n>ndtn7tn7tn7tn7h7tn7>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nn7tn7tn7tn7tn7tn7tn7tn7n7tnn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>u7tu7tu7tu7tu7tu7tu7tu7u7tu>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>0>0a>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>na>>n>nna>>n>na>>n>>>>>>>>a2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>W_n>n>t97t97t97t97t9n>t97t97t97t97t9n>t97t97t97t97t9n>t97t97t9>0>>0>0>a>0>0C
CSCqCn>n>n>n>n>n>n>n>n>gjCwC=g]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7tg7tg7tg7tg7tg7tg7E7tg7tg7tg7tg7tg7tg7tg7eg]gn>n>dg7tg7ttg7tg7tg7tg7eg]gn>E.7t97t97t97t97t97t97t97t97t97t97t97t97t97t97tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tg7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tn7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(bt(btEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtEbtn>n7tg7g7t>>ntg7tg7tna>g7tgg7t>n>7tg7g7t>>>tg7tg7t>0>17t>0>17t>0>17t>0>17ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7ta7tu7tu7tu7tu7tu7tu7tu7tu7tu7tu7t(btu7t(bt(btu7t(bt(btu7t(bt(btu7t(bt(btu7tybtybtybtybtybtybtybtybtybtybtybtybtybtybtybtybt)>n>nd97t97t97t97t9]bt)t97t97E7t97t97t97t]bt)7t97tg7eg]g>n>nd97]bt)97t97t97t97t97t97E]bt)t97t97t97t97t97tg7]bt)7t9]bt)t97t97E7t9u7t(he7t]bt)7t97tg7eg]gtybthe7]bt)97t97t97t97tbtybhe]bt)t97t97t97t97t97t9hebt)7t9]bt)t97t97E97t9he(he7t]bt)7t97tg7e(bt(a6D(D(D(D(D(D(D(D(D(D(D(D(D(D(Eet97t97t97t97t97t9h97t9n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n7tn7tn7tn7tn7tn7tn7tn7n7tn>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>nu7tu7tu7tu7tu7tu7tu7tu7u7tun>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>(bt(bt(bt(btEbtEbtEbtEbEbtEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE 2U0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>0>0>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>a>n>n>>a>n>n>a>n>nnnnnnnna2U0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>0>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>n>__Ey