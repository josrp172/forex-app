import os

file_path = r'c:\Users\josrp\Documents\JosephProject\personal_projects\forex_app\christmas\templates\greeting.html'
with open(file_path, 'rb') as f:
    content = f.read()

bad1 = b'            const hasPics = {{ \'true\' if has_pics else \'false\' }\r\n        };'
good1 = b'            const hasPics = {{ \'true\' if has_pics else \'false\' }};'

if bad1 in content:
    new_content = content.replace(bad1, good1)
    with open(file_path, 'wb') as f:
        f.write(new_content)
    print("SUCCESS")
else:
    # Try with \n just in case
    bad2 = b'            const hasPics = {{ \'true\' if has_pics else \'false\' }\n        };'
    if bad2 in content:
        new_content = content.replace(bad2, good1)
        with open(file_path, 'wb') as f:
            f.write(new_content)
        print("SUCCESS (LF)")
    else:
        print("NOT FOUND")
        # Let's print a bit of content around where we think it is
        idx = content.find(b'const hasPics =')
        if idx != -1:
            print("Found nearby:", content[idx:idx+100])
