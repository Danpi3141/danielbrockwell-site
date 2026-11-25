"""Makes the Psion release files for the site, from the program folders in PsionII/Programs.

For each program in RELEASES it writes two files into src/downloads/psion/<slug>/:

  <slug>-<version>.opk          the build: the pack image, copied as it is
  <slug>-<version>-source.zip   source + build, laid out like PsionII so it builds as it is:
                                Programs/<Folder>/ = the program's repo at HEAD plus the built
                                pack image and launchers; Tools/ = the shared Tools repo at HEAD;
                                LICENSE and RELEASE.txt at the top

Release files are never overwritten: if a file is already there with different bytes the script
stops (a new version gets a new file name). The one exception is --rescrub (below).

The zip is reproducible: entries are sorted and carry the release date, so running the script
again gives the same bytes and the same SHA-256.

Windows home-folder paths (C:/Users/<name>, with either slash, in logs, reports and build.json)
are shortened to ~ in every source zip, so no zip carries a Windows user name; RELEASE.txt says so
when it happened.

    python -I tools/package_psion.py            # all programs in RELEASES
    python -I tools/package_psion.py chess      # one
    python -I tools/package_psion.py --list     # show what each zip would hold, write nothing
    python -I tools/package_psion.py --rescrub src/downloads/psion/chess/chess-1.0-source.zip
                                  # shorten home-folder paths in a zip already released, in place
"""
import argparse
import hashlib
import io
import os
import re
import subprocess
import sys
import tarfile
import zipfile

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PSIONII = os.path.join(os.path.expanduser('~'), 'PsionII')
PROGRAMS = os.path.join(PSIONII, 'Programs')
TOOLS = os.path.join(PSIONII, 'Tools')
ALLOW_DIRTY = False             # --allow-dirty: package HEAD past uncommitted changes (they're left out)
OUT = os.path.join(SITE, 'src', 'downloads', 'psion')

RELEASES = {
    'chess': {
        'run': 'CHESS',
        'title': 'Chess',
        'folder': 'Chess',
        'version': '1.2.1',
        'date': (2026, 11, 24),        # 1.0 (21 Nov), 1.1 (22 Nov) and 1.2 (24 Nov) stay downloadable: release files are never replaced
        'opk': 'build/game/CHESS.opk',
        # build outputs that do go in (the rest of build/ is listings and test output)
        'build_files': ['build/game/CHESS.opk', 'build/game/CHESS.opl', 'build/game/budget.txt'],
        'models': 'LZ and LZ64',
    },
    'connect4': {
        'run': 'C4',
        'psion_skip': {'psion/C4g2.odb'},     # a game exported while testing
        'title': 'Connect 4',
        'folder': 'Connect4',
        'version': '1.0.1',
        'date': (2026, 11, 24),        # 1.0 (21 Nov) stays downloadable
        'opk': 'build/game/C4.opk',
        'build_files': ['build/game/C4.opk', 'build/game/C4.opl', 'build/game/C4G.opl',
                        'build/game/budget.txt'],
        'models': 'CM, XP, LA, LZ and LZ64',
    },
    'reversi': {
        'run': 'REV',
        'title': 'Reversi',
        'folder': 'Reversi',
        'version': '1.0.1',
        'date': (2026, 11, 24),        # 0.9 (21 Nov) and 1.0 (22 Nov) stay downloadable
        'opk': 'build/game/REV.opk',
        'build_files': ['build/game/REV.opk', 'build/game/REV.opl', 'build/game/REVG.opl',
                        'build/game/budget.txt'],
        'models': 'CM, XP, LA, LZ and LZ64',
    },
    # OPL and machine-code games whose pack image is committed in their repo: nothing to add from build/
    'lander': {
        'run': 'LANDER',
        'title': 'Lunar Lander',
        'folder': 'Lander',
        'version': '1.0',
        'date': (2026, 11, 20),
        'opk': 'LANDER.opk',
        'build_cmd': 'python build.py',
        'build_files': [],
        'models': 'LZ and LZ64',
    },
    'rampart': {
        'run': 'RAMPART',
        'title': 'Rampart',
        'folder': 'Rampart',
        'version': '1.0',
        'date': (2026, 11, 20),
        'opk': 'RAMPART.opk',
        'build_cmd': 'python build.py',
        'build_files': [],
        'models': 'LZ and LZ64',
    },
    'phaselock': {
        'run': 'PHASE',
        'title': 'Phaselock',
        'folder': 'Phaselock',
        'version': '0.9.1',
        'date': (2026, 11, 25),        # 0.9 (20 Nov) stays downloadable
        'opk': 'PHASE.opk',
        'build_cmd': 'python build.py',
        'build_files': [],
        'models': 'LZ and LZ64',
    },
    'spins': {
        'run': 'SANTA',
        'title': 'Psion Spins',
        'folder': 'Spins',
        'version': '0.9.5',
        'date': (2026, 11, 25),
        'opk': 'build/game/SPINS.opk',
        'build_files': [],
        'models': 'CM, XP, LA, LZ and LZ64',
    },
    '2fa': {
        'run': 'TFA',
        'title': 'Psion 2FA',
        'folder': 'TFA',
        'version': '0.9.2',
        'date': (2026, 11, 24),        # 0.9 (23 Nov) and 0.9.1 (24 Nov) stay downloadable
        'opk': 'build/game/TFA.opk',          # committed in the repo, with the launchers
        'build_files': [],
        'models': 'CM, XP, LA (XP 32K), LZ and LZ64',
    },
    'bignum': {
        'run': 'BIGNUM',
        'title': 'BigNum',
        'folder': 'BigNum',
        'version': '0.9.8',
        'date': (2026, 11, 25),
        'opk': 'build/game/BIGNUM.opk',       # committed in the repo, with the listings
        'build_files': [],
        'models': 'CM (reduced), XP, LA (XP 32K), LZ and LZ64',
    },
}

MIT = """MIT License

Copyright (c) 2026 Daniel Brockwell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""


# C:\Users\<name>, C:/Users/<name>, JSON's C:\\Users\\<name>, Git Bash's /c/Users/<name>
HOME_RE = re.compile(rb'(?i)\b[a-z]:(\\{1,4}|/)users\1[^\\/\s"\']+|/[a-z]/users/[^\\/\s"\']+')
SCRUB_NOTE = ('Home-folder paths in logs, reports and build records are shortened to ~; '
              'the files are otherwise as committed.')


def scrub(data):
    """data with home-folder paths shortened to ~, and how many there were."""
    return HOME_RE.subn(b'~', data)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def git(path, *args):
    return subprocess.run(['git', '-C', path] + list(args), check=True, capture_output=True).stdout


def committed(path):
    """Every file committed at HEAD in the repo at path, as {name: bytes}, and the commit id."""
    dirty = git(path, 'status', '--porcelain').decode().strip()
    if dirty:
        if not ALLOW_DIRTY:
            sys.exit('STOP: %s has uncommitted changes; commit them first so the zip matches a commit '
                     '(or --allow-dirty: the zip is built from HEAD either way).' % path)
        print('note: %s has uncommitted changes, left out (the zip is HEAD): %s' % (path, ' '.join(dirty.split())))
    commit = git(path, 'rev-parse', 'HEAD').decode().strip()
    files = {}
    with tarfile.open(fileobj=io.BytesIO(git(path, 'archive', '--format=tar', 'HEAD'))) as tf:
        for m in tf.getmembers():
            if m.isfile():
                files[m.name] = tf.extractfile(m).read()
    return files, commit


def source_files(rel):
    """[(path in the zip, bytes)] sorted, and {'program': commit, 'tools': commit}.

    The zip is a small copy of the PsionII folder, because the build reaches outside the program:
    Programs/<folder>/ holds the program's repo at HEAD (its .gitignore leaves out build/, ext/
    and caches) plus the build outputs named in build_files; Tools/ holds the shared Tools repo
    at HEAD, which tools/pack.py imports (the OPL translator and pack writer) and which makes
    psion/ for RPBOOT.
    """
    root = os.path.join(PROGRAMS, rel['folder'])
    prog, c1 = committed(root)
    tools, c2 = committed(TOOLS)
    files = {'Programs/%s/%s' % (rel['folder'], k): v for k, v in prog.items()}
    files.update({'Tools/' + k: v for k, v in tools.items()})
    for p in rel['build_files']:
        with open(os.path.join(root, p), 'rb') as fh:
            files['Programs/%s/%s' % (rel['folder'], p)] = fh.read()
    count = 0
    for k in files:
        files[k], n = scrub(files[k])
        count += n
    return sorted(files.items()), {'program': c1, 'tools': c2, 'scrubbed': count}


def release_txt(rel, opk_name, opk_bytes, files, commits):
    d = 'Programs/%s' % rel['folder']
    lines = [
        '%s %s for the Psion Organiser II (%s)' % (rel['title'], rel['version'], rel['models']),
        'Released %04d-%02d-%02d. MIT licence: see LICENSE.' % rel['date'],
        '',
        'What is here',
        '  %s/   the program: source, data, docs, tests, tools' % d,
        "           (commit %s of its repo)" % commits['program'],
        '  Tools/   the shared Psion tools the build uses: OPL translator, pack writer,',
        "           RPBOOT and RPLOAD (commit %s of the Tools repo)" % commits['tools'],
        '',
        'The build',
        '  %s/%s  (%s bytes; the same file as the download %s)' % (d, rel['opk'], format(len(opk_bytes), ','), opk_name),
        '  SHA-256 %s' % sha256(opk_bytes),
        '  %s/psion/ holds the same program as files for loading onto a pack with RPBOOT.' % d,
        '',
        'Building it again (Python 3)',
        '  cd %s' % d,
        '  %-26s writes %s' % (rel.get('build_cmd', 'python tools/build.py'), rel['opk']),
        '  See README.md there for the emulator, the keys and the tests.',
        '',
        'Not in this zip',
        "  The tests run the Jape emulator's sources under Node and expect them in Emulator/",
        '  beside Programs/ and Tools/, with Organiser ROM images, which are not mine to give away.',
        '  Third-party downloads used while making the data (ext/) and caches are left out,',
        "  as the program repo's .gitignore says.",
        '',
    ] + ([SCRUB_NOTE, ''] if commits.get('scrubbed') else []) + [
        '%d files.' % (len(files) + 2),
        '',
    ]
    return chr(10).join(lines)


def psion_readme(rel, names):
    run = rel['run']
    lines = [
        '%s %s for the Psion Organiser II (%s)' % (rel['title'], rel['version'], rel['models']),
        'MIT licence: see LICENSE.',
        '',
        "These are the program's files, ready for an Organiser: translated procedures (.OB3)",
        'and the loader that copies them onto a pack over a Comms Link.',
        '',
        'Loading them',
        '  1. Unzip this folder on the PC.',
        '  2. In Psi2Win, set Folder to this folder and click Start!.',
        '  3. If RPBOOT is not on the Organiser yet: COMMS > RECEIVE > PROCEDURE, type RPBOOT,',
        '     EXE. Then PROG > EDIT RPBOOT, MODE > TRAN.',
        '  4. PROG > RUN RPBOOT. Choose the pack to copy the program to (B: or C: is best) and',
        '     wait until it says NOW RUN B:%s (or whichever pack you chose).' % run,
        '  5. PROG > RUN %s on that pack.' % run,
        '  RPBOOT uses RPLOAD on an LZ or LZ64 and RPLOADCM on a CM, XP or LA. Delete A:RPLOAD',
        '  afterwards to free its memory.',
        '',
        'Files',
    ]
    lines += ['  ' + n for n in names]
    lines += ['', 'More: https://danielbrockwell.uk/psion/getting-started/', '']
    return chr(10).join(lines)


def zip_bytes_of(top, stamp, entries):
    """A zip of (name, bytes) entries under top/, reproducibly: given order, one fixed date."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as zf:
        for name, data in entries:
            info = zipfile.ZipInfo(top + name, date_time=stamp)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            zf.writestr(info, data, compresslevel=9)
    return buf.getvalue()


def make(slug, rel, list_only=False):
    root = os.path.join(PROGRAMS, rel['folder'])
    v = rel['version']
    opk_name = '%s-%s.opk' % (slug, v)
    zip_name = '%s-%s-source.zip' % (slug, v)
    with open(os.path.join(root, rel['opk']), 'rb') as fh:
        opk_bytes = fh.read()
    files, commits = source_files(rel)
    if list_only:
        total = sum(len(d) for _, d in files)
        print('== %s: commit %s, %d files, %s bytes before compression'
              % (zip_name, commits['program'][:10], len(files), format(total, ',')))
        for p, d in files:
            print('   %9s  %s' % (format(len(d), ','), p))
        return

    # the zip, in memory, reproducibly: sorted entries, one fixed date
    buf = io.BytesIO()
    stamp = rel['date'] + (0, 0, 0)
    top = '%s-%s/' % (slug, v)

    def add(name, data):
        info = zipfile.ZipInfo(top + name, date_time=stamp)
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        zf.writestr(info, data, compresslevel=9)

    with zipfile.ZipFile(buf, 'w') as zf:
        add('LICENSE', MIT.encode('utf-8'))
        add('RELEASE.txt', release_txt(rel, opk_name, opk_bytes, files, commits).encode('utf-8'))
        for p, d in files:
            add(p, d)
    zip_bytes = buf.getvalue()

    # the psion/ folder as committed: what an Organiser needs, loaded with RPBOOT
    prog, _ = committed(root)
    skip = rel.get('psion_skip', set())
    pfiles = sorted((k[len('psion/'):], v) for k, v in prog.items()
                    if k.startswith('psion/') and k.count('/') == 1 and k not in skip)
    if not pfiles:
        sys.exit('STOP: %s has no committed psion/ folder' % rel['folder'])
    psion_name = '%s-%s-psion.zip' % (slug, v)
    psion_bytes = zip_bytes_of('%s-%s-psion/' % (slug, v), stamp, [
        ('README.txt', psion_readme(rel, [n for n, _ in pfiles]).encode('utf-8')),
        ('LICENSE', MIT.encode('utf-8'))] + pfiles)

    outdir = os.path.join(OUT, slug)
    os.makedirs(outdir, exist_ok=True)
    for name, data in ((psion_name, psion_bytes), (opk_name, opk_bytes), (zip_name, zip_bytes)):
        path = os.path.join(outdir, name)
        if os.path.exists(path):
            with open(path, 'rb') as fh:
                old = fh.read()
            if old == data:
                print('same     %s' % name)
                continue
            sys.exit('STOP: %s is already released with different bytes. Release files are never '
                     'overwritten: give the new build a new version.' % path)
        with open(path, 'wb') as fh:
            fh.write(data)
        print('wrote    %s  %s bytes  sha256 %s' % (name, format(len(data), ','), sha256(data)))


def rescrub(path):
    """Shorten home-folder paths in a source zip already released, in place: same entries in the
    same order, same dates and compression; RELEASE.txt gets SCRUB_NOTE before its last line."""
    with open(path, 'rb') as fh:
        old = fh.read()
    out = io.BytesIO()
    count = 0
    with zipfile.ZipFile(io.BytesIO(old)) as zin, zipfile.ZipFile(out, 'w') as zout:
        infos = zin.infolist()
        for info in infos:
            data, n = scrub(zin.read(info))
            count += n
            info.compress_type = zipfile.ZIP_DEFLATED
        for info in infos:
            data, _ = scrub(zin.read(info))
            if info.filename.endswith('/RELEASE.txt') and count and SCRUB_NOTE.encode() not in data:
                head, last = data.rstrip(b'\n').rsplit(b'\n', 1)
                data = head + b'\n' + SCRUB_NOTE.encode() + b'\n\n' + last + b'\n'
            new = zipfile.ZipInfo(info.filename, date_time=info.date_time)
            new.compress_type = zipfile.ZIP_DEFLATED
            new.external_attr = info.external_attr
            zout.writestr(new, data, compresslevel=9)
    if not count:
        print('clean    %s' % os.path.basename(path))
        return
    data = out.getvalue()
    with open(path, 'wb') as fh:
        fh.write(data)
    print('rescrub  %s  %d paths  %s bytes  sha256 %s' % (os.path.basename(path), count,
                                                       format(len(data), ','), sha256(data)))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('slugs', nargs='*', help='programs to package (default: all)')
    ap.add_argument('--list', action='store_true', help='list each zip\'s contents and write nothing')
    ap.add_argument('--allow-dirty', action='store_true', help='package HEAD even if the repo has uncommitted changes')
    ap.add_argument('--rescrub', nargs='+', metavar='ZIP', help='shorten home-folder paths in released source zips, in place')
    a = ap.parse_args()
    if a.rescrub:
        for p in a.rescrub:
            rescrub(p)
        return
    global ALLOW_DIRTY
    ALLOW_DIRTY = a.allow_dirty
    for slug in a.slugs or sorted(RELEASES):
        if slug not in RELEASES:
            sys.exit('unknown program %r (have: %s)' % (slug, ', '.join(sorted(RELEASES))))
        make(slug, RELEASES[slug], a.list)


if __name__ == '__main__':
    main()
