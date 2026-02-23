# Specification

## Summary
**Goal:** Build RA³ Momentum Engine - a professional NSE F&O trading dashboard that integrates with Shoonya API to analyze NIFTY and BANKNIFTY option chains, detect market positions, generate trading signals, and provide real-time alerts.

**Planned changes:**
- Replace any existing API with Shoonya API integration using TOTP-based authentication
- Add Settings panel for configuring Shoonya API credentials (user ID, vendor code, IMEI, secret API key, TOTP secret)
- Fetch and display live option chain data for NIFTY and BANKNIFTY (±5 strikes around ATM, updating every 1 minute)
- Show LTP, Call OI, Call OI Change, Put OI, Put OI Change, and Volume for each strike
- Highlight highest Call OI, highest Put OI, and sudden OI change spikes
- Implement market position analysis (Long Build-Up, Short Build-Up, Short Covering, Long Unwinding)
- Display market bias as Bullish, Bearish, or Sideways for both symbols
- Calculate and display Put-Call Ratio (PCR) with strength categorization and visual meter
- Build smart signal engine generating BUY CALL, BUY PUT, or WAIT signals based on OI analysis, PCR levels, and momentum detection
- Create Key Levels Panel showing strong resistance/support strikes, ATM strike, and breakout levels
- Implement alert system for market bias changes, support/resistance breaks, momentum shifts, and volume spikes
- Design professional dark-themed trading dashboard UI with live updating panels, bias meter, signal cards, alert history, and refresh countdown timer

**User-visible outcome:** Users can configure their Shoonya API credentials, view real-time NIFTY and BANKNIFTY option chain data with intelligent highlighting, monitor market bias and PCR strength, receive actionable trading signals, track key support/resistance levels, and get alerts for significant market events - all in a professional dark-themed trading interface that updates every minute.
