# 命令行
## 清屏命令
- cls: cmd 清屏
- clear / reset: Linux 清屏
## Linux基本命令
Linux中以 . 开头的文件/文件夹为隐藏文件/文件夹
- pwd : 获取当前目录;
- / : 根目录;
- cd / : 跳转到根目录, cd(change directory);
- cd .. : 跳到上一层;
- cd ../../../ : 跳到上三层;
- ls -a: 查看全部文件/文件夹(包含隐藏);
- l.: 只显示隐藏文件/文件夹;
- ls: 查看当前目录下的文件;
- ls -l: 查看详细信息, 如果第一个字符是“d”就代表是文件夹, “-”代表是文件, 第5列代表的是字节;
- ls -lh: 查看详细信息, 人性化展示文件列表, h = human;
- ls -a: 显示隐藏文件;
- ls -la: 与 ls -l 类似;
- ls -lha: 与 ls -lh类似;
- stat 文件名: 查看文件详细信息, 比 ls 更加详细;
- du -sh * :  查看所有文件夹大小;
- du -h --max-depth=1 : 查看当前目录下各文件夹、文件大小;
- df -h: 查看磁盘空间信息;
- du -sh: 查看指定目录总大小;
- tar cvf etcbak.tar etc/:   打包一个tar;
- tar xvf etcbak.tar: 解开一个tar;
- tar cvzf etcbak.tar.gz etc/:  打包压缩一个 tar;
- tar zxvf etcbak.tar.gz:   解压一个tar;
- mkdir + 文件夹名: 创建目录;
- mkdir -p + 文件夹名: 直接创建一个不存在的目录下的子目录;
- mkdir -p CN/gansu/baiyin/t : 创建层级目录;
- mv + 文件名/目录名 + 目录名: 将文件/目录移动到目录下;
- mv A B: 将目录 A 重命名为 B;
- tree : 显示当前文件的树结构;
- tree CN: 显示CN目录的树结构;
- rm 文件: 删除文件;
- rm -d [文件夹]: 删除空目录;
- rm -r [文件夹]: 删除非空目录;
- chmod 731 filename.sh: 对 filename.sh 文件赋加执行权限; 
- netstat -tunlp: 查看端口进程;
- netstat -tunlp |grep 80: 查看80端口进程;
- head -n 5 /tmp/tmpfile: 查看 tmpfile 文件前5行;
- tail -n 5 /tmp/tmpfile: 查看 tmpfile 文件后5行;
- cat filename | tail -n +100 | head -n 200: 显示100-299行;
- ln [参数][源文件或目录][目标文件或目录]: 为某个文件在另一个位置建立一个同步的链接;
- ln -s: 建立软链接;
- unlink 软链接: 删除软链接;
- chmod 731 XXX.sh: 为 shell 文件增加 读、写、执行 权限;

### CentOS 7.9 内核升级到 3.10.0-1160.90.1.el7
- 查看服务器内核版本: uname -r;
- 下载 kernel-3.10.0-1160.90.1.el7.x86_64.rpm 并上传:
```
scp ./kernel-3.10.0-1160.90.1.el7.x86_64.rpm irteam@domain.xxx:~
```
- 进入服务器, 安装内核:
```
sudo rpm -ivh kernel-3.10.0-1160.90.1.el7.x86_64.rpm
```
- 设置新内核为默认启动项:
```
sudo grub2-set-default 0
/*
* 如果发生 sudo: grub2-set-default: command not found
* 尝试使用以下命令: 
* sudo /usr/sbin/grub2-set-default 0
*/
```
- 更新引导:
```
sudo grub2-mkconfig -o /boot/grub2/grub.cfg

/*
* 如果发生 sudo: grub2-mkconfig: command not found
* 尝试使用以下命令: 
* sudo /usr/sbin/grub2-mkconfig -o /boot/grub2/grub.cfg
*/
```
- 重启系统:
```
sudo reboot

/*
* 如果发生 sudo: reboot: command not found
* 尝试使用以下命令: 
* sudo /sbin/reboot
*/
```
- 清除 pm2 缓存:
```
rm ~/.pm2/dump.pm2 && pm2 list
```

### vim 命令相关
- touch fileA: 如果fileA存在, 更改这个文件或目录的日期时间, 否则在当前目录下新建一个空白文件fileA;
- vim .test: 创建一个隐藏文件;
- vi filename: 打开或新建文件;
- i  切换到编辑模式;
- v  进入可视(Visual)模式; 移动光标选定内容;
- d  删除;
- y  复制;
- p  粘贴;
- G  光标移动到最后一行;
- gg  光标移动到首行;
- esc + ggvG  全选;
- esc + ggyG  全部复制;
- esc + dG  全部删除;
- :w  保存文件, 但不退出vi;
- :w file  将修改另外保存到file中, 不退出vi;
- :w!  强制保存, 不退出vi;
- :wq  保存文件并退出vi;
- :q  不保存文件, 退出编辑, 如果文本内容被修改过, 会报错;
- :q!  强制退出编辑, 如果文本内容被修改过, 会丢弃此次编辑;
- :x  退出编辑并保存;
- :set number 显示行数;
- cat + 文件名: 查看文件-直接到文件最后;
- more + 文件名: 查看文件-慢慢看文件, 回车->一行行看, 空格->一页页看;

### shell 相关
- sh XXX.sh: 执行 XXX.sh 脚本;
- ''  单引号将字符串原样输出;
- ""  双引号的字符串中可以有变量;
- ${变量名} == $变量名;
- $(命令) == \`命令`;
- unset 变量名: 删除变量;
- exit 0: 程序执行正确;
- exit 1: 不为0 就表示程序运行出错, 可以根据这个返回值判断你这个程序运行是否ok;
- -eq: 等于;
- -ne : 不等于;
- -gt : 大于;
- -lt : 小于;
- ge : 大于等于;
- le : 小于等于;
- $0 : Shell本身的文件名;
- $1～$n: 添加到Shell的各参数值, $1是第1参数、$2是第2参数…; 

## nginx 命令
- http://localhost/ 查看项目
```
// nginx.conf
server {
    listen       80;
    server_name  localhost;
    location / {
        root   /path/to/your/react/app/build;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
      proxy_pass http://backend-server;
    }
}
```
```
// 反向代理
// nginx.conf 
http {
  server {
    listen 80;
    server_name domain1.com;

    location / {
      proxy_pass http://127.0.0.1:8000;
    }
  }

  server {
    listen 80;
    server_name domain2.com;

    location / {
      proxy_pass http://127.0.0.1:9000;
    }
  }
}
```
- :d cd soft\nginx\nginx-1.19.6-window: 跳转到 nginx 相关目录;
- .\nginx -t: 检查 nginx 配置是否正确;
- start nginx: 启动;
- tasklist /fi "imagename eq nginx.exe": 查看 nginx 进程;
- .\nginx -s reload: 重启 nginx;
- .\nginx -s stop: 快速停止, 无输出;
- .\nginx -s quit: 完整有序停止, 无输出;
- taskkill /f /im nginx.exe: 使用 taskkill 关闭所有 nginx;

