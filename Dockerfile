FROM openjdk:8-jdk

# Install required packages
RUN apt-get update && apt-get install -y wget unzip bash && rm -rf /var/lib/apt/lists/*

# Install Sencha Cmd
ARG CMD_VERSION=6.2.0.103
RUN mkdir -p /tmp/sencha && \
    wget -q -O /tmp/sencha/SenchaCmd.zip https://cdn.sencha.com/cmd/${CMD_VERSION}/no-jre/SenchaCmd-${CMD_VERSION}-linux-amd64.sh.zip && \
    unzip /tmp/sencha/SenchaCmd.zip -d /tmp/sencha && \
    bash /tmp/sencha/SenchaCmd-${CMD_VERSION}-linux-amd64.sh -q -dir /opt/Sencha/Cmd/${CMD_VERSION} && \
    rm -rf /tmp/sencha

ENV PATH=/opt/Sencha/Cmd/${CMD_VERSION}/:$PATH

# Comment out ssl_conf = ssl_sect in openssl config
RUN sed -i 's/^\s*ssl_conf = ssl_sect/# ssl_conf = ssl_sect/' /etc/ssl/openssl.cnf

# Download and install Ext JS SDK
ARG EXTJS_VERSION=6.2.0
#RUN git clone https://github.com/chakijs/chakijs.git /opt/ext
RUN mkdir -p /tmp/ext && \
    wget -q -O /tmp/ext/ext.zip http://cdn.sencha.com/ext/gpl/ext-${EXTJS_VERSION}-gpl.zip && \
    unzip /tmp/ext/ext.zip -d /tmp/ext && \
    mv /tmp/ext/ext-${EXTJS_VERSION} /opt/ext && \
    rm -rf /tmp/ext

WORKDIR /code
