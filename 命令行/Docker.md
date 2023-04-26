# Docker
### Docker Engine
#### CentOS 下载 Docker Engine
- [官网](https://docs.docker.com/engine/install/centos/)
- Uninstall old versions
```javascript
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```
- Set up the repository
```javascript
sudo yum install -y yum-utils
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```
- Install Docker Engine
```javascript
sudo yum install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
- Start Docker
```javascript
sudo systemctl start docker
sudo systemctl enable docker
```
- 查看 Docker 是否是 active
```javascript
sudo systemctl status docker
```
- docker ps: 列出容器;
- docker images: 列出本地镜像;

#### Dockerfile
- [官网](https://docs.docker.com/engine/reference/builder/)
- Docker 通过读取 Dockerfile 中的指令构建 images;

### Docker Compose
#### Linux 安装 Docker Compose
- [官网](https://docs.docker.com/compose/install/other/#on-linux)
- Download and install Compose standalone
```javascript
curl -SL https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
```
- 为 docker-compose 命令增加权限
```javascript
sudo chmod +x /usr/local/bin/docker-compose
sudo chmod +x /usr/bin/docker-compose
```
- 建立软连接:
```javascript
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```
- docker-compose version: 查看 Docker Compose 版本;
- docker-compose status: 查看 docker-compose 命令;
- docker-compose.yml 文件: 定义构成应用程序的服务;
- docker-compose up: 启动程序;
- docker-compose up -d: 启动程序, 后台执行该服务;
- docker-compose down: 关闭并移除容器;
- docker-compose build --no-cache: 构建或重新构建服务;
- 进入 docker 容器执行命令:
```
sudo docker exec -it docker_container bash
```
#### portainer: Docker Compose 图像化管理界面:
- 创建 docker-compose.yml
```javascript
version: "3"
services:
  portainer:
    image: portainer/portainer
    container_name: portainer
    ports:
      - "9000:9000"
    volumes:
      - ./data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
```
- 运行 
```javascript
sudo docker-compose up -d
```
- 即可在 :9000 端口查看 portainer.io。

#### netdata: 对系统和应用程序的健康监控:
- 创建 docker-compose.yml
- 运行 sudo docker-compose up -d
- 即可在 :9002 端口查看 netdata。 
```javascript
version: '3'
services:
  netdata:
    image: netdata/netdata
    container_name: netdata
    ports:
      - 9002:19999
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
    security_opt:
      - apparmor:unconfined
    volumes:
      - netdataconfig:/etc/netdata
      - netdatalib:/var/lib/netdata
      - netdatacache:/var/cache/netdata
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro

volumes:
  netdataconfig:
  netdatalib:
  netdatacache:
```

#### heimdall: 书签管理
```
version: "2.1"
services:
  heimdall:
    image: linuxserver/heimdall
    container_name: heimdall
    volumes:
      - ./config:/config
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
    ports:
      - 80:80
    restart: unless-stopped
```

#### filebrowser: 文件上传/下载
```
version: '3'
services:
  filebrowser:
    restart: always
    image: filebrowser/filebrowser
    container_name: filebrowser
    ports:
      - "9001:80"
    volumes:
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
      - /home1/irteamsu/shared:/srv
      - ./filebrowser.db:/database.db
```

### 将本地 MySQL 数据转移到 docker MySQL里
- 服务器生成 github 私钥:
```javascript
ssh-keygen -t rsa -b 2048 -C "your_email@example.com"
cd ~/.ssh/
cat id_rsa.pub
```
- git clone 
- 导出本地 MySQL 数据:
```
mysqldump -u username -p database_name > database_name.sql
```
- 将导出的 SQL 文件传输到 docker 容器中:
```
sudo docker cp database_name.sql mysql_container:/docker-entrypoint-initdb.d/
```
- 进入 docker 容器运行命令:
```
sudo docker exec -it mysql_container mysql -uroot -p

-- 方法1
my_database < /docker-entrypoint-initdb.d/database_name.sql

-- 方法2
source /docker-entrypoint-initdb.d/serve.sql;
```


### DockerHub
- [官网](https://hub.docker.com/)
