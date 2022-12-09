## 接口说明

* ### 获取微信openid
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/pub/public/getBwlWxOpenid?code=[微信code]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    code    微信code
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "openid":""
    }
  }
  ```

* ### 微信用户登录
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/pub/public/wechatLogin?openid=[微信openid]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    openid    微信openid
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "authcode":"", 授权码,作为session_token
    }
  }
  ```

* ### 用户评价
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/pub/public/userComment?session_token=[令牌]
  ```
  接口类型：
  ``` POST ```

  URL参数说明:
  ```
    session_token      令牌
  ```
  FormData表单传递数据
  ``` 
  MediaType: application/x-www-form-urlencoded 
  FieldName: data
  内容(JSON格式):
  {
      "commentGrade":"",   评价等级 5.有用; 3.一般; 1.无用
      "commentExplain":"", 评价文字
  }
  ```
  返回：
  ```
  {
    "status": "success"
  }
  ```

* ### 获取用户评价信息
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/pub/public/getUserComment?session_token=[令牌]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    session_token      令牌
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "commentGrade":"",          /*评价等级 5.有用; 3.一般; 1.无用*/
        "commentExplain":"",        /*评价文字*/
        "time":"",                  /*时间*/
    }
  }
  ```

* ### 访问统计
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/pub/public/visitStatistics?session_token=[令牌]&condition=[查询条件]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    session_token      令牌
    condition          查询条件
    {
        "begindate":"", 开始日期
        "enddate":""    结束日期
    }
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "list":[
            {
                "visitDate":"", 访问日期
                "visitUsers":"", 访问用户数
                "visitCount":"", 访问人次
            }
        ]
    }
  }
  ```

* ### 用户评价统计
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/pub/public/userCommentStatistics?session_token=[令牌]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    session_token      令牌
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "commentGrade":"", 评价等级
        "count":"", 评价数
    }
  }
  ```

* ### 桥梁列表
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/bwl/waterlevel/getScreenList?session_token=[令牌]&begin=[起始页]&pagesize=[每页记录数]&where=[模糊查询条件]&filters=[过滤条件]&sorts=[排序]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    session_token      令牌
    begin              起始页
    pagesize           每页记录数
    where              模糊查询条件
    filters            过滤条件
    sorts              排序
    {
        "screenName":1, 1.升序;-1.降序; 0.不排序
        "groupName":-1,
        "waterlevel":0,
    }
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "count":"", 总记录数
        "list":[
            {
                "deviceCode":"",            /*设备码*/
                "screenCode":"",            /*屏幕条码*/
                "screenName":"",            /*屏幕名称*/
                "department":"",            /*部门*/
                "groupName":"",             /*分组*/
                "status":"",                /*状态 0：未初始化 1：在线 2：离线*/
                "serviceStatus":"",         /*服务套餐状态（iLEDSys 不返回） 0：未购买套餐 1：套餐有效 2：套餐过期*/
                "model":"",                 /*型号*/
                "width":"",                 /*宽度*/
                "height":"",                /*高度*/
                "longitude":"",             /*经度*/
                "latitude":"",              /*纬度*/
                "waterway":"",              /*航道*/
                "region":"",                /*所在区域*/
                "lastTime":"",              /*最后一次更新时间*/
                "waterlevel":"",            /*水位*/
                "waterlevelTime":"",        /*最后一次获取的水位时间*/
                "follow":"",                /*是否被当前用户关注 0:否 ,1:是*/
            }
        ]
    }
  }
  ```

* ### 桥梁水位记录
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/bwl/waterlevel/getScreenWaterLevelList?session_token=[令牌]&deviceCode=[桥梁编号]&begin=[起始页]&pagesize=[每页记录数]&filters=[过滤条件]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    session_token      令牌
    deviceCode         桥梁编号
    begin              起始页
    pagesize           每页记录数
    filters            过滤条件
    {
        "begindate":"", 根据选择从当前时间往前推1(7或30)天(格式必须是yyyy-MM-dd HH:mm:ss)
        "enddate":""  当前时间(格式必须是yyyy-MM-dd HH:mm:ss)
    }
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "count":"", 总记录数
        "list":[
            {
                "deviceCode":"",            /*设备码*/
                "screenCode":"",            /*屏幕条码*/
                "dataType":"12",            /*数据类别,12表示是水位计传感器*/
                "value":"",                 /*数值*/
                "time":"",                  /*时间*/
            }
        ]
    }
  }
  ```

* ### 关注桥梁
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/bwl/waterlevel/addUserFollow?session_token=[令牌]
  ```
  接口类型：
  ``` POST ```

  URL参数说明:
  ```
    session_token      令牌
  ```
  FormData表单传递数据
  ``` 
  MediaType: application/x-www-form-urlencoded 
  FieldName: data
  内容(JSON格式):
  {
      "deviceCode":[""], 设备号
  }
  ```
  返回：
  ```
  {
    "status": "success"
  }
  ```

* ### 取消关注桥梁
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/bwl/waterlevel/cancelUserFollow?session_token=[令牌]
  ```
  接口类型：
  ``` POST ```

  URL参数说明:
  ```
    session_token      令牌
  ```
  FormData表单传递数据
  ``` 
  MediaType: application/x-www-form-urlencoded 
  FieldName: data
  内容(JSON格式):
  {
      "deviceCode":[""], 设备号
  }
  ```
  返回：
  ```
  {
    "status": "success"
  }
  ```

* ### 获取关注的桥梁列表
  URL地址:
  ```
  https://njzz.rongtuyun.com/api/zz/bwl/waterlevel/getFollowScreenList?session_token=[令牌]&begin=[起始页]&pagesize=[每页记录数]&where=[模糊查询条件]&filters=[过滤条件]&sorts=[排序]
  ```
  接口类型：
  ``` GET ```

  URL参数说明:
  ```
    session_token      令牌
    begin              起始页
    pagesize           每页记录数
    where              模糊查询条件
    filters            过滤条件
    sorts              排序
    {
        "screenName":1, 1.升序;-1.降序; 0.不排序
        "groupName":-1,
        "waterlevel":0,
    }
  ```
  返回：
  ```
  {
    "status": "success",
    "data":{
        "count":"", 总记录数
        "list":[
            {
                "deviceCode":"",            /*设备码*/
                "screenCode":"",            /*屏幕条码*/
                "screenName":"",            /*屏幕名称*/
                "department":"",            /*部门*/
                "groupName":"",             /*分组*/
                "status":"",                /*状态 0：未初始化 1：在线 2：离线*/
                "serviceStatus":"",         /*服务套餐状态（iLEDSys 不返回） 0：未购买套餐 1：套餐有效 2：套餐过期*/
                "model":"",                 /*型号*/
                "width":"",                 /*宽度*/
                "height":"",                /*高度*/
                "longitude":"",             /*经度*/
                "latitude":"",              /*纬度*/
                "waterway":"",              /*航道*/
                "region":"",                /*所在区域*/
                "lastTime":"",              /*最后一次更新时间*/
                "waterlevel":"",            /*水位*/
                "waterlevelTime":"",        /*最后一次获取的水位时间*/
            }
        ]
    }
  }
  ```

