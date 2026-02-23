import List "mo:core/List";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Migration "migration";

(with migration = Migration.run)
actor {
  type DayData = {
    price : Float;
    change : Float;
    callOI : Float;
    putOI : Float;
    expiry : Text;
  };

  type MarketDynamics = {
    price_time_series : [Float];
    change_time_series : [Float];
    call_oi_time_series : [Float];
    put_oi_time_series : [Float];
    underlying : DayData;
    expiry : Text;
  };

  type Signal = {
    message : Text;
    urgency : Text;
    symbol : Text;
    action : Text;
    price : Float;
    expiry : Text;
  };

  let defaultExpiry : Text = "WEEKLY_EXPIRY";

  func fetchPriceTimeSeries(_symbol : Text, _expiry : Text) : async [Float] {
    List.repeat<Float>(0, 30).toArray();
  };

  func fetchChangeTimeSeries(_symbol : Text, _expiry : Text) : async [Float] {
    List.repeat<Float>(0, 30).toArray();
  };

  func fetchOpenInterest(_symbol : Text, _expiry : Text, _optionType : Text) : async [Float] {
    List.repeat<Float>(0, 30).toArray();
  };

  func fetchHistoricalPriceTimeSeries(_symbol : Text, _expiry : Text) : async [Float] {
    List.repeat<Float>(0, 365).toArray();
  };

  func fetchHistoricalChangeTimeSeries(_symbol : Text, _expiry : Text) : async [Float] {
    List.repeat<Float>(0, 365).toArray();
  };

  func fetchHistoricalOpenInterest(_symbol : Text, _expiry : Text, _optionType : Text) : async [Float] {
    List.repeat<Float>(0, 365).toArray();
  };

  func countPositiveChanges(timeSeries : [Float]) : Int {
    switch (timeSeries.size()) {
      case (0) { 0 };
      case (1) { if (timeSeries[0] < 0.0) { 0 } else { 1 } };
      case (_) {
        let first = if (timeSeries[0] < 0.0) { 0 } else { 1 };
        first + countPositiveChanges(timeSeries.sliceToArray(1, timeSeries.size() - 1));
      };
    };
  };

  func countNegativeChanges(timeSeries : [Float]) : Int {
    switch (timeSeries.size()) {
      case (0) { 0 };
      case (1) { if (timeSeries[0] < 0.0) { 1 } else { 0 } };
      case (_) {
        let first = if (timeSeries[0] < 0.0) { 1 } else { 0 };
        first + countNegativeChanges(timeSeries.sliceToArray(1, timeSeries.size() - 1));
      };
    };
  };

  func calculatePositiveBuildups(d : MarketDynamics) : async Int {
    countPositiveChanges(d.price_time_series) + countPositiveChanges(d.call_oi_time_series) + countPositiveChanges(d.put_oi_time_series);
  };

  func calculateNegativeBuildups(d : MarketDynamics) : async Int {
    countNegativeChanges(d.price_time_series) + countNegativeChanges(d.call_oi_time_series) + countNegativeChanges(d.put_oi_time_series);
  };

  func hasLongUnwinding(d : MarketDynamics) : Bool {
    let callChanges = d.call_oi_time_series.sliceToArray(1, d.call_oi_time_series.size() - 1);
    let callOI = {
      price = d.underlying.price;
      change = d.underlying.change;
      callOI = d.underlying.callOI;
      putOI = d.underlying.putOI;
      expiry = d.underlying.expiry;
    };
    callChanges.foldLeft(callOI.callOI, func(cum, change) { cum - change }) < 0.0;
  };

  public shared ({ caller }) func calculateTradeSignals(marketDynamics : MarketDynamics) : async [Signal] {
    let signals = List.empty<Signal>();

    let posBuildups = await calculatePositiveBuildups(marketDynamics);
    let negBuildups = await calculateNegativeBuildups(marketDynamics);

    if (posBuildups > 0) {
      signals.add({
        urgency = "High";
        message = "%d positive buildups detected".concat(posBuildups.toText());
        symbol = "NIFTY21";
        action = "BUY_CALL";
        price = marketDynamics.underlying.price;
        expiry = defaultExpiry;
      });
    };

    if (negBuildups > 0) {
      signals.add({
        urgency = "High";
        message = "%d negative buildups detected".concat(negBuildups.toText());
        symbol = "NIFTY21";
        action = "BUY_PUT";
        price = marketDynamics.underlying.price;
        expiry = defaultExpiry;
      });
    };

    if (hasLongUnwinding(marketDynamics)) {
      signals.add({
        urgency = "Low";
        message = "Long Unwinding detected! Price decreasing with declining OI";
        symbol = "NIFTY21";
        action = "SELL_CALL";
        price = marketDynamics.underlying.price;
        expiry = defaultExpiry;
      });
    };

    signals.toArray();
  };

  public shared ({ caller }) func fetchHistoricalMarketData(_symbol : Text, expiry : Text) : async MarketDynamics {
    let priceData = await fetchHistoricalPriceTimeSeries(_symbol, expiry);
    let changeData = await fetchHistoricalChangeTimeSeries(_symbol, expiry);
    let callOI = await fetchHistoricalOpenInterest(_symbol, expiry, "CALL");
    let putOI = await fetchHistoricalOpenInterest(_symbol, expiry, "PUT");

    let underlying = {
      price = priceData[priceData.size() - 1];
      change = changeData[changeData.size() - 1];
      callOI = 0.0;
      putOI = 0.0;
      expiry;
    };

    {
      price_time_series = priceData;
      change_time_series = changeData;
      call_oi_time_series = callOI;
      put_oi_time_series = putOI;
      underlying;
      expiry;
    };
  };

  public shared ({ caller }) func fetchMarketDynamics(_symbol : Text) : async MarketDynamics {
    let priceData = await fetchPriceTimeSeries(_symbol, defaultExpiry);
    let changeData = await fetchChangeTimeSeries(_symbol, defaultExpiry);
    let callOI = await fetchOpenInterest(_symbol, defaultExpiry, "CALL");
    let putOI = await fetchOpenInterest(_symbol, defaultExpiry, "PUT");

    let underlying = {
      price = priceData[priceData.size() - 1];
      change = changeData[changeData.size() - 1];
      callOI = 0.0;
      putOI = 0.0;
      expiry = defaultExpiry;
    };

    {
      price_time_series = priceData;
      change_time_series = changeData;
      call_oi_time_series = callOI;
      put_oi_time_series = putOI;
      underlying;
      expiry = defaultExpiry;
    };
  };

  public shared ({ caller }) func fetchSkewIndicator(_symbol : Text, _expiry : Text) : async (Float, Float, Float) {
    let callPremium = 0.0;
    let putPremium = 0.0;
    let atmStrike = 17000.0;

    (
      callPremium / (callPremium + putPremium),
      (callPremium - putPremium) / atmStrike,
      callPremium - putPremium,
    );
  };

  public shared ({ caller }) func fetchATMStrikes(_symbol : Text, _expiry : Text) : async [Nat] {
    [];
  };

  public shared ({ caller }) func fetchPCR(_symbol : Text, _expiry : Text) : async Float {
    0.0;
  };

  public shared ({ caller }) func fetchPCRVolume(_symbol : Text, _expiry : Text) : async Float {
    0.0;
  };

  public shared ({ caller }) func fetchPCRStrength(_symbol : Text, _expiry : Text) : async Text {
    "Neutral";
  };

  public shared ({ caller }) func fetchSustainedStrength(_symbol : Text, _expiry : Text) : async Text {
    "Balanced";
  };

  public shared ({ caller }) func fetchATMVolume(_symbol : Text, _expiry : Text) : async Float {
    0.0;
  };

  public shared ({ caller }) func fetchKeyLevels(_symbol : Text, _expiry : Text) : async [Nat] {
    [];
  };
};
