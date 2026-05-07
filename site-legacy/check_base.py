import re
with open('dist/zh/index.html', 'r', encoding='utf-8') as f:
    content = f.read()
matches = re.findall(r'href="(/Zentangle-Chou/[^"]+)"', content)
print('Sample links with base:')
for m in matches[:10]:
    print(f'  {m}')
print()
matches2 = re.findall(r'src="(/Zentangle-Chou/[^"]+)"', content)
print('Sample scripts with base:')
for m in matches2[:5]:
    print(f'  {m}')
