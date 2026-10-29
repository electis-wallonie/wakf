#!/usr/bin/env python3
"""Lists every .mp3 under audio/ into data/audio.json (keys without extension). Run after adding recordings."""
import os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
base = os.path.join(ROOT, 'audio'); files = []
for d, _, fs in os.walk(base):
    for f in fs:
        if f.endswith('.mp3'): files.append(os.path.relpath(os.path.join(d, f), base)[:-4].replace(os.sep, '/'))
json.dump({"files": sorted(files)}, open(os.path.join(ROOT, 'data', 'audio.json'), 'w'), indent=0)
print(len(files), 'audio files indexed')
