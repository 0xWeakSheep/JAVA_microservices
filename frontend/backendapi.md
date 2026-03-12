# Backend API

后端基础地址：

- 直连后端：`http://localhost:3001`
- 如果启用网关：`http://localhost:3000`

接口统一前缀：

- ` /api`

鉴权方式：

- 需要登录的接口使用 `Authorization: Bearer <token>`
- 登录成功后从 `/api/auth/login` 返回 `token`

内置管理员账号：

- 用户名：`root`
- 密码：`root`

## 1. 认证接口

### 1.1 登录

- 方法：`POST`
- 路径：`/api/auth/login`
- 鉴权：否

请求体：

```json
{
  "username": "root",
  "password": "root"
}
```

返回示例：

```json
{
  "token": "jwt-token",
  "user": {
    "userId": 3,
    "username": "root",
    "email": "root@movies.local",
    "manager": true,
    "permission": true
  }
}
```

### 1.2 注册

- 方法：`POST`
- 路径：`/api/auth/register`
- 鉴权：否

请求体：

```json
{
  "username": "alice",
  "password": "123456",
  "email": "alice@example.com"
}
```

返回示例：

```json
{
  "userId": 10,
  "username": "alice",
  "email": "alice@example.com",
  "manager": false,
  "permission": true
}
```

### 1.3 获取当前登录用户

- 方法：`GET`
- 路径：`/api/auth/me`
- 鉴权：是

返回示例：

```json
{
  "userId": 3,
  "username": "root",
  "email": "root@movies.local",
  "manager": true,
  "permission": true
}
```

## 2. 电影接口

### 2.1 获取电影列表

- 方法：`GET`
- 路径：`/api/movies`
- 鉴权：否
- 查询参数：
  - `title`：可选，按标题模糊搜索

示例：

```text
GET /api/movies
GET /api/movies?title=肖申克
```

返回示例：

```json
[
  {
    "movieId": 11,
    "title": "肖申克的救赎",
    "description": "电影简介",
    "releaseDate": "1994-09-09T16:00:00.000+00:00",
    "runtime": 142,
    "posterImage": "https://example.com/poster.jpg",
    "averageScore": 9.7
  }
]
```

### 2.2 获取单个电影详情

- 方法：`GET`
- 路径：`/api/movies/{movieId}`
- 鉴权：否

返回示例：

```json
{
  "movieId": 11,
  "title": "肖申克的救赎",
  "description": "电影简介",
  "releaseDate": "1994-09-09T16:00:00.000+00:00",
  "runtime": 142,
  "posterImage": "https://example.com/poster.jpg",
  "averageScore": 9.7
}
```

### 2.3 新增电影

- 方法：`POST`
- 路径：`/api/movies`
- 鉴权：是
- 权限：管理员

请求体：

```json
{
  "title": "星际穿越",
  "description": "电影简介",
  "releaseDate": "2014-11-07",
  "runtime": 169,
  "posterImage": "https://example.com/interstellar.jpg"
}
```

### 2.4 修改电影

- 方法：`PUT`
- 路径：`/api/movies/{movieId}`
- 鉴权：是
- 权限：管理员

请求体：

```json
{
  "title": "星际穿越",
  "description": "更新后的简介",
  "releaseDate": "2014-11-07",
  "runtime": 169,
  "posterImage": "https://example.com/interstellar.jpg"
}
```

### 2.5 删除电影

- 方法：`DELETE`
- 路径：`/api/movies/{movieId}`
- 鉴权：是
- 权限：管理员

成功返回：

- `204 No Content`

## 3. 评论接口

### 3.1 获取评论列表

- 方法：`GET`
- 路径：`/api/reviews`
- 鉴权：否
- 查询参数：
  - `movieId`：可选，按电影查询
  - `userId`：可选，按用户查询

示例：

```text
GET /api/reviews
GET /api/reviews?movieId=11
GET /api/reviews?userId=3
```

返回示例：

```json
[
  {
    "reviewId": 1,
    "movieId": 11,
    "userId": 3,
    "content": "很好看",
    "score": 10,
    "createdAt": "2026-03-12T05:30:00.000+00:00",
    "username": "root",
    "title": "肖申克的救赎"
  }
]
```

### 3.2 创建评论

- 方法：`POST`
- 路径：`/api/reviews`
- 鉴权：是

请求体：

```json
{
  "movieId": 11,
  "content": "剧情很完整，值得再看一遍。",
  "score": 9
}
```

说明：

- `userId` 不需要前端传，后端会从当前 token 中识别登录用户

### 3.3 删除评论

- 方法：`DELETE`
- 路径：`/api/reviews/{reviewId}`
- 鉴权：是
- 权限：管理员

成功返回：

- `204 No Content`

## 4. 用户管理接口

以下接口均需要管理员权限。

### 4.1 获取用户列表

- 方法：`GET`
- 路径：`/api/users`
- 鉴权：是
- 权限：管理员

返回示例：

```json
[
  {
    "userId": 3,
    "username": "root",
    "email": "root@movies.local",
    "manager": true,
    "permission": true
  }
]
```

### 4.2 获取单个用户

- 方法：`GET`
- 路径：`/api/users/{userId}`
- 鉴权：是
- 权限：管理员

### 4.3 修改用户可用状态

- 方法：`PATCH`
- 路径：`/api/users/{userId}/permission?value=true|false`
- 鉴权：是
- 权限：管理员

示例：

```text
PATCH /api/users/5/permission?value=false
```

### 4.4 修改用户管理员标记

- 方法：`PATCH`
- 路径：`/api/users/{userId}/manager?value=true|false`
- 鉴权：是
- 权限：管理员

示例：

```text
PATCH /api/users/5/manager?value=true
```

## 5. 日志接口

### 5.1 获取操作日志

- 方法：`GET`
- 路径：`/api/logs`
- 鉴权：是
- 权限：管理员

返回示例：

```json
[
  {
    "id": 1,
    "methodName": "POST /api/movies -> createMovie",
    "userName": "root",
    "timestamp": "2026-03-12T05:45:00.000+00:00"
  }
]
```

## 6. 常见状态码

- `200 OK`：请求成功
- `201 Created`：创建成功
- `204 No Content`：删除成功
- `400 Bad Request`：参数错误或用户名已存在
- `401 Unauthorized`：未登录、token 无效或已过期
- `403 Forbidden`：无权限
- `404 Not Found`：资源不存在

## 7. 前端对接建议

- 登录后保存 `token`
- 后续请求统一带上：

```text
Authorization: Bearer <token>
```

- 管理员接口包括：
  - 电影新增、修改、删除
  - 评论删除
  - 用户管理
  - 日志查看
