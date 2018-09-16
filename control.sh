#!/bin/bash
NODE=`which node`
DATE=`date +%Y-%m-%d`
PID_FILE="./bin/canary.pid"
LOG_NAME="./logs/stdout/stdout-"${DATE}".log"
SERVER_PATH=`/bin/pwd`
ACTION=$1
PORT=$2
INDEX="$SERVER_PATH/server/index.js "

if [ ! -d "./logs" ]; then
  mkdir ./logs
fi

if [ ! -d "./logs/stdout" ]; then
  mkdir ./logs/stdout
fi

echo 'index'
echo $INDEX

start(){
if [ -f $PID_FILE ];then
   echo "$PID_FILE process is already staring! "
else
  echo "node start ======"
  $NODE $INDEX >> $LOG_NAME 2>&1 &  #将调试信息写入文件，并以后台的方式运行
  echo "$NODE $INDEX >> $LOG_NAME 2>&1 &"
  if [ $? -eq 0 ];then
   echo $! > $PID_FILE #将当前进程写入pid文件
    echo "node start successfully!"
  else
    echo "node start failed!"
  fi
fi
}

stop(){
if [ ! -f $PID_FILE ];then
  echo "node is not start yet!"
else
  echo "node stop ======"
  kill `cat $PID_FILE`
  rm -rf $PID_FILE
  if [ $? -eq 0 ];then
    echo "node stopped successfully!"
  else
    echo "node stopped failed!"
  fi
fi
}

case $ACTION in
start)
  start
;;
stop)
  stop
;;
reload)
  stop
  sleep 3
  start
;;
*)
  echo "$0 Usage: [start|stop|reload]"
;;
esac
