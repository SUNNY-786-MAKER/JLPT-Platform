import json
import sys

with open("database.js", "r", encoding="utf-8") as f:
    content = f.read()

idx_start = content.find("const grammarDatabase = [")
idx_end = content.find("const readingDatabase = [")
if idx_end == -1:
    idx_end = content.find("window.grammarDatabase = grammarDatabase;")

grammar_section = content[idx_start:idx_end]
closing_bracket_idx = grammar_section.rfind("];")
grammar_array_str = grammar_section[len("const grammarDatabase = "):closing_bracket_idx + 1].strip()

data = json.loads(grammar_array_str)

jargon_words = ["clause", "conjugat", "nominaliz", "indicative", "subjunctive", "imperative", "passive", "causative", "preceding", "antecedent"]

found = 0
with open("jargon_results.txt", "w", encoding="utf-8") as out:
    for item in data:
        exp = item.get("explanation", "").lower()
        note = item.get("note", "").lower()
        formation = item.get("formation", "").lower()
        
        matches = []
        for word in jargon_words:
            if word in exp or word in note or word in formation:
                matches.append(word)
                
        if matches:
            found += 1
            out.write(f"ID: {item['id']} ({item['pattern']}) - Matches: {matches}\n")
            out.write(f"Explanation: {item.get('explanation')}\n")
            out.write(f"Formation: {item.get('formation')}\n")
            out.write(f"Note: {item.get('note')}\n")
            out.write("-" * 50 + "\n")

    out.write(f"Total patterns with jargon: {found} out of {len(data)}\n")

print(f"Done! Written results to jargon_results.txt. Found {found} patterns.")
