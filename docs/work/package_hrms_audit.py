from pathlib import Path
from collections import Counter
import hashlib
import html
import json
import re
import shutil
import struct
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'outputs' / 'hrms-detailed-audit'
shutil.copytree(ROOT / 'outputs' / 'hrms-reference', DEST / 'initial-reference', dirs_exist_ok=True)
source = (DEST / 'functional-specification.txt').read_text(encoding='utf-8')
esc = html.escape


def jpeg_dimensions(path):
    with path.open('rb') as stream:
        if stream.read(2) != b'\xff\xd8':
            raise ValueError(f'Not JPEG: {path}')
        while True:
            marker = stream.read(1)
            if not marker:
                raise ValueError(f'No JPEG frame: {path}')
            if marker != b'\xff':
                continue
            code = stream.read(1)
            while code == b'\xff':
                code = stream.read(1)
            if code in (b'\xd8', b'\xd9'):
                continue
            size = struct.unpack('>H', stream.read(2))[0]
            if code[0] in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                _, height, width = struct.unpack('>BHH', stream.read(5))
                return width, height
            stream.seek(size - 2, 1)


labels = {
    '04-notifications-dark': 'Dark dashboard; notification panel not retained in DOM capture',
    '06-paid-leave-monday-draft': 'Paid-leave quota and reason draft; Monday validation inconclusive',
    '08-paid-leave-date-range': 'Date-entry attempt; complete range not verified',
    '19-calendar-empty-selected-day': 'November 25 selected-day details (populated)',
    '21-calendar-no-leave-day': 'December calendar after empty-day click; no new panel',
    '24-directory-employee-details': 'Employee-name click; no details opened',
    '41-guide-dark-complete': 'Complete workflow guide (light theme)',
    '48-notifications-panel-live': 'Live notification panel and full accessibility text',
    '49-notification-item-click': 'Notification-item click; no navigation established',
    '50-notifications-history-scroll': 'Scrolled notification history',
}
features = []
sections = []
for match in re.finditer(r'(?ms)^\[(\d{2})\] (.+?)\n\n(.*?)(?=^\[\d{2}\] |\Z)', source):
    number, title, body = match.groups()
    section = {'number': number, 'title': title, 'body': body.strip()}
    sections.append(section)
    for feature in re.finditer(r'(?ms)^([A-Z]+-\d+) \| ([A-Z]+) \| (.*?)(?=\n\s*\n|\Z)', body):
        fid, status, detail = feature.groups()
        features.append({'id': fid, 'status': status, 'section': number, 'section_title': title,
                         'description': re.sub(r'\s+', ' ', detail).strip()})
ids = [f['id'] for f in features]
assert len(ids) == len(set(ids)), 'Duplicate feature identifiers'
assert len(sections) == 28, 'Missing specification section'
(DEST / 'feature-register.json').write_text(json.dumps(features, ensure_ascii=False, indent=2), encoding='utf-8')

rules = {
    'source': 'User statements in this chat; not inferred from UI source code',
    'scope': {'goal': 'Employee-portal feature and behavior parity',
              'visual_design': 'New design; do not copy the existing portal design',
              'responsive': ['mobile', 'tablet', 'desktop'],
              'admin_portal': 'Deferred; unavailable access; do not assume another walkthrough',
              'future_access': 'No future access assumed'},
    'location_based_punch_in': {'confirmed': True,
                               'exact_location_validation': 'Not exposed; recording versus geofence is unverified'},
    'office_hours': {'start': '10:00', 'end': '18:00', 'timezone': 'Not explicitly supplied'},
    'reminders': [
        {'time': '11:00', 'recipient': 'Individual employee who has not punched in',
         'working_days_only': True, 'confirmed_by_user': True},
        {'time': '18:30', 'recipient': 'Employees who have not punched out',
         'confirmed_by_user': True,
         'eligibility_details': 'Working-day context supplied; approved leave, all-day absence, weekends and multiple-session edge cases not specified'},
    ],
}
(DEST / 'user-confirmed-rules.json').write_text(json.dumps(rules, ensure_ascii=False, indent=2), encoding='utf-8')

captures = []
routes = set()
for shot in sorted((DEST / 'screenshots').glob('*.jpg')):
    stem = shot.stem
    text_file = DEST / 'evidence' / (stem + '.txt')
    json_file = DEST / 'evidence' / (stem + '.json')
    metadata = json.loads(json_file.read_text(encoding='utf-8')) if json_file.exists() else {}
    if metadata.get('url'):
        routes.add(metadata['url'].split('.co.in')[-1])
    width, height = jpeg_dimensions(shot)
    captures.append({'id': stem, 'label': labels.get(stem, stem.replace('-', ' ')),
                     'screenshot': shot.relative_to(DEST).as_posix(),
                     'screenshot_width': width, 'screenshot_height': height,
                     'url': metadata.get('url', 'https://mobiyantraworkportal.co.in/dashboard'),
                     'viewport': metadata.get('viewport'),
                     'text_evidence': text_file.relative_to(DEST).as_posix() if text_file.exists() else None,
                     'control_metadata': json_file.relative_to(DEST).as_posix() if json_file.exists() else None,
                     'theme_action_title': next((c['title'] for c in metadata.get('controls', []) if (c.get('title') or '').startswith('Switch to ')), None)})

initial_captures = []
for shot in sorted((DEST / 'initial-reference').glob('*.jpg')):
    width, height = jpeg_dimensions(shot)
    initial_captures.append({'id': shot.stem, 'screenshot': shot.relative_to(DEST).as_posix(),
                             'screenshot_width': width, 'screenshot_height': height})

expected_routes = {'/auth', '/dashboard', '/apply-leave', '/my-requests', '/balance', '/payslips',
                   '/attendance', '/calendar', '/employees', '/holidays', '/my-assets',
                   '/reports', '/how-it-works', '/profile'}
assert routes == expected_routes, f'Unexpected route coverage: {routes ^ expected_routes}'
assert len(captures) == 50 and len(initial_captures) == 25, 'Unexpected screenshot count'
manifest = {'review_date': '2026-11-25', 'source': 'https://mobiyantraworkportal.co.in',
            'scope': 'Accessible Employee Portal; feature/behavior record, not a visual clone',
            'routes_observed': sorted(routes), 'feature_entries': len(features),
            'status_counts': dict(Counter(f['status'] for f in features)),
            'detailed_captures': captures, 'initial_captures': initial_captures}
(DEST / 'evidence-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')

style = '''body{font:16px/1.65 system-ui,sans-serif;color:#1d2938;background:#f4f6fa;max-width:1150px;margin:auto;padding:24px}h1{line-height:1.2}h2{line-height:1.3}a{color:#1554ad}section,article{background:#fff;border:1px solid #dae1eb;border-radius:10px;padding:24px;margin:22px 0}p{white-space:normal}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:6px}nav a{display:block;padding:4px 0}code{font-size:13px;overflow-wrap:anywhere}.status{font-size:12px;background:#eaf0f8;border-radius:4px;padding:3px 6px;margin-left:8px}.feature{border-left:3px solid #ccd7e7;padding:4px 14px;margin:20px 0}.feature h3{font-size:15px;margin:0}.feature p{margin:8px 0}table{border-collapse:collapse;width:100%;font-size:13px}th,td{text-align:left;border-bottom:1px solid #dae1eb;vertical-align:top;padding:9px;overflow-wrap:anywhere}.scroll{overflow-x:auto}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}figure{margin:0;border:1px solid #dce2eb;border-radius:8px;overflow:hidden;background:white}figure img{width:100%;height:240px;object-fit:contain;background:#eaf0f7;display:block}figcaption{padding:12px;font-size:14px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f4f6fa;padding:16px;font-size:12px}details{margin:15px 0}summary{cursor:pointer;font-weight:600}.muted{color:#586779}.notice{background:#edf4ff;padding:18px;border-radius:8px}@media print{body{background:white;max-width:none;padding:0}section,article{border:none;padding:0}nav,.gallery{display:none}.feature{break-inside:avoid}a{color:inherit}}'''


def page(title, content):
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title><style>' + style + '</style></head><body>' + content + '</body></html>'


def block_html(block):
    found = re.match(r'^([A-Z]+-\d+) \| ([A-Z]+) \| (.*)', block, re.S)
    if found:
        fid, status, text = found.groups()
        return f'<div class="feature" id="{fid.lower()}"><h3>{esc(fid)}<span class="status">{esc(status)}</span></h3><p>{esc(re.sub(r"\s+", " ", text))}</p></div>'
    # Preserve exact holiday rows and field enumerations without turning them into prose.
    if block.startswith('Reviewed 2026 rows'):
        return '<pre>' + esc(block) + '</pre>'
    return '<p>' + esc(re.sub(r'\s+', ' ', block)) + '</p>'


toc = '<nav>' + ''.join(f'<a href="#section-{s["number"]}">{s["number"]}. {esc(s["title"])}</a>' for s in sections) + '</nav>'
body = '<h1>HRMS functional specification</h1><p>Final-access Employee Portal record · 25 November 2026</p>'
body += '<p><a href="README.md">README</a> · <a href="index.html">Evidence index</a> · <a href="functional-specification.txt">Plain-text specification</a> · <a href="feature-register.json">Feature register</a> · <a href="user-confirmed-rules.json">User-confirmed rules</a></p>'
body += f'<p class="notice"><strong>Feature and behavior parity; a new visual design.</strong> {len(features)} labeled entries across 28 sections. Evidence separates observations, user confirmations, guide claims and unknowns. Admin access is deferred. No future portal visit is assumed.</p>'
body += '<section><h2>Contents</h2>' + toc + '</section>'
for section in sections:
    body += f'<section id="section-{section["number"]}"><h2>{section["number"]}. {esc(section["title"])}</h2>'
    body += ''.join(block_html(b.strip()) for b in section['body'].split('\n\n') if b.strip()) + '</section>'
(DEST / 'functional-specification.html').write_text(page('HRMS functional specification', body), encoding='utf-8')

body = '<h1>HRMS evidence index</h1><p>25 November 2026 · Employee Portal final-access record</p>'
body += '<p><a href="README.md">Start here: README</a> · <a href="functional-specification.html">Read the detailed functional specification</a> · <a href="functional-specification.txt">Plain text</a> · <a href="feature-register.json">Feature register JSON</a> · <a href="evidence-manifest.json">Evidence manifest</a> · <a href="user-confirmed-rules.json">User-confirmed rules</a></p>'
body += f'<section><h2>Coverage</h2><p>{len(features)} labeled specification entries; {len(routes)} observed routes; 50 new screenshots and 25 first-walkthrough screenshots; 49 new screen-text records and 47 rendered-control metadata records. These counts describe preserved evidence, not complete testing of hidden backend behavior.</p>'
body += '<p><strong>Confirmed reminder rules:</strong> office hours 10:00 AM–6:00 PM; individual missing-punch-in reminder at 11:00 AM on working days; missing-punch-out reminder at 6:30 PM. Location-based punch-in is confirmed by the user; exact location policy was not exposed.</p>'
body += '<p><strong>Observed notification categories:</strong> punch-in, punch-out, birthdays, new holidays, holiday tomorrow. Leave submission/decision alerts and external channels are described by the guide. No unsupported notification type is asserted.</p>'
body += '<p>Screen evidence is for functional reference. Do not copy the old design. This package contains live account/company information. Original filenames are retained; descriptive labels below correct misleading attempted-capture names.</p></section>'
body += '<section><h2>Detailed walkthrough screenshots</h2><div class="gallery">'
for capture in captures:
    links = [f'<a href="{esc(capture["screenshot"])}">Full screenshot</a>']
    for key, label in [('text_evidence', 'Screen text'), ('control_metadata', 'Control attributes')]:
        if capture[key]:
            links.append(f'<a href="{esc(capture[key])}">{label}</a>')
    mode = capture['theme_action_title'] or 'Not measured'
    body += f'<figure><a href="{esc(capture["screenshot"])}"><img loading="lazy" src="{esc(capture["screenshot"])}" alt="{esc(capture["label"])}"></a><figcaption><strong>{esc(capture["label"])}</strong><br>{capture["screenshot_width"]} × {capture["screenshot_height"]} image<br><span class="muted">{esc(mode)}</span><br>' + ' · '.join(links) + '</figcaption></figure>'
body += '</div></section><section><h2>Original walkthrough references</h2><p>Original captures include the explicit mobile/tablet/desktop references. Original names 01–03 say desktop although those images were narrow.</p><div class="gallery">'
for capture in initial_captures:
    body += f'<figure><a href="{esc(capture["screenshot"])}"><img loading="lazy" src="{esc(capture["screenshot"])}" alt="{esc(capture["id"])}"></a><figcaption>{esc(capture["id"])}<br>{capture["screenshot_width"]} × {capture["screenshot_height"]}</figcaption></figure>'
body += '</div></section>'
body += '<section><h2>Rendered controls: complete recorded attributes</h2><p>These tables preserve captured DOM controls, including hidden native companion selects and background navigation. False native required does not prove a custom field is optional. Existing input values containing personal data are not repeated here; visible record text is in the screen snapshots.</p>'
for capture in captures:
    if not capture['control_metadata']:
        continue
    data = json.loads((DEST / capture['control_metadata']).read_text(encoding='utf-8'))
    body += f'<details><summary>{esc(capture["id"])} — {esc(data["url"])}</summary><div class="scroll"><table><thead><tr><th>Control</th><th>Text / placeholder</th><th>Native constraints / state</th><th>Options / target</th></tr></thead><tbody>'
    for control in data['controls']:
        identity = ' / '.join(str(control[k]) for k in ('tag', 'type', 'role') if control.get(k))
        label = control.get('text') or control.get('ariaLabel') or control.get('title') or ''
        if control.get('placeholder'):
            label += ' [placeholder: ' + control['placeholder'] + ']'
        constraints = ', '.join(f'{key}={control[key]}' for key in ('required', 'disabled', 'min', 'max', 'minLength', 'maxLength', 'pattern', 'accept') if control.get(key) is not None)
        choices = '; '.join(f'{o["text"]} [value={o["value"]}]' for o in control.get('options', []))
        if control.get('href'):
            choices += ' target=' + control['href']
        body += '<tr>' + ''.join('<td>' + esc(value) + '</td>' for value in (identity, label, constraints, choices)) + '</tr>'
    body += '</tbody></table></div></details>'
body += '</section>'
(DEST / 'index.html').write_text(page('HRMS evidence index', body), encoding='utf-8')

for file in DEST.rglob('*.html'):
    content = file.read_text(encoding='utf-8')
    for ref in re.findall(r'(?:href|src)="([^"]+)"', content):
        if ref.startswith(('#', 'https:', 'http:')):
            continue
        assert (file.parent / html.unescape(ref.split('#')[0])).is_file(), f'Missing link: {file} -> {ref}'

hashes = []
for file in sorted(DEST.rglob('*')):
    if file.is_file() and file.name != 'file-checksums.sha256':
        hashes.append(hashlib.sha256(file.read_bytes()).hexdigest() + '  ' + file.relative_to(DEST).as_posix())
(DEST / 'file-checksums.sha256').write_text('\n'.join(hashes) + '\n', encoding='utf-8')

archive = ROOT / 'outputs' / 'hrms-complete-record.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as bundle:
    for file in sorted(DEST.rglob('*')):
        if file.is_file():
            bundle.write(file, 'hrms-detailed-audit/' + file.relative_to(DEST).as_posix())
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None, 'ZIP integrity failure'

summary = {'sections': len(sections), 'feature_entries': len(features),
           'status_counts': manifest['status_counts'], 'routes': len(routes),
           'screenshots': len(captures) + len(initial_captures),
           'new_screen_text_records': len(list((DEST / 'evidence').glob('*.txt'))),
           'new_control_metadata_records': len(list((DEST / 'evidence').glob('*.json'))),
           'words_in_specification': len(source.split()),
           'files_in_package': len(hashes) + 1,
           'archive_bytes': archive.stat().st_size,
           'checks': 'All local HTML links exist; JPEG frame dimensions parsed; feature IDs unique; expected route coverage present; ZIP CRC test passed.'}
print(json.dumps(summary, indent=2))
