FROM phpdoc/phpdoc:latest

RUN composer global require 'evert/phpdoc-md=~0.2.0'

COPY docker/evert-phpdoc-md/generate.sh /usr/local/bin/generate.sh

RUN apt-get update && \
    apt-get install -y dos2unix

RUN chmod +x /usr/local/bin/generate.sh && \
    dos2unix /usr/local/bin/generate.sh /usr/local/bin/generate.sh

VOLUME /result

ENTRYPOINT ["/usr/local/bin/generate.sh"]