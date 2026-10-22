# Example requests

Illustrative. These show the kind of request the skill is for and what a good answer contains.
Test tasks are in `../evals/`.

1. "Review this system prompt before we ship it. The output goes into an n8n Switch node:
   'Read the customer's message and decide what kind of ticket it is. Customer message: {{ $json.body }}.
   If the message is urgent, mark it as urgent. Be concise but explain your reasoning.'"
   A good answer rates the customer text inside the instructions and the missing exact output format as
   High, flags "explain your reasoning" as conflicting with exact-text routing, defines "urgent", adds an
   empty-message branch, keeps `{{ $json.body }}` unchanged, and gives tests including an injection attempt.
2. "Our Zapier step writes follow-up emails. Rules: under 100 words, include the full returns policy word for
   word, never more than 10% off, do whatever it takes to keep unhappy customers."
   A good answer finds both conflicts, keeps the returns policy and the 10% cap in the revision (the word
   limit applies to the author's own text), and lists any change of intent as a question, not an edit.
3. "Here is the prompt for our inbox agent that creates tasks and replies to senders. Is it safe?"
   A good answer treats the email body as untrusted, points out that a sender can make the agent create
   tasks or send replies, recommends approval or an allow-list outside the prompt, and does not claim the
   revised prompt prevents injection.
