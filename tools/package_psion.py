"""Makes the Psion release files for the site, from the program folders in PsionII/Programs.

For each program in RELEASES it writes two files into src/downloads/psion/<slug>/:

  <slug>-<version>.opk          the build: the pack image, copied as it is
  <slug>-<version>-source.zip   source + build, laid out like PsionII so it builds as it is:
                                Programs/<Folder>/ = the program's repo at HEAD plus the built
                                pack image and launchers; Tools/ = the shared Tools repo at HEAD;
                                LICENSE and RELEASE.txt at the top

Release files are never overwritten: if a file is already there with different bytes the script
stops (a new version gets a new file name). The zip is reproducible: entries are sorted and carry
the release date, so running the script again gives the same bytes and the same SHA-256.

    python -I tools/package_psion.py            # all programs in RELEASES
    python -I tools/package_psion.py chess      # one
    python -I tools/package_psion.py --list     # show what each zip would hold, write nothing
"""
import argparse
import hashlib
import io
import os
import subprocess
import sys
import tarfile
import zipfile

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PSIONII = os.path.join(os.path.expanduser('~'), 'PsionII')
PROGRAMS = os.path.join(PSIONII, 'Programs')
TOOLS = os.path.join(PSIONII, 'Tools')
OUT = os.path.join(SITE, 'src', 'downloads', 'psion')

RELEASES = {
    'chess': {
        'title': 'Chess',
        'folder': 'Chess',
        'version': '1.0',
        'date': (2026, 11, 21),
        'opk': 'build/game/CHESS.opk',
        # build outputs that do go in (the rest of build/ is listings and test output)
        'build_files': ['build/game/CHESS.opk', 'build/game/CHESS.opl', 'build/game/CHG1.opl',
                        'build/game/CHG2.opl', 'build/game/CHG3.opl', 'build/game/budget.txt'],
        'models': 'LZ and LZ64',
    },
    'connect4': {
        'title': 'Connect 4',
        'folder': 'Connect4',
        'version': '1.0',
        'date': (2026, 11, 21),
        'opk': 'build/game/C4.opk',
        'build_files': ['build/game/C4.opk', 'build/game/C4.opl', 'build/game/C4G.opl',
                        'build/game/budget.txt'],
        'models': 'CM, XP, LA, LZ and LZ64',
    },
    'reversi': {
        'title': 'Reversi',
        'folder': 'Reversi',
        'version': '0.9',
        'date': (2026, 11, 21),
        'opk': 'build/game/REV.opk',
        'build_files': ['build/game/REV.opk', 'build/game/REV.opl', 'build/game/REVG.opl',
                        'build/game/budget.txt'],
        'models': 'CM, XP, LA, LZ and LZ64',
    },
    # OPL and machine-code games whose pack image is committed in their repo: nothing to add from build/
    'lander': {
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
        'title': 'Phaselock',
        'folder': 'Phaselock',
        'version': '0.9',
        'date': (2026, 11, 20),
        'opk': 'PHASE.opk',
        'build_cmd': 'python build.py',
        'build_files': [],
        'models': 'LZ and LZ64',
    },
    'spins': {
        'title': 'Psion Spins',
        'folder': 'Spins',
        'version': '0.9',
        'date': (2026, 11, 21),
        'opk': 'build/game/SPINS.opk',
        'build_files': [],
        'models': 'CM, XP, LA, LZ and LZ64',
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


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def git(path, *args):
    return subprocess.run(['git', '-C', path] + list(args), check=True, capture_output=True).stdout


def committed(path):
    """Every file committed at HEAD in the repo at path, as {name: bytes}, and the commit id."""
    if git(path, 'status', '--porcelain').strip():
        sys.exit('STOP: %s has uncommitted changes; commit them first so the zip matches a commit.' % path)
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
    return sorted(files.items()), {'program': c1, 'tools': c2}


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
        '%d files.' % (len(files) + 2),
        '',
    ]
    return chr(10).join(lines)


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

    outdir = os.path.join(OUT, slug)
    os.makedirs(outdir, exist_ok=True)
    for name, data in ((opk_name, opk_bytes), (zip_name, zip_bytes)):
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


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('slugs', nargs='*', help='programs to package (default: all)')
    ap.add_argument('--list', action='store_true', help='list each zip\'s contents and write nothing')
    a = ap.parse_args()
    for slug in a.slugs or sorted(RELEASES):
        if slug not in RELEASES:
            sys.exit('unknown program %r (have: %s)' % (slug, ', '.join(sorted(RELEASES))))
        make(slug, RELEASES[slug], a.list)


if __name__ == '__main__':
    main()
