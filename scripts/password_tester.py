#!/usr/bin/env python3
"""
Hash cracking script for CyberDen Password Tester.
Supports: brute force, dictionary, hybrid, and rainbow table modes.
For authorized security testing only.
"""

import sys
import json
import time
import hashlib
import itertools
import string
import os

try:
    import passlib.hash as passlib_hash
    HAS_PASSLIB = True
except ImportError:
    HAS_PASSLIB = False


def progress(attempts: int, rate: float, elapsed: float, current: str = ''):
    msg = {'attempts': attempts, 'rate': round(rate, 1), 'elapsed': round(elapsed, 3)}
    if current:
        msg['currentWord'] = current
    print(f"PROGRESS:{json.dumps(msg)}", flush=True)


def hash_password(password: str, algorithm: str) -> str:
    p = password.encode('utf-8', errors='replace')
    alg = algorithm.lower()
    if alg == 'md5':
        return hashlib.md5(p).hexdigest()
    elif alg == 'sha1':
        return hashlib.sha1(p).hexdigest()
    elif alg == 'sha256':
        return hashlib.sha256(p).hexdigest()
    elif alg == 'sha512':
        return hashlib.sha512(p).hexdigest()
    elif alg == 'ntlm':
        import hashlib
        return hashlib.new('md4', password.encode('utf-16-le')).hexdigest()
    raise ValueError(f'Unsupported algorithm: {algorithm}')


def verify_bcrypt(password: str, hash_str: str) -> bool:
    if not HAS_PASSLIB:
        raise RuntimeError('passlib not installed — run: pip install passlib')
    return passlib_hash.bcrypt.verify(password, hash_str)


def check(password: str, target_hash: str, algorithm: str) -> bool:
    alg = algorithm.lower()
    if alg == 'bcrypt':
        try:
            return verify_bcrypt(password, target_hash)
        except Exception:
            return False
    try:
        return hash_password(password, alg) == target_hash.lower()
    except Exception:
        return False


def brute_force(target_hash: str, algorithm: str, charsets: list, max_length: int):
    charset = ''
    if 'lowercase' in charsets:
        charset += string.ascii_lowercase
    if 'uppercase' in charsets:
        charset += string.ascii_uppercase
    if 'digits' in charsets:
        charset += string.digits
    if 'symbols' in charsets:
        charset += string.punctuation

    if not charset:
        charset = string.ascii_lowercase + string.digits

    attempts = 0
    start = time.time()
    last_report = start

    for length in range(1, max_length + 1):
        for combo in itertools.product(charset, repeat=length):
            word = ''.join(combo)
            attempts += 1
            now = time.time()
            elapsed = now - start
            if now - last_report >= 0.5:
                rate = attempts / max(elapsed, 0.001)
                progress(attempts, rate, elapsed, word)
                last_report = now
            if check(word, target_hash, algorithm):
                elapsed = time.time() - start
                return {'found': True, 'password': word, 'attempts': attempts, 'elapsed': round(elapsed, 3)}

    elapsed = time.time() - start
    return {'found': False, 'attempts': attempts, 'elapsed': round(elapsed, 3)}


def dictionary_attack(target_hash: str, algorithm: str, wordlist_path: str):
    if not os.path.exists(wordlist_path):
        return {'error': f'Wordlist not found: {wordlist_path}', 'found': False, 'attempts': 0, 'elapsed': 0}

    attempts = 0
    start = time.time()
    last_report = start

    with open(wordlist_path, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            word = line.rstrip('\n\r')
            attempts += 1
            now = time.time()
            elapsed = now - start
            if now - last_report >= 0.5:
                rate = attempts / max(elapsed, 0.001)
                progress(attempts, rate, elapsed, word)
                last_report = now
            if check(word, target_hash, algorithm):
                elapsed = time.time() - start
                return {'found': True, 'password': word, 'attempts': attempts, 'elapsed': round(elapsed, 3)}

    elapsed = time.time() - start
    return {'found': False, 'attempts': attempts, 'elapsed': round(elapsed, 3)}


def hybrid_attack(target_hash: str, algorithm: str, wordlist_path: str):
    """Dictionary words + numeric/symbol suffixes."""
    if not os.path.exists(wordlist_path):
        return {'error': f'Wordlist not found: {wordlist_path}', 'found': False, 'attempts': 0, 'elapsed': 0}

    suffixes = (
        [str(i) for i in range(100)] +
        [str(i) for i in range(1900, 2030)] +
        ['!', '@', '#', '$', '!1', '123', '1234', '12345', '!@#']
    )

    attempts = 0
    start = time.time()
    last_report = start

    with open(wordlist_path, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            base = line.rstrip('\n\r')
            candidates = [base, base.capitalize(), base.upper()] + [base + s for s in suffixes] + [s + base for s in ['!', '@', '#']]
            for word in candidates:
                attempts += 1
                now = time.time()
                if now - last_report >= 0.5:
                    elapsed = now - start
                    progress(attempts, attempts / max(elapsed, 0.001), elapsed, word)
                    last_report = now
                if check(word, target_hash, algorithm):
                    elapsed = time.time() - start
                    return {'found': True, 'password': word, 'attempts': attempts, 'elapsed': round(elapsed, 3)}

    elapsed = time.time() - start
    return {'found': False, 'attempts': attempts, 'elapsed': round(elapsed, 3)}


def rainbow_table_lookup(target_hash: str, table_path: str):
    """Look up a pre-computed rainbow table (plaintext:hash format)."""
    if not os.path.exists(table_path):
        return {'error': f'Rainbow table not found: {table_path}', 'found': False, 'attempts': 0, 'elapsed': 0}

    target = target_hash.lower().strip()
    attempts = 0
    start = time.time()
    last_report = start

    with open(table_path, 'r', encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.rstrip('\n\r')
            if ':' in line:
                parts = line.split(':', 1)
                plain, hashed = parts[0], parts[1].lower()
            else:
                continue
            attempts += 1
            now = time.time()
            if now - last_report >= 1.0:
                elapsed = now - start
                progress(attempts, attempts / max(elapsed, 0.001), elapsed, plain)
                last_report = now
            if hashed == target:
                elapsed = time.time() - start
                return {'found': True, 'password': plain, 'attempts': attempts, 'elapsed': round(elapsed, 3)}

    elapsed = time.time() - start
    return {'found': False, 'attempts': attempts, 'elapsed': round(elapsed, 3)}


def main():
    opts = json.loads(sys.argv[1])
    mode = opts.get('mode', 'dictionary')
    target_hash = opts.get('hash', '').strip()
    algorithm = opts.get('algorithm', 'md5')

    if not target_hash:
        print(json.dumps({'error': 'No hash provided', 'found': False, 'attempts': 0, 'elapsed': 0}))
        sys.exit(1)

    if mode == 'bruteforce':
        result = brute_force(
            target_hash, algorithm,
            opts.get('charsets', ['lowercase', 'digits']),
            opts.get('maxLength', 6)
        )
    elif mode == 'dictionary':
        result = dictionary_attack(target_hash, algorithm, opts.get('wordlistPath', ''))
    elif mode == 'hybrid':
        result = hybrid_attack(target_hash, algorithm, opts.get('wordlistPath', ''))
    elif mode == 'rainbow':
        result = rainbow_table_lookup(target_hash, opts.get('rainbowTablePath', ''))
    else:
        result = {'error': f'Unknown mode: {mode}', 'found': False, 'attempts': 0, 'elapsed': 0}

    print(json.dumps(result), flush=True)


if __name__ == '__main__':
    main()
