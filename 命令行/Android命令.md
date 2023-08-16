# Android命令
- adb devices: 列出当前连接到计算机上的 Android 设备;
- adb reverse tcp:8081 tcp:8081：将设备上的 8081 端口映射到主机的 8081 端口,   
当设备上的应用程序通过 8081 端口发送请求时, 请求将被转发到主机上的 8081 端口;

### 调试
- adb shell input keyevent 82: 打开开发菜单;
- Android 模拟器按两下R: 快速刷新;
