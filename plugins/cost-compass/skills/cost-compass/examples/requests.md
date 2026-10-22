# Example requests

Illustrative. These show the kind of request the skill is for and what a good answer contains.
Test tasks are in `../evals/`.

1. "We're adding a support chatbot. About 3,000 conversations a month, 5 turns each. What will it cost?"
   (no prices given) A good answer counts the system prompt and the history re-sent on every turn,
   computes tokens per month, writes `[PRICE NEEDED: ...]` for each rate, asks for all prices in one
   message with the pricing page to check, and gives no dollar total.
2. "40,000 emails a month, one extraction call each, 1,800 input and 150 output tokens. Input is $1.50
   and output $6.00 per million tokens. 3% get re-run."
   A good answer shows 40,000 × 1,800 = 72,000,000 tokens × $1.50 / 1,000,000 = $108.00, output $36.00,
   $144.00 × 1.03 = $148.32, gives a low / expected / high range from the uncertain drivers, and names
   the biggest saving with its trade-off.
3. "Our voice receptionist takes 1,200 calls a month. Here are our voice and model prices. We also text a
   confirmation after bookings."
   A good answer adds voice and telephony minutes, models the growing conversation history per turn,
   leaves the SMS price blank because it was not given, and shows that minutes, not tokens, drive the bill.
