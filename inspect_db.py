import json
import sys

# Reconfigure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

db_path = "database.js"

with open(db_path, "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("const grammarDatabase = [")
idx_end = content.find("const readingDatabase = [")
if idx_end == -1:
    idx_end = content.find("window.grammarDatabase = grammarDatabase;")

grammar_section = content[idx_start:idx_end]
closing_bracket_idx = grammar_section.rfind("];")
grammar_array_str = grammar_section[len("const grammarDatabase = "):closing_bracket_idx + 1].strip()

data = json.loads(grammar_array_str)

for idx, item in enumerate(data):
    for ex in item.get("examples", []):
        furi = ex.get("furigana", "")
        if "<rt>" not in furi:
            print(f"ID: {item['id']} ({item['pattern']})")
            print("Japanese:", ex.get("japanese"))
            print("Furigana:", repr(furi))
            print("-" * 40)
