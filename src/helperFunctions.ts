type BinanceTicker = {
  s: string; // symbol
  c: string; // last price
  P: string; // % change
  E: number; // event time
};

export type FormattedTicker = {
  symbol: string;
  price: string;
  change: string;
  time: number;
};

export let latestPrices: Record<string, any> = {};

function formatSymbol(symbol: string): string {
  if (symbol.endsWith("USDT")) {
    const base = symbol.slice(0, -4);
    return `${base}/USDT`;
  }
  return symbol;
}

type BinanceStreamPayload = {
  stream: string;
  data: BinanceTicker;
};

export function mapBinanceStream(
  payload: BinanceStreamPayload,
): FormattedTicker {
  const d = payload.data;

  return {
    symbol: formatSymbol(d.s),
    price: d.c,
    change: d.P,
    time: d.E,
  };
}
