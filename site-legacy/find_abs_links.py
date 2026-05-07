import os, re

files_to_fix = []
for root, dirs, files in os.walk('src'):
    for fname in files:
        if fname.endswith('.astro') or fname.endswith('.tsx'):
            path = os.path.join(root, fname)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Find href="/... or href='/... (but not href="// for URLs)
            matches = re.findall(r'href=["\'](/[a-zA-Z][^"\']*)["\']', content)
            if matches:
                files_to_fix.append((path, matches))

for path, matches in files_to_fix:
    print(f'\n{path}')
    for m in matches:
        print(f'  {m}')
