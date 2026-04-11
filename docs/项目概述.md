# 项目简介

本项目是一个电影评论与管理系统，面向普通用户提供电影浏览、搜索、详情查看、注册登录、发表评论等业务功能，面向管理员提供电影维护、用户权限管理与操作日志查看等后台能力；整体技术栈采用 `Next.js 15 + React 19 + TypeScript` 构建前端界面，采用 `Spring Boot 3 + Spring Web + Spring Data MongoDB + Spring AOP` 构建核心业务后端，配合 `Spring Cloud Gateway` 作为统一入口与反向代理，数据存储使用 `MongoDB`，进程管理使用 `PM2`；其中与 Spring Boot 相关的技术实现主要包括基于 `Controller / Service / Repository` 的分层开发、通过 `Spring Data MongoDB` 访问文档数据库、使用 `AOP` 记录操作日志、使用自定义 `Interceptor + JWT` 完成接口鉴权与管理员权限控制、使用配置类完成跨域、初始化数据、序列号生成与 Web 拦截器注册，从而形成一个前后端分离、支持网关转发和基础权限管理的电影评论平台。
