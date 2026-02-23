import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Signal {
    action: string;
    urgency: string;
    message: string;
    expiry: string;
    price: number;
    symbol: string;
}
export interface MarketDynamics {
    underlying: DayData;
    put_oi_time_series: Array<number>;
    call_oi_time_series: Array<number>;
    change_time_series: Array<number>;
    expiry: string;
    price_time_series: Array<number>;
}
export interface DayData {
    callOI: number;
    change: number;
    expiry: string;
    price: number;
    putOI: number;
}
export interface backendInterface {
    calculateTradeSignals(marketDynamics: MarketDynamics): Promise<Array<Signal>>;
    fetchATMStrikes(_symbol: string, _expiry: string): Promise<Array<bigint>>;
    fetchATMVolume(_symbol: string, _expiry: string): Promise<number>;
    fetchHistoricalMarketData(_symbol: string, expiry: string): Promise<MarketDynamics>;
    fetchKeyLevels(_symbol: string, _expiry: string): Promise<Array<bigint>>;
    fetchMarketDynamics(_symbol: string): Promise<MarketDynamics>;
    fetchPCR(_symbol: string, _expiry: string): Promise<number>;
    fetchPCRStrength(_symbol: string, _expiry: string): Promise<string>;
    fetchPCRVolume(_symbol: string, _expiry: string): Promise<number>;
    fetchSkewIndicator(_symbol: string, _expiry: string): Promise<[number, number, number]>;
    fetchSustainedStrength(_symbol: string, _expiry: string): Promise<string>;
}
