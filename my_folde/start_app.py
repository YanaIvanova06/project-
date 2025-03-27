import subprocess
import webbrowser
import time
import os

def start_server():
    # Запуск Next.js сервера
    server_process = subprocess.Popen(['npm', 'run', 'dev'], 
                                    cwd=os.path.dirname(os.path.abspath(__file__)),
                                    shell=True)
    
    # Ждем 5 секунд, чтобы сервер успел запуститься
    time.sleep(5)
    
    # Открываем браузер
    webbrowser.open('http://localhost:3000')
    
    try:
        # Ждем, пока пользователь не закроет окно
        server_process.wait()
    except KeyboardInterrupt:
        # Если пользователь нажал Ctrl+C, закрываем сервер
        server_process.terminate()

if __name__ == '__main__':
    start_server()
