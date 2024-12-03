# @rbxts/formatting
Utility functions for formatting numbers and parsing strings back into numbers for Roblox

## commaFormat

Places commas between every three decimal points in `n`

### Parameters

*   `n` **([number][19] | [string][20])**&#x20;

### Examples

```javascript
commaFormat(1000000) // 1,000,000
```

Returns **[string][20]**&#x20;

## abbreviate

Abbreviates numbers larger than or equal to `threshold`

### Parameters

*   `n` **[number][19]**&#x20;
*   `threshold`   (optional, default `100_000`)
*   `suffixes`   (optional, default `baseSuffixes`)

### Examples

```javascript
abbreviate(1000000) // 1M
abbreviate(1000000000000000000000) // 1Sx
```

Returns **[string][20]**&#x20;

## parseAbbreviatedNumber

Parses a number formatted by `abbreviate()` back into a number type

### Parameters

*   `suffixed` **[string][20]**&#x20;
*   `suffixes`   (optional, default `baseSuffixes`)

### Examples

```javascript
parseAbbreviatedNumber("1B") // 1000000000
```

Returns **[number][19]**&#x20;

## toSeconds

Takes a remaining time string and converts it to the amount of time it represents in seconds.

### Parameters

*   `time` **[string][20]**&#x20;

### Examples

```javascript
toSeconds("10m 20s") // 620
```

Returns **[number][19]**&#x20;

## toRemainingTime

Takes a time in seconds and converts it to a remaining time string

### Parameters

*   `seconds` **[number][19]**&#x20;
*   `secondsFormat`   (optional, default `"%ds"`)
*   `minutesFormat`   (optional, default `"%dm"`)
*   `hoursFormat`   (optional, default `"%dh"`)
*   `daysFormat`   (optional, default `"%dd"`)

### Examples

```javascript
toRemainingTime(310) // 5m 10s
```

Returns **[string][20]**&#x20;

## toLongRemainingTime

Takes a time in seconds and converts it to a long remaining time string

### Parameters

*   `seconds` **[number][19]**&#x20;

### Examples

```javascript
toLongRemainingTime(3690) // 01:01:30
```

Returns **[string][20]**&#x20;

[1]: #commaformat

[2]: #parameters

[3]: #examples

[4]: #abbreviate

[5]: #parameters-1

[6]: #examples-1

[7]: #parseabbreviatednumber

[8]: #parameters-2

[9]: #examples-2

[10]: #toseconds

[11]: #parameters-3

[12]: #examples-3

[13]: #toremainingtime

[14]: #parameters-4

[15]: #examples-4

[16]: #tolongremainingtime

[17]: #parameters-5

[18]: #examples-5

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String