import { Assert, Fact, Theory, InlineData } from "@rbxts/runit";
import { commaFormat, abbreviate, parseAbbreviated, toSeconds, toRemainingTime, toLongRemainingTime } from "../../src";

class FormattingTest {
  @Theory
  @InlineData(1_000_000, "1,000,000")
  @InlineData(1_000_000.123, "1,000,000.123")
  @InlineData(100_000, "100,000", 100_000)
  @InlineData(99_999, "99999", 100_000)
  public commaFormat(input: number, expected: string, minimum?: number): void {
    Assert.equal(expected, commaFormat(input, minimum));
  }

  @Theory
  @InlineData(1_000, "1K")
  @InlineData(100_000, "100K")
  @InlineData(1_000_000, "1M")
  @InlineData(1_500_000, "1.5M")
  @InlineData(1_560_000, "1.56M")
  @InlineData(1_567_000, "1.567M")
  @InlineData(1_568_000, "1.568M")
  @InlineData(1_000_000_000, "1B")
  @InlineData(1_000_000_000_000_000_000, "1Qt")
  public abbreviate(input: number, expected: string, minimum?: number): void {
    Assert.equal(expected, abbreviate(input, minimum));
  }

  @Theory
  @InlineData("1K", 1_000)
  @InlineData("100k", 100_000)
  @InlineData("1M", 1_000_000)
  @InlineData("1.5M", 1_500_000)
  @InlineData("1.56M", 1_560_000)
  @InlineData("1.567M", 1_567_000)
  @InlineData("1.568M", 1_568_000)
  @InlineData("1b", 1_000_000_000)
  public parseAbbreviated(input: string, expected: number): void {
    Assert.equal(expected, parseAbbreviated(input));
  }

  @Fact
  public parseAbbreviatedThrows(): void {
    Assert.throws(() => parseAbbreviated("1l"), "[@rbxts/formatting]: Invalid suffixed number format");
  }

  @Theory
  @InlineData("30", 30)
  @InlineData("30s", 30)
  @InlineData("30 seconds", 30)
  @InlineData("30 secs", 30)
  @InlineData("30 sec", 30)
  @InlineData("1m", 60)
  @InlineData("2 mins", 120)
  @InlineData("2 minutes", 120)
  @InlineData("2 minutes 30s", 150)
  @InlineData("2m 30s", 150)
  @InlineData("1d 2h 3m 2s", 93_782)
  public toSeconds(input: string, expected: number): void {
    Assert.equal(expected, toSeconds(input));
  }

  @Theory
  @InlineData(30, "30s")
  @InlineData(180, "3m")
  @InlineData(310, "5m 10s")
  @InlineData(3910, "1h 5m 10s")
  public toRemainingTime(input: number, expected: string): void {
    Assert.equal(expected, toRemainingTime(input));
  }

  @Theory
  @InlineData(30, "00:00:30")
  @InlineData(180, "00:03:00")
  @InlineData(310, "00:05:10")
  @InlineData(3910, "01:05:10")
  public toLongRemainingTime(input: number, expected: string): void {
    Assert.equal(expected, toLongRemainingTime(input));
  }
}

export = FormattingTest;