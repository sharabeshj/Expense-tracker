import os
from project import app

docker_file = 'Dockerfile'
source_dir = os.path.abspath(os.curdir)
destination_dir = os.path.join(source_dir, '../postgresql')

if not os.path.isdir(destination_dir):
    os.makedirs(destination_dir)


with open(os.path.join(destination_dir, docker_file), 'w') as postgres_dockerfile:
    postgres_dockerfile.write('FROM postgres:9.6')
    postgres_dockerfile.write('\n')
    postgres_dockerfile.write('\n# Set environment variables')
    postgres_dockerfile.write('\nENV POSTGRES_USER {}'.format(app.config['POSTGRES_USER']))
    postgres_dockerfile.write('\nENV POSTGRES_PASSWORD {}'.format(app.config['POSTGRES_PASSWORD']))
    postgres_dockerfile.write('\nENV POSTGRES_DB {}'.format(app.config['POSTGRES_DB']))
    postgres_dockerfile.write('\n')
