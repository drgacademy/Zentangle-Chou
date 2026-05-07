import re
with open('dist/zh/index.html', 'r', encoding='utf-8') as f:
    content = f.read()
all_hrefs = re.findall(r'href="([^"]+)"', content)
base_links = [h for h in all_hrefs if h.startswith('/Zentangle-Chou')]
root_links = [h for h in all_hrefs if h.startswith('/') and not h.startswith('/Zentangle-Chou')]
print(f'Total hrefs: {len(all_hrefs)}')
print(f'With base: {len(base_links)}')
print(f'Root only (potential 404): {len(root_links)}')
print()
print('Root-only links:')
for h in root_links[:20]:
    print(f'  {h}')
