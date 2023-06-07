package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.LikeDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.ILikeService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-18 15:14
 */
@RestController("WebLikeController")
@RequestMapping("/web/like")
public class LikeController {

    @Resource
    private ILikeService likeService;

    /**
     * 点赞文章
     * @param likeDTO
     * @return
     */
    @PostMapping("/like")
    public ResponseDTO<Boolean> likeArticle(@RequestBody LikeDTO likeDTO){
        return likeService.likeArticle(likeDTO);
    }

    /**
     * 取消点赞文章
     * @param likeDTO
     * @return
     */
    @PostMapping("/unlike")
    public ResponseDTO<Boolean> unlikeArticle(@RequestBody LikeDTO likeDTO){
        return likeService.unlikeArticle(likeDTO);
    }

    /**
     * 判断是否喜欢文章
     * @param likeDTO
     * @return
     */
    @PostMapping("/judge")
    public ResponseDTO<Boolean> judgeLike(@RequestBody LikeDTO likeDTO){
        return likeService.judgeLike(likeDTO);
    }

}
