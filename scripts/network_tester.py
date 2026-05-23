#!/usr/bin/env python3
"""
Network protocol credential tester for CyberDen.
Supports: SSH, HTTP Basic Auth, FTP, SMTP.
For authorized penetration testing only — always obtain written permission.
"""

import sys
import json
import time
import os

# Rate limiting is enforced to prevent accidental denial-of-service.
DEFAULT_RATE_LIMIT = 5  # max attempts per second


def progress(job_id: str, attempts: int, rate: float, elapsed: float, current: str = ''):
    msg = {'jobId': job_id, 'attempts': attempts, 'rate': round(rate, 1), 'elapsed': round(elapsed, 3)}
    if current:
        msg['currentWord'] = current
    print(f"PROGRESS:{json.dumps(msg)}", flush=True)


def rate_sleep(rate_limit: int, last_time: float) -> float:
    """Sleep if needed to respect rate limit. Returns current time."""
    min_interval = 1.0 / max(rate_limit, 1)
    elapsed = time.time() - last_time
    if elapsed < min_interval:
        time.sleep(min_interval - elapsed)
    return time.time()


def test_ssh(target: str, port: int, username: str, password: str) -> bool:
    try:
        import paramiko
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(target, port=port, username=username, password=password, timeout=5, banner_timeout=5)
        client.close()
        return True
    except paramiko.AuthenticationException:
        return False
    except Exception:
        return False


def test_http(target: str, port: int, username: str, password: str) -> bool:
    try:
        import urllib.request
        import base64
        url = f'http://{target}:{port}/'
        req = urllib.request.Request(url)
        creds = base64.b64encode(f'{username}:{password}'.encode()).decode()
        req.add_header('Authorization', f'Basic {creds}')
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status < 400
    except Exception as e:
        # 401 means auth failed, other errors may mean server is down
        return False


def test_ftp(target: str, port: int, username: str, password: str) -> bool:
    try:
        import ftplib
        ftp = ftplib.FTP()
        ftp.connect(target, port, timeout=5)
        ftp.login(username, password)
        ftp.quit()
        return True
    except ftplib.error_perm:
        return False
    except Exception:
        return False


def test_smtp(target: str, port: int, username: str, password: str) -> bool:
    try:
        import smtplib
        server = smtplib.SMTP(target, port, timeout=5)
        server.ehlo()
        if server.has_extn('STARTTLS'):
            server.starttls()
        server.login(username, password)
        server.quit()
        return True
    except smtplib.SMTPAuthenticationError:
        return False
    except Exception:
        return False


PROTOCOL_MAP = {
    'ssh': (test_ssh, 22),
    'http': (test_http, 80),
    'ftp': (test_ftp, 21),
    'smtp': (test_smtp, 587),
}


def run_attack(opts: dict) -> dict:
    mode = opts.get('mode', 'dictionary')
    protocol = opts.get('protocol', 'ssh')
    target = opts.get('target', '')
    port = opts.get('port') or PROTOCOL_MAP.get(protocol, (None, 0))[1]
    rate_limit = min(opts.get('rateLimit', DEFAULT_RATE_LIMIT), 50)  # cap at 50/s
    job_id = opts.get('jobId', '')

    test_fn, _ = PROTOCOL_MAP.get(protocol, (None, 0))
    if not test_fn:
        return {'error': f'Unknown protocol: {protocol}', 'found': False, 'attempts': 0, 'elapsed': 0}

    found_credentials = []
    attempts = 0
    start = time.time()
    last_time = start
    last_report = start

    if mode == 'spraying':
        password = opts.get('password', '')
        usernames = opts.get('usernames', [])
        for username in usernames:
            last_time = rate_sleep(rate_limit, last_time)
            attempts += 1
            now = time.time()
            elapsed = now - start
            if now - last_report >= 0.5:
                progress(job_id, attempts, attempts / max(elapsed, 0.001), elapsed, username)
                last_report = now
            if test_fn(target, port, username, password):
                found_credentials.append({'username': username, 'password': password})
    else:
        username = opts.get('username', 'admin')
        wordlist_path = opts.get('wordlistPath', '')

        if not os.path.exists(wordlist_path):
            return {'error': f'Wordlist not found: {wordlist_path}', 'found': False, 'attempts': 0, 'elapsed': 0}

        with open(wordlist_path, 'r', encoding='utf-8', errors='replace') as f:
            for line in f:
                password = line.rstrip('\n\r')
                last_time = rate_sleep(rate_limit, last_time)
                attempts += 1
                now = time.time()
                elapsed = now - start
                if now - last_report >= 0.5:
                    progress(job_id, attempts, attempts / max(elapsed, 0.001), elapsed, password)
                    last_report = now
                if test_fn(target, port, username, password):
                    found_credentials.append({'username': username, 'password': password})
                    break  # Stop on first success in dictionary/bruteforce mode

    elapsed = time.time() - start
    return {
        'found': len(found_credentials) > 0,
        'credentials': found_credentials,
        'attempts': attempts,
        'elapsed': round(elapsed, 3),
    }


def main():
    opts = json.loads(sys.argv[1])
    result = run_attack(opts)
    print(json.dumps(result), flush=True)


if __name__ == '__main__':
    main()
