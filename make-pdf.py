import os

sections = [
	'angular-now/README.md',
	'advanced-observables/README.md',
	'unidirectional-data-flow/README.md',
	'progressive-web-application/README.md',
	'e2e-testing/README.md'
]

for filename in sections:
	f = open(os.path.join('.', filename), 'rt')
	print(f.read() + '\n\n---')
	f.close()

# Making PDF slides:
# 1. Download deck2pdf
# 2. Run this script (python make-pdf.py > pdf.md) and output it to pdf.md
# 3. Place contents of pdf.md instead pdf.html's textarea section
# 4. Run ./deck2pdf-0.3.0/bin/deck2pdf --profile=remarkjs pdf.html angular-advanced-training.pdf
