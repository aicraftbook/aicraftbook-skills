# Example requests

Illustrative. These show the kind of request the skill is for and what a good review contains.
Test tasks are in `../evals/tasks.json`.

1. "Can a beginner follow this README? It explains how to run our Flask demo locally."
   The README activates a virtual environment it never creates, says the app runs on port 8000 while the
   code starts it on 5000, and never says which Python version it needs. A good review rates the missing
   virtual-environment step and the port contradiction as blocking, asks the author to state the tested
   Python version as a marked gap instead of picking one, and adds an expected-output line after
   `flask run`.
2. "Review my install guide for our CLI before I post it. Readers are on Mac and Windows."
   A good review flags the macOS-only install command as blocking for Windows readers (the guide says it
   is for both), the `config.yml` that step 4 edits but no step creates, and the "start the worker" step
   that has no command. It does not claim to have run anything.
3. "Here's our quickstart for connecting to our API. Anything missing?"
   The guide shows a live-looking key in a code block and tells readers to commit the script. A good
   review rates both as blocking, does not repeat the key, tells the author to revoke it, replaces it
   with `YOUR_API_KEY` read from an environment variable, adds the `.gitignore` line, and suggests the
   narrowest key scope the steps need.
