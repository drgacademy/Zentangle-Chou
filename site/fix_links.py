import os, re

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add base import at the top if not present
    if 'const base = import.meta.env.BASE_URL;' not in content and '.astro' in path:
        # Insert after frontmatter ---
        if content.startswith('---'):
            idx = content.find('---', 3)
            if idx != -1:
                insert_pos = idx + 3
                content = content[:insert_pos] + '\nconst base = import.meta.env.BASE_URL;\n' + content[insert_pos:]
    
    # Replace href="/... with href={base + "..."} in .astro files
    if path.endswith('.astro'):
        # Replace href="/path" -> href={base + "/path"}
        def replacer(m):
            return 'href={base + "' + m.group(1) + '"}'
        content = re.sub(r'href="(/[a-zA-Z][^"]*)"', replacer, content)
        # Replace href='/path' -> href={base + '/path'}
        def replacer2(m):
            return "href={base + '" + m.group(1) + "'}"
        content = re.sub(r"href='(/[a-zA-Z][^']*)'", replacer2, content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed: {path}')

files = [
    'src/layouts/Layout.astro',
    'src/pages/en/index.astro',
    'src/pages/en/portfolio/[id].astro',
    'src/pages/en/tangles/[slug].astro',
    'src/pages/zh/index.astro',
    'src/pages/zh/portfolio/[id].astro',
    'src/pages/zh/tangles/[slug].astro',
]

for f in files:
    if os.path.exists(f):
        fix_file(f)
    else:
        print(f'Not found: {f}')
