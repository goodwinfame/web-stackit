import express from 'express';
import http from 'http';
import searchController from '@c/searchController';
import questionController from '@c/questionController';
import answerController from '@c/answerController';



const app = express();

const server = http.createServer(app);

app.use(function (req, res, next): void {
    //设置请求跨域属性及返回值类型
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-App-UA,X-Auth-Token,X-Language,X-Login-Org-ID,X-Switch-Org-ID, X-Page-Num, X-Page-Size");
    res.header("Access-Control-Expose-Headers", "X-Auth-Token,X-Language,X-Total-Count")
    if(req.method !== 'OPTIONS'){
        res.header("Content-Type", "application/json;charset=utf-8");

    }
    next();
});

//搜索业务
app.get("/iteam/v2/knowledge/search", searchController)

//问题查询业务
app.get("/iteam/v2/knowledge/questions/:ids", questionController)

//回答查询业务
app.get("/iteam/v2/knowledge/answers/:ids", answerController)

server.listen(8011, function(): void {
    console.log('server started, listening port: 8011');
})

