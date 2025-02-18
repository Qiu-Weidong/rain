---
title: TCP分析
date: 2022-11-17 19:03:19
tags:
  - TCP
  - 计算机网络
categories:
  - 计算机网络
---
## 字段含义
 - **pkt_seqno** 此TCP连接中所有报文的序号，可与Wireshark截获的报文对应。
 - **pkt_type** 报文类型。
 - **RorS_seqno** 发送报文序号或接收报文序号。
 - **snd_ssthresh** 慢启动门限值(字节)
 - **snd_cwnd** 发送方拥塞窗口(以MSS为单位)
 - **rcv_wnd** 目前接收方通告窗口(字节)
 - **snd_wnd_left** 发送窗口左边沿(字节)
 - **snd_wnd_pointer** 指针(字节)
 - **snd_wnd_left+cwnd**与**snd_wnd_left+rcv_wnd**的较小值为右边沿(字节)
 - **snd_wnd_pointer-left** 已发送但未确认的字节数。

## 前三条报文分析(三次握手)
```
pkt_seqno pkt_type        RorS_seqno  snd_ssthresh    snd_cwnd  rcv_wnd     snd_wnd_left      snd_wnd_pointer   snd_wnd_left+cwnd snd_wnd_left+rcv_wnd  snd_wnd_pointer-left
1         snd_con_syn     1           2147483647      2         0           4248826968        4248826969        4248829888        4248826968            1           
2         rcv_con_syn_ack 1           2147483647      2         5840        4248826969        4248826969        4248829889        4248832809            0           
3         snd_con_ack     2           2147483647      3         5840        4248826969        4248826969        4248831349        4248832809            0   
```
首先看第一条信息。这里显示的是第一条报文发送之后的状态。
可以看到，左边沿(snd_wnd_left)为4248826968，连接同步报文占用一个字节，因此指针比左边沿+1，为4248826969，此时已发送但未被确认的字节数就是刚发的一个字节的报文，因此`snd_wnd_pointer-left`=1。拥塞窗口初始设置为2MSS。简单的计算可得MSS长度为1460 。计算方法为 `(snd_wnd_left+cwnd - snd_wnd_left) / 2 = 1460`

然后看第二条信息。
然后，当接收放接收到这条报文的时候，会确定左边沿和指针，这里，左边沿着是4248826968，指针是4248826969 。而接收方的右边沿为左边沿+65535。
然后，接收方会对下一跳应该收到的字节发出确认，所以确认报文中的确认好是4248826969，确认之后，左边沿就会向右边移动。此时接收方的左边沿是4248826969、指针也是4248826969，右边沿是4248826969+65535 。
这里第二条报文显示的是发送方收到syn的确认之后的状态。接收方给发送方通告的窗口大小是 5840 。

然后看第三条信息。这里是第三条报文发送之后的状态。
此时，由于收到的确认，拥塞窗口增加了1，然后发送方对收到的确认报文进行确认，这个确认报文是不携带任何数据的，因此左边沿没有变换。接收方收到之后，左边沿和指针也不会有变化。


## 连接建立后的前四条报文
```
pkt_seqno pkt_type        RorS_seqno  snd_ssthresh    snd_cwnd  rcv_wnd     snd_wnd_left      snd_wnd_pointer   snd_wnd_left+cwnd snd_wnd_left+rcv_wnd  snd_wnd_pointer-left
4         snd_data        3           2147483647      3         5840        4248826969        4248828369        4248831349        4248832809            1400        
5         rcv_ack         2           2147483647      4         8400        4248828369        4248828369        4248834209        4248836769            0           
6         snd_data        4           2147483647      4         8400        4248828369        4248829769        4248834209        4248836769            1400        
7         snd_data        5           2147483647      4         8400        4248828369        4248831229        4248834209        4248836769            2860    
```


