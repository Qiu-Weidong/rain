---
title: LLVM如何实现字符串类型
date: 2022-06-12 10:31:55
tags:
  - llvm 
categories:
  - llvm 
---
LLVM中有两种方式实现字符串：
 - 直接使用LLVM IR实现
 - 使用高级语言实现并生成LLVM IR 

我个人更喜欢使用第二种方法，但为了示例，我将继续说明 LLVM IR 中一个简单但有用的字符串类型。 它采用 32 位架构，因此如果您的目标是 64 位架构，请将所有出现的 `i32` 替换为 `i64`。
我们将创建一个动态的、可变的字符串类型，它可以附加内容，也可以插入内容，转换大小写等等，这取决于定义了哪些支持函数来操作字符串类型。
```llvm 
; The actual type definition for our 'String' type.
%String = type {
    i8*,     ; 0: buffer; pointer to the character buffer
    i32,     ; 1: length; the number of chars in the buffer
    i32,     ; 2: maxlen; the maximum number of chars in the buffer
    i32      ; 3: factor; the number of chars to preallocate when growing
}

define fastcc void @String_Create_Default(%String* %this) nounwind {
    ; Initialize 'buffer'.
    %1 = getelementptr %String* %this, i32 0, i32 0
    store i8* null, i8** %1

    ; Initialize 'length'.
    %2 = getelementptr %String* %this, i32 0, i32 1
    store i32 0, i32* %2

    ; Initialize 'maxlen'.
    %3 = getelementptr %String* %this, i32 0, i32 2
    store i32 0, i32* %3

    ; Initialize 'factor'.
    %4 = getelementptr %String* %this, i32 0, i32 3
    store i32 16, i32* %4

    ret void
}

declare i8* @malloc(i32)
declare void @free(i8*)
declare i8* @memcpy(i8*, i8*, i32)

define fastcc void @String_Delete(%String* %this) nounwind {
    ; Check if we need to call 'free'.
    %1 = getelementptr %String* %this, i32 0, i32 0
    %2 = load i8** %1
    %3 = icmp ne i8* %2, null
    br i1 %3, label %free_begin, label %free_close

free_begin:
    call void @free(i8* %2)
    br label %free_close

free_close:
    ret void
}

define fastcc void @String_Resize(%String* %this, i32 %value) {
    ; %output = malloc(%value)
    %output = call i8* @malloc(i32 %value)

    ; todo: check return value

    ; %buffer = this->buffer
    %1 = getelementptr %String* %this, i32 0, i32 0
    %buffer = load i8** %1

    ; %length = this->length
    %2 = getelementptr %String* %this, i32 0, i32 1
    %length = load i32* %2

    ; memcpy(%output, %buffer, %length)
    %3 = call i8* @memcpy(i8* %output, i8* %buffer, i32 %length)

    ; free(%buffer)
    call void @free(i8* %buffer)

    ; this->buffer = %output
    store i8* %output, i8** %1

    ;this->maxlen = %value (value that was passed into @malloc is the new maxlen)
    %4 = getelementptr %String* this, i32 0, i32 2
    store i32 %value, i32* %4
    ret void
}

define fastcc void @String_Add_Char(%String* %this, i8 %value) {
    ; Check if we need to grow the string.
    %1 = getelementptr %String* %this, i32 0, i32 1
    %length = load i32* %1
    %2 = getelementptr %String* %this, i32 0, i32 2
    %maxlen = load i32* %2
    ; if length == maxlen:
    %3 = icmp eq i32 %length, %maxlen
    br i1 %3, label %grow_begin, label %grow_close

grow_begin:
    %4 = getelementptr %String* %this, i32 0, i32 3
    %factor = load i32* %4
    %5 = add i32 %maxlen, %factor
    call void @String_Resize(%String* %this, i32 %5)
    br label %grow_close

grow_close:
    %6 = getelementptr %String* %this, i32 0, i32 0
    %buffer = load i8** %6
    %7 = getelementptr i8* %buffer, i32 %length
    store i8 %value, i8* %7
    %8 = add i32 %length, 1
    store i32 %8, i32* %1

    ret void
}
```
