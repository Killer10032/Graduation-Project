package com.example.demo.controller;

import com.example.demo.common.Result;
import com.example.demo.mapper.BlogMapper;
import com.example.demo.service.LikedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/Blog")
public class BlogController {

    @Autowired
    private BlogMapper blogMapper;

    @Autowired
    private LikedService likedService;

    @RequestMapping("/test")
    public Result<?> test() {
        return Result.success(likedService.getByLikedArticleIdAndUserId(1,1));
    }
}
