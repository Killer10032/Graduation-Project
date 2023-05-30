package com.example.demo.controller;

import com.example.demo.common.Result;
import com.example.demo.service.BlogLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class LikeController {

    @Autowired
    private BlogLikeService blogLikeService;

    @RequestMapping("/like/{articleId}/{userId}/{liked}")
    private Result<?> likeTest(@PathVariable Integer articleId,  @PathVariable Integer userId, @PathVariable Integer liked) {
        if (liked == 0) {   //如果本来状态是0未点赞状态，则点赞
            blogLikeService.saveLiked2Redis(articleId.toString(), userId.toString());
        } else if (liked == 1){ // 如果本来状态为1已点赞，则取消点赞
            blogLikeService.unlikeFromRedis(articleId.toString(), userId.toString());
        }
        return Result.success();
    }

}
