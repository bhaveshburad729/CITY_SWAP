import os
import sys
import subprocess

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

IGNORE_PATTERNS = ['myenv', 'node_modules', '.env', 'ecopulse.db', 'scratch', '__pycache__', '.git']

def get_git_status_files():
    out = subprocess.check_output(['git', 'status', '--porcelain'], text=True)
    files = []
    for line in out.splitlines():
        if not line.strip():
            continue
        status = line[:2].strip()
        filename = line[3:].strip().strip('"')
        if any(ign in filename for ign in IGNORE_PATTERNS):
            continue
        if os.path.exists(filename) or status == 'D':
            files.append((status, filename))
    return files

def generate_unique_descriptive_message(batch_files, batch_index):
    file_list = [f[1] for f in batch_files]
    names = [os.path.basename(f) for f in file_list]
    
    # Determine exact functional scope based on file paths
    if any('auth' in f.lower() for f in file_list):
        scope = "auth"
        action = "implement authentication components and services"
    elif any('server/routes' in f for f in file_list):
        scope = "server-api"
        action = "add backend API route handlers"
    elif any('server/models' in f or 'server/schemas' in f for f in file_list):
        scope = "server-data"
        action = "define database ORM models and Pydantic schemas"
    elif any('server/services' in f for f in file_list):
        scope = "server-services"
        action = "implement business logic service layer"
    elif any('client/src/components' in f for f in file_list):
        scope = "client-ui"
        action = "add interactive frontend UI components and modals"
    elif any('client/src/pages' in f for f in file_list):
        scope = "client-pages"
        action = "update application pages and dashboard views"
    elif any(f.endswith('.png') or f.endswith('.jpeg') or 'public' in f for f in file_list):
        scope = "assets"
        action = "add UI illustrations, graphics, and static public assets"
    elif any('README' in f or 'package' in f or 'requirements' in f for f in file_list):
        scope = "docs-config"
        action = "update project documentation and package manifests"
    else:
        scope = "core"
        action = f"update batch module files"

    # Create distinct subject line containing file basenames
    key_files = ", ".join(names[:3])
    extra = f" (+{len(names)-3} files)" if len(names) > 3 else ""
    subject = f"feat({scope}): {action} [{key_files}{extra}]"

    # Create detailed body
    body_lines = [f"Batch #{batch_index} contains exact file changes:"]
    for status, path in batch_files:
        st_name = "New File" if status in ['??', 'A'] else "Modified" if status == 'M' else "Deleted"
        body_lines.append(f"  • [{st_name}] {path}")

    return f"{subject}\n\n" + "\n".join(body_lines)

def run_single_batch_commit(batch_size=7, batch_number=1):
    files = get_git_status_files()
    total_files = len(files)
    if total_files == 0:
        print("No pending modified or untracked files to commit.")
        return False

    print(f"Total uncommitted files remaining: {total_files}")
    batch = files[:batch_size]
    file_paths = [f[1] for f in batch]
    msg = generate_unique_descriptive_message(batch, batch_number)

    print("==================================================")
    print(f"EXECUTING BATCH #{batch_number} ({len(batch)} files):")
    for st, path in batch:
        print(f"  [{st}] {path}")
    print(f"\nUnique Commit Message:\n{msg}")
    print("==================================================")

    # Git add
    add_cmd = ['git', 'add'] + file_paths
    subprocess.run(add_cmd, check=True)

    # Git commit
    commit_cmd = ['git', 'commit', '-m', msg]
    subprocess.run(commit_cmd, check=True)
    print(f"Successfully committed batch #{batch_number} of {len(batch)} files!")

    # Attempt git push
    try:
        subprocess.run(['git', 'push'], check=True)
        print("Git push completed successfully!")
    except Exception as e:
        print(f"Git push notice: {e}")

    remaining = get_git_status_files()
    print(f"Remaining uncommitted files: {len(remaining)}")
    return len(remaining) > 0

if __name__ == '__main__':
    run_single_batch_commit(batch_size=7, batch_number=1)
