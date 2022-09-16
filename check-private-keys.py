from __future__ import annotations

import argparse
from typing import Sequence
import re, os

BLACKLIST = [
    b'BEGIN RSA PRIVATE KEY',
    b'BEGIN DSA PRIVATE KEY',
    b'BEGIN EC PRIVATE KEY',
    b'BEGIN OPENSSH PRIVATE KEY',
    b'BEGIN PRIVATE KEY',
    b'PuTTY-User-Key-File-2',
    b'BEGIN SSH2 ENCRYPTED PRIVATE KEY',
    b'BEGIN PGP PRIVATE KEY BLOCK',
    b'BEGIN ENCRYPTED PRIVATE KEY',
    b'BEGIN OpenVPN Static key V1',
]


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('-f','--filenames', nargs='*', help='Filenames to check')
    parser.add_argument('-d','--dir',type=str, help='Directory to check')
    args = parser.parse_args(argv)

    

    if args.dir:
        print(args.dir)
        # filenames = [(dir_path,dir_names,file_names) for (dir_path, dir_names, file_names) in os.walk(args.dir)]
        filenames = []
        for (dir_path, dir_names, file_names) in os.walk(args.dir):
            if '.git' in dir_path:
                continue
            # print((dir_path, dir_names, file_names))
            for file in file_names:
                if len(file) >0:
                    filenames.append(os.path.join(dir_path,file))
                
        print('files',filenames)
        return search_in_filesnames(filenames)


   

def search_in_filesnames(filenames):
    private_key_files = []
    for filename in filenames:
        with open(filename, 'rb') as f:
            content = f.read()
            print(filename)
            pk = re.search(b'(0x)?[a-f0-9A-F]{64}',content)
            if pk:
                private_key_files.append((filename,pk.group(0)))
            # if any(line in content for line in BLACKLIST):
            #     private_key_files.append(filename)

    if private_key_files:
        for private_key_file in private_key_files:
            print(f'Private key found: {private_key_file}')
        return 1
    else:
        return 0

if __name__ == '__main__':
    raise SystemExit(main())